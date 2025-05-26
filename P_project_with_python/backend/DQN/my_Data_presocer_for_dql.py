import csv
import pandas as pd 
#from Database.CREATE_SQL import url

class DataProcessor:
    def __init__(self):
        pass
    
    def get_file_content(self, link_to_file):
        coindata = []
        with open(link_to_file, 'r') as dataFile:
            open_files = csv.reader(dataFile, delimiter=',')
            first = True
            for row in open_files:
             if first:
                first = False
                continue
             flowdata = []
             for i in row:
                 flowdata.append(float(i))
             coindata.append(flowdata)
        return coindata
    
    def get_betch_data(self, link_to_file, qyt=60):
        coindata = self.get_file_content(link_to_file)
        data_betch = []
        qyt = int(len(coindata)/qyt+0.5)
        
        for cow in range(qyt):
            data_betch.append(coindata[cow:cow+60])
        
        return data_betch
    
    def clean_fix_content(self, link_to_file, keep_first_line=True, write_to_file=False):
        coindata = self.get_file_content(link_to_file)
        Newdata = []
        Temdata = []
        if keep_first_line:
            Newdata.append(coindata[0])
        minute = 1
        for row in range(0, len(coindata)):
            if int(coindata[row][0]) == minute:
                Temdata.append(coindata[row])
                if minute != 60:
                    minute+=1
                else:
                    minute=1
                    Newdata += Temdata
                    Temdata= []    
            elif int(coindata[row][0]) == 1:
                minute = 2
                Temdata = []
                Temdata.append(coindata[row])
        if write_to_file:
            newFile = link_to_file.split('.')
            newlink = newFile[0]+"_Clean."+newFile[1]
            self.write_data_to_file(newlink, Newdata)        
        
        return Newdata
    
    def write_data_to_file(self, link_to_file, data):
        with open(link_to_file, "w") as outFile:
            writer = csv.writer(outFile)
            writer.writerows(data)
        
    
if __name__ == "__main__":
    dp = DataProcessor()
    url = "private/cryptoMinute/BATUSDT.csv"
    
    cdata = dp.clean_fix_content(url, keep_first_line=False, write_to_file=True)

