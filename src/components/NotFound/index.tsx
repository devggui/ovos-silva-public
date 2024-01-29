import { ReactNode } from "react"
import { View, Text } from "react-native"

type Props = {
  image: ReactNode
  title: string    
}

export function NotFound({ title, image }: Props) {  
  return (
    <View className="flex-1 items-center justify-center mx-6 space-y-6">          
      {image}

      <Text className="text-xl font-title700 text-black/80 text-center">
        {title}
      </Text>      
    </View>
  )
}