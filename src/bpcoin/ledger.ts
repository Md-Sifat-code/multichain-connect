import type { SignedBpTx } from "./tx";
import { verifyTx } from "./tx";

export class InMemoryLedger {
  private balances = new Map<string, number>(); // address -> balance
  private nonces = new Map<string, number>();   // pubKeyPEM -> next expected nonce

  faucet(address: string, amount: number) {
    this.balances.set(address, (this.balances.get(address) ?? 0) + amount);
  }

  balanceOf(address: string): number {
    return this.balances.get(address) ?? 0;
  }

  expectedNonce(pubKey: string): number {
    return this.nonces.get(pubKey) ?? 0;
  }

  apply(tx: SignedBpTx): { ok: true } | { ok: false; error: string } {
    if (!verifyTx(tx)) return { ok: false, error: "invalid_signature_or_hash" };

    const { body } = tx;

    // Nonce check
    const want = this.expectedNonce(body.fromPubKey);
    if (body.nonce !== want) return { ok: false, error: `bad_nonce: want ${want} got ${body.nonce}` };

    // Transfer
    const fromAddr = body.fromPubKey; // in this toy model we use pubKey PEM as "address"
    const toAddr = body.toAddress;

    const fromBal = this.balanceOf(fromAddr);
    if (fromBal < body.amount) return { ok: false, error: "insufficient_funds" };

    this.balances.set(fromAddr, fromBal - body.amount);
    this.balances.set(toAddr, this.balanceOf(toAddr) + body.amount);

    // Bump nonce
    this.nonces.set(body.fromPubKey, want + 1);

    return { ok: true };
  }
}
