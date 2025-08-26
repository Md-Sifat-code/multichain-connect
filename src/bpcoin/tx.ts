import { canonicalStringify } from "./serialize";
import { sha256, signEd25519, verifyEd25519, KeyPair, exportPublicKeyPEM } from "./crypto";

export type BpTxBody = {
  fromPubKey: string;     // PEM (public)
  toAddress: string;      // string (could be any address format for tests)
  amount: number;         // integer/float
  nonce: number;
  timestamp: number;      // ms
  memo?: string;
};

export type SignedBpTx = {
  body: BpTxBody;
  hash: string;       // hex sha256 of body
  signature: string;  // base64
};

export function txHash(body: BpTxBody): string {
  const canon = canonicalStringify(body);
  return sha256(canon).toString("hex");
}

export function signTx(body: BpTxBody, keypair: KeyPair): SignedBpTx {
  const hash = txHash(body);
  const signature = signEd25519(keypair.privateKey, hash);
  return { body, hash, signature };
}

export function verifyTx(tx: SignedBpTx): boolean {
  const recomputed = txHash(tx.body);
  if (recomputed !== tx.hash) return false;
  // Use fromPubKey PEM to verify
  return verifyEd25519(tx.body.fromPubKey, tx.hash, tx.signature);
}

export function makeBody(params: Omit<BpTxBody, "fromPubKey" | "timestamp"> & { from: KeyPair; timestamp?: number }): BpTxBody {
  return {
    fromPubKey: exportPublicKeyPEM(params.from.publicKey),
    toAddress: params.toAddress,
    amount: params.amount,
    nonce: params.nonce,
    timestamp: params.timestamp ?? Date.now(),
    memo: params.memo
  };
}
