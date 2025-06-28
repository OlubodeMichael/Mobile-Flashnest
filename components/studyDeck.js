import { View, Text, TouchableOpacity } from "react-native";

export default function StudyDeck({ deck, onPress }) {
  return (
    <TouchableOpacity
      className="bg-gray-900 rounded-xl p-4 my-2 mx-4 shadow-lg border border-gray-800"
      onPress={onPress}>
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-3">
          <Text className="text-lg font-bold text-white mb-2">
            {deck.title || deck.name}
          </Text>
          <View className="mt-1">
            <Text className="text-xs text-gray-300 mb-1">Study Progress</Text>
            <View className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <View className="h-full w-3/5 bg-yellow-400 rounded-full" />
            </View>
          </View>
        </View>
        <View className="flex-row gap-3">
          <View className="items-center">
            <Text className="text-lg font-bold text-yellow-400">
              {deck.flashcards_count || 0}
            </Text>
            <Text className="text-xs text-gray-300">Cards</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-yellow-400">85%</Text>
            <Text className="text-xs text-gray-300">Mastery</Text>
          </View>
        </View>
      </View>

      <View className="mt-3 pt-3 border-t border-gray-800">
        <Text className="text-xs text-gray-400">Last Studied</Text>
        <Text className="text-sm text-white font-medium">
          {new Date().toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
