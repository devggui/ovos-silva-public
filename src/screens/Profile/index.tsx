import React, { useEffect, useState } from "react"
import { Text, ScrollView, TouchableOpacity, Linking } from "react-native"
import { BellIcon, ChatBubbleOvalLeftEllipsisIcon, MapPinIcon, UserIcon } from "react-native-heroicons/outline"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { Background } from "../../components/Background"
import { Separator } from "../../components/Separator"
import { ProfileOptionsCard } from "../../components/ProfileOptionsCard"
import { UserCard } from "../../components/UserCard"

import { theme } from "../../global/styles/theme"
import { UserProps } from "../../@types/user"
import Toast from "react-native-root-toast"
import { CommonActions, useIsFocused } from "@react-navigation/native"
import { ArrowRightOnRectangleIcon } from "react-native-heroicons/solid"
import { api } from "../../lib/axios"
import { clearCart } from "../../reducers/cart/cartReducer"
import { useDispatch } from "react-redux"

export function Profile({ navigation }) {      
  const [userData, setUserData] = useState({} as UserProps)  
  const [addressId, setAddressId] = useState('')    
  
  const isFocused = useIsFocused()     
  const dispatch = useDispatch()

  useEffect(() => {      
    if (userData.id !== null) {
      handleFetchUserData()    
    }

    handleGetCurrentAddress()
  }, [isFocused])

  async function handleGetCurrentAddress() {
    const response = await AsyncStorage.getItem('@currentAddress')
    
    const data = JSON.parse(response)
    
    if (data === null) {
      return
    }

    if (data !== null) {
      setAddressId(data.addressId)    
    }
  }

  async function handleFetchUserData() {
    const data = await AsyncStorage.getItem('@user')
    const user = JSON.parse(data)
    const clientId = user.id
    
    const response = await api.get(`/client/${clientId}`)    

    setUserData({ ...response.data, id: user.id })   
  }    

  async function clearUserKeyCache() {        
    dispatch(clearCart())
    
    const allKeys = await AsyncStorage.getAllKeys()          
           
    await AsyncStorage.multiRemove(allKeys)

    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'login' }          
        ],
      })
    )
  }

  function handleNavigateToAddressScreen() {
    navigation.navigate('address', {
      addressId,       
      onSelected: handleGetCurrentAddress,
      beforeScreen: 'profile'         
    })
  }

  function openWhatsApp() {    
    const phoneNumber = '+5514998619263';
    const message = 'Olá, gostaria de conversar sobre o aplicativo!'
    
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`    
    
    Linking.openURL(whatsappUrl)
      .catch((error) => {
        console.error('Error opening WhatsApp:', error)
        showToast('Não foi possível abrir o WhatsApp!', "#dc3545")
      })
  }

  const showToast = (message: string, background: string) => {
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      backgroundColor: background,
      opacity: 1,
      textColor: "#FFF",
      containerStyle: {
        borderRadius: 100,
        paddingHorizontal: 24,
        marginTop: 24
      }    
    })
  }

  return (
    <Background>                  

      <UserCard 
        firstName={userData.firstName}
        lastName={userData.lastName}        
      />                          

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 50 }}
      >
        <ProfileOptionsCard 
          icon={ <UserIcon size={24} color={theme.colors.gray} /> } 
          title="Meus dados" 
          subtitle="Minhas informações de conta"
          onPress={() => navigation.navigate('personal', { 
            userData: userData,
            onUpdated: handleFetchUserData 
          })}
        />      

        <Separator />

        <ProfileOptionsCard 
          icon={ <BellIcon size={24} color={theme.colors.gray} /> } 
          title="Notificações" 
          subtitle="Minha central de notificações"
          onPress={() => navigation.navigate('notifications')}
        />      

        <Separator />

        <ProfileOptionsCard 
          icon={ <MapPinIcon size={24} color={theme.colors.gray} /> } 
          title="Endereços" 
          subtitle="Meus endereços de entrega"
          onPress={handleNavigateToAddressScreen}
        /> 

        <Separator />

        <ProfileOptionsCard 
          icon={ <ChatBubbleOvalLeftEllipsisIcon size={24} color={theme.colors.gray} /> } 
          title="Fale conosco" 
          subtitle="Tire suas dúvidas com nossa equipe"
          onPress={openWhatsApp}
        />  

        <Separator />

        <ProfileOptionsCard 
          icon={ <ArrowRightOnRectangleIcon size={24} color={theme.colors.gray} /> } 
          title="Sair da conta" 
          subtitle="Deixe a conta e volte mais tarde"
          onPress={clearUserKeyCache}
        />              
      </ScrollView>                   
    </Background>
  )
}