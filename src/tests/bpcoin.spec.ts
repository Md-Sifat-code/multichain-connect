import { describe, it, expect } from "vitest";
import { InMemoryLedger, generateEd25519KeyPair, makeBody, signTx } from "../bpcoin";

describe("BP Coin Test Utils", () => {
  it("signs, verifies and applies a tx", () => {
    const alice = generateEd25519KeyPair();
    const bobAddr = "bob-address";

    const ledger = new InMemoryLedger();
    const aliceAddr = "alice-address-uses-pubkey-only-for-balances-in-this-toy"; // we faucet by any string
    ledger.faucet(aliceAddr, 100);

    // In this toy model, we’ll pretend the from address is Alice's pubKey in ledger,
    // but we fauceted a normal string; for demo, faucet Alice's pub-pem instead:
    const alicePubPem = alice.publicKey.export({ type: "spki", format: "pem" }) as string;
    ledger.faucet(alicePubPem, 100);

    const body = makeBody({
      from: alice,
      toAddress: bobAddr,
      amount: 25,
      nonce: 0
    });

    const tx = signTx(body, alice);

    const res = ledger.apply(tx);
    expect(res.ok).toBe(true);
    expect(ledger.balanceOf(bobAddr)).toBe(25);
    expect(ledger.expectedNonce(body.fromPubKey)).toBe(1);
  });
});
