'use client';

import React, { createContext, useContext } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseContextValue {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  app: null,
  db: null,
  auth: null,
});

export const useFirebase = () => useContext(FirebaseContext);
export const useFirebaseApp = () => useFirebase().app;
export const useFirestore = () => useFirebase().db;
export const useAuth = () => useFirebase().auth;

export const FirebaseProvider: React.FC<{
  app: FirebaseApp;
  db: Firestore;
  auth: Auth;
  children: React.ReactNode;
}> = ({ app, db, auth, children }) => {
  return (
    <FirebaseContext.Provider value={{ app, db, auth }}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};
