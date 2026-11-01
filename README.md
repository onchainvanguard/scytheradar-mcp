# ScytheRadar MCP

On-chain risk intelligence for AI agents — **read-only**, **bilingual (中文/English)**, and built for the Chinese-speaking agent ecosystem first. Screen wallets, check blacklists, and trace fund flows, with rug-pull forensics no other crypto MCP ships.

**Read-only by design.** No private keys, no signing, no transaction execution. The worst case is a wrong answer; your funds are never at risk.

## Why ScytheRadar (vs the 15+ crypto-AML MCPs)

| We win where they don't | The gap we fill |
|---|---|
| 🀄 Chinese agent ecosystem first | First mover for Coze / Dify / Chinese Claude & Cursor users — bilingual tool descriptions and docs. Every competitor is English-only. |
| 🪦 Rug-pull forensics (death files) | 87+ rug-pull case files with autopsy reports, timelines, and scam-contract code breakdowns — not just a score, a case file. |
| 💧 TRON 脏U (dirty-USDT) focus | Tether's official freeze list (9,000+ addresses) + OFAC multi-chain sanctions — built for Asia's P2P/OTC "should I accept this USDT" reality. |
| 💰 Cheap, read-only, keyless trial | 6 free calls/day, no signup; paid plans from a few USDT. Built for retail users and small merchants, not banks. |

## Tools

| Tool | What it does |
|---|---|
| `screen_address` | Risk-screen a wallet address (0-100 score / level / verdict / risk flags) |
| `check_blacklist` | Blacklist hit check (Tether freezes / OFAC sanctions / phishing) |
| `trace_funds` | Fund tracing (flow / hops / aggregation / suspected laundering path) |

## Language

Tool descriptions are bilingual (中文 / English), so Chinese-language agents (Coze, Dify, 文心, Kimi) call the right tool just as reliably as English ones. 工具描述中英双语，中文 agent 同样能精准调用。

## Quick start

### 1. Get an API key

Grab a free key at <https://scytheradar.com/b2b>. Without a key you get a limited trial (6 calls/day); with a key you unlock full coverage.

### 2. Claude Desktop

Add to your Claude Desktop MCP config:

```json
{
  "mcpServers": {
    "scytheradar": {
      "command": "npx",
      "args": ["-y", "scytheradar-mcp"],
      "env": {
        "SCYTHERADAR_API_KEY": "your-key"
      }
    }
  }
}
```

### 3. Cursor

Cursor Settings → MCP → Add new MCP server, command `npx -y scytheradar-mcp`, env `SCYTHERADAR_API_KEY`.

### 4. Run locally

```bash
export SCYTHERADAR_API_KEY=your-key
npx -y scytheradar-mcp
```

## Environment variables

| Variable | Description |
|---|---|
| `SCYTHERADAR_API_KEY` | API key (required for paid endpoints) |
| `SCYTHERADAR_BASE` | API base URL, defaults to `https://scytheradar.com` |

## Coverage

- Chains: BSC / Ethereum / Base / Arbitrum / TRON (blacklist also covers BTC / LTC / ZEC / XMR / Solana)
- Data: 9,000+ Tether freeze addresses · 495 OFAC sanctions (multi-chain) · phishing database · 87+ rug-pull death files (autopsy + timeline)

## Disclaimer

Research use only. Not investment advice.
