import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Linking,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthProvider";

import LogoText from "../../components/LogoText";
import { router } from "expo-router";

import AppleAuth from "../../components/Auth/apple";

export default function Login() {
  const { login, isLoading, error, handleGoogleSignIn, clearError } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Clear error when component mounts
  useEffect(() => {
    // Clear any existing errors when the component mounts
    clearError();
  }, []);

  // Show API errors in an alert
  useEffect(() => {
    if (error) {
      Alert.alert("Login Failed", error, [
        {
          text: "OK",
          onPress: () => {
            // Clear the error after user acknowledges it
            clearError();
          },
        },
      ]);
    }
  }, [error]);

  const handleForgotPassword = () => {
    Linking.openURL("https://www.flashnest.app/forgot-password");
  };

  const handleSignUp = () => {
    router.replace("/register");
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    try {
      await login(form.email, form.password);
      router.replace("/(protected)/home");
      console.log("Login successful");
    } catch (error) {
      // Error is already handled by the AuthProvider and shown in the error state
      console.log("Login failed:", error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
          className="flex-1">
          <View className="flex-1 px-6 pt-8">
            {/* Header Section */}
            <View className="items-center mb-12">
              <LogoText />
              <Text className="text-gray-500 mt-4 text-center text-lg leading-6 max-w-sm">
                Welcome back! Sign in to continue your learning journey
              </Text>
            </View>

            {/* Login Form */}
            <View className="w-full space-y-6">
              {/* Email Input */}
              <View>
                <Text className="text-gray-700 font-semibold text-base mb-3">
                  Email Address
                </Text>
                <View className="flex-row items-center overflow-visible bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-center align-middle">
                  <Feather
                    name="mail"
                    size={20}
                    color="#6B7280"
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    className="flex-1 text-gray-900 text-lg"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={form.email}
                    onChangeText={(text) => {
                      setForm({ ...form, email: text });
                      if (error) clearError();
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-gray-700 font-semibold text-base mb-3">
                  Password
                </Text>
                <View className="flex-row items-center bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 align-middle">
                  <Feather
                    name="lock"
                    size={20}
                    color="#6B7280"
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    className="flex-1 text-gray-900 text-lg"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={form.password}
                    onChangeText={(text) => {
                      setForm({ ...form, password: text });
                      if (error) clearError();
                    }}
                    secureTextEntry
                  />
                </View>
              </View>

              {/* Forgot Password Link */}
              <View className="items-end">
                <TouchableOpacity
                  onPress={handleForgotPassword}
                  className="py-2">
                  <Text className="text-yellow-500 font-semibold text-base">
                    Forgot your password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                className="rounded-2xl overflow-hidden mt-6"
                activeOpacity={0.8}>
                <LinearGradient
                  colors={["#fbbf24", "#f59e0b"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-2xl"
                  style={{ padding: 16 }}>
                  <Text className="text-black text-center font-bold text-xl">
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-[1px] bg-gray-200" />
              <Text className="mx-4 text-gray-400 font-medium text-base">
                or
              </Text>
              <View className="flex-1 h-[1px] bg-gray-200" />
            </View>

            {/* Social Login Buttons */}
            {Platform.OS === "ios" ? (
              <AppleAuth />
            ) : (
              <TouchableOpacity
                onPress={handleGoogleSignIn}
                className="w-full flex-row items-center justify-center bg-white py-4 border-2 border-gray-200 rounded-2xl mb-6 shadow-sm"
                activeOpacity={0.8}>
                <Image
                  source={require("../../assets/google-icon.png")}
                  className="w-6 h-6 mr-3"
                />
                <Text className="text-gray-700 font-semibold text-base">
                  Continue with Google
                </Text>
              </TouchableOpacity>
            )}

            {/* Sign Up Link */}
            <View className="items-center mt-8">
              <TouchableOpacity onPress={handleSignUp}>
                <Text className="text-gray-500 text-base">
                  Don't have an account?{" "}
                  <Text className="text-yellow-500 font-bold">Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
