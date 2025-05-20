import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoText from "../../components/LogoText";

export default function FirstOnboarding() {
  const router = useRouter();

  const handleSkip = async () => {
    // await AsyncStorage.setItem("isOnboarded", "true");
    router.replace("/(protected)/home");
  };

  const handleNext = () => {
    router.push("/second");
  };

  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      {/* Progress Indicator */}
      <View className="flex-row justify-center items-center mt-16 mb-6 space-x-2">
        <View className="w-8 h-2 rounded-full bg-yellow-400" />
        <View className="w-3 h-2 rounded-full bg-gray-200" />
        <View className="w-3 h-2 rounded-full bg-gray-200" />
      </View>
      <LogoText />
      {/* Title & Subtitle */}
      <Animated.View
        entering={FadeInUp.delay(200).springify()}
        className="w-full max-w-md items-center mb-8">
        <Text className="text-3xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">
          Welcome to FlashNest
        </Text>
        <Text className="text-base text-gray-500 text-center leading-7">
          Organize your learning journey with smart folders and AI-powered
          flashcards. Let's get started!
        </Text>
      </Animated.View>

      {/* Bottom Navigation */}
      <View className="flex-row justify-between items-center w-full max-w-md mt-16 px-2">
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
          <Text className="text-gray-400 text-base font-medium">Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          className="bg-yellow-400 rounded-full p-4"
          activeOpacity={0.8}>
          <Text className="text-black text-lg font-bold">Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
