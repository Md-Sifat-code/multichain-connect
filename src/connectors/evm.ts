import type { BaseConnector, EIP1193Provider } from "./types";

function getProvider(): EIP1193Provider | null {
  if (typeof window === "undefined") return null;
  return window.ethereum ?? null;
}

export class EvmConnector implements BaseConnector {
  readonly name = "EVM";
  private provider: EIP1193Provider | null = null;

  constructor(provider?: EIP1193Provider) {
    this.provider = provider ?? getProvider();
  }

  isInstalled(): boolean {
    return !!this.provider;
  }

  async connect(): Promise<void> {
    this.provider ??= getProvider();
    if (!this.provider) throw new Error("No EVM provider found (e.g., MetaMask).");
    await this.provider.request({ method: "eth_requestAccounts" });
  }

  async disconnect(): Promise<void> {
    // EIP-1193 has no standard disconnect; wallets handle this UI-side.
    // Nothing to do here, but you can clear any local state if you kept it.
  }

  async getAccounts(): Promise<string[]> {
    if (!this.provider) return [];
    const accounts = await this.provider.request({ method: "eth_accounts" });
    return accounts ?? [];
  }

  async getChainId(): Promise<string> {
    if (!this.provider) throw new Error("Not connected");
    const chainIdHex: string = await this.provider.request({ method: "eth_chainId" });
    return chainIdHex;
  }

  async switchChain(chainIdHex: string): Promise<void> {
    if (!this.provider) throw new Error("Not connected");
    try {
      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }]
      });
    } catch (err: any) {
      // Optionally handle addChain if unknown
      throw err;
    }
  }

  async signMessage(message: string | Uint8Array): Promise<string> {
    if (!this.provider) throw new Error("Not connected");
    const [account] = await this.getAccounts();
    if (!account) throw new Error("No EVM account");

    // personal_sign expects hex or string; we’ll send raw string
    const msg = typeof message === "string" ? message : new TextDecoder().decode(message);
    const sig = await this.provider.request({
      method: "personal_sign",
      params: [msg, account]
    });
    return sig;
  }

  async sendTransaction(tx: {
    from?: string;
    to?: string;
    value?: string; // hex
    data?: string;  // hex
    gas?: string;   // hex
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
    nonce?: string;
    chainId?: string;
  }): Promise<string> {
    if (!this.provider) throw new Error("Not connected");
    const hash: string = await this.provider.request({
      method: "eth_sendTransaction",
      params: [tx]
    });
    return hash;
  }
}
