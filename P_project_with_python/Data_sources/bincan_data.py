import requests
import pandas as pd
import mplfinance as mpf
from datetime import datetime
import time

def fetch_klines(symbol="BTCUSDT", interval="1m", limit=60):
    url = f"https://api.binance.com/api/v3/klines?symbol={symbol}&interval={interval}&limit={limit}"
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()

    df = pd.DataFrame(data, columns=[
        "open_time", "open", "high", "low", "close", "volume",
        "close_time", "quote_asset_volume", "number_of_trades",
        "taker_buy_base_volume", "taker_buy_quote_volume", "ignore"
    ])

    df["open_time"] = pd.to_datetime(df["open_time"], unit='ms')
    df.set_index("open_time", inplace=True)
    df = df[["open", "high", "low", "close", "volume"]].astype(float)
    
    return df

def live_candle_chart(symbol="BTCUSDT"):
    print(f"Live candle chart for {symbol} - Press Ctrl+C to stop")
    while True:
        try:
            df = fetch_klines(symbol=symbol, interval="1m", limit=60)
            mpf.plot(df, type='candle', volume=True, style='binance', title=f'{symbol} Live 1m', show_nontrading=True)
            time.sleep(60)  # انتظر دقيقة لتحديث البيانات
        except KeyboardInterrupt:
            print("Stopped by user.")
            break
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(10)

if __name__ == "__main__":
    live_candle_chart("BTCUSDT")  # يمكنك التغيير إلى "ETHUSDT" أو أي رمز آخر
