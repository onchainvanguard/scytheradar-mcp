# ScytheRadar MCP

On-chain risk intelligence for AI agents — **read-only**. Lets Claude, Cursor, and other MCP clients screen wallet addresses, check blacklists, and trace fund flows directly.

**Read-only by design.** No private keys, no signing, no transaction execution. The worst case is a wrong answer; your funds are never at risk.

## Tools

| Tool | What it does |
|---|---|
| `screen_address` | Risk-screen a wallet address (0-100 score / level / verdict / risk flags) |
| `check_blacklist` | Blacklist hit check (Tether freezes / OFAC sanctions / phishing) |
| `trace_funds` | Fund tracing (flow / hops / aggregation / suspected laundering path) |

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
- Data: 9,000+ Tether freeze addresses · 495 OFAC sanctions (multi-chain) · phishing database · death files (rug-pull forensics)

## Disclaimer

Research use only. Not investment advice.
