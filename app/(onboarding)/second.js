import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp, SlideInRight } from "react-native-reanimated";
import LogoText from "../../components/LogoText";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SecondOnboarding() {
  const router = useRouter();

  const handleSkip = async () => {
    await AsyncStorage.setItem("onboarding", "true");
    router.replace("/(auth)");
  };

  const handleNext = () => {
    router.push("/third");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Main Content */}
      <View className="flex-1 justify-center items-center px-6">
        {/* Progress Indicator */}
        <Animated.View
          entering={FadeInUp.delay(100).springify()}
          className="flex-row justify-center items-center mt-16 mb-8 space-x-2">
          <View className="w-3 h-2 rounded-full bg-gray-200" />
          <View className="w-8 h-2 rounded-full bg-yellow-400" />
          <View className="w-3 h-2 rounded-full bg-gray-200" />
        </Animated.View>

        {/* Logo */}
        <Animated.View
          entering={FadeInUp.delay(200).springify()}
          className="mb-12">
          <LogoText />
        </Animated.View>

        {/* Illustration */}
        <Animated.View
          entering={SlideInRight.delay(300).springify()}
          className="w-64 h-64 mb-8">
          <Image
            source={require("../../assets/Onboarding-2.png")}
            className="w-full h-full"
            resizeMode="contain"
          />
        </Animated.View>

        {/* Title & Subtitle */}
        <Animated.View
          entering={FadeInUp.delay(400).springify()}
          className="w-full max-w-md items-center mb-8">
          <Text className="text-3xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">
            Fill your folders
          </Text>
          <Text className="text-base text-gray-500 text-center leading-7">
            Add your notes and flashcards to each folder to organize your
            learning journey.
          </Text>
        </Animated.View>

        {/* Bottom Navigation */}
        <Animated.View
          entering={FadeInUp.delay(500).springify()}
          className="flex-row justify-between items-center w-full max-w-md mt-8 px-2">
          <TouchableOpacity
            onPress={handleSkip}
            activeOpacity={0.7}
            className="flex-row items-center">
            <Text className="text-gray-400 text-base font-medium mr-2">
              Skip
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            className="bg-yellow-400 rounded-full px-8 py-4 flex-row items-center"
            activeOpacity={0.8}>
            <Text className="text-black text-lg font-bold mr-2">Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="black" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}
