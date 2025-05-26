
import { useState, useCallback, useEffect } from 'react';

interface XLSTMState {
  position: number;
  cash: number;
  previousPrice: number;
  previousAction: string;
  weights: number[];
  biases: number[];
  attentionWeights: number[][];
  tradeCount: number;
}

interface XLSTMHyperParameters {
  learningRate: number;
  attentionHeads: number;
  timeSteps: number;
}

/**
 * Extended LSTM with Attention (xLSTM) Trading Agent
 * Adds attention mechanism to improve prediction
 */
export class XLSTMTradingAgent {
  private state: XLSTMState;
  private learningRate: number;
  private attentionHeads: number;
  private timeSteps: number;
  private priceHistory: number[];
  private volumeHistory: number[]; // Additional feature

  constructor(initialCapital: number = 10000) {
    this.learningRate = 0.01;
    this.attentionHeads = 2;
    this.timeSteps = 12;
    this.priceHistory = [];
    this.volumeHistory = [];
    
    // Initialize attention weights
    const attentionWeights = Array(this.attentionHeads).fill(0)
      .map(() => Array(this.timeSteps).fill(0)
        .map(() => Math.random() * 0.2 - 0.1));
    
    this.state = {
      position: 0,
      cash: initialCapital,
      previousPrice: 100, // Initial price
      previousAction: 'hold',
      weights: Array(this.timeSteps).fill(0).map(() => Math.random() * 0.2 - 0.1),
      biases: [Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1],
      attentionWeights,
      tradeCount: 0,
    };
  }

