import React, { useEffect, useState } from "react"
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from "react-native"
import uuid from "react-native-uuid"
import { SafeAreaView } from "react-native-safe-area-context"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-root-toast"
import cep from "cep-promise"

import { Checkbox, TextInput } from "react-native-paper"
import { Background } from "../../components/Background"
import { Button } from "../../components/Button"
import { Header } from "../../components/Header"
import { Label } from "../../components/Label"
import { theme } from "../../global/styles/theme"
import { Loading } from "../../components/Loading"
import { api } from "../../lib/axios"

export function LoginAddress({ navigation, route }) {
  const [onCep, setOnCep] = useState<string | ''>('')
  const [street, setStreet] = useState<string | ''>('')
  const [number, setNumber] = useState<string | ''>('')  
  const [complement, setComplement] = useState<string | ''>('')
  const [reference, setReference] = useState<string | ''>('')
  const [district, setDistrict] = useState<string | ''>('')
  const [city, setCity] = useState<string | ''>('')
  const [uf, setUf] = useState<string | ''>('')   
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(false)    

  useEffect(() => {    
    if (onCep.length === 8) {
      Keyboard.dismiss()

      handleGetCepData()
    }
  }, [onCep])

  useEffect(() => {
    if (checked) {      
      setNumber('')
    }
  }, [checked])

  async function handleGetCepData() {    
    try {
      setLoading(true)                  

      const cepData = await cep(onCep)              

      setStreet(cepData.street)
      setDistrict(cepData.neighborhood)
      setCity(cepData.city)
      setUf(cepData.state)
    } catch (error) {      
      showToast('CEP Inválido', "#dc3545")               
      console.error(error)        
    }

    setLoading(false)
  }

  async function handleCreateAddress() {
    try {               
      if (street !== '' && district !== '' && city !== '' && uf !== '') {        

        const addressId = uuid.v4()
        
        if (number === '' && !checked) {
          showToast('Informe um número, ou marque a opção "Sem número"', "#dc3545")               
          return
        }

        setLoading(true)

        const addressData = {
          id: addressId,
          cep: onCep ? onCep : '',
          street: street,
          number: number === '' && checked ? 'sem número' : number,
          complement: complement ? complement : '',
          reference: reference ? reference : '',
          district: district,
          city: city,
          uf: uf
        }

        const streetAndNumber = `${addressData.street}, ${addressData.number}`           

        const currentAddressData = {
          addressId: addressData.id,
          addressName: streetAndNumber
        }

        const userId = uuid.v4()

        const userData = {
          id: userId,
          phoneNumber: route.params.phoneNumber,       
          firstName: route.params.firstName,
          lastName: route.params.lastName,
          address: addressData,
        }                

        const response = await api.post('/clients', userData)    

        const userKey = await AsyncStorage.getItem('@user') 
        
        if (userKey === null && response.data.clientId) {
          await AsyncStorage.setItem('@user', JSON.stringify({ ...userData, id: response.data.clientId }))
        } 

        await AsyncStorage.setItem(`@address:${addressId}`, JSON.stringify(addressData))
        await AsyncStorage.setItem('@currentAddress', JSON.stringify(currentAddressData))         

        setLoading(false)

        navigation.navigate('tab')
      }      
    } catch (error) {
      console.log(error)
    }
  }

  function formatCep(cep: string) {
    const formattedCep = cep.replace(/-/g, '')
    setOnCep(formattedCep)
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
      <Header 
        title="Endereço" 
      />      
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >        
        <View className="p-4">
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>            
            <View className="space-y-4">
              <Text className="text-xl text-black/80 font-text500">
                Onde você quer receber seu pedido?              
              </Text> 
              
              <View>
                <Label 
                  text="CEP (opicional)"
                />

                <View className="flex-row items-center">
                  <TextInput
                    textColor="black"  
                    className="w-1/2 text-black bg-white"                 
                    placeholder="12345678"  
                    placeholderTextColor={theme.colors.black40}                           
                    mode="outlined"  
                    activeOutlineColor={theme.colors.black80}   
                    keyboardType="numeric"    
                    maxLength={8}      
                    onBlur={handleGetCepData}  
                    onChangeText={cep => formatCep(cep)}   
                    value={onCep}                   
                  /> 

                  {loading && <Loading />}                               
                </View>
              </View>

              <View>
                <Label 
                  text="Nome da rua"
                />

                <TextInput
                  textColor="black" 
                  className="text-black bg-white"
                  placeholder="Avenida Nações Unidas"  
                  placeholderTextColor={theme.colors.black40}                           
                  mode="outlined"                                        
                  onChangeText={street => setStreet(street)}
                  value={street}                  
                  activeOutlineColor={theme.colors.black80}  
                />
              </View>

              <View className="flex-row items-center space-x-4">
                <View className="w-1/3">
                  <Label 
                    text="Nº"
                  />
                  
                  <TextInput
                    textColor="black"          
                    className="text-black bg-white"           
                    placeholder={checked ? "" : "123"}    
                    placeholderTextColor={theme.colors.black40}                           
                    mode="outlined"                                          
                    onChangeText={number => setNumber(number)}
                    value={number}   
                    disabled={checked}                 
                    activeOutlineColor={theme.colors.black80}
                  /> 
                </View>

                <View className="flex-row items-center text-center">
                  <Checkbox
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked(!checked);
                    }}
                  />

                  <Text className="text-sm font-text400 text-black/80">
                    Sem número
                  </Text>
                </View>
              </View>
              
              <View>
                <Label
                  text="Complemento (opicional)"
                />

                <TextInput
                  textColor="black"
                  className="text-black bg-white"
                  placeholder="Casa, sobrado, ..." 
                  placeholderTextColor={theme.colors.black40}           
                  mode="outlined"                                  
                  onChangeText={complement => setComplement(complement)}
                  value={complement}    
                  activeOutlineColor={theme.colors.black80}            
                />
              </View>
              
              <View>
                <Label
                  text="Referência (opicional)"
                />

                <TextInput
                  textColor="black" 
                  className="text-black bg-white"
                  placeholder="Ao lado da padaria, ..." 
                  placeholderTextColor={theme.colors.black40}           
                  mode="outlined"                                  
                  onChangeText={reference => setReference(reference)}
                  value={reference}   
                  activeOutlineColor={theme.colors.black80}             
                />
              </View>
              
              <View>
                <Label
                  text="Bairro"
                />

                <TextInput
                  textColor="black" 
                  className="text-black bg-white"                 
                  placeholder="Centro" 
                  placeholderTextColor={theme.colors.black40}           
                  mode="outlined"
                  onChangeText={district => setDistrict(district)}
                  value={district}
                  activeOutlineColor={theme.colors.black80}                
                />              
              </View>

              <View className="flex-row w-full space-x-4">                
                <View className="flex-1">
                  <Label 
                    text="Cidade"
                  />

                  <TextInput
                    textColor="black"    
                    className="text-black bg-white"                 
                    placeholder="Bauru" 
                    placeholderTextColor={theme.colors.black40}           
                    mode="outlined"                    
                    onChangeText={city => setCity(city)}
                    value={city}    
                    activeOutlineColor={theme.colors.black80}                                  
                  />                
                </View>
                
                <View>
                  <Label 
                    text="UF"
                  />

                  <TextInput
                    textColor="black" 
                    className="text-black bg-white"
                    placeholder="SP" 
                    placeholderTextColor={theme.colors.black40}           
                    mode="outlined"                    
                    onChangeText={uf => setUf(uf.toUpperCase())}
                    value={uf}                  
                    maxLength={2}
                    activeOutlineColor={theme.colors.black80}
                  />                
                </View>
              </View>
            </View>
          </ScrollView>
        </View>                
      </KeyboardAvoidingView>

      <SafeAreaView className="p-4">
        <Button 
          title="Salvar endereço" 
          onPress={handleCreateAddress}   
          loading={loading}      
          disabled={street === '' || district === '' || city === '' || uf === ''} 
        />        
      </SafeAreaView>                           
    </Background>
  )
}