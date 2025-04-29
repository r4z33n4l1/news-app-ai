import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import * as SecureStore from 'expo-secure-store';
import { Session } from '@supabase/supabase-js';
import { Platform } from 'react-native';

type AuthContextType = {
  session: Session | null;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Save session to secure storage
const saveSession = async (session: Session | null) => {
  if (Platform.OS !== 'web') {
    if (session) {
      await SecureStore.setItemAsync('session', JSON.stringify(session));
    } else {
      await SecureStore.deleteItemAsync('session');
    }
  }
};

// Get session from secure storage
const getSession = async (): Promise<Session | null> => {
  if (Platform.OS !== 'web') {
    const session = await SecureStore.getItemAsync('session');
    return session ? JSON.parse(session) : null;
  }
  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // Check for existing session
        const storedSession = await getSession();
        
        if (storedSession && isMounted) {
          setSession(storedSession);
          
          // Verify the session is still valid
          const { data, error } = await supabase.auth.getSession();
          if (!error && data?.session) {
            if (isMounted) {
              setSession(data.session);
              await saveSession(data.session);
            }
          } else {
            // Session is invalid or expired
            if (isMounted) {
              setSession(null);
              await saveSession(null);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (isMounted) {
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (isMounted) {
          setSession(newSession);
          await saveSession(newSession);
        }
      }
    );

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data.session;
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data.session;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear local session storage
    await saveSession(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password',
    });
    if (error) throw error;
  };

  const value = {
    session,
    initialized,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};