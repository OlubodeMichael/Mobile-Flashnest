import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const { logout, userProfile, user } = useAuth();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("isOnboarded");
    await logout();
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

            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-200">
              <View className="w-8 h-8 items-center justify-center mr-3">
                <Ionicons name="settings-outline" size={22} color="#4B5563" />
              </View>
              <Text className="text-gray-900 font-medium flex-1">
                Preferences
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
