import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import LogoText from "../../components/LogoText";

export default function AuthPage() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        {/* Welcome Section */}
        <View className="flex-1 items-center justify-start pt-12">
          <LogoText />
          <Text className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Welcome to FlashNest
          </Text>
          <Text className="text-gray-600 text-lg text-center">
            Your personal flashcard learning companion
          </Text>
        </View>

        {/* Bottom Section with Buttons */}
        <View className="w-full space-y-4 mb-8">
          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="bg-yellow-400 py-4 rounded-xl mb-4">
            <Text className="text-center font-semibold text-gray-900 text-lg">
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/register")}
            className="bg-gray-100 py-4 rounded-xl">
            <Text className="text-center font-semibold text-gray-900 text-lg">
              Create Account
            </Text>
          </TouchableOpacity>

          <Text className="text-gray-500 text-center text-sm mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
