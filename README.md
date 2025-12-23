# Solana Referral System

A Solana-based referral and attribution system designed to enable on-chain incentive distribution using SPL tokens.  
Built with Anchor, supporting verifiable reward transfers between users.  
This project demonstrates how referral logic and rewards can be enforced directly on-chain, removing the need for off-chain trust.

## ✨ Features

- On-chain referral reward transfers using SPL tokens
- Secure token movement via Anchor CPI calls
- Wallet-authorized reward distribution
- Composable design for protocol integrations
- Suitable for growth, attribution, and incentive systems in Solana apps

## 🏗 Architecture Overview

The system consists of:

- **Smart Contract (Anchor Program)**  
  Handles secure SPL token transfers for referral rewards.

- **Referral Logic (Off-chain / App Layer)**  
  Determines who receives rewards and when, while the contract enforces how rewards move on-chain.

## 🔐 Smart Contract Details

**Program ID**

4uL34WQ31gYhMjkks7bUd9yx2TYztvj2iUp9BjXvpnQg


**Core Instruction**  
`send_token`  
Transfers SPL tokens from a sender’s token account to a recipient’s token account using CPI.

```rust
pub fn send_token(ctx: Context<SendToken>, amount: u64) -> Result<()>

### Accounts

- `from_token_account` – Sender’s SPL token account (mutable)
- `to_token_account` – Recipient’s SPL token account (mutable)
- `authority` – Signer owning the sender token account
- `token_program` – SPL Token Program

## 🔄 How It Works

1. A user performs an action that qualifies for a referral reward
2. The application verifies referral eligibility
3. The Anchor program executes an SPL token transfer
4. Rewards are settled fully on-chain, transparently and securely

## 🧪 Example Use Cases

- Protocol referral programs
- User acquisition incentives
- Ambassador or affiliate payouts
- DAO reward distribution
- Growth attribution systems

## 🛠 Tech Stack

- Solana
- Anchor Framework
- Rust
- SPL Token Program

## 🚀 Project Status

- ✅ Anchor smart contract implemented
- ✅ SPL token transfers working
- ✅ MVP completed
- 🔄 Extensible for additional referral logic (tiers, limits, analytics)

## 📌 Notes

This project focuses on core on-chain mechanics.  
Referral qualification logic is intentionally kept off-chain to maintain flexibility while preserving trustless settlement.
