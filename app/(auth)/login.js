import React, { useState } from "react";
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

import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthProvider";

import LogoText from "../../components/LogoText";
import { router } from "expo-router";

export default function Login() {
  const { login, isLoading, error, handleGoogleSignIn } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
          className="flex-1">
          <View className="flex-1 items-center justify-center px-6 bg-white">
            {/* Brand Logo */}
            <Image
              source={require("../../assets/icons/icon-light.png")}
              style={{ width: 48, height: 48, marginBottom: 8 }}
            />
            <Text className="font-bold text-2xl text-blue-900 mb-2">
              FlashNest
            </Text>

            {/* Heading and Subheading */}
            <Text className="text-3xl font-bold text-gray-900 mt-4">
              Sign in to your Account
            </Text>
            <Text className="text-base text-gray-500 mt-2 mb-6">
              Enter your email and password to log in
            </Text>

            {/* Input Fields */}
            <View className="w-full space-y-4">
              {/* Email Input */}
              <View className="mb-2">
                <Text className="text-gray-700 font-medium text-lg mb-1">
                  Email
                </Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 shadow-sm focus-within:border-blue-500">
                  <Feather
                    name="mail"
                    size={20}
                    color="#9CA3AF"
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    className="flex-1 text-gray-700 text-lg"
                    placeholder="Enter your email"
                    value={form.email}
                    placeholderTextColor="#9CA3AF"
                    onChangeText={(text) => setForm({ ...form, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{ paddingVertical: 8 }}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-gray-700 font-medium text-lg mb-1">
                  Password
                </Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 shadow-sm focus-within:border-blue-500">
                  <Feather
                    name="lock"
                    size={20}
                    color="#9CA3AF"
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    className="flex-1 text-gray-700 text-lg"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={form.password}
                    onChangeText={(text) =>
                      setForm({ ...form, password: text })
                    }
                    secureTextEntry
                    style={{ paddingVertical: 8 }}
                  />
                  <TouchableOpacity
                    onPress={handleForgotPassword}
                    style={{ marginLeft: 8 }}>
                    <Text className="text-blue-600 text-sm">Forgot?</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Log In Button */}
            <TouchableOpacity
              onPress={handleLogin}
              className="w-full bg-blue-600 py-3 rounded-lg mt-6">
              <Text className="text-white text-center font-semibold text-lg">
                {isLoading ? "Logging in..." : "Log In"}
              </Text>
            </TouchableOpacity>

            {/* Or Separator */}
            <View className="flex-row items-center my-4 w-full">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="mx-4 text-gray-500">Or</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            {/* Social Logins */}
            <TouchableOpacity
              onPress={handleGoogleSignIn}
              className="w-full flex-row items-center justify-center bg-white py-3 border border-gray-300 rounded-lg mb-2">
              <Image
                source={require("../../assets/google-icon.png")}
                className="w-6 h-6 mr-2"
              />
              <Text className="text-gray-700 font-semibold text-lg">
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <TouchableOpacity onPress={handleSignUp} className="mt-8">
              <Text className="text-gray-500 text-center">
                Don't have an account?{" "}
                <Text className="text-blue-600">Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
