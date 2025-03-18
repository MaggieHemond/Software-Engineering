import yfinance as yf
import json  # Pretty print

stock = yf.Ticker("AAPL")  # Apple stock

print(json.dumps(stock.info, indent=4))  # Nicely formatted output


history = stock.history(period="1mo")  # Get last 1 month of data
print(history)