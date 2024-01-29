import React from "react"
import { StatusBar } from "react-native"
import { Routes } from "./src/routes"
import { useFonts } from 'expo-font'
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter'
import { Rajdhani_500Medium, Rajdhani_700Bold } from '@expo-google-fonts/rajdhani'
import { PaperProvider } from "react-native-paper"
import { Provider as StoreProvider } from "react-redux"
import { store } from "./store"
import { RootSiblingParent } from "react-native-root-siblings"

import { Background } from "./src/components/Background"
import { theme } from "./src/global/styles/theme"

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Rajdhani_500Medium,
    Rajdhani_700Bold
  })

  if (!fontsLoaded && !fontError) {
    return null
  }  
  
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <Background>
          <StatusBar 
            barStyle="dark-content"
            backgroundColor="transparent"        
          />
                    
          <RootSiblingParent>
            <Routes /> 
          </RootSiblingParent>          

        </Background>
      </PaperProvider>
    </StoreProvider>
  )
}