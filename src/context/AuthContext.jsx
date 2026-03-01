import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { supabase } from '../lib/supabase';

// 🔧 DEV BYPASS: Set to false to re-enable real authentication
const DEV_BYPASS = false;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(DEV_BYPASS ? {} : null);
    const [user, setUser] = useState(DEV_BYPASS ? { email: 'dev@bypass.local' } : null);
    const [loading, setLoading] = useState(false);
    const client = useApolloClient();

    useEffect(() => {
        if (DEV_BYPASS) return; // Skip Supabase calls in bypass mode

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);

                if (event === 'SIGNED_OUT') {
                    client.clearStore();
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [client]);

    const login = async (email, password) => {
        if (DEV_BYPASS) return;
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        if (DEV_BYPASS) return;
        await supabase.auth.signOut();
        client.clearStore();
    };

    return (
        <AuthContext.Provider value={{
            session,
            user,
            login,
            logout,
            isAuthenticated: DEV_BYPASS ? true : !!session,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
