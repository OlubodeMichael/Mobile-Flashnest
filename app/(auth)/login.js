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
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthProvider";

import LogoText from "../../components/LogoText";
import { router } from "expo-router";

export default function Login() {
  const { login, isLoading, error } = useAuth();
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
          <View className="flex-1 items-center justify-center px-6">
            <LogoText />

            <View className="w-full space-y-4 mt-8">
              <View className="space-y-2 py-4">
                <Text className="text-gray-700 font-medium text-lg">Email</Text>
                <TextInput
                  className="w-full px-4 py-3 h-12 border text-gray-700 border-gray-300 rounded-lg"
                  placeholder="Enter your email"
                  value={form.email}
                  placeholderTextColor="#9CA3AF"
                  onChangeText={(text) => setForm({ ...form, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View className="space-y-2">
                <Text className="text-gray-700 font-medium text-lg">
                  Password
                </Text>
                <TextInput
                  className="w-full px-4 py-3 h-12 border text-gray-700 border-gray-300 rounded-lg"
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={form.password}
                  onChangeText={(text) => setForm({ ...form, password: text })}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                onPress={handleLogin}
                className="w-full bg-blue-600 py-3 text-gray-700 rounded-lg mt-6">
                <Text className="text-white text-center font-semibold text-lg">
                  {isLoading ? "Logging in..." : "Login"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword} className="mt-4">
                <Text className="text-blue-600 text-center">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSignUp} className="mt-4">
                <Text className="text-blue-600 text-center">
                  Don't have an account? Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
