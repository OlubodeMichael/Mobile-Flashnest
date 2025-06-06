import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { useStudy } from "../../contexts/StudyProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const { logout, userProfile, user } = useAuth();
  const { decks } = useStudy();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("isOnboarded");
    await logout();
  };

  const totalCards =
    decks?.decks?.reduce(
      (acc, deck) => acc + (deck.flashcards?.length || 0),
      0
    ) || 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white px-6 pt-6 pb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Profile</Text>
          <Text className="text-gray-600 text-lg">
            Manage your account settings
          </Text>
        </View>

        {/* User Info */}
        <View className="px-6 py-6">
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <View className="flex-row items-center mb-6">
              <View className="bg-yellow-100 w-16 h-16 rounded-full items-center justify-center mr-4">
                <Ionicons name="person" size={32} color="#F59E0B" />
              </View>
              <View className="flex-col">
                <View>
                  <Text className="text-xl font-semibold text-gray-900">
                    {userProfile?.first_name} {userProfile?.last_name}
                  </Text>
                </View>
                <View>
                  <Text className="text-xl font-semibold text-gray-900">
                    {user?.email}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View className="px-6 py-2">
          <View className="bg-white rounded-2xl shadow-sm">
            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
              <View className="bg-blue-100 w-10 h-10 rounded-full items-center justify-center mr-3">
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="#3B82F6"
                />
              </View>
              <Text className="text-gray-900 font-medium flex-1">
                Notifications
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
              <View className="bg-purple-100 w-10 h-10 rounded-full items-center justify-center mr-3">
                <Ionicons name="settings-outline" size={20} color="#8B5CF6" />
              </View>
              <Text className="text-gray-900 font-medium flex-1">
                Preferences
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center p-4">
              <View className="bg-green-100 w-10 h-10 rounded-full items-center justify-center mr-3">
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color="#10B981"
                />
              </View>
              <Text className="text-gray-900 font-medium flex-1">
                Help & Support
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-6 py-6">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-50 p-4 rounded-2xl flex-row items-center justify-center">
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#EF4444"
              className="mr-2"
            />
            <Text className="text-red-500 font-semibold text-lg">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
