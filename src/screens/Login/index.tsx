import { useEffect, useState } from "react"
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Keyboard, Modal } from "react-native"
import { api } from "../../lib/axios"
import { useNavigation } from "@react-navigation/native"
import { TextInput } from "react-native-paper"
import MaskInput from "react-native-mask-input"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { Background } from "../../components/Background"
import { Button } from "../../components/Button"
import { Header } from "../../components/Header"
import { theme } from "../../global/styles/theme"

import PhoneNumberSvg from "../../assets/phone-number.svg"

export function Login() {
  const [phoneNumber, setPhoneNumber] = useState('')          
  const [loading, setLoading] = useState(false)
  
  const navigation = useNavigation<any>()

  useEffect(() => {
    if (phoneNumber.length === 11) {
      Keyboard.dismiss()
    }
  }, [phoneNumber])

  async function signInWithPhoneNumber() { 
    setLoading(true)

    const response = await api.get(`/clients/${phoneNumber}`)                
    
    const data = {      
      phoneNumber: phoneNumber,        
    }            

    if (response.data.length === 0) {
      setLoading(false)
      
      navigation.navigate('loginUsername', data)
    } else {
      const userKey = await AsyncStorage.getItem('@user') 
      
      if (userKey === null) {       
        const data = {
          id: response.data[0].id,
          firstName: response.data[0].data.firstName,
          lastName: response.data[0].data.lastName,
          phoneNumber: response.data[0].data.phoneNumber,
          address: response.data[0].data.address,
          createdAt: response.data[0].data.createdAt
        }        

        const streetAndNumber = `${data.address.street}, ${data.address.number}`           

        const currentAddressData = {
          addressId: data.address.id,
          addressName: streetAndNumber
        }

        await AsyncStorage.setItem('@user', JSON.stringify(data))

        await AsyncStorage.setItem(`@address:${data.address.id}`, JSON.stringify(data.address))
        await AsyncStorage.setItem('@currentAddress', JSON.stringify(currentAddressData))         
      }   
      
      setLoading(false)

      navigation.navigate('tab')
    }    
  }  

  return (
    <Background> 
      <Header 
        title="celular" 
        removeBackButton
      />      

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="px-4 flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
          <View className="items-center mb-6">
            <PhoneNumberSvg width={160} height={160} />
          </View>

          <Text className="text-xl font-text500 text-black/80 text-left mb-6">
            Qual o número do seu celular?
          </Text>
          
          <View className="w-full flex-row items-center">

            <View className="mr-2 bg-zinc-200 text-center items-center justify-center w-1/5 h-14 rounded-md">
              <Text>
                🇧🇷 +55
              </Text>
            </View>

            <TextInput
              className="flex-1 text-black bg-white"    
              textColor="black"        
              mode="outlined" 
              activeOutlineColor={theme.colors.black80}                 
              render={props =>
                <MaskInput 
                  {...props}          
                  placeholder="(00) 0 0000-0000"           
                  placeholderTextColor={theme.colors.black40}                                             
                  value={phoneNumber}
                  maxLength={16}
                  onChangeText={(masked, unmasked) => {                  
                    setPhoneNumber(unmasked)              
                  }}
                  mask={['(', /\d/, /\d/, ')', ' ', /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                />
              }
            />          
          </View>

          <Text className="text-xs font-text400 text-black/60 mt-1">
            Número de acesso à conta. Por segurança, essa informação não poderá ser alterada.
          </Text>
        </ScrollView>      
      </KeyboardAvoidingView>    

      <View className="p-4">         
        <Button 
          onPress={signInWithPhoneNumber}
          title="Continuar" 
          disabled={phoneNumber.length < 11}     
          loading={loading}       
        />        
      </View>      
    </Background>
  )
}