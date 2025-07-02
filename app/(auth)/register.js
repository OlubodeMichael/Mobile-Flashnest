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
  ActivityIndicator,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import LogoText from "../../components/LogoText";
import { router } from "expo-router";
import { useAuth } from "../../contexts/AuthProvider";
import AppleAuth from "../../components/Auth/apple";

export default function Register() {
  const { signUp, isLoading, error, handleGoogleSignIn, clearError } =
    useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Clear error when component mounts
  useEffect(() => {
    // Clear any existing errors when the component mounts
    clearError();
  }, []);

  // Show API errors in an alert
  useEffect(() => {
    if (error) {
      Alert.alert("Registration Failed", error, [
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

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!form.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!form.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!form.password) {
      errors.password = "Password is required";
    } else if (!passwordRegex.test(form.password)) {
      errors.password =
        "Password must be at least 8 characters with letters and numbers";
    }
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = () => {
    router.replace("/login");
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await signUp(
        form.firstName,
        form.lastName,
        form.email,
        form.password,
        form.confirmPassword
      );
      console.log("Registration successful");
      // Redirect to home page after successful registration
      router.replace("/(protected)/home");
    } catch (error) {
      // Error is now handled by the useEffect hook
      console.error("Registration error:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
          className="flex-1">
          <View className="flex-1 px-6 pt-4">
            {/* Header Section */}
            <View className="items-center mb-8">
              <LogoText />
              <Text className="text-gray-500 mt-3 text-center text-lg leading-6 max-w-sm">
                Create your account to start your learning journey
              </Text>
            </View>

            {/* Register Form */}
            <View className="w-full space-y-6 flex-1">
              {/* Name Fields Row */}
              <View className="flex-row space-x-4">
                {/* First Name */}
                <View className="flex-1">
                  <Text className="text-gray-700 font-semibold text-base mb-3">
                    First Name
                  </Text>
                  <View
                    className={`flex-row items-center bg-gray-50 border-2 rounded-2xl px-4 py-4 ${
                      formErrors.firstName
                        ? "border-red-300"
                        : "border-gray-100"
                    }`}>
                    <Feather
                      name="user"
                      size={20}
                      color="#6B7280"
                      style={{ marginRight: 12 }}
                    />
                    <TextInput
                      className="flex-1 text-gray-900 text-base"
                      placeholder="Enter first name"
                      placeholderTextColor="#9CA3AF"
                      value={form.firstName}
                      onChangeText={(text) => {
                        setForm({ ...form, firstName: text });
                        if (formErrors.firstName) {
                          setFormErrors({ ...formErrors, firstName: "" });
                        }
                        if (error) clearError();
                      }}
                    />
                  </View>
                  {formErrors.firstName && (
                    <Text className="text-red-500 text-sm mt-2">
                      {formErrors.firstName}
                    </Text>
                  )}
                </View>

                {/* Last Name */}
                <View className="flex-1">
                  <Text className="text-gray-700 font-semibold text-base mb-3">
                    Last Name
                  </Text>
                  <View
                    className={`flex-row items-center bg-gray-50 border-2 rounded-2xl px-4 py-4 ${
                      formErrors.lastName ? "border-red-300" : "border-gray-100"
                    }`}>
                    <Feather
                      name="user"
                      size={20}
                      color="#6B7280"
                      style={{ marginRight: 12 }}
                    />
                    <TextInput
                      className="flex-1 text-gray-900 text-base"
                      placeholder="Enter last name"
                      placeholderTextColor="#9CA3AF"
                      value={form.lastName}
                      onChangeText={(text) => {
                        setForm({ ...form, lastName: text });
                        if (formErrors.lastName) {
                          setFormErrors({ ...formErrors, lastName: "" });
                        }
                        if (error) clearError();
                      }}
                    />
                  </View>
                  {formErrors.lastName && (
                    <Text className="text-red-500 text-sm mt-2">
                      {formErrors.lastName}
                    </Text>
                  )}
                </View>
              </View>

              {/* Email Input */}
              <View>
                <Text className="text-gray-700 font-semibold text-base mb-3">
                  Email Address
                </Text>
                <View
                  className={`flex-row items-center bg-gray-50 border-2 rounded-2xl px-4 py-4 ${
                    formErrors.email ? "border-red-300" : "border-gray-100"
                  }`}>
                  <Feather
                    name="mail"
                    size={20}
                    color="#6B7280"
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    className="flex-1 text-gray-900 text-base"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={form.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(text) => {
                      setForm({ ...form, email: text });
                      if (formErrors.email) {
                        setFormErrors({ ...formErrors, email: "" });
                      }
                      if (error) clearError();
                    }}
                  />
                </View>
                {formErrors.email && (
                  <Text className="text-red-500 text-sm mt-2">
                    {formErrors.email}
                  </Text>
                )}
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-gray-700 font-semibold text-base mb-3">
                  Password
                </Text>
                <View
                  className={`flex-row items-center bg-gray-50 border-2 rounded-2xl px-4 py-4 ${
                    formErrors.password ? "border-red-300" : "border-gray-100"
                  }`}>
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
                    secureTextEntry
                    value={form.password}
                    onChangeText={(text) => {
                      setForm({ ...form, password: text });
                      if (formErrors.password) {
                        setFormErrors({ ...formErrors, password: "" });
                      }
                      if (error) clearError();
                    }}
                  />
                </View>
                {formErrors.password && (
                  <Text className="text-red-500 text-sm mt-2">
                    {formErrors.password}
                  </Text>
                )}
              </View>

              {/* Confirm Password Input */}
              <View>
                <Text className="text-gray-700 font-semibold text-base mb-3">
                  Confirm Password
                </Text>
                <View
                  className={`flex-row items-center bg-gray-50 border-2 rounded-2xl px-4 py-4 ${
                    formErrors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-100"
                  }`}>
                  <Feather
                    name="lock"
                    size={20}
                    color="#6B7280"
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    className="flex-1 text-gray-900 text-lg"
                    placeholder="Confirm your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    value={form.confirmPassword}
                    onChangeText={(text) => {
                      setForm({ ...form, confirmPassword: text });
                      if (formErrors.confirmPassword) {
                        setFormErrors({ ...formErrors, confirmPassword: "" });
                      }
                      if (error) clearError();
                    }}
                  />
                </View>
                {formErrors.confirmPassword && (
                  <Text className="text-red-500 text-sm mt-2">
                    {formErrors.confirmPassword}
                  </Text>
                )}
              </View>

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleRegister}
                disabled={isLoading}
                className="rounded-2xl overflow-hidden mt-6"
                activeOpacity={0.8}>
                <LinearGradient
                  colors={["#fbbf24", "#f59e0b"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-2xl"
                  style={{ padding: 16 }}>
                  {isLoading ? (
                    <ActivityIndicator color="black" size="small" />
                  ) : (
                    <Text className="text-black text-center font-bold text-xl">
                      Create Account
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="flex-row items-center my-6">
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
                className="w-full flex-row items-center justify-center bg-white py-4 border-2 border-gray-200 rounded-2xl mb-4 shadow-sm"
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

            {/* Sign In Link */}
            <View className="items-center mt-6">
              <TouchableOpacity onPress={handleLogin}>
                <Text className="text-gray-500 text-base">
                  Already have an account?{" "}
                  <Text className="text-yellow-500 font-bold">Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
