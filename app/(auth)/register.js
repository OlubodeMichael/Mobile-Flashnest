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
import { SafeAreaView } from "react-native-safe-area-context";
import LogoText from "../../components/LogoText";
import { router } from "expo-router";
import { useAuth } from "../../contexts/AuthProvider";

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
          <View className="flex-1 items-center justify-center px-6">
            <LogoText />

            <View className="w-full space-y-4 mt-8">
              <View className="space-y-2 py-4">
                <View className="space-y-4">
                  {/* Name Fields Row */}
                  <View className="flex-row gap-4 space-x-4">
                    {/* First Name */}
                    <View className="flex-1">
                      <Text className="text-gray-700 font-medium text-lg">
                        First name
                      </Text>
                      <TextInput
                        className={`w-full px-4 py-3 h-12 border text-gray-700 rounded-lg ${
                          formErrors.firstName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your first name"
                        placeholderTextColor="#9CA3AF"
                        value={form.firstName}
                        onChangeText={(text) => {
                          setForm({ ...form, firstName: text });
                          if (formErrors.firstName) {
                            setFormErrors({ ...formErrors, firstName: "" });
                          }
                          // Clear API error when user starts typing
                          if (error) clearError();
                        }}
                      />
                      {formErrors.firstName && (
                        <Text className="text-red-500 text-sm mt-1">
                          {formErrors.firstName}
                        </Text>
                      )}
                    </View>

                    {/* Last Name */}
                    <View className="flex-1">
                      <Text className="text-gray-700 font-medium text-lg">
                        Last name
                      </Text>
                      <TextInput
                        className={`w-full px-4 py-3 h-12 border text-gray-700 rounded-lg ${
                          formErrors.lastName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your last name"
                        placeholderTextColor="#9CA3AF"
                        value={form.lastName}
                        onChangeText={(text) => {
                          setForm({ ...form, lastName: text });
                          if (formErrors.lastName) {
                            setFormErrors({ ...formErrors, lastName: "" });
                          }
                          // Clear API error when user starts typing
                          if (error) clearError();
                        }}
                      />
                      {formErrors.lastName && (
                        <Text className="text-red-500 text-sm mt-1">
                          {formErrors.lastName}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
                <View className="space-y-2 py-4">
                  <View className="pb-4">
                    <Text className="text-gray-700 font-medium text-lg">
                      Email
                    </Text>
                    <TextInput
                      className={`w-full px-4 py-3 h-12 border text-gray-700 rounded-lg ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      }`}
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
                        // Clear API error when user starts typing
                        if (error) clearError();
                      }}
                    />
                    {formErrors.email && (
                      <Text className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </Text>
                    )}
                  </View>
                  <View className="pb-4">
                    <Text className="text-gray-700 font-medium text-lg">
                      Password
                    </Text>
                    <TextInput
                      className={`w-full px-4 py-3 h-12 border text-gray-700 rounded-lg ${
                        formErrors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your password"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry
                      value={form.password}
                      onChangeText={(text) => {
                        setForm({ ...form, password: text });
                        if (formErrors.password) {
                          setFormErrors({ ...formErrors, password: "" });
                        }
                        // Clear API error when user starts typing
                        if (error) clearError();
                      }}
                    />
                    {formErrors.password && (
                      <Text className="text-red-500 text-sm mt-1">
                        {formErrors.password}
                      </Text>
                    )}
                  </View>
                  <View>
                    <Text className="text-gray-700 font-medium text-lg">
                      Confirm Password
                    </Text>
                    <TextInput
                      className={`w-full px-4 py-3 h-12 border text-gray-700 rounded-lg ${
                        formErrors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Confirm your password"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry
                      value={form.confirmPassword}
                      onChangeText={(text) => {
                        setForm({ ...form, confirmPassword: text });
                        if (formErrors.confirmPassword) {
                          setFormErrors({ ...formErrors, confirmPassword: "" });
                        }
                        // Clear API error when user starts typing
                        if (error) clearError();
                      }}
                    />
                    {formErrors.confirmPassword && (
                      <Text className="text-red-500 text-sm mt-1">
                        {formErrors.confirmPassword}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleRegister}
                disabled={isLoading}
                className={`w-full bg-blue-600 py-3 text-gray-700 rounded-lg mt-6 ${
                  isLoading ? "opacity-70" : ""
                }`}>
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold text-lg">
                    Register
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex-row items-center my-4">
                <View className="flex-1 h-[1px] bg-gray-300" />
                <Text className="mx-4 text-gray-500">or</Text>
                <View className="flex-1 h-[1px] bg-gray-300" />
              </View>

              <TouchableOpacity
                onPress={handleGoogleSignIn}
                className="w-full flex-row items-center justify-center bg-white py-3 border border-gray-300 rounded-lg">
                <Image
                  source={require("../../assets/google-icon.png")}
                  className="w-6 h-6 mr-2"
                />
                <Text className="text-gray-700 font-semibold text-lg">
                  Sign up with Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleLogin} className="mt-4">
                <Text className="text-blue-600 text-center">
                  Already have an account? Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
