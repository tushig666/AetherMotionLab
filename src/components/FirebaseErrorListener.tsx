'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export const FirebaseErrorListener = () => {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // In development, this will trigger the Next.js error overlay with rich context
      if (process.env.NODE_ENV === 'development') {
        throw error;
      }

      // In production, we show a professional toast
      toast({
        variant: "destructive",
        title: "ACCESS DENIED",
        description: "You do not have the required permissions for this operation.",
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
};
