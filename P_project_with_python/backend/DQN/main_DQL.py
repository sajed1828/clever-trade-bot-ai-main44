from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from collections import deque

# -----------------------
# Noisy Layers + Dueling Architecture
# -----------------------

class NoisyLinear(nn.Module):
    def __init__(self, in_features, out_features, sigma_init=0.5):
        super(NoisyLinear, self).__init__()
        self.in_features = in_features
        self.out_features = out_features
        self.sigma_init = sigma_init
        
        self.weight_mu = nn.Parameter(torch.empty(out_features, in_features))
        self.weight_sigma = nn.Parameter(torch.empty(out_features, in_features))
        self.register_buffer('weight_epsilon', torch.empty(out_features, in_features))
        
        self.bias_mu = nn.Parameter(torch.empty(out_features))
        self.bias_sigma = nn.Parameter(torch.empty(out_features))
        self.register_buffer('bias_epsilon', torch.empty(out_features))
        
        self.reset_parameters()
        self.reset_noise()

    def reset_parameters(self):
        mu_range = 1 / np.sqrt(self.in_features)
        self.weight_mu.data.uniform_(-mu_range, mu_range)
        self.weight_sigma.data.fill_(self.sigma_init * mu_range)
        self.bias_mu.data.uniform_(-mu_range, mu_range)
        self.bias_sigma.data.fill_(self.sigma_init * mu_range)

    def reset_noise(self):
        epsilon_in = self._scale_noise(self.in_features)
        epsilon_out = self._scale_noise(self.out_features)
        self.weight_epsilon.copy_(epsilon_out.ger(epsilon_in))
        self.bias_epsilon.copy_(epsilon_out)

    def forward(self, x):
        if self.training:
            weight = self.weight_mu + self.weight_sigma * self.weight_epsilon
            bias = self.bias_mu + self.bias_sigma * self.bias_epsilon
        else:
            weight = self.weight_mu
            bias = self.bias_mu
        return torch.nn.functional.linear(x, weight, bias)

    def _scale_noise(self, size):
        x = torch.randn(size)
        return x.sign().mul_(x.abs().sqrt())

class DuelingDQN(nn.Module):
    def __init__(self, input_dim, action_dim):
        super(DuelingDQN, self).__init__()
        self.feature = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.ReLU()
        )
        
        self.value_stream = nn.Sequential(
            NoisyLinear(128, 128),
            nn.ReLU(),
            NoisyLinear(128, 1)
        )
        
        self.advantage_stream = nn.Sequential(
            NoisyLinear(128, 128),
            nn.ReLU(),
            NoisyLinear(128, action_dim)
        )

    def forward(self, x):
        x = self.feature(x)
        value = self.value_stream(x)
        advantage = self.advantage_stream(x)
        q_value = value + advantage - advantage.mean()
        return q_value

    def reset_noise(self):
        for m in self.modules():
            if isinstance(m, NoisyLinear):
                m.reset_noise()

# -----------------------
# 2.  Prioritized Experience Replay 
# -----------------------

class ReplayMemory:
    def __init__(self, capacity, alpha=0.6):
        self.capacity = capacity
        self.memory = []
        self.alpha = alpha
        self.pos = 0
        self.priorities = np.zeros((capacity), dtype=np.float32)

    def push(self, state, action, reward, next_state, done):
        max_pord = self.priorities.max() if self.memory else 1.0
        
        if len(self.memory) <self.capacity:
           self.memory.append((state, action, reward, next_state, done))
        else:
            self.memory[self.pos] = (state, action, reward, next_state, done)
        self.priorities[self.pos] = max_pord
        self.pos = (self.pos + 1) % self.capacity
        
    def sample(self, batch_size, beta =0.4):
        if len(self.memory) == self.capacity:
            prios = self.priorities
        else:
            prios = self.priorities[:self.pos]
        
        probs = prios ** self.alpha
        probs /= probs.sum()
        
        indices =  np.random.choice(len(self.memory), batch_size, p=probs)
        samples = [self.memory[idx] for idx in indices]
        
        total = len(self.memory)
        weights = (total * probs[indices]) ** (-beta)
        weights /= weights.max()
        weights = np.array(weights, dtype=np.float32)

        
        batch = list(zip(*samples))
        states = torch.Tensor(batch[0], dtype= torch.float32)
        actions = torch.Tensor(batch[1], dtype= torch.int32).unsqueeze(1)
        rewards = torch.Tensor(batch[2], dtype= torch.float32).unsqueeze(1)
        next_states = torch.Tensor(batch[3], dtype= torch.float32)
        dones = torch.Tensor(batch[4], dtype= torch.float32).unsqueeze(1)
        indices = torch.Tensor(batch[5], dtype= torch.float32).unsqueeze(1)
        weights =torch.Tensor(weights, dtype= torch.float32).unsqueeze(1)
        
        return states, actions, rewards, next_states, dones, indices, weights

    def update_priorities(self, batch_indices, batch_priorities):
        for idx, prio in zip(batch_indices, batch_priorities):
            self.priorities[idx] = prio

    def __len__(self):
        return len(self.memory)
    