  /**
   * Get the current state of the agent
   */
  getState(): XLSTMState {
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
  setHyperparameters(params: XLSTMHyperParameters): void {
    const oldAttentionHeads = this.attentionHeads;
    const oldTimeSteps = this.timeSteps;
    
    this.learningRate = params.learningRate;
    this.attentionHeads = params.attentionHeads;
    this.timeSteps = params.timeSteps;
    
    // Resize weights array if timeSteps changed
    if (this.state.weights.length !== this.timeSteps) {
      this.state.weights = Array(this.timeSteps).fill(0)
        .map((_, i) => i < this.state.weights.length 
          ? this.state.weights[i] 
          : Math.random() * 0.2 - 0.1
        );
    }
    
    // Resize attention weights if needed
    if (oldAttentionHeads !== params.attentionHeads || oldTimeSteps !== params.timeSteps) {
      this.state.attentionWeights = Array(params.attentionHeads).fill(0)
        .map((_, head) => Array(params.timeSteps).fill(0)
          .map((_, step) => {
            if (head < oldAttentionHeads && step < oldTimeSteps) {
              return this.state.attentionWeights[head][step];
            }
            return Math.random() * 0.2 - 0.1;
          })
        );
    }
  }

  /**
   * Reset the agent to its initial state
   */
  reset(initialCapital: number = 10000): void {
    this.priceHistory = [];
    this.volumeHistory = [];
    
    // Initialize attention weights
    const attentionWeights = Array(this.attentionHeads).fill(0)
      .map(() => Array(this.timeSteps).fill(0)
        .map(() => Math.random() * 0.2 - 0.1));
    
    this.state = {
      position: 0,
      cash: initialCapital,
      previousPrice: 100,
      previousAction: 'hold',
      weights: Array(this.timeSteps).fill(0).map(() => Math.random() * 0.2 - 0.1),
      biases: [Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1],
      attentionWeights,
      tradeCount: 0,
    };
  }

  /**
   * Apply attention mechanism to the input
   */
  private applyAttention(priceHistory: number[]): number[] {
    const attentionOutputs: number[] = [];
    
    // For each attention head
    for (let head = 0; head < this.attentionHeads; head++) {
      let weightedSum = 0;
      let weightSum = 0;
      
      // Apply softmax-like attention weights
      for (let i = 0; i < Math.min(priceHistory.length, this.timeSteps); i++) {
        const attentionScore = Math.exp(this.state.attentionWeights[head][i]);
        weightedSum += priceHistory[priceHistory.length - 1 - i] * attentionScore;
        weightSum += attentionScore;
      }
      
      // Normalize by sum of weights
      attentionOutputs.push(weightSum > 0 ? weightedSum / weightSum : 0);
    }
    
    return attentionOutputs;
  }

  /**
   * xLSTM prediction with attention mechanism
   */
  private xLSTMPredict(priceHistory: number[]): number {
    if (priceHistory.length < this.timeSteps) {
      return priceHistory[priceHistory.length - 1]; // Not enough data
    }
    
    // Apply attention mechanism
    const attentionOutputs = this.applyAttention(priceHistory);
    
    // Weighted sum of attention outputs and direct inputs
    let prediction = this.state.biases[0];
    
    // Add attention outputs
    for (let i = 0; i < attentionOutputs.length; i++) {
      prediction += attentionOutputs[i] * (i + 1) / this.attentionHeads;
    }
    
    // Add direct weighted inputs for residual connection
    const historyLength = Math.min(priceHistory.length, this.state.weights.length);
    for (let i = 0; i < historyLength; i++) {
      prediction += priceHistory[priceHistory.length - 1 - i] * this.state.weights[i] * 0.2;
    }
    
    // Non-linearity + scaling
    prediction = (Math.tanh(prediction) * 0.1 + 1) * priceHistory[priceHistory.length - 1];
    
    return prediction;
  }

  /**
   * Predict action based on current price and volume
   */
  predict(currentPrice: number, volume: number = 1000): string {
    // Update history
    this.priceHistory.push(currentPrice);
    this.volumeHistory.push(volume);
    
    if (this.priceHistory.length > this.timeSteps * 2) {
      this.priceHistory.shift();
      this.volumeHistory.shift();
    }
    
    // Need enough history to make prediction
    if (this.priceHistory.length < this.timeSteps) {
      this.state.previousPrice = currentPrice;
      return 'hold';
    }
    
    // Make prediction using xLSTM
    const predictedPrice = this.xLSTMPredict(this.priceHistory.slice(-this.timeSteps));
    
    // Determine action based on prediction
    let action: string;
    if (predictedPrice > currentPrice * 1.01) {
      action = 'buy';
    } else if (predictedPrice < currentPrice * 0.99) {
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
          // Strategy: use 15% of available cash to buy
          const cashToUse = this.state.cash * 0.15;
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
          // Strategy: sell 40% of position
          const sharesToSell = Math.ceil(this.state.position * 0.4);
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
   * Learn from experience (update weights and attention)
   */
  private learn(currentPrice: number): void {
    if (this.priceHistory.length < this.timeSteps + 1) {
      return; // Not enough data to learn
    }
    
    // Calculate error
    const historicalPrices = this.priceHistory.slice(-this.timeSteps - 1, -1);
    const prediction = this.xLSTMPredict(historicalPrices);
    const actual = currentPrice;
    const error = actual - prediction;
    
    // Update regular weights
    for (let i = 0; i < Math.min(this.timeSteps, historicalPrices.length); i++) {
      const input = historicalPrices[historicalPrices.length - 1 - i];
      this.state.weights[i] += this.learningRate * error * input * 0.01;
    }
    
    // Update attention weights
    for (let head = 0; head < this.attentionHeads; head++) {
      for (let i = 0; i < Math.min(this.timeSteps, historicalPrices.length); i++) {
        this.state.attentionWeights[head][i] += 
          this.learningRate * error * 0.005 * (head + 1) / this.attentionHeads;
      }
    }
    
    // Update biases
    this.state.biases[0] += this.learningRate * error * 0.01;
    this.state.biases[1] += this.learningRate * error * 0.01;
  }
}

/**
 * React hook for using xLSTM Trading Agent
 */
export function useXLSTMTrading(initialCapital: number = 10000) {
  const [agent] = useState(() => new XLSTMTradingAgent(initialCapital));
  const [state, setState] = useState(agent.getState());
  const [portfolio, setPortfolio] = useState(initialCapital);

  // Predict action
  const predict = useCallback((currentPrice: number, volume: number = 1000) => {
    const action = agent.predict(currentPrice, volume);
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
  const setHyperparameters = useCallback((params: XLSTMHyperParameters) => {
    agent.setHyperparameters(params);
  }, [agent]);

  // Return the agent state and methods
  return { state, predict, portfolio, reset, setHyperparameters };
}
