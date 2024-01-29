import { ReactNode } from "react"
import { View, Text, TouchableOpacity, TouchableOpacityProps } from "react-native"
import { ChevronRightIcon } from "react-native-heroicons/solid"
import { theme } from "../../global/styles/theme"

type Props = TouchableOpacityProps & {
  icon: ReactNode
  title: string
  subtitle: string
}

export function ProfileOptionsCard({ icon, title, subtitle, ...props }: Props) {
  return (
    <TouchableOpacity 
      {...props}
      className="flex-row items-center justify-between mx-4"
    >
      <View className="flex-row items-center">
        {icon}

        <View className="ml-6">
          <Text className="text-xl text-black/80 font-title700">{title}</Text>

          <Text className="text-sm text-black/60 font-text400">{subtitle}</Text>
        </View>
      </View>
            
      <ChevronRightIcon size={24} color={theme.colors.black80} />      
    </TouchableOpacity>
  )
}