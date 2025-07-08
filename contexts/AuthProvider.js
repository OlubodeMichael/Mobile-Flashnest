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
import { Alert } from "react-native";

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

  const deleteAccount = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      const res = await fetch(
        "https://cfbzvbngxttpcspnyfxb.supabase.co/functions/v1/delete-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Delete failed");

      Alert.alert("Account deleted", result.message);
      await logout();
      router.replace("/(auth)/login");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const handleSignInWithApple = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = getSupabase();

      // Step 1: Apple sign-in
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error("No identity token received from Apple");
      }

      // Step 2: Supabase sign-in with Apple identity token
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
      });

      if (error) {
        console.error("Apple sign-in error:", error);
        setError(error.message);
        throw error;
      }

      if (!user) {
        throw new Error("No user returned from Apple authentication");
      }
      console.log("credential:", credential);

      setUser(user);

      // Step 3: Check if user profile exists
      const { data: existingProfile } = await supabase
        .from("Users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      // Step 4: Prepare full name from Apple credential or user metadata
      let fullName = "";

      if (credential.fullName?.givenName || credential.fullName?.familyName) {
        fullName = `${credential.fullName.givenName || ""} ${
          credential.fullName.familyName || ""
        }`.trim();
      } else if (user.user_metadata?.full_name) {
        fullName = user.user_metadata.full_name;
      }

      const [firstName, ...lastParts] = fullName.split(" ");
      const lastName = lastParts.join(" ");

      // Step 5: Create user profile if not existing
      if (!existingProfile) {
        await supabase.from("Users").insert({
          id: user.id,
          email: user.email,
          first_name: firstName || "",
          last_name: lastName || "",
          active: true,
        });
        console.log("✅ New Apple user profile created");
      }

      // Step 6: Load and store profile
      const userProfile = await getCurrentUser();
      //console.log("🔍 User profile:", userProfile);
      setUserProfile(userProfile);
      invalidateUserData();

      console.log("✅ Apple authentication complete");
    } catch (error) {
      console.error("Apple authentication failed:", error);
      if (error.code === "ERR_CANCELED") return;
      setError(error.message || "Apple authentication failed");
      throw error;
    } finally {
      setIsLoading(false);
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
        deleteAccount,
        clearError,
        invalidateUserData,
        handleSignInWithApple, // Expose for manual invalidation if needed
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
