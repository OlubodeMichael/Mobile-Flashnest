import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import HelpAndSupport from "../../components/HelpAndSupport";
import { LinearGradient } from "expo-linear-gradient";

export default function Profile() {
  const { logout, userProfile, user, deleteAccount } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [editedFirstName, setEditedFirstName] = useState(
    userProfile?.first_name || ""
  );
  const [editedLastName, setEditedLastName] = useState(
    userProfile?.last_name || ""
  );
  const [editedEmail, setEditedEmail] = useState(user?.email || "");

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await logout();
  };

  const handleSaveProfile = async () => {
    // TODO: Implement API call to update user profile
    setIsEditModalVisible(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation.toLowerCase() !== "delete") {
      Alert.alert("Error", "Please type 'delete' to confirm account deletion.");
      return;
    }

    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
              setIsDeleteModalVisible(false);
              setDeleteConfirmation("");
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to delete account. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["left", "right", "top"]}>
      <ScrollView
        className="flex-1 px-4 pt-2"
        showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-black">Profile</Text>
          <Text className="text-gray-400 mt-1">
            Manage your account settings
          </Text>
        </View>

        {/* User Info Card */}
        <View className="mb-6">
          <View className="bg-gray-900 rounded-3xl p-6">
            <View className="flex-row items-center">
              <View className="w-16 h-16 bg-yellow-500 rounded-2xl items-center justify-center mr-4">
                <Text className="text-black font-bold text-xl">
                  {userProfile?.first_name?.charAt(0)?.toUpperCase()}
                  {userProfile?.last_name?.charAt(0)?.toUpperCase()}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-semibold text-white">
                  {userProfile?.first_name} {userProfile?.last_name}
                </Text>
                <Text className="text-gray-400 mt-1">{user?.email}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-black mb-4">
            Settings
          </Text>

          {/* Edit Profile Card */}
          <TouchableOpacity
            onPress={() => setIsEditModalVisible(true)}
            className="mb-4 rounded-3xl overflow-hidden">
            <LinearGradient
              colors={["#fbbf24", "#f59e0b"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-3xl"
              style={{ padding: 20 }}>
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-black/20 rounded-2xl items-center justify-center mr-4">
                  <Ionicons name="person" size={28} color="black" />
                </View>
                <View className="flex-1">
                  <Text className="text-black text-lg font-semibold mb-1">
                    Edit Profile
                  </Text>
                  <Text className="text-black/70 text-sm">
                    Update your personal information
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="black" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Notifications Card */}
          <TouchableOpacity
            className="mb-4 rounded-3xl overflow-hidden"
            onPress={() => {
              Alert.alert(
                "Notifications",
                "Notifications will be available in a future update."
              );
            }}>
            <LinearGradient
              colors={["#3b82f6", "#1d4ed8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-3xl"
              style={{ padding: 20 }}>
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center mr-4">
                  <Ionicons name="notifications" size={28} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-lg font-semibold mb-1">
                    Notifications
                  </Text>
                  <Text className="text-white/80 text-sm">
                    Manage your notification preferences
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="white" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Help & Support Card */}
          <View className="mb-4 rounded-3xl overflow-hidden">
            <LinearGradient
              colors={["#fbbf24", "#f59e0b"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-3xl"
              style={{ padding: 20 }}>
              <HelpAndSupport />
            </LinearGradient>
          </View>
        </View>

        {/* Stats Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-black mb-4">
            Your Activity
          </Text>
          <View className="bg-gray-900 rounded-3xl p-6">
            <Text className="text-lg font-semibold text-white mb-4">
              Account Overview
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <View className="w-12 h-12 bg-yellow-500 rounded-2xl items-center justify-center mb-2">
                  <Ionicons name="calendar" size={24} color="black" />
                </View>
                <Text className="text-xl font-bold text-white">
                  {new Date().getDate()}
                </Text>
                <Text className="text-gray-400 text-sm">Days Active</Text>
              </View>
              <View className="items-center flex-1">
                <View className="w-12 h-12 bg-blue-500 rounded-2xl items-center justify-center mb-2">
                  <Ionicons name="shield-checkmark" size={24} color="white" />
                </View>
                <Text className="text-xl font-bold text-white">100%</Text>
                <Text className="text-gray-400 text-sm">Account Status</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Danger Zone Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-red-600 mb-4">
            Danger Zone
          </Text>
          <View className="bg-red-50 rounded-3xl p-6 border border-red-200">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-red-500 rounded-2xl items-center justify-center mr-4">
                <Ionicons name="warning" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-red-800 text-lg font-semibold mb-1">
                  Delete Account
                </Text>
                <Text className="text-red-600 text-sm">
                  Permanently delete your account and all data
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setIsDeleteModalVisible(true)}
              className="bg-red-500 p-4 rounded-2xl">
              <Text className="text-white font-semibold text-center">
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add padding at the bottom to account for the fixed logout button */}
        <View className="h-24" />
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-50 p-4 rounded-2xl flex-row items-center justify-center border border-red-200">
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#EF4444"
              style={{ marginRight: 8 }}
            />
            <Text className="text-red-500 font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 justify-end bg-black/50">
              <TouchableWithoutFeedback onPress={() => {}}>
                <View className="bg-white rounded-t-3xl p-6">
                  <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-xl font-bold text-black">
                      Edit Profile
                    </Text>
                    <TouchableOpacity
                      onPress={() => setIsEditModalVisible(false)}>
                      <Ionicons name="close" size={24} color="#4B5563" />
                    </TouchableOpacity>
                  </View>

                  <View className="space-y-4">
                    <View>
                      <Text className="text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </Text>
                      <TextInput
                        className="bg-gray-50 p-4 rounded-xl text-gray-900 border border-gray-200"
                        value={editedFirstName}
                        onChangeText={setEditedFirstName}
                        placeholder="Enter first name"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>

                    <View>
                      <Text className="text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </Text>
                      <TextInput
                        className="bg-gray-50 p-4 rounded-xl text-gray-900 border border-gray-200"
                        value={editedLastName}
                        onChangeText={setEditedLastName}
                        placeholder="Enter last name"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>

                    <View>
                      <Text className="text-sm font-medium text-gray-700 mb-2">
                        Email
                      </Text>
                      <TextInput
                        className="bg-gray-50 p-4 rounded-xl text-gray-900 border border-gray-200"
                        value={editedEmail}
                        onChangeText={setEditedEmail}
                        placeholder="Enter email"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>

                    <TouchableOpacity
                      onPress={handleSaveProfile}
                      className="bg-yellow-500 p-4 rounded-xl mt-4">
                      <Text className="text-black font-semibold text-center">
                        Save Changes
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setIsDeleteModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 justify-end bg-black/50">
              <TouchableWithoutFeedback onPress={() => {}}>
                <View className="bg-white rounded-t-3xl p-6">
                  <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-xl font-bold text-red-600">
                      Delete Account
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setIsDeleteModalVisible(false);
                        setDeleteConfirmation("");
                      }}>
                      <Ionicons name="close" size={24} color="#4B5563" />
                    </TouchableOpacity>
                  </View>

                  <View className="space-y-4">
                    <View className="bg-red-50 p-4 rounded-xl border border-red-200">
                      <Text className="text-red-800 font-semibold mb-2">
                        ⚠️ Warning
                      </Text>
                      <Text className="text-red-700 text-sm">
                        This action cannot be undone. All your data, including
                        decks, flashcards, and study progress will be
                        permanently deleted.
                      </Text>
                    </View>

                    <View>
                      <Text className="text-sm font-medium text-gray-700 mb-2">
                        Type "delete" to confirm
                      </Text>
                      <TextInput
                        className="bg-gray-50 p-4 rounded-xl text-gray-900 border border-gray-200"
                        value={deleteConfirmation}
                        onChangeText={setDeleteConfirmation}
                        placeholder="Type 'delete' to confirm"
                        placeholderTextColor="#9CA3AF"
                        autoCapitalize="none"
                      />
                    </View>

                    <TouchableOpacity
                      onPress={handleDeleteAccount}
                      disabled={deleteConfirmation.toLowerCase() !== "delete"}
                      className={`p-4 rounded-xl mt-4 ${
                        deleteConfirmation.toLowerCase() === "delete"
                          ? "bg-red-500"
                          : "bg-gray-300"
                      }`}>
                      <Text
                        className={`font-semibold text-center ${
                          deleteConfirmation.toLowerCase() === "delete"
                            ? "text-white"
                            : "text-gray-500"
                        }`}>
                        Delete Account
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Fixed Logout Button at bottom */}
    </SafeAreaView>
  );
}
