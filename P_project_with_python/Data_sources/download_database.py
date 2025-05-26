
#symbol = 'AAPL'
#interval = '1m'
#url = f'https://api.binance.com/api/v3/klines?symbol={symbol}&interval={interval}&limit=1'

import aiohttp
import pandas as pd 
import os 
import asyncio
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class DataMarket:
    def __init__(self):
        self.api = os.getenv('ALPHA_API_KEY')
        if not self.api:
            raise ValueError('API key not found in environment variables')
        self.headers = {"Content-Type": "application/json"}
    
    async def get_historical_data(self, symbol: str) -> pd.DataFrame:
        url = (
            f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=1min&outputsize=compact&apikey={self.api}'
        )
        
        try:
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=10)) as session:
                async with session.get(url, headers=self.headers) as response:
                    if response.status == 404:
                        raise ValueError(f"Symbol not found: {symbol}")
                    response.raise_for_status()
                    data = await response.json()
            
            if not data or "Time Series (1min)" not in data:
                raise ValueError("Data not found in Alpha Vantage response")

            raw = data["Time Series (1min)"]
            df = pd.DataFrame.from_dict(raw, orient="index", dtype=float)
            df.index = pd.to_datetime(df.index)
            df = df.sort_index()
            df.columns = ['open', 'high', 'low', 'close', 'volume']

            return df

        except aiohttp.ClientError as e:
            raise ConnectionError(f"Network error: {e}")
        except Exception as e:
            raise Exception(f"Unexpected error: {e}")


async def main():
    market = DataMarket()
    df = await market.get_historical_data('AAPL')
    print(df)

if __name__ == "__main__":
    asyncio.run(main())

