'use client';

import { useState, useEffect } from 'react';
import { DocumentReference, onSnapshot, DocumentData } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useDoc<T = DocumentData>(ref: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      return;
    }

    return onSnapshot(ref, 
      (doc) => {
        setData(doc.exists() ? doc.data() as T : null);
        setLoading(false);
      },
      async (err) => {
        if (err.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
            path: ref.path,
            operation: 'get',
          });
          errorEmitter.emitPermissionError(permissionError);
        }
        setError(err);
        setLoading(false);
      }
    );
  }, [ref?.path]);

  return { data, loading, error };
}
