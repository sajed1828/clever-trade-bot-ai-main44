# app.py 
from fastapi import FastAPI, Request
from DQN import Agent

app = FastAPI()

@app.post("/predict")
async def predict(data: dict):
    price = data["price"]
    result = Agent(price)
    return {"action": result}

