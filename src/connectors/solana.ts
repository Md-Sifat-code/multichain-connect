import type { BaseConnector } from "./types";

function getProvider(): any | null {
  if (typeof window === "undefined") return null;
  return window.solana ?? null;
}

export class SolanaConnector implements BaseConnector {
  readonly name = "Solana";
  private provider: any | null = null;
  private publicKey: string | null = null; // base58

  constructor(provider?: any) {
    this.provider = provider ?? getProvider();
  }

  isInstalled(): boolean {
    return !!this.provider;
  }

  async connect(): Promise<void> {
    this.provider ??= getProvider();
    if (!this.provider) throw new Error("No Solana provider found (e.g., Phantom).");
    const res = await this.provider.connect(); // Phantom-style
    this.publicKey = res?.publicKey?.toString?.() ?? null;
  }

  async disconnect(): Promise<void> {
    if (this.provider?.disconnect) await this.provider.disconnect();
    this.publicKey = null;
  }

  async getAccounts(): Promise<string[]> {
    return this.publicKey ? [this.publicKey] : [];
  }

  async getChainId(): Promise<string | number | null> {
    // Solana doesn’t use EVM chainId; you can expose cluster if available.
    try {
      const cluster = this.provider?.getCluster?.() ?? null;
      return cluster ?? null;
    } catch {
      return null;
    }
  }

  async signMessage(message: string | Uint8Array): Promise<string> {
    if (!this.provider) throw new Error("Not connected");
    const msgBytes = typeof message === "string" ? new TextEncoder().encode(message) : message;
    const res = await this.provider.signMessage(msgBytes, "utf8");
    // return base64 signature
    const sigBytes: Uint8Array = res.signature ?? res;
    return Buffer.from(sigBytes).toString("base64");
  }

  /**
   * Send a raw transaction via JSON-RPC without heavy deps.
   * @param rpcUrl eg. "https://api.mainnet-beta.solana.com"
   * @param rawTx base64-encoded transaction
   */
  async sendRawTransaction(rpcUrl: string, rawTx: string): Promise<string> {
    const resp = await fetch(rpcUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "sendTransaction",
        params: [rawTx, { skipPreflight: false }]
      })
    });
    const json = await resp.json();
    if (json.error) throw new Error(json.error.message || "sendTransaction failed");
    return json.result;
  }
}
