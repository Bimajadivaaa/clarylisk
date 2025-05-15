# 🔮 Clarylisk Smart Contracts with Foundry

## ⚡️ The Magic of Foundry

Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust. It's the backbone of Clarylisk's smart contract development!

## 🧰 Foundry Toolbox

Foundry brings you:

- 🛠️ **Forge**: Lightning-fast Ethereum testing framework
- 🗡️ **Cast**: Swiss army knife for EVM interactions
- ⚒️ **Anvil**: Local Ethereum node with superpowers
- 🪄 **Chisel**: Solidity REPL that makes debugging fun

## 🚀 Quick Start Guide

### 🔍 Prerequisites

1. Install Foundry (if you haven't already):
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Clone the Clarylisk smart contracts repository:
```bash
git clone https://github.com/clarylisk/contracts.git
cd contracts
```

## ✨ Magical Commands

### 🏗️ Build Your Contracts
```bash
forge build
```

### 🧪 Test Your Magic
```bash
forge test
```
Want colorful output? Try:
```bash
forge test -vvv --gas-report
```

### 💅 Format Your Spells
```bash
forge fmt
```

### ⛽ Track Your Gas Usage
```bash
forge snapshot
```

### 🌍 Create Your Local Chain
```bash
anvil
```

### 📜 Deploy Your Contracts
Deploy to testnet:
```bash
forge script script/DeployClarylisk.s.sol:DeployClaryliskScript --rpc-url lisk_testnet --broadcast --verify
```

Deploy to mainnet (be careful!):
```bash
forge script script/DeployClarylisk.s.sol:DeployClaryliskScript --rpc-url lisk_mainnet --broadcast --verify
```

### 🔮 Interact With The Blockchain
Get token balance:
```bash
cast call $IDRX_CONTRACT "balanceOf(address)" $YOUR_ADDRESS --rpc-url lisk_mainnet
```

## 🧙‍♂️ Advanced Spells

### Deploy with environment variables
```bash
source .env
forge script script/DeployClarylisk.s.sol:DeployClaryliskScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY
```

### Verify your contract
```bash
forge verify-contract $CONTRACT_ADDRESS src/Clarylisk.sol:Clarylisk --chain-id 1 --watch
```

### Debug transaction
```bash
cast trace $TX_HASH --rpc-url lisk_mainnet
```

## 📚 Common Contract Interactions

### Approve donations (for testing)
```bash
cast send $CLARYLISK_CONTRACT "approveDonations(uint256[])" "[1,2,3]" --rpc-url $RPC_URL --private-key $PRIVATE_KEY
```

### Burn gambling donations
```bash
cast send $CLARYLISK_CONTRACT "burnDonations(uint256[])" "[4,5]" --rpc-url $RPC_URL --private-key $PRIVATE_KEY
```

## 🎭 Testing Environment Setup

Create a `.env` file with:
```
RPC_URL="https://mainnet.lisk.io/rpc"
PRIVATE_KEY="your_private_key_here"
ETHERSCAN_API_KEY="your_etherscan_api_key_here"
```

Then load it before running commands:
```bash
source .env
```

## 🏆 Best Practices

- Always run `forge test` before deploying
- Use `forge coverage` to ensure test coverage
- Leverage `forge gas-report` to optimize contracts
- Setup GitHub Actions for CI/CD with Foundry
- Use `cast storage` to inspect contract storage

## 🆘 Need Help?

```bash
forge --help
anvil --help
cast --help
chisel --help
```

Or visit the [Foundry Documentation](https://book.getfoundry.sh/)

---

<p align="center">🔮 <b>Happy Conjuring!</b> 🔮</p>