# -----------------------
# 3. (Agent) 
# -----------------------

class Agent:
    def __init__(self, state_dim, action_dim):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.policy_net = DuelingDQN(state_dim, action_dim).to(self.device)
        self.target_net = DuelingDQN(state_dim, action_dim).to(self.device)
        self.target_net.load_state_dict(self.policy_net.state_dict())
        self.target_net.eval()

        self.memory = ReplayMemory(10000)
        self.optimizer = optim.Adam(self.policy_net.parameters(), lr=1e-4)
        self.batch_size = 64
        self.gamma = 0.99
        self.update_target_every = 1000
        self.step_count = 0

    def select_action(self, state):
        state = torch.FloatTensor(state).unsqueeze(0).to(self.device)
        with torch.no_grad():
            action = self.policy_net(state).max(1)[1].item()
        return action

    def optimize(self):
        if len(self.memory) < self.batch_size:
            return

        states, actions, rewards, next_states, dones, indices, weights = self.memory.sample(self.batch_size)

        states = states.to(self.device)
        actions = actions.to(self.device)
        rewards = rewards.to(self.device)
        next_states = next_states.to(self.device)
        dones = dones.to(self.device)
        weights = weights.to(self.device)

        current_q_values = self.policy_net(states).gather(1, actions)

        with torch.no_grad():
            next_actions = self.policy_net(next_states).max(1)[1].unsqueeze(1)
            next_q_values = self.target_net(next_states).gather(1, next_actions)
            target_q_values = rewards + self.gamma * next_q_values * (1 - dones)

        loss = (current_q_values - target_q_values).pow(2) * weights
        prios = loss + 1e-5
        loss = loss.mean()

        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()

        self.memory.update_priorities(indices, prios.data.cpu().numpy())

        self.step_count += 1
        if self.step_count % self.update_target_every == 0:
            self.target_net.load_state_dict(self.policy_net.state_dict())

        self.policy_net.reset_noise()
        self.target_net.reset_noise()

    def store_transition(self, state, action, reward, next_state, done):
        self.memory.push(state, action, reward, next_state, done)

# -----------------------
# 4. training loop
# -----------------------

def train(agent, env, num_episodes=500):
    for episode in range(num_episodes):
        state = env.reset()
        total_reward = 0

        for t in range(200):
            action = agent.select_action(state)
            next_state, reward, done, _ = env.step(action)
            agent.store_transition(state, action, reward, next_state, done)
            agent.optimize()

            state = next_state
            total_reward += reward

            if done:
                break

        print(f"Episode {episode+1}: Total Reward = {total_reward}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # عنوان React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],)

@app.post("/settings/start-training")
async def start_training(data: dict):
    episodes = data.get("episodes", 100)
    try:
        agent = Agent()  # تأكد أن الكلاس Agent لا يأخذ بارامترات غير ضرورية
        agent.train(episodes)  # تأكد من وجود دالة train داخل Agent
        return {"message": f"model is trading {episodes} loop is complite"}
    except Exception as e:
        return {"message": f"ERROR: {str(e)}"}
