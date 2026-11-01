// ScytheRadar API 薄封装 —— 只做 HTTP 转发，判定逻辑全在服务端
// 遵循 API 契约：X-API-Key 鉴权 / 错误扁平信封 {error,hint,code} / 业务判定永远 200

const BASE = process.env.SCYTHERADAR_BASE || "https://scytheradar.com";
const API_KEY = process.env.SCYTHERADAR_API_KEY || "";

// 是否配置了付费 Key（决定走完整接口还是免注册试调）
export const hasKey = () => Boolean(API_KEY);

export class ApiError extends Error {
  constructor(message, { code = "unknown", status = 0 } = {}) {
    super(message);
    this.name = "ScytheRadarApiError";
    this.code = code;
    this.status = status;
  }
}

function pick(...values) {
  for (const v of values) {
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
}

export async function apiGet(path, params = {}) {
  const url = new URL(path, BASE);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  }

  const headers = {};
  if (API_KEY) headers["X-API-Key"] = API_KEY;

  let res;
  try {
    res = await fetch(url, { headers });
  } catch (e) {
    throw new ApiError(`无法连接 ScytheRadar API（${BASE}）：${e.message}`, { code: "network_error" });
  }

  const raw = await res.text();
  let body = {};
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    body = { _raw: raw.slice(0, 200) };
  }

  if (!res.ok) {
    // 扁平错误信封 {error, hint, code}
    throw new ApiError(body.hint || body.error || `HTTP ${res.status}`, {
      code: body.error || `http_${res.status}`,
      status: res.status,
    });
  }

  const rateLimit = {
    limit: res.headers.get("x-ratelimit-limit"),
    remaining: res.headers.get("x-ratelimit-remaining"),
    reset: res.headers.get("x-ratelimit-reset"),
  };

  return { data: body, rateLimit };
}

// 无 Key 时退回免注册试调（6 次/IP/天，字段裁剪）
export async function apiGetWithFallback(path, params = {}, demoPath = null) {
  if (hasKey()) return apiGet(path, params);
  if (!demoPath) {
    throw new ApiError("未配置 API Key。请设置环境变量 SCYTHERADAR_API_KEY（在 scytheradar.com/b2b 免费领取）。", {
      code: "missing_api_key",
    });
  }
  const r = await apiGet(demoPath, params);
  r.data._demo = true;
  return r;
}

// 校验地址形态：EVM 0x+40hex 或 TRON T+33 base58
export function looksValidAddress(addr) {
  if (!addr || typeof addr !== "string") return false;
  const a = addr.trim();
  if (/^0x[0-9a-fA-F]{40}$/.test(a)) return true;
  if (/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(a)) return true;
  return false;
}
