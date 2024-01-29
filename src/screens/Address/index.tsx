import React, { useEffect, useState } from "react"
import { 
  View, 
  Text,      
  ScrollView,
  LogBox,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Button as AlertButton, Dialog, Portal, Text as AlertText } from "react-native-paper"

import { AddressCard } from '../../components/AddressCard'
import { Button } from '../../components/Button'
import { Header } from "../../components/Header"

import { AddressProps } from "../../@types/address"
import { ModalView } from "../../components/ModalView"
import { AddressCreate } from "../../components/AddressCreate"

import DeliveryAccessSvg from "../../assets/delivery-access.svg"
import Toast from "react-native-root-toast"

export function Address({ route, navigation }) {  
  const [openAddressModal, setOpenAddressModal] = useState(false)    
  const [adresses, setAdresses] = useState([])    
  const [visible, setVisible] = useState(false)

  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state.',
  ])

  const showDialog = () => setVisible(true)

  const hideDialog = () => setVisible(false)

  const onSelected = route.params.onSelected  

  useEffect(() => {
    if (!openAddressModal) {
      getAdresses()
    }
  }, [openAddressModal])

  async function handleOpenAddressModal() {
    const allKeys = await AsyncStorage.getAllKeys()
    const addressKeys = allKeys.filter((key) => key.startsWith('@address:'))                
    
    if (addressKeys.length >= 5) {
      showToast("Você só pode adicionar apenas 5 endereços.", "#dc3545")

      return
    }

    setOpenAddressModal(true)
  }

  function handleOnCreated() {
    setOpenAddressModal(false)
  }  

  async function handleAddressSelect(addressSelected: AddressProps) {
    const streetAndNumber = `${addressSelected.street}, ${addressSelected.number}`           

    const data = {
      addressId: addressSelected.id,
      addressName: streetAndNumber
    }

    const currentAddress = await AsyncStorage.getItem('@currentAddress')

    if (currentAddress !== null) {
      await AsyncStorage.mergeItem('@currentAddress', JSON.stringify(data)) 
    } else {
      await AsyncStorage.setItem('@currentAddress', JSON.stringify(data)) 
    }

    const onSelected = route.params.onSelected  

    onSelected()
    
    navigation.goBack()
  }

  const getAdresses = async () => {
    try {            
      const allKeys = await AsyncStorage.getAllKeys()          

      const addressKeys = allKeys.filter((key) => key.startsWith('@address:'))            

      if (addressKeys == null) {
        return
      }

      const addressData = await AsyncStorage.multiGet(addressKeys)
      
      const addresses = addressData.map(([key, value]) => {      
        return JSON.parse(value)
      })
      
      setAdresses(addresses)
    } catch (error) {
      console.log(error)
    }    
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
    <View className="flex-1 items-center">                
      <Header 
        title="Endereço" 
      />      

      {adresses.length === 0 && (
        <>
          <DeliveryAccessSvg width={160} height={160} />      

          <Text className="text-lg tracking-widest w-48 text-center my-4">
            Onde você quer receber seu pedido?
          </Text>      
        </>
      )}
      
      <ScrollView 
        className="flex-1 w-full px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 24
        }}
      >
        {adresses.map(address => (
          <AddressCard 
            key={address.id}
            data={address} 
            checked={address.id === route.params.addressId}
            onPress={() => handleAddressSelect(address)}
            onUpdated={getAdresses}
            onDelete={getAdresses}
            onSelected={onSelected}
          />
        ))}
      </ScrollView>

      <View className="p-4">
        <Text className="text-sm font-text400 text-black/60 mb-2">
          Clique no endereço desejado para utiliza-lo.
        </Text>

        <Button 
          title="Adicionar novo endereço" 
          onPress={handleOpenAddressModal} 
        />
      
        <ModalView 
          visible={openAddressModal}
          onClose={() => setOpenAddressModal(false)} 
        >
          <AddressCreate 
            onCreated={handleOnCreated} 
            onShowAlert={showDialog}            
          />         
        </ModalView>
      </View> 

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Atenção</Dialog.Title>
          <Dialog.Content>
            <AlertText variant="bodyMedium">No momento estamos atendendo somente a cidade de <Text className="font-bold">Bauru - SP</Text>. Mas você pode continuar utilizando nosso aplicativo normalmente, porém, não conseguirá finalizar o pedido!</AlertText>
          </Dialog.Content>
          <Dialog.Actions>            
            <AlertButton onPress={hideDialog}>Ok</AlertButton>            
          </Dialog.Actions>
        </Dialog>
      </Portal>                       
    </View>          
  )
}