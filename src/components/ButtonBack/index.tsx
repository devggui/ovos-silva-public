import React, { ReactNode } from "react"
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { GestureHandlerRootView, BorderlessButton } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"

import { theme } from "../../global/styles/theme"
import { ArrowSmallLeftIcon } from "react-native-heroicons/solid"

type Props = {
  hasBackground?: boolean
}

export function ButtonBack({ hasBackground }: Props) {  
  const navigation = useNavigation<any>()

  function handleGoBack() {
    navigation.goBack()
  }

  return (
    <SafeAreaView>
      <View className="w-full px-6 h-20 flex-row items-center justify-start">
        <View className={`rounded-full p-1 ${hasBackground ? "bg-black/60" : ""}`}>
          <GestureHandlerRootView>
            <BorderlessButton
              onPress={handleGoBack}
            >
              <ArrowSmallLeftIcon width={24} height={24} color={theme.colors.primary} />
            </BorderlessButton>
          </GestureHandlerRootView>              
        </View>
      </View>
    </SafeAreaView>
  )
}