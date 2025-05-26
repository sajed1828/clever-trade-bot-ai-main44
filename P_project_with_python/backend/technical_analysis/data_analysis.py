import numpy as np 
import pandas as pd 
import sys
import os

#project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
#sys.path.append(project_root)

from Data_sources.DATA_tiingo import get_historical_data

import yfinance as yf
import pandas as pd

# Load data using yfinance and calculate indicators
def load_data(ticker):
    # Download data using yfinance
    data = yf.download(ticker, start="2010-01-01", end="2025-01-01")

    # Calculate SMA_20
    data['SMA_20'] = data['Close'].rolling(window=20).mean()
    
    # Calculate SMA_50
    data['SMA_50'] = data['Close'].rolling(window=50).mean()

    # Calculate RSI (Relative Strength Index)
    delta = data['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    data['RSI'] = 100 - (100 / (1 + rs))

    # Calculate MACD (Moving Average Convergence Divergence)
    data['EMA_12'] = data['Close'].ewm(span=12, adjust=False).mean()  # Exponential Moving Average 12
    data['EMA_26'] = data['Close'].ewm(span=26, adjust=False).mean()  # Exponential Moving Average 26
    data['MACD'] = data['EMA_12'] - data['EMA_26']
    data['MACD_Signal'] = data['MACD'].ewm(span=9, adjust=False).mean()  # Signal Line

    # Calculate Bollinger Bands
    data['Bollinger_Mid'] = data['Close'].rolling(window=20).mean()
    data['Bollinger_Upper'] = data['Bollinger_Mid'] + 2 * data['Close'].rolling(window=20).std()
    data['Bollinger_Lower'] = data['Bollinger_Mid'] - 2 * data['Close'].rolling(window=20).std()

    # Drop NaN values
    data = data.dropna()

    return data[['Close', 'SMA_20', 'SMA_50', 'RSI', 'MACD', 'MACD_Signal', 'Bollinger_Upper', 'Bollinger_Lower']]

# Example of calling the function for a stock symbol (e.g., 'AAPL')
data = load_data('AAPL')
print(data.tail())
