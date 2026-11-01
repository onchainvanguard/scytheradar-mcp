// 端到端测试：模拟 AI agent 客户端连接 scytheradar-mcp 并调用 tool
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client({ name: "e2e-test", version: "1.0.0" });
const transport = new StdioClientTransport({
  command: "node",
  args: ["server.js"],
  env: { ...process.env },
});

await client.connect(transport);
console.log("✅ MCP 握手成功");

const tools = await client.listTools();
console.log("✅ 注册 tool 数量:", tools.tools.length);
for (const t of tools.tools) {
  console.log("   -", t.name, "|", t.description.slice(0, 40) + "...");
}

const r = await client.callTool({
  name: "screen_address",
  arguments: { address: "0x4fabb145d64652a948d72533023f6e7a623c7c53" },
});
const txt = r.content.find((c) => c.type === "text")?.text || "";
console.log("\n✅ screen_address 调用成功，返回片段：");
console.log(txt.slice(0, 400));

await client.close();
console.log("\n全部通过");
