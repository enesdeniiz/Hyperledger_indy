import { Buffer } from 'buffer';

declare module '*.svg' {
  const content: any;
  export default content;
}

interface UserData {
  firstName: string;
  lastName: string;
  birthDate: string;
}

interface UserCredential {
  did: string;
  verkey: string;
  isAdult: boolean;
  issuanceDate: string;
}

interface VerifiableCredential {
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
}

declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}
