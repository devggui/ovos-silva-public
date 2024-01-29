import React, { useEffect, useState } from "react"
import { 
  View, 
  Text,     
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-root-toast"
import cep from "cep-promise"

import { Button } from "../Button"
import { Background } from "../Background"
import { AddressProps } from "../../@types/address"
import { Checkbox, TextInput } from "react-native-paper"
import { Label } from "../Label"
import { theme } from "../../global/styles/theme"
import { Loading } from "../Loading"
import { api } from "../../lib/axios"

type Props = {
  data: AddressProps
  onUpdated: () => void
  onClose: () => void
}

export function AddressUpdate({ onUpdated, onClose, data }: Props) {
  const [id, setId] = useState<string | ''>(data.id)
  const [onCep, setOnCep] = useState<string | ''>(data.cep)
  const [street, setStreet] = useState<string | ''>(data.street)
  const [number, setNumber] = useState<string | ''>(data.number === 'sem número' ? '' : data.number)  
  const [complement, setComplement] = useState<string | ''>(data.complement)
  const [reference, setReference] = useState<string | ''>(data.reference)
  const [district, setDistrict] = useState<string | ''>(data.district)
  const [city, setCity] = useState<string | ''>(data.city)
  const [uf, setUf] = useState<string | ''>(data.uf)     
  const [error, setError] = useState(false)
  const [checked, setChecked] = useState(data.number === 'sem número' ? true : false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (checked) {      
      setNumber('')
    }
  }, [checked])
  
  function formatCep(cep: string) {
    const formattedCep = cep.replace(/-/g, '')
    setOnCep(formattedCep)
  }

  async function handleGetCepData() {        
    try {
      const cepData = await cep(onCep)

      setStreet(cepData.street)
      setDistrict(cepData.neighborhood)
      setCity(cepData.city)
      setUf(cepData.state)
    } catch (error) {      
      console.error(error)        
    }
  }

  async function handleUpdateAddress() {
    try {
      if (street !== '' && district !== '' && city !== '' && uf !== '') {        
        setError(false)
        
        if (number === '' && !checked) {
          setError(true)
          return
        }

        setLoading(true)        

        const newData = {
          id: data.id,
          cep: onCep ? onCep : '',
          street: street,
          number: number === '' && checked ? 'sem número' : number,
          complement: complement ? complement : '',
          reference: reference ? reference : '',
          district: district,
          city: city,
          uf: uf
        }  

        // Update in atabase
        const getUser = await AsyncStorage.getItem('@user')
        const userData = JSON.parse(getUser)
        const phoneNumber = userData.phoneNumber
        
        const client = await api.get(`/clients/${phoneNumber}`)
        
        const clientId = client.data[0].id
        const clientAddressId = client.data[0].data.address.id
                
        if (id === clientAddressId) {
          await api.put(`/clients/${clientId}`, {
            firstName: userData.firstName,
            lastName: userData.lastName,
            address: newData
          })
        }
    
        await AsyncStorage.mergeItem(`@address:${data.id}`, JSON.stringify(newData))
  
        setLoading(false)

        showToast()
  
        onUpdated()
  
        onClose()
      } else {
        setError(true)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const showToast = () => {
    Toast.show('Endereço atualizado', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      backgroundColor: "#28a745",
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
                    className="w-1/2text-black bg-white"                 
                    placeholder="12345678"  
                    placeholderTextColor={theme.colors.black40}                           
                    mode="outlined"  
                    activeOutlineColor={theme.colors.black80}   
                    keyboardType="numeric"    
                    maxLength={8}      
                    onBlur={handleGetCepData}  
                    onChangeText={cep => formatCep(cep)}   
                    value={onCep} 
                    disabled                  
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
                    error={error && number === ''}             
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
          title="Atualizar endereço" 
          onPress={handleUpdateAddress} 
          loading={loading}      
          disabled={street === '' || district === '' || city === '' || uf === ''}          
        />
      </SafeAreaView>          
    </Background>
  )
}