import React, { createContext, useContext, useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  signUp as supaSignUp,
  signIn,
  signOut,
  getCurrentUser,
  signInWithOAuth,
  updateUser,
} from "flashnest-backend/authHelper";
import { initSupabase, getSupabase } from "flashnest-backend/supabaseClient";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";
import { useQueryClient } from "@tanstack/react-query";
import * as AppleAuthentication from "expo-apple-authentication";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

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

  // Helper function to invalidate all user data
  const invalidateUserData = () => {
    queryClient.invalidateQueries({ queryKey: ["decks"] });
    queryClient.invalidateQueries({ queryKey: ["flashcards"] });
    queryClient.invalidateQueries({ queryKey: ["deck"] });
    queryClient.invalidateQueries({ queryKey: ["userProfile"] });
  };

  // Helper function to clear all user data
  const clearUserData = () => {
    queryClient.removeQueries({ queryKey: ["decks"] });
    queryClient.removeQueries({ queryKey: ["flashcards"] });
    queryClient.removeQueries({ queryKey: ["deck"] });
    queryClient.removeQueries({ queryKey: ["userProfile"] });
  };

  // 👇 Check session on app load
  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabase();
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.warn("Session check failed", error.message);
        setUser(null);
        clearUserData();
      } else if (data?.session?.user) {
        const { user } = data.session;
        setUser(user);
      } else {
        setUser(null);
        clearUserData();
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

        // Invalidate queries to ensure fresh data is loaded
        if (profile) {
          invalidateUserData();
        }
      } catch (err) {
        console.warn("Failed to fetch profile:", err.message);
        setUserProfile(null);
      }
    };

    fetchProfile();

    const { auth } = getSupabase();
    const { data: listener } = auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        console.log("✅ User signed in, invalidating data...");
        invalidateUserData();
      } else if (event === "SIGNED_OUT" || !session) {
        setUser(null);
        setUserProfile(null);
        console.log("❌ User signed out, clearing data...");
        clearUserData();
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
      setError(null);
      const { session, user } = await supaSignUp({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      if (!session) throw new Error("No session returned");

      await AsyncStorage.setItem("token", session.access_token);
      setUser(user);

      // Fetch and set the user profile immediately after signup
      const userProfile = await getCurrentUser();
      setUserProfile(userProfile);
      invalidateUserData();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
      console.log("Redirect URI:", redirectUri);
      const { url, error } = await signInWithOAuth({
        provider: "google",
        redirectTo: redirectUri,
      });

      if (error) {
        console.error("OAuth URL generation failed:", error.message);
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(url, redirectUri);

      if (result.type === "success" && result.url) {
        const supabase = getSupabase();
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) throw userError;

        setUser(userData.user);

        // Optionally get and set profile
        const profile = await getCurrentUser();
        setUserProfile(profile);

        invalidateUserData();
      } else {
        console.warn("OAuth flow cancelled or failed:", result);
      }
    } catch (err) {
      console.error("Google sign-in failed:", err.message);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      const { session, user } = await signIn({ email, password });
      if (!session) throw new Error("No session returned");

      await AsyncStorage.setItem("token", session.access_token);
      setUser(user);

      // Fetch and set the user profile immediately after login
      const userProfile = await getCurrentUser();
      setUserProfile(userProfile);

      invalidateUserData();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      await AsyncStorage.removeItem("onboarding");
      await AsyncStorage.removeItem("token");

      // Clear all user data from cache
      clearUserData();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setUserProfile(null);
      router.replace("/(onboarding)");
    }
  };

  const updateUserProfile = async (firstName, lastName) => {
    try {
      const { data, error } = await updateUser({ firstName, lastName });
      if (error) throw error;
      setUserProfile(data);

      // Invalidate user profile query
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    } catch (err) {
      console.error(err);
    }
  };
  const handleSignInWithApple = async () => {
    try {
      const supabase = getSupabase();
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential.identityToken) {
        const {
          error,
          data: { user },
        } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: credential.identityToken,
        });
        console.log(JSON.stringify({ error, user }, null, 2));
        if (!error) {
          // User is signed in.
        }
        setUser(user);
        setUserProfile(user);
        invalidateUserData();
      } else {
        throw new Error("No identityToken.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearError = () => {
    setError(null);
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
        tokenChecked,
        handleGoogleSignIn,
        updateUserProfile,
        clearError,
        invalidateUserData,
        handleSignInWithApple, // Expose for manual invalidation if needed
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
