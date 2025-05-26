
import { useState, useCallback, useEffect } from 'react';

interface LSTMState {
  position: number;
  cash: number;
  previousPrice: number;
  previousAction: string;
  weights: number[];
  biases: number[];
  tradeCount: number;
}

interface LSTMHyperParameters {
  learningRate: number;
  recurrentDropout: number;
  timeSteps: number;
}

/**
 * Long Short-Term Memory (LSTM) Trading Agent
 * Uses a simplified LSTM approach for time-series prediction
 */
export class LSTMTradingAgent {
  private state: LSTMState;
  private learningRate: number;
  private recurrentDropout: number;
  private timeSteps: number;
  private priceHistory: number[];

  constructor(initialCapital: number = 10000) {
    this.learningRate = 0.01;
    this.recurrentDropout = 0.2;
    this.timeSteps = 10;
    this.priceHistory = [];
    this.state = {
      position: 0,
      cash: initialCapital,
      previousPrice: 100, // Initial price
      previousAction: 'hold',
      weights: Array(this.timeSteps).fill(0).map(() => Math.random() * 0.2 - 0.1),
      biases: [Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1],
      tradeCount: 0,
    };
  }

  /**
   * Get the current state of the agent
   */
  getState(): LSTMState {
    return { ...this.state };
  }

  /**
   * Calculate portfolio value (cash + position value)
   */
  getPortfolioValue(currentPrice: number): number {
    return this.state.cash + this.state.position * currentPrice;
  }

  /**
   * Update hyperparameters
   */
  setHyperparameters(params: LSTMHyperParameters): void {
    this.learningRate = params.learningRate;
    this.recurrentDropout = params.recurrentDropout;
    this.timeSteps = params.timeSteps;
    
    // Resize weights array if timeSteps changed
    if (this.state.weights.length !== this.timeSteps) {
      this.state.weights = Array(this.timeSteps).fill(0)
        .map((_, i) => i < this.state.weights.length 
          ? this.state.weights[i] 
          : Math.random() * 0.2 - 0.1
        );
    }
  }

  /**
   * Reset the agent to its initial state
   */
  reset(initialCapital: number = 10000): void {
    this.priceHistory = [];
    this.state = {
      position: 0,
      cash: initialCapital,
      previousPrice: 100,
      previousAction: 'hold',
      weights: Array(this.timeSteps).fill(0).map(() => Math.random() * 0.2 - 0.1),
      biases: [Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1],
      tradeCount: 0,
    };
  }

  /**
   * Simplified LSTM cell calculation (focusing on the core concept)
   */
  private simplifiedLSTMPredict(priceHistory: number[]): number {
    // In a real implementation, this would involve proper LSTM gates
    // Here we use a simplified weighted sum of historical prices
    
    const normalizedHistory = [...priceHistory];
    
    // Simple dropout simulation
    if (this.recurrentDropout > 0) {
      for (let i = 0; i < normalizedHistory.length; i++) {
        if (Math.random() < this.recurrentDropout) {
          normalizedHistory[i] = 0; // "Drop out" this input
        }
      }
    }
    
    // Weighted sum of inputs (simplified model)
    let prediction = this.state.biases[0];
    const historyLength = Math.min(normalizedHistory.length, this.state.weights.length);
    
    for (let i = 0; i < historyLength; i++) {
      prediction += normalizedHistory[normalizedHistory.length - 1 - i] * this.state.weights[i];
    }
    
    // Apply activation function (tanh)
    prediction = Math.tanh(prediction) * this.state.biases[1] + this.state.previousPrice;
    
    return prediction;
  }

  /**
   * Predict action based on current price
   */
  predict(currentPrice: number): string {
    // Update price history
    this.priceHistory.push(currentPrice);
    if (this.priceHistory.length > this.timeSteps * 2) {
      this.priceHistory.shift();
    }
    
    // Need enough history to make prediction
    if (this.priceHistory.length < this.timeSteps) {
      this.state.previousPrice = currentPrice;
      return 'hold';
    }
    
    // Make prediction using LSTM
    const predictedPrice = this.simplifiedLSTMPredict(this.priceHistory.slice(-this.timeSteps));
    
    // Determine action based on prediction
    let action: string;
    if (predictedPrice > currentPrice * 1.005) {
      action = 'buy';
    } else if (predictedPrice < currentPrice * 0.995) {
      action = 'sell';
    } else {
      action = 'hold';
    }
    
    // Execute the action
    this.executeAction(action, currentPrice);
    
    // Learn from this experience
    this.learn(currentPrice);
    
    return action;
  }

  /**
   * Execute a trading action
   */
  private executeAction(action: string, currentPrice: number): void {
    switch(action) {
      case 'buy':
        if (this.state.cash > 0) {
          // Simple strategy: use 10% of available cash to buy
          const cashToUse = this.state.cash * 0.1;
          const shares = Math.floor(cashToUse / currentPrice);
          
          if (shares > 0) {
            this.state.position += shares;
            this.state.cash -= shares * currentPrice;
            this.state.tradeCount++;
          }
        }
        break;
        
      case 'sell':
        if (this.state.position > 0) {
          // Simple strategy: sell 50% of position
          const sharesToSell = Math.ceil(this.state.position * 0.5);
          this.state.cash += sharesToSell * currentPrice;
          this.state.position -= sharesToSell;
          this.state.tradeCount++;
        }
        break;
        
      case 'hold':
      default:
        // Do nothing
        break;
    }
    
    // Update state
    this.state.previousAction = action;
    this.state.previousPrice = currentPrice;
  }

  /**
   * Learn from experience (update weights)
   */
  private learn(currentPrice: number): void {
    if (this.priceHistory.length < this.timeSteps + 1) {
      return; // Not enough data to learn
    }
    
    // Calculate error (simple difference between prediction and actual)
    const historicalPrices = this.priceHistory.slice(-this.timeSteps - 1, -1);
    const prediction = this.simplifiedLSTMPredict(historicalPrices);
    const actual = currentPrice;
    const error = actual - prediction;
    
    // Update weights (simple gradient descent)
    for (let i = 0; i < Math.min(this.timeSteps, historicalPrices.length); i++) {
      const input = historicalPrices[historicalPrices.length - 1 - i];
      this.state.weights[i] += this.learningRate * error * input;
    }
    
    // Update biases
    this.state.biases[0] += this.learningRate * error;
    this.state.biases[1] += this.learningRate * error * Math.tanh(this.state.biases[0]);
  }
}

/**
 * React hook for using LSTM Trading Agent
 */
export function useLSTMTrading(initialCapital: number = 10000) {
  const [agent] = useState(() => new LSTMTradingAgent(initialCapital));
  const [state, setState] = useState(agent.getState());
  const [portfolio, setPortfolio] = useState(initialCapital);

  // Predict action
  const predict = useCallback((currentPrice: number) => {
    const action = agent.predict(currentPrice);
    setState(agent.getState());
    setPortfolio(agent.getPortfolioValue(currentPrice));
    return action;
  }, [agent]);

  // Reset agent
  const reset = useCallback((capital?: number) => {
    agent.reset(capital);
    setState(agent.getState());
    setPortfolio(capital || initialCapital);
  }, [agent, initialCapital]);

  // Set hyperparameters
  const setHyperparameters = useCallback((params: LSTMHyperParameters) => {
    agent.setHyperparameters(params);
  }, [agent]);

  // Return the agent state and methods
  return { state, predict, portfolio, reset, setHyperparameters };
}
