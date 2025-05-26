
import requests
import time

api_key = 'd9db5e0db37946f3acb015d6835ea0c5'
symbol = 'XAU/USD'  # Gold against USD
interval = '1min'

while True:
    url = f'https://api.twelvedata.com/time_series?symbol={symbol}&interval={interval}&apikey={api_key}&outputsize=1'
    response = requests.get(url)
    data = response.json()

    if 'values' in data:
        latest = data['values'][0]
        print(f"Time: {latest['datetime']} | Price: {latest['close']} USD")
    else:
        print(data)  # Shows errors if any

    time.sleep(60)

