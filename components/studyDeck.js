import { View, Text, TouchableOpacity } from "react-native";

export default function StudyDeck({ deck, onPress }) {
  return (
    <TouchableOpacity
      className="bg-yellow-500 rounded-2xl p-5 my-2.5 mx-4 shadow-lg"
      onPress={onPress}>
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-4">
          <Text className="text-2xl font-bold text-yellow-900 mb-3">
            {deck.title || deck.name}
          </Text>
          <View className="mt-2">
            <Text className="text-sm text-yellow-800 mb-1.5">
              Study Progress
            </Text>
            <View className="h-1.5 bg-yellow-600/20 rounded-full overflow-hidden">
              <View className="h-full w-3/5 bg-yellow-400 rounded-full" />
            </View>
          </View>
        </View>
        <View className="flex-row gap-4">
          <View className="items-center">
            <Text className="text-xl font-bold text-yellow-900">
              {deck.flashcards?.length || 0}
            </Text>
            <Text className="text-xs text-yellow-800 mt-0.5">Cards</Text>
          </View>
          <View className="items-center">
            <Text className="text-xl font-bold text-yellow-900">85%</Text>
            <Text className="text-xs text-yellow-800 mt-0.5">Mastery</Text>
          </View>
        </View>
      </View>

      <View className="mt-5 pt-4 border-t border-yellow-600/20">
        <Text className="text-xs text-yellow-800">Last Studied</Text>
        <Text className="text-sm text-yellow-900 font-medium mt-0.5">
          {new Date().toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
