
import { useState, useCallback, useEffect } from 'react';

interface DQLState {
  position: number;
  cash: number;
  previousPrice: number;
  previousAction: string;
  qTable: Record<string, Record<string, number>>;
  tradeCount: number;
}

interface HyperParameters {
  learningRate: number;
  discountFactor: number;
  explorationRate: number;
}

/**
 * Deep Q-Learning Trading Agent
 * Uses a simple Q-table approach for trading decisions
 */
export class DQLTradingAgent {
  private state: DQLState;
  private learningRate: number;
  private discountFactor: number;
  private explorationRate: number;

  constructor(initialCapital: number = 10000) {
    this.learningRate = 0.1;
    this.discountFactor = 0.9;
    this.explorationRate = 0.2;
    this.state = {
      position: 0,
      cash: initialCapital,
      previousPrice: 100, // Initial price
      previousAction: 'hold',
      qTable: {},
      tradeCount: 0,
    };
  }

  /**
   * Get the current state of the agent
   */
  getState(): DQLState {
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
  setHyperparameters(params: HyperParameters): void {
    this.learningRate = params.learningRate;
    this.discountFactor = params.discountFactor;
    this.explorationRate = params.explorationRate;
  }

  /**
   * Reset the agent to its initial state
   */
  reset(initialCapital: number = 10000): void {
    this.state = {
      position: 0,
      cash: initialCapital,
      previousPrice: 100,
      previousAction: 'hold',
      qTable: {},
      tradeCount: 0,
    };
  }

  /**
   * Discretize the state for Q-table lookup
   * Simplifies continuous state space into discrete buckets
   */
  private getStateKey(price: number): string {
    // Simple price trend state representation
    const priceChange = price > this.state.previousPrice ? 'up' : 
                       price < this.state.previousPrice ? 'down' : 'same';
    
    // Position state (has position or not)
    const positionState = this.state.position > 0 ? 'has_position' : 'no_position';
    
    return `${priceChange}_${positionState}`;
  }

  /**
   * Get available actions based on current state
   */
  private getAvailableActions(): string[] {
    const actions = ['hold'];
    
    // Can buy if has cash
    if (this.state.cash > 0) {
      actions.push('buy');
    }
    
    // Can sell if has position
    if (this.state.position > 0) {
      actions.push('sell');
    }
    
    return actions;
  }

  /**
   * Predict action using epsilon-greedy strategy
   */
  predict(currentPrice: number): string {
    const stateKey = this.getStateKey(currentPrice);
    const availableActions = this.getAvailableActions();
    
    // Initialize Q-values for this state if not exist
    if (!this.state.qTable[stateKey]) {
      this.state.qTable[stateKey] = {};
      availableActions.forEach(action => {
        this.state.qTable[stateKey][action] = 0;
      });
    }
    
    let action: string;
    
    // Explore: random action with probability explorationRate
    if (Math.random() < this.explorationRate) {
      action = availableActions[Math.floor(Math.random() * availableActions.length)];
    } 
    // Exploit: choose best action
    else {
      const qValues = this.state.qTable[stateKey];
      action = availableActions.reduce((best, current) => {
        return qValues[current] > qValues[best] ? current : best;
      }, availableActions[0]);
    }
    
    // Execute the action
    this.executeAction(action, currentPrice);
    
    // Learn from this experience
    this.learn(stateKey, action, currentPrice);
    
    return action;
  }

  /**
   * Execute a trading action
   */
  private executeAction(action: string, currentPrice: number): void {
    const previousValue = this.getPortfolioValue(this.state.previousPrice);
    
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
   * Learn from experience using Q-learning
   */
  private learn(stateKey: string, action: string, currentPrice: number): void {
    const previousValue = this.getPortfolioValue(this.state.previousPrice);
    const currentValue = this.getPortfolioValue(currentPrice);
    
    // Calculate reward based on portfolio value change
    const reward = currentValue - previousValue;
    
    // Get max Q-value for next state
    const nextStateKey = this.getStateKey(currentPrice);
    let maxNextQ = 0;
    
    if (this.state.qTable[nextStateKey]) {
      maxNextQ = Math.max(...Object.values(this.state.qTable[nextStateKey]));
    }
    
    // Q-learning update rule
    const oldQValue = this.state.qTable[stateKey][action];
    const newQValue = oldQValue + this.learningRate * (
      reward + this.discountFactor * maxNextQ - oldQValue
    );
    
    // Update Q-table
    this.state.qTable[stateKey][action] = newQValue;
  }
}

/**
 * React hook for using DQL Trading Agent
 */
export function useDQLTrading(initialCapital: number = 10000) {
  const [agent] = useState(() => new DQLTradingAgent(initialCapital));
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
  const setHyperparameters = useCallback((params: HyperParameters) => {
    agent.setHyperparameters(params);
  }, [agent]);

  // Return the agent state and methods
  return { state, predict, portfolio, reset, setHyperparameters };
}
