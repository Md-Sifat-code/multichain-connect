export type Address = `0x${string}` | string;

export interface BaseConnector {
  readonly name: string;
  isInstalled(): boolean;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getAccounts(): Promise<string[]>;
  getChainId(): Promise<string | number | null>;
  signMessage(message: string | Uint8Array): Promise<string>;
}

export type EIP1193Provider = {
  request: (args: { method: string; params?: any[] | object }) => Promise<any>;
  on?: (event: string, cb: (...args: any[]) => void) => void;
  removeListener?: (event: string, cb: (...args: any[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: EIP1193Provider & any;
    solana?: any;
  }
}
