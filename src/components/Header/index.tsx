import React, { ReactNode } from "react"
import { View, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { GestureHandlerRootView, BorderlessButton } from "react-native-gesture-handler"

import { useNavigation } from "@react-navigation/native"
import { theme } from "../../global/styles/theme"
import { ArrowSmallLeftIcon } from "react-native-heroicons/solid"

type Props = {
  title: string
  action?: ReactNode
  removeBackButton?: boolean
}

export function Header({ title, action, removeBackButton }: Props) {  
  const navigation = useNavigation<any>()

  function handleGoBack() {
    navigation.goBack()
  }

  return (
    <SafeAreaView>
      <View className="w-full h-20 px-4 flex-row justify-items-center items-center relative">
        <GestureHandlerRootView className={`absolute left-4 ${removeBackButton ? "hidden" : ""}`}>
          <BorderlessButton
            onPress={handleGoBack}
          >
            <ArrowSmallLeftIcon width={24} height={24} color={theme.colors.primary} />            
          </BorderlessButton>
        </GestureHandlerRootView>        

        <Text className="flex-1 text-center font-text500 text-sm uppercase text-black/80">
          {title}
        </Text>

        {action && (
          <View className="absolute right-4">
            {action}
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}