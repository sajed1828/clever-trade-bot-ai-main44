from ITCH import itch_store
import pandas as pd


class Itch_trade_modul:
    
    def __init__(self, stock = 'AAPL', order_dict = {-1: 'sell', 1: 'buy'}):
        super(Itch_trade_modul, self).__init__()
        self.stock = stock
        self.order_dict = order_dict

    def get_messages(date, stock):
        """Collect trading messages for given stock"""
        with pd.HDFStore(itch_store) as store:
            
            # Create a locates for stocks 
            stock_locate = store.select('/R' ,where='stock = stock').stock_locate.iloc[0]
            
            # Create a selection condition using the locate code
            target = f'stock_locate = {stock_locate}'
        
            data = {}

            # Relevant message types to extract
            messages = ['/A', '/F', '/E', '/C', '/X', '/D', '/U', '/P', '/Q']

            # For each message type, load the data for this stock
            
        
        return

    def get_trader(m):
        return

    def add_orders(orders, buysell, nlevels):
        """Add orders up to desired depth given by nlevels;
        sell in ascending, buy in descending order"""
        orders = []
        
        return
    
    def save_orders():
        return
        
    def for_loop(): 
        for i in range():
            pass

