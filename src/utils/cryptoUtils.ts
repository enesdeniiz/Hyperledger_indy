import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { Buffer } from 'buffer';

// Type imports
type UserData = {
  firstName: string;
  lastName: string;
  birthDate: string;
};

type UserCredential = {
  did: string;
  verkey: string;
  isAdult: boolean;
  issuanceDate: string;
};

type VerifiableCredential = {
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: {
    id: string;
    isAdult: boolean;
  };
  proof: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    proofValue: string;
  };
};

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

// DID oluşturma (publicKey'den farklı bir değer kullanarak)
export const generateDID = (publicKeyBase58: string) => {
  // Verkey'i ters çevirerek ve ilk 16 karakterini alarak DID için farklı bir değer oluştur
  const reversedKey = publicKeyBase58.split('').reverse().join('');
  return `did:example:${reversedKey.substring(0, 16)}`;
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

// Yaş doğrulama - 18 yaşından büyük mü kontrol et
export const isAdult = (birthDate: string): boolean => {
  const today = new Date();
  const birth = new Date(birthDate);
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age >= 18;
};

// Yaş doğrulama kredisi oluştur
export const createAgeVerificationCredential = (did: string, publicKeyBase58: string, birthDate: string): VerifiableCredential => {
  const isUserAdult = isAdult(birthDate);
  const now = new Date().toISOString();
  const message = `${did}:isAdult:${isUserAdult}:${now}`;
  const privateKeyHex = getFromLocalStorage('didKeyPair').privateKey;
  const signature = signMessage(message, privateKeyHex);
  
  const credential: VerifiableCredential = {
    id: `${did}#age-credential`,
    type: ["VerifiableCredential", "AgeVerificationCredential"],
    issuer: "did:example:issuer",
    issuanceDate: now,
    credentialSubject: {
      id: did,
      isAdult: isUserAdult
    },
    proof: {
      type: "Ed25519Signature2018",
      created: now,
      verificationMethod: `${did}#keys-1`,
      proofPurpose: "assertionMethod",
      proofValue: signature
    }
  };
  
  return credential;
};

// Yaş doğrulama kredisini doğrula
export const verifyAgeCredential = (credential: VerifiableCredential, publicKeyHex: string): boolean => {
  try {
    const message = `${credential.credentialSubject.id}:isAdult:${credential.credentialSubject.isAdult}:${credential.issuanceDate}`;
    return verifySignature(message, credential.proof.proofValue, publicKeyHex);
  } catch (error) {
    console.error('Kredi doğrulama hatası:', error);
    return false;
  }
};

// Kullanıcı verilerini kaydet (doğum tarihi veritabanına kaydedilmez)
export const saveUserData = (userData: UserData) => {
  // Sadece isim ve soyisim kaydedilir, doğum tarihi kaydedilmez
  const { firstName, lastName } = userData;
  saveToLocalStorage('userData', { firstName, lastName });
  
  // Doğum tarihi sadece yaş doğrulama için kullanılır ve sonra atılır
  const birthDate = userData.birthDate;
  const isUserAdult = isAdult(birthDate);
  
  // Sadece 18 yaş üstü olup olmadığı bilgisi kaydedilir
  const userCredential: UserCredential = {
    did: getFromLocalStorage('did'),
    verkey: getFromLocalStorage('didKeyPair').publicKeyBase58,
    isAdult: isUserAdult,
    issuanceDate: new Date().toISOString()
  };
  
  saveToLocalStorage('userCredential', userCredential);
  
  // Doğrulanabilir kredi oluştur
  const credential = createAgeVerificationCredential(
    userCredential.did,
    userCredential.verkey,
    birthDate
  );
  
  saveToLocalStorage('ageCredential', credential);
  
  return userCredential;
};
