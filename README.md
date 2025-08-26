# ​ Web3 Toolkit

[![npm version](https://img.shields.io/npm/v/@sifat046/web3-toolkit.svg?logo=npm)](https://www.npmjs.com/package/@sifat046/web3-toolkit)
[![build status](https://img.shields.io/github/actions/workflow/status/Md-Sifat-code/web3-toolkit/ci.yml?branch=main&logo=github)](https://github.com/Md-Sifat-code/web3-toolkit/actions)
[![license](https://img.shields.io/github/license/Md-Sifat-code/web3-toolkit.svg)](LICENSE)

---

**Web3 Toolkit** — A lightweight, dev-friendly npm library for blockchain integration. Includes:

- Multi-chain wallet connectors (EVM & Solana)
- BP Coin Test Utils—for signing, verifying & simulating transactions in test environments

No bulky SDKs. Great for dApps, rapid prototyping, and blockchain learning! 🌐⚡

---

## Features

- 🦊 **EVM Connector** — Works with MetaMask and other EIP-1193 providers
- **Solana Connector** — For Phantom and Solana wallets
- **BP Coin Test Utils** — Sign, verify, simulate transactions with a minimal dev-friendly toolkit
- 🧩 Zero heavy dependencies—lightweight by design

---

## Installation

```bash
npm install @sifat046/web3-toolkit
```

````

---

## Usage Examples

### EVM (e.g., MetaMask)

```ts
import { Connectors } from "@sifat046/web3-toolkit";

const evm = new Connectors.EvmConnector();
await evm.connect();
console.log("Accounts:", await evm.getAccounts());
const signature = await evm.signMessage("Hello Web3");
```

---

### Solana (e.g., Phantom)

```ts
import { Connectors } from "@sifat046/web3-toolkit";

const sol = new Connectors.SolanaConnector();
await sol.connect();
const [publicKey] = await sol.getAccounts();
const signature = await sol.signMessage("Hello Solana");
```

---

### BP Coin Test Utils

```ts
import { BpCoin } from "@sifat046/web3-toolkit";

const kp = BpCoin.generateEd25519KeyPair();
const ledger = new BpCoin.InMemoryLedger();
const aliceAddr = BpCoin.exportPublicKeyPEM(kp.publicKey);

ledger.faucet(aliceAddr, 50);

const body = BpCoin.makeBody({
  from: kp,
  toAddress: "bob",
  amount: 10,
  nonce: 0,
});
const tx = BpCoin.signTx(body, kp);

console.log("Valid TX?", BpCoin.verifyTx(tx));
ledger.apply(tx);
console.log("Bob's balance:", ledger.balanceOf("bob"));
```

---

## Roadmap

- ᐅ Add WalletConnect support for EVM
- ᐅ Auto network switching
- ᐅ Example dApp boilerplate

---

## Contributing

Contributions welcome! Feel free to open issues or submit pull requests.

---

## Author & Contact

**Md Sifat bin Jibon**
Student & Full-Stack Dev in Dhaka, Bangladesh
[GitHub](https://github.com/Md-Sifat-code) • [LinkedIn](https://www.linkedin.com/in/md-sifat-bin-jibon-3aa93b371/)

---

## License

MIT © Md Sifat bin Jibon

```

```
````
