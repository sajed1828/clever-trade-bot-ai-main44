import aiohttp
import pandas as pd 
import os 
import asyncio
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

class DataMarket:
    def __init__(self):
        self.api = os.getenv('ALPHA_API_KEY')
        if not self.api:
            raise ValueError('the  api is broked')
        self.headers = {"Content-Type": "application/json", "Authorization": f"Token {self.api}"}
    
    async def get_historical_data(self, symbol: str, lookback_days: int = 4380) -> pd.DataFrame:
        end_date = datetime.now()
        start_date = end_date - timedelta(lookback_days) 
        
        url = (
            f"https://api.tiingo.com/tiingo/daily/{symbol}/prices?"
            f'startDate={start_date.strftime("%Y-%m-%d")}&'
            f'endDate={end_date.strftime("%Y-%m-%d")}'
        )
        
        try:
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=10)) as session:
                async with session.get(url, headers=self.headers) as response:
                    if response.status == 404:
                        raise ValueError(f"Symbol not found: {symbol}")
                    response.raise_for_status()
                    data = await response.json()
            if not data:
                raise ValueError("there is bug where download data") 
            
            df = pd.DataFrame(data)
            df["date"] = pd.to_datetime(df["date"])
            df.set_index("date", inplace=True)

            df[["open", "high", "low", "close"]] = df[["adjOpen", "adjHigh", "adjLow", "adjClose"]].round(2)
            df["volume"] = df["adjVolume"].astype(int)
            df["symbol"] = symbol.upper()

            return df        

        except aiohttp.ClientError as e:
            raise ConnectionError(f"Network error while fetching data for {symbol}: {e}")
        except ValueError as ve:
            raise ve  # Propagate value errors (symbol issues, no data, etc.)
        except Exception as e:
            raise Exception(f"Unexpected error fetching data for {symbol}: {e}")            

async def main():
    market = DataMarket()
    df = await market.get_historical_data('AAPL', lookback_days=30)
    print(df)

if __name__ == "__main__":
    asyncio.run(main())


