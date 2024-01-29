import { View, Text } from "react-native"

type Props = {
  count?: number
  bottomTabs?: boolean
}

export function Badge({ count, bottomTabs }: Props) {    
  return (    
    <View className={`bg-yellow-500 w-4 h-4 items-center justify-center text-center self-center rounded-full absolute -top-1 ${bottomTabs ? "right-2" : "-right-1"}`}>
      <Text className="text-[10px] font-title700 text-white text-center">
        {count}
      </Text>
    </View>    
  )
}