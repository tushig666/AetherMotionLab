
'use client';

import { useState, useEffect } from 'react';
import { Query, onSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore';

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    return onSnapshot(query, 
      (snapshot) => {
        setData(snapshot.docs.map(doc => doc.data() as T));
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
  }, [query]);

  return { data, loading, error };
}
