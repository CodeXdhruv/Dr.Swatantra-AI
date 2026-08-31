import { createRemoteJWKSet, jwtVerify } from 'jose';

const FIREBASE_JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

const jwks = createRemoteJWKSet(new URL(FIREBASE_JWKS_URL));

import { decodeJwt } from 'jose';

export async function verifyFirebaseToken(token: string, projectId: string) {
  try {
    const unverifiedPayload = decodeJwt(token);
    console.log('Unverified payload:', unverifiedPayload);
    
    const { payload } = await jwtVerify(token, jwks, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });
    return payload;
  } catch (err: any) {
    console.error('JWT Verification failed:', err.message);
    const unverified = decodeJwt(token);
    throw new Error(`JWT Verify Error: ${err.message}. Expected Project: ${projectId}. Token Issuer: ${unverified.iss}`);
  }
}
