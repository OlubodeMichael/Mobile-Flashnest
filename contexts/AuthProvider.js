import React, { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { useEffect } from "react";
import { signUp, signIn } from "flashnest-backend/authHelper";
import { initSupabase } from "flashnest-backend/supabaseClient";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  initSupabase({
    url: SUPABASE_URL,
    key: SUPABASE_ANON_KEY,
    options: {
      auth: {
        storage: AsyncStorage,
      },
    },
  });

  const api_url = "http://localhost:8000/api"; // "https://api.flashnest.app/api";

  const signUp = async (
    firstName,
    lastName,
    email,
    password,
    confirmPassword
  ) => {
    try {
      const response = await signUp({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });

      const { session, user, profile } = response;

      if (!session) throw new Error("No session returned");
      await AsyncStorage.setItem("token", session.access_token);
      setUser(profile);
      router.replace("/(protected)/home");

      return response;
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await signIn({ email, password });
      const { session, user, profile } = response;
      console.log(profile);
      console.log(user);
      console.log(session);

      if (!session) throw new Error("No session returned");

      await AsyncStorage.setItem("token", session.access_token);
      setUser(profile);

      router.replace("/(protected)/home");
    } catch (error) {
      console.error("Login failed", error);
      setError(error.message || "Login error");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("isOnboarded");
    setUser(null);
    router.replace("/(auth)/login");
  };

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token");

      const userData = await fetchUser(token);
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setTokenChecked(true);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signUp, login, logout, tokenChecked, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
