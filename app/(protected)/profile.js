import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import RevenueCatUI from "react-native-purchases-ui";

export default function Profile() {
  const { logout, userProfile, user } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
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
  const proAction = () => {
    RevenueCatUI.presentPaywall();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-gray-900">My Profile</Text>
        </View>

        {/* User Info */}
        <View className="px-6 py-4">
          <View className="bg-gray-50 rounded-2xl p-6">
            <View className="flex-row items-center">
              <View className="bg-indigo-500 w-16 h-16 rounded-full items-center justify-center mr-4">
                <Ionicons name="person" size={28} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-semibold text-gray-900">
                  {userProfile?.first_name} {userProfile?.last_name}
                </Text>
                <Text className="text-gray-500 mt-1">{user?.email}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View className="px-6 py-4">
          <Text className="text-sm font-medium text-gray-500 mb-3">
            SETTINGS
          </Text>
          <View className="bg-gray-50 rounded-2xl">
            <TouchableOpacity
              onPress={() => setIsEditModalVisible(true)}
              className="flex-row items-center p-4 border-b border-gray-200">
              <View className="w-8 h-8 items-center justify-center mr-3">
                <Ionicons name="person-outline" size={22} color="#4B5563" />
              </View>
              <Text className="text-gray-900 font-medium flex-1">
                Edit Profile
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={proAction}
              className="flex-row items-center p-4 border-b border-gray-200">
              <View className="w-8 h-8 items-center justify-center mr-3">
                <Ionicons name="diamond-outline" size={22} color="#FFD700" />
              </View>
              <Text className="text-gray-900 font-medium flex-1">
                Upgrade to Pro
              </Text>
              <View className="flex-row items-center">
                <View className="bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-1 rounded-full mr-2">
                  <Text className="text-white text-xs font-bold">PRO</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-200">
              <View className="w-8 h-8 items-center justify-center mr-3">
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color="#4B5563"
                />
              </View>
              <Text className="text-gray-900 font-medium flex-1">
                Notifications
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center p-4">
              <View className="w-8 h-8 items-center justify-center mr-3">
                <Ionicons
                  name="help-circle-outline"
                  size={22}
                  color="#4B5563"
                />
              </View>
              <Text className="text-gray-900 font-medium flex-1">
                Help & Support
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Add padding at the bottom to account for the fixed logout button */}
        <View className="h-24" />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900">
                Edit Profile
              </Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  First Name
                </Text>
                <TextInput
                  className="bg-gray-50 p-4 rounded-xl text-gray-900"
                  value={editedFirstName}
                  onChangeText={setEditedFirstName}
                  placeholder="Enter first name"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </Text>
                <TextInput
                  className="bg-gray-50 p-4 rounded-xl text-gray-900"
                  value={editedLastName}
                  onChangeText={setEditedLastName}
                  placeholder="Enter last name"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Email
                </Text>
                <TextInput
                  className="bg-gray-50 p-4 rounded-xl text-gray-900"
                  value={editedEmail}
                  onChangeText={setEditedEmail}
                  placeholder="Enter email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                onPress={handleSaveProfile}
                className="bg-indigo-500 p-4 rounded-xl mt-4">
                <Text className="text-white font-medium text-center">
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Fixed Logout Button at bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-gray-200 px-6 py-4">
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-gray-50 p-4 rounded-2xl flex-row items-center justify-center">
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#EF4444"
            className="mr-2"
          />
          <Text className="text-red-500 font-medium">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
