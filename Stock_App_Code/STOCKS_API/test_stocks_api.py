import os
import re
import requests
import yfinance as yf

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

# Read the Finnhub API key from the environment
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")

app = Flask(__name__)
CORS(app)

def yfinance_get_stock(symbols_list):
    """
    Fetch stock data from yfinance for a list of symbols.
    Returns a list of stock‐info dicts.
    """
    results = []

    for symbol in symbols_list:
        ticker = yf.Ticker(symbol)

        try:
            info = ticker.info
        except Exception as e:
            results.append({
                "symbol": symbol,
                "error": f"Failed to fetch info: {e}"
            })
            continue

        if info is None or "shortName" not in info or "currentPrice" not in info:
            results.append({
                "symbol": symbol,
                "error": "Missing data."
            })
            continue

        history_df = ticker.history(period="30d")
        history_list = []

        for date, row in history_df.iterrows():
            history_list.append({
                "date": date.strftime("%Y-%m-%d"),
                "close": row["Close"]
            })

        results.append({
            "symbol": symbol,
            "name": info["shortName"],
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "current_price": info["currentPrice"],
            "history": history_list
        })

    return results


def finnhub_autocomplete(keyword):
    """
    Use Finnhub's /search endpoint to return autocomplete suggestions.
    Returns up to 50 dicts containing:
      - symbol
      - displaySymbol
      - description
      - type
    """
    if not FINNHUB_API_KEY:
        return [{"error": "Finnhub API key is missing."}]

    base_url = "https://finnhub.io/api/v1/search"
    built_url = (
        f"{base_url}"
        f"?q={keyword}"
        f"&token={FINNHUB_API_KEY}"
    )

    # Log the URL in your Render logs
    print("🔗 Calling Finnhub URL:", built_url)

    try:
        response = requests.get(built_url, timeout=10)
    except Exception as e:
        return [{"error": f"Network error: {e}"}]

    print("🔗 Status code:", response.status_code)

    try:
        data = response.json()
    except ValueError:
        return [{"error": "Invalid JSON response from Finnhub"}]

    matches = data.get("result", [])
    suggestions = []

    for m in matches:
        symbol        = m.get("symbol")
        display_symbol = m.get("displaySymbol")
        description   = m.get("description")
        asset_type    = m.get("type")  # e.g. "Common Stock", "Crypto", etc.

        # Only include entries that have all four fields
        if symbol and display_symbol and description and asset_type:
            suggestions.append({
                "symbol":        symbol,
                "displaySymbol": display_symbol,
                "description":   description,
                "type":          asset_type
            })

    # Return up to the first 50 matches
    return suggestions[:50]


@app.route('/stock', methods=['GET'])
def send_stock_info():
    """
    Single endpoint reading 'symbol=func:payload'.
      e.g. yfinance:AAPL,MSFT  or  autocomplete:AA
    """
    stock_query = request.args.get('symbol')

    if not stock_query:
        return jsonify({
            "error": "Please provide 'symbol=func:payload' in the query."
        }), 400

    match = re.match(r'^(\w+):(.+)$', stock_query)

    if not match:
        return jsonify({
            "error": "Invalid format. Use 'yfinance:<symbols>' or 'autocomplete:<keyword>'."
        }), 400

    func    = match.group(1).lower()
    payload = match.group(2).strip()

    if func == "yfinance":
        symbols = [s.strip() for s in payload.split(',')]
        data    = yfinance_get_stock(symbols)
        return jsonify(data)

    elif func == "autocomplete":
        suggestions = finnhub_autocomplete(payload)
        return jsonify(suggestions)

    else:
        return jsonify({
            "error": f"Unknown function '{func}'. Use 'yfinance' or 'autocomplete'."
        }), 400


