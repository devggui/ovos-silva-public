import { ReactNode } from "react"
import { View, Text } from "react-native"

type Props = {
  icon: ReactNode
  title: string     
  radio: ReactNode
}

export function PaymentCard({ icon, title,  radio }: Props) {
  return (
    <View className="border border-zinc-200 p-2 rounded-md flex-row items-center justify-between text-center">
      <View className="flex-row items-center text-center">
        {icon}

        <Text className="text-sm font-text500 font-bold text-black/80 ml-4">
          {title}
        </Text>
      </View>  

      {radio}              
    </View>
  )
}