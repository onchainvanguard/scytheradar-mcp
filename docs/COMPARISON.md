# Chain risk MCP servers in 2026: a comparison

On-chain risk intelligence is moving into AI agents. Teams now ask "should I accept
this USDT?" or "is this wallet a honeypot?" directly inside Coze, Dify, Claude, or
Cursor — and the answer has to come back through an MCP server. This note compares
how the field splits, and where ScytheRadar sits.

## The landscape in one table

| Server | Position | Audience |
|---|---|---|
| MistTrack (SlowMist) | Established security-lab AML, institutional address profiling | Exchanges / enterprise KYT |
| ChainAware | On-chain compliance, wallet profiling + batch screening | Enterprise compliance |
| Chainalysis / Elliptic / TRM | Traditional AML leaders | Government, banks |
| Independent AML teams (OceanAlt, PublicAML, Satoshkin, etc.) | Lightweight address-blacklist lookups | Developers |
| **ScytheRadar** | **Read-only chain risk + rug-pull forensics + TRON dirty-USDT, bilingual** | **Chinese agent ecosystem (Coze/Dify) + retail / P2P USDT desks** |

The table is deliberately about position, not raw list sizes. Most vendors do not
publish their list counts in a verifiable way, so comparing them on numbers would
be making up data. The three columns above — position and audience — are the only
honest axes.

## Where ScytheRadar actually differs

Three things none of the mainstream vendors focus on:

1. **Chinese-language agent ecosystem first.** Tool descriptions are bilingual
   (中文/English) so Coze, Dify, Wenxin, and Kimi invoke them precisely. The
   established vendors ship English-only surfaces.

2. **Rug-pull forensics, not just a score.** 87+ death files with autopsy reports,
   timelines, and scam-contract breakdowns. It returns a *case file*, not a number.

3. **TRON dirty-USDT as a first-class concern.** Tether's official freeze list
   (9,000+ addresses) plus 495 OFAC multi-chain sanctions, aimed at the Asia P2P /
   OTC question: "should I accept this USDT?"

## Safety model

- **Read-only by design.** No private keys, no signing, no transaction execution.
  The worst case is a wrong answer; funds are never at risk.
- Free tier: 6 calls/day, no signup. Paid: Dev 15 USDT/mo, Pro 50 USDT/mo — orders
  of magnitude cheaper than institutional AML.

## Verifiable anchors

Everything ScytheRadar claims is checkable:

- Tether freeze list: `/api/v1/blacku` (TRON coverage)
- OFAC multi-chain sanctions: `lib/sanctions.json` (`count` field)
- Death files: `/death/` — 87 projects, including the LAX pull 14-chapter case
  (SR-TRACE-DD169EB1)

## Links

- GitHub: https://github.com/onchainvanguard/scytheradar-mcp
- npm: https://www.npmjs.com/package/scytheradar-mcp
- Website: https://scytheradar.com
- Install: `npx -y scytheradar-mcp` (env `SCYTHERADAR_API_KEY`)
