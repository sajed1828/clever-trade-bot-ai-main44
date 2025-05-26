import requests
import time
from datetime import datetime

symbol = 'AAPL'
interval = '1m'
url = f'https://api.binance.com/api/v3/klines?symbol={symbol}&interval={interval}&limit=1'

import requests
import time

API_KEY = 'TEYKFS3D35TMKO3N'
symbol = 'AAPL'

while True:
    url_1 = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=1min&apikey={API_KEY}'
    response = requests.get(url_1)
    data = response.json()
    
    print(data)
    
    latest_timestamp = list(data["Time Series (1min)"].keys())[0]
    latest_data = data["Time Series (1min)"][latest_timestamp]

    print(f"Time: {latest_timestamp} | AAPL Price: {latest_data['4. close']} USD")

    time.sleep(60)  # wait for 60 seconds (API limit)
