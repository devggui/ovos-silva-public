import { View, LogBox } from "react-native"
import { TextInput } from "react-native-paper"
import { useEffect, useState } from "react"
import { UserProps } from "../../@types/user"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { cpf } from 'cpf-cnpj-validator'

import { Background } from "../../components/Background"
import { Header } from "../../components/Header"
import { Button } from "../../components/Button"
import Toast from "react-native-root-toast"
import { theme } from "../../global/styles/theme"
import { Label } from "../../components/Label"

export function Personal({ route, navigation }) {
  const [userData, setUserData] = useState({} as UserProps)
  const [firstName, setFirstName] = useState('')  
  const [lastName, setLastName] = useState('')  
  const [phoneNumber, setPhoneNumber] = useState('')    
  const [cpfNumber, setCpfNumber] = useState('')
  const [isValid, setIsValid] = useState(true)  
  const [error, setError] = useState(false)  

  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state.',
  ])

  const onUpdated = route.params.onUpdated

  useEffect(() => {
    setUserData(route.params.userData)
    setFirstName(userData.firstName)
    setLastName(userData.lastName)
    setPhoneNumber(userData.phoneNumber)    
    setCpfNumber(userData.cpf)
  }, [userData])    
  
  useEffect(() => {    
    if (cpfNumber === '' && error) {
      setError(false)
    }
  }, [cpfNumber]) 

  async function handleUpdateUserData() {                
    if (cpfNumber.length > 0 && !cpf.isValid(cpfNumber)) {
      setError(true)
      showToast("CPF inválido!", "#dc3545")
      return
    }
    
    const data = {
      ...userData,
      firstName: firstName,
      lastName: lastName,
      cpf: cpfNumber
    }    

    await AsyncStorage.mergeItem('@user', JSON.stringify(data))

    onUpdated()

    showToast('Dados atualizados', "#28a745")    
        
    navigation.goBack()
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

  const validateText = (fullName: string) => {
    const regex = /^[A-Za-z\s!@#$%^&*()_+[\]{}|;:'",.<>/?\\-]+$/
      
    if (!regex.test(fullName)) {
      setIsValid(false)
    } else {
      setIsValid(true)      
    }
  }

  function capitalizeCompoundName(name: string, provider: string) {
    const nameParts = name.split(" ")

    const capitalizedNameParts = nameParts.map(part => {
      return part.charAt(0).toUpperCase() + part.slice(1)
    })

    const finishedName = capitalizedNameParts.join(" ")    

    validateText(finishedName)

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
        title="meus dados"
      />

      <View className="px-4 flex-1 space-y-4">
       
        <View>
          <Label 
            text="Primeiro nome" 
          />

          <TextInput
            className="bg-white text-black"          
            textColor="black"
            mode="outlined"          
            value={firstName}
            onChangeText={text => capitalizeCompoundName(text, 'firstName')}
            error={!isValid || firstName === '' ? true : false}   
            activeOutlineColor={theme.colors.black80}         
          />
        </View>

        <View>
          <Label 
            text="Último nome"
          />

          <TextInput
            className="bg-white text-black"          
            textColor="black"
            mode="outlined"            
            value={lastName}
            onChangeText={text => capitalizeCompoundName(text, 'lastName')}
            error={!isValid || lastName === '' ? true : false}       
            activeOutlineColor={theme.colors.black80}     
          />
        </View>        

        <View>
          <Label 
            text="Meu número"
          />

          <TextInput
            textColor="gray"
            className="bg-white text-black"          
            mode="outlined"            
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
            disabled
            activeOutlineColor={theme.colors.black80}
          />    
        </View>    

        <View>
          <Label 
            text="CPF (opicional)"
          />

          <TextInput
            textColor="black" 
            className="bg-white text-black"          
            mode="outlined"            
            onChangeText={text => setCpfNumber(text.replace(/\D/g, ''))} 
            placeholder="12345678900"    
            placeholderTextColor={theme.colors.black40}           
            value={cpfNumber}     
            error={error ? true : false}
            maxLength={11}
            keyboardType="numeric"  
            activeOutlineColor={theme.colors.black80}                  
          />   
        </View>
      </View>

      <View className="p-4">        
        <Button 
          onPress={handleUpdateUserData}
          title="Atualizar" 
          disabled={firstName === '' || lastName === ''} 
        />
      </View>
    </Background>
  )
}