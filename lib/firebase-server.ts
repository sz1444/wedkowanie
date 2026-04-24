import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export function getDb() {
  getAdminApp();
  return getFirestore();
}

export const APP_ID = process.env.NEXT_PUBLIC_APP_ID ?? 'fishrank-universal';
export const CATCHES_COLLECTION = `artifacts/${APP_ID}/public/data/catches`;
