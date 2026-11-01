// ScytheRadar MCP Server —— 给 AI Agent 的链上风险检测工具箱（只读）
// 3 个 tool：screen_address / check_blacklist / trace_funds
// 薄封装 scytheradar.com /api/v1/* 判定 API，不持有私钥、不执行任何交易。

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { apiGet, apiGetWithFallback, ApiError, hasKey, looksValidAddress } from "./lib/client.js";

const VERSION = "0.1.0";

const server = new McpServer({
  name: "scytheradar-mcp",
  version: VERSION,
});

const chainEnum = z
  .enum(["auto", "bsc", "ethereum", "base", "arbitrum", "tron"])
  .optional()
  .describe("Chain. Defaults to auto-detect. Options: bsc / ethereum / base / arbitrum / tron");

// 统一的 tool 错误兜底：把异常转成 agent 可读的文本，不裸抛
function safe(fn) {
  return async (args) => {
    try {
      return await fn(args);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : String(e?.message || e);
      return { content: [{ type: "text", text: `Query failed: ${msg}` }], isError: true };
    }
  };
}

function fmt(data) {
  return JSON.stringify(data, null, 2);
}

// ---------- tool 1：地址风险筛查 ----------
server.tool(
  "screen_address",
  "Screen a wallet address for on-chain risk. Returns a 0-100 risk score, risk level, verdict, and matched risk flags (honeypot / mintable / owner-not-renounced / blacklist, etc). Supports EVM (0x...) and TRON (T...) addresses. Use before receiving funds, interacting with a contract, or investing.",
  { address: z.string().describe("Address to screen, 0x-prefixed (EVM) or T-prefixed (TRON)"), chain: chainEnum },
  safe(async ({ address, chain }) => {
    const a = address.trim();
    if (!looksValidAddress(a)) {
      return { content: [{ type: "text", text: `Invalid address: ${address}. Expected 0x + 40 hex chars (EVM) or T + 34 chars (TRON).` }], isError: true };
    }
    const { data, rateLimit } = await apiGetWithFallback(
      "/api/v1/risk",
      { addr: a, chain },
      "/api/v1/demo/risk"
    );
    const head = {
      addr: data.addr,
      chain: data.chain,
      symbol: data.symbol,
      score: data.score,
      level: data.level,
      verdict: data.verdict,
      verdictEn: data.verdictEn,
      flagTotal: data.flagTotal,
      flags: data.flags,
      meta: data.meta,
    };
    if (data._demo) head.note = "No API key set — running on the free trial (6 calls/day, trimmed fields). Set SCYTHERADAR_API_KEY to unlock full fields.";
    return { content: [{ type: "text", text: fmt(head) }] };
  })
);

// ---------- tool 2：黑名单命中检测 ----------
server.tool(
  "check_blacklist",
  "Check whether an address or transaction hash matches a blacklist (Tether freezes / OFAC sanctions / phishing scams). Returns match type, source, and evidence. TRON coverage includes 9,000+ Tether freeze addresses plus a multi-chain OFAC list. Use to judge whether funds are tainted or safe to receive.",
  {
    address: z.string().optional().describe("Address to check (0x- or T-prefixed). Use either this or txhash"),
    txhash: z.string().optional().describe("Transaction hash. Use either this or address"),
    chain: chainEnum,
  },
  safe(async ({ address, txhash, chain }) => {
    if (!address && !txhash) {
      return { content: [{ type: "text", text: "Provide either address or txhash." }], isError: true };
    }
    const { data } = await apiGet("/api/v1/blacku", {
      addr: address,
      txhash,
      chain,
    });
    return { content: [{ type: "text", text: fmt(data) }] };
  })
);

// ---------- tool 3：资金溯源 ----------
server.tool(
  "trace_funds",
  "Trace the flow of funds from an address or transaction, layer by layer. Returns fund exposure, hop addresses, final aggregation, and suspected laundering paths. Supports deep mode (slower but more complete). Use for tracing stolen funds or checking whether an incoming deposit passed through a mixer or sanctioned address.",
  {
    address: z.string().optional().describe("Source address or transaction hash"),
    target: z.string().optional().describe("Trace target address (equivalent to address, use either)"),
    deep: z.boolean().optional().describe("Deep trace, default false"),
    chain: chainEnum,
  },
  safe(async ({ address, target, deep, chain }) => {
    const a = target || address;
    if (!a) {
      return { content: [{ type: "text", text: "Provide either address or target." }], isError: true };
    }
    const { data } = await apiGet("/api/v1/trace", {
      addr: a,
      deep: deep ? "1" : undefined,
      chain,
    });
    return { content: [{ type: "text", text: fmt(data) }] };
  })
);

// ---------- 启动 ----------
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  if (!hasKey()) {
    process.stderr.write(
      "[scytheradar-mcp] SCYTHERADAR_API_KEY not set. screen_address will run on the free trial (6 calls/day); check_blacklist / trace_funds require a key. Get one at https://scytheradar.com/b2b\n"
    );
  }
}

main().catch((e) => {
  process.stderr.write(`[scytheradar-mcp] startup failed: ${e?.message || e}\n`);
  process.exit(1);
});
