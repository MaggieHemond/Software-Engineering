from flask import Flask, request, jsonify #Method to host
import yfinance as yf # Stock market "API"
from flask_cors import CORS

from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow frontend requests

def get_stock_info(stock_name):
    """Fetch stock data from yfinance using if-checks instead of try-except"""
    stock = yf.Ticker(stock_name)
    
    # Check if stock data exists
    if "shortName" in stock.info and "currentPrice" in stock.info:
        stock_info = {
            "symbol": stock_name,
            "name": stock.info["shortName"],
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "current_price": stock.info["currentPrice"]
        }
        return stock_info
    else:
        return {"error": f"Stock symbol '{stock_name}' not found or missing data."}

@app.route('/stock', methods=['GET'])
def stock():
    """API endpoint to get stock data"""
    stock_name = request.args.get('symbol')

    # Check if user provided a stock symbol
    if not stock_name:
        return jsonify({"error": "Please provide a stock symbol."}), 400

    stock_info = get_stock_info(stock_name)
    return jsonify(stock_info)

