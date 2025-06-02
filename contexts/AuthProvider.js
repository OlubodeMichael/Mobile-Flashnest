import React, { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const api_url = "http://localhost:8000/api"; // "https://api.flashnest.app/api";

  const fetchUser = async (token) => {
    if (!token) return null;

    try {
      const response = await axios.get(`${api_url}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };
  const signUp = async (
    firstName,
    lastName,
    email,
    password,
    passwordConfirm
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(`${api_url}/users/signup`, {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
      });

      const { token } = response.data;
      await AsyncStorage.setItem("token", token);

      const userData = await fetchUser(token);
      if (userData) {
        setUser(userData);
        router.replace("/(protected)/home");
      } else {
        throw new Error("Failed to fetch user data");
      }

      return response.data;
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${api_url}/users/login`, {
        email,
        password,
      });

      const { token } = response.data;
      await AsyncStorage.setItem("token", token);

      const userData = await fetchUser(token);
      if (userData) {
        setUser(userData);
        router.replace("/(protected)/home");
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Login failed", error);
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
