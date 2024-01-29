import { TouchableOpacity, View, Text } from "react-native"

type Props = {
  title: string
  onPress?: () => void
  onPressTitle?: string
}

export function HeaderCard({ title, onPress, onPressTitle }: Props) {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <Text className="font-title700 text-lg text-black/80">
        {title}
      </Text>

      {onPress && (
        <TouchableOpacity
          onPress={onPress}
        >
          <Text className="text-yellow-500 font-text500 text-sm">
            {onPressTitle}
          </Text>        
        </TouchableOpacity>
      )}
    </View>
  )
}