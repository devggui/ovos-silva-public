import { View, Text } from "react-native"

type Props = {
  text: string  
  hasLength?: boolean
  textLength?: number
}

export function Label({ ...props }: Props) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-base font-text500 text-left text-black/80 ">
        {props.text}
      </Text>

      {props.hasLength && (
        <Text className="text-sm font-text400 text-right text-black/60">
          {props.textLength}/140
        </Text>
      )}
    </View>
  )
}