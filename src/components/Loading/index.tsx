import React from "react"
import { ActivityIndicator, View } from "react-native"

export function Loading() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="small" color="#eab308" />    
    </View>
  )
}