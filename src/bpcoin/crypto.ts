import { createHash, generateKeyPairSync, sign as nodeSign, verify as nodeVerify, KeyObject } from "crypto";

export type KeyPair = {
  publicKey: KeyObject;
  privateKey: KeyObject;
};

export function sha256(data: string | Uint8Array): Buffer {
  const h = createHash("sha256");
  h.update(data);
  return h.digest();
}

export function generateEd25519KeyPair(): KeyPair {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  return { publicKey, privateKey };
}

export function exportPublicKeyPEM(pub: KeyObject): string {
  return pub.export({ type: "spki", format: "pem" }) as unknown as string;
}

export function exportPrivateKeyPEM(priv: KeyObject): string {
  return priv.export({ type: "pkcs8", format: "pem" }) as unknown as string;
}

export function importPublicKeyPEM(pem: string): KeyObject {
  return KeyObject.from(pem as unknown as any); // Node accepts PEM strings directly in verify/sign calls too
}

export function signEd25519(privateKey: KeyObject, data: Uint8Array | string): string {
  const buf = typeof data === "string" ? Buffer.from(data) : Buffer.from(data);
  const signature = nodeSign(null, buf, privateKey); // null for Ed25519
  return signature.toString("base64");
}

export function verifyEd25519(publicKey: KeyObject | string, data: Uint8Array | string, sigB64: string): boolean {
  const buf = typeof data === "string" ? Buffer.from(data) : Buffer.from(data);
  const sig = Buffer.from(sigB64, "base64");
  return nodeVerify(null, buf, publicKey as any, sig);
}
