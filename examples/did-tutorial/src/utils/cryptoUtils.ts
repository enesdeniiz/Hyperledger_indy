import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { Buffer } from 'buffer';

// Ed25519 anahtar çifti oluşturma
export const generateKeyPair = () => {
  const keyPair = nacl.sign.keyPair();
  return {
    publicKey: Buffer.from(keyPair.publicKey).toString('hex'),
    privateKey: Buffer.from(keyPair.secretKey).toString('hex'),
    publicKeyBase58: bs58.encode(Buffer.from(keyPair.publicKey)),
    privateKeyBase58: bs58.encode(Buffer.from(keyPair.secretKey))
  };
};

// DID oluşturma (publicKey'in ilk 16 karakteri kullanılarak)
export const generateDID = (publicKeyBase58: string) => {
  return `did:example:${publicKeyBase58.substring(0, 16)}`;
};

// Mesaj imzalama
export const signMessage = (message: string, privateKeyHex: string) => {
  const privateKeyUint8 = new Uint8Array(Buffer.from(privateKeyHex, 'hex'));
  const messageUint8 = new Uint8Array(Buffer.from(message));
  const signature = nacl.sign.detached(messageUint8, privateKeyUint8);
  return Buffer.from(signature).toString('hex');
};

// İmza doğrulama
export const verifySignature = (message: string, signatureHex: string, publicKeyHex: string) => {
  try {
    const publicKeyUint8 = new Uint8Array(Buffer.from(publicKeyHex, 'hex'));
    const messageUint8 = new Uint8Array(Buffer.from(message));
    const signatureUint8 = new Uint8Array(Buffer.from(signatureHex, 'hex'));
    return nacl.sign.detached.verify(messageUint8, signatureUint8, publicKeyUint8);
  } catch (error) {
    console.error('İmza doğrulama hatası:', error);
    return false;
  }
};

// Hex formatından Base58'e dönüştürme
export const hexToBase58 = (hex: string) => {
  return bs58.encode(Buffer.from(hex, 'hex'));
};

// Base58'den Hex formatına dönüştürme
export const base58ToHex = (base58: string) => {
  return Buffer.from(bs58.decode(base58)).toString('hex');
};

// LocalStorage'a veri kaydetme
export const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// LocalStorage'dan veri okuma
export const getFromLocalStorage = (key: string) => {
  const value = localStorage.getItem(key);
  if (value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
  return null;
};

// DID Dokümanı oluşturma
export const generateDIDDocument = (did: string, publicKeyBase58: string) => {
  const now = new Date().toISOString();
  return {
    "@context": "https://www.w3.org/ns/did/v1",
    "id": did,
    "verificationMethod": [
      {
        "id": `${did}#keys-1`,
        "type": "Ed25519VerificationKey2018",
        "controller": did,
        "publicKeyBase58": publicKeyBase58
      }
    ],
    "authentication": [
      `${did}#keys-1`
    ],
    "created": now,
    "updated": now
  };
};
