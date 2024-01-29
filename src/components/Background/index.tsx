import { ReactNode } from "react"
import { View } from "react-native"

type Props = {
  children: ReactNode
}

export function Background({ children }: Props) {
  return (
    <View className="flex-1 bg-white">
      {children}
    </View>
  )
}