import React, { useCallback, useEffect, useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from "react-native"
import { ChevronDownIcon, BellIcon } from "react-native-heroicons/solid"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useIsFocused } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"

import { ProductsList } from "../../components/ProductsList"
import { Background } from "../../components/Background"
import { DotBadge } from "../../components/DotBadge"

import { theme } from "../../global/styles/theme"
import { api } from "../../lib/axios"

export function Home({ navigation }) {    
  const [addressId, setAddressId] = useState('')  
  const [addressName, setAddressName] = useState('')    
  const [refreshing, setRefreshing] = useState(false)      
  const [hasNotifications, setHasNotifications] = useState(false)
  
  const isFocused = useIsFocused()     

  const getNotifications = async () => {
    await api.get('/notifications')
      .then(response => response.data)
      .then(data => data.length === 0 ? setHasNotifications(false) : setHasNotifications(true)) 
  }    

  const onRefresh = useCallback(() => {
    setRefreshing(true)  
  }, [])            

  useEffect(() => {        
    handleGetCurrentAddress()               
    getNotifications()
  }, [isFocused])  
  
  function handleNavigateToAddressScreen() {
    navigation.navigate('address', {
      addressId,       
      onSelected: handleGetCurrentAddress            
    })
  }

  function handleNavigateToNotificationsScreen() {
    navigation.navigate('notifications')
  }      

  async function handleGetCurrentAddress() {    
    const currentAddress = JSON.parse(await AsyncStorage.getItem('@currentAddress'))                

    if (currentAddress === null) {
      setAddressId(null)
      setAddressName(null)
    } else {
      setAddressId(currentAddress.addressId)
      setAddressName(currentAddress.addressName)      
    }    
  }  

  return (
    <Background>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SafeAreaView className="w-full p-4 flex-row items-center justify-center relative">                            
          <TouchableOpacity 
            onPress={handleNavigateToAddressScreen} 
            className="flex-row items-center justify-center space-x-2 max-w-[200px]"
          > 
            <Text className="text-sm font-text500 text-black/80 text-center">
              {addressId !== null && addressName !== null ? addressName : "Selecione o endereço"}
            </Text>

            <ChevronDownIcon 
              size={14} 
              color={theme.colors.primary} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleNavigateToNotificationsScreen}
            className="absolute right-4 bottom-4"
          >
            <View className="relative">
              <BellIcon 
                size={24} 
                color={theme.colors.primary} 
              />  
              {hasNotifications && <DotBadge />}                                        
            </View>
          </TouchableOpacity>
        </SafeAreaView>         
                      
        <ProductsList 
          onRefresh={refreshing}
          setOnRefresh={setRefreshing}            
        />                      
      </ScrollView>    
    </Background>
  )
}