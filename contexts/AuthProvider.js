import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  signUp as supaSignUp,
  signIn,
  signOut,
  getCurrentUser,
} from "flashnest-backend/authHelper";
import { initSupabase, getSupabase } from "flashnest-backend/supabaseClient";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize Supabase
  initSupabase({
    url: SUPABASE_URL,
    key: SUPABASE_ANON_KEY,
    options: {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    },
  });

  // 👇 Check session on app load
  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabase();
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.warn("Session check failed", error.message);
        setUser(null);
      } else if (data?.session?.user) {
        const { user } = data.session;
        setUser(user); // optionally fetch profile here
      } else {
        setUser(null);
      }

      setTokenChecked(true);
    };

    checkSession();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!tokenChecked) return;

      try {
        const profile = await getCurrentUser();
        setUserProfile(profile);
      } catch (err) {
        console.warn("Failed to fetch profile:", err.message);
        setUserProfile(null);
      }
    };

    fetchProfile();

    const { auth } = getSupabase();
    const { data: listener } = auth.onAuthStateChange((event, session) => {
      if (!session) {
        setUser(null);
        router.replace("/(auth)/login");
      }
    });

    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, [tokenChecked]);

  const signUp = async (
    firstName,
    lastName,
    email,
    password,
    confirmPassword
  ) => {
    try {
      setIsLoading(true);
      const { session, profile } = await supaSignUp({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      if (!session) throw new Error("No session returned");

      await AsyncStorage.setItem("token", session.access_token);
      setUser(profile);
      router.replace("/(protected)/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const { session, profile } = await signIn({ email, password });
      if (!session) throw new Error("No session returned");

      await AsyncStorage.setItem("token", session.access_token);
      await AsyncStorage.setItem("onboarding", "true");
      setUser(profile);
      router.replace("/(protected)/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      await AsyncStorage.removeItem("onboarding");
      await AsyncStorage.removeItem("token");
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      router.replace("/(auth)/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        signUp,
        login,
        logout,
        isLoading,
        error,
        tokenChecked, // 👈 Now exposed
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
