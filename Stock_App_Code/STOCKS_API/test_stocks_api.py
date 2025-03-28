from flask import Flask, request, jsonify  # For API functions
import yfinance as yf  # To fetch stock data
from flask_cors import CORS  # To enable cross-origin requests
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow frontend requests

def get_stock_info(stock_name):
    """
    Fetch stock data from yfinance.
    Returns a dictionary with:
      - symbol
      - name
      - current price (from stock.info)
      - current date/time
      - history: a list of dictionaries, each containing the date and 'Close' price for the last 30 days.
    """
    stock = yf.Ticker(stock_name)
    info = stock.info
    
    # Check if required data exists
    if "shortName" in info and "currentPrice" in info:
        # Fetch historical data for the last 30 days
        history_df = stock.history(period="30d")
        # Create a list of daily records (using 'Close' prices)
        history_list = []
        for date, row in history_df.iterrows():
            history_list.append({
                "date": date.strftime("%Y-%m-%d"),
                "close": row["Close"]
            })

        stock_info = {
            "symbol": stock_name,
            "name": info["shortName"],
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "current_price": info["currentPrice"],
            "history": history_list  # Last 30 days 'Close' price history
        }
        return stock_info
    else:
        return {"error": f"Stock symbol '{stock_name}' not found or missing data."}

@app.route('/stock', methods=['GET'])
def fetch_stock():
    """
    API endpoint to get stock data.
    Accepts a comma-separated list of stock symbols via the 'symbol' query parameter.
    Example: /stock?symbol=NVDA,AAPL,GME
    Returns a JSON array containing stock data for each symbol.
    """
    stock_names = request.args.get('symbol')
    if not stock_names:
        return jsonify({"error": "Please provide at least one stock symbol."}), 400

    # Split symbols by comma and remove any extra whitespace
    symbols = [s.strip() for s in stock_names.split(',')]
    results = [get_stock_info(symbol) for symbol in symbols]
    return jsonify(results)


