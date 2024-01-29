import { useState } from "react"
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { TextInput } from "react-native-paper"
import { api } from "../../lib/axios"
import { theme } from "../../global/styles/theme"

import { Background } from "../../components/Background"
import { Button } from "../../components/Button"
import { Header } from "../../components/Header"
import { Label } from "../../components/Label"

export function LoginUsername({ navigation, route }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')    
  const [loading, setLoading] = useState(false)

  const phoneNumber = route.params.phoneNumber  

  async function goToLoginAddressScreen() {

    const data = {      
      phoneNumber: phoneNumber,       
      firstName: firstName,
      lastName: lastName
    }               

    navigation.push('loginAddress', data)   
  }

  function capitalizeCompoundName(name: string, provider: string) {
    if (!/^[a-zA-Z\s]*$/.test(name)) {
      return
    }    

    const nameParts = name.split(" ")

    const capitalizedNameParts = nameParts.map(part => {
      return part.charAt(0).toUpperCase() + part.slice(1)
    })

    const finishedName = capitalizedNameParts.join(" ")      

    if (provider === 'firstName') {
      setFirstName(finishedName)    
    }

    if (provider === 'lastName') {
      setLastName(finishedName)    
    }
  }

  return (
    <Background>
      <Header 
        title="nome"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView>
          <View className="px-4 space-y-6 flex-1">
            <Text className="text-xl text-black/80 font-text500">
              Qual o seu nome?
            </Text>        

            <View>          
              <Label 
                text="Primeiro nome" 
                hasLength
                textLength={firstName.length}            
              />

              <TextInput
                textColor="black"            
                className="relative text-black bg-white"  
                mode="outlined"
                placeholder="João" 
                placeholderTextColor={theme.colors.black40}           
                value={firstName}            
                onChangeText={text => capitalizeCompoundName(text, 'firstName')}
                maxLength={140}  
                activeOutlineColor={theme.colors.black80}
              />         
            </View>

            <View>
              <Label 
                text="Último nome"
                hasLength
                textLength={lastName.length}
              />

              <TextInput
                textColor="black"            
                className="relative text-black bg-white"  
                mode="outlined"
                placeholder="Da Silva" 
                placeholderTextColor={theme.colors.black40}                      
                value={lastName}
                onChangeText={text => capitalizeCompoundName(text, 'lastName')}
                maxLength={140}      
                activeOutlineColor={theme.colors.black80}      
              />          
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="p-4">
        <Button           
          onPress={goToLoginAddressScreen}
          title="Continuar"           
          disabled={firstName.length === 0 || lastName.length === 0}
          loading={loading}
        />   
      </View>
    </Background>
  )
}