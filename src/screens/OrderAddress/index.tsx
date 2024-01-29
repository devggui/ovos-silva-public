import { useEffect, useState } from "react"
import { TouchableOpacity, View, Text, LogBox } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MapPinIcon } from "react-native-heroicons/solid"
import { RadioButton } from "react-native-paper"
import Toast from "react-native-root-toast"
import { useDispatch } from "react-redux"
import { utcToZonedTime } from "date-fns-tz"

import { Background } from "../../components/Background"
import { Header } from "../../components/Header"
import { Button } from "../../components/Button"
import { Separator } from "../../components/Separator"
import { ModalView } from "../../components/ModalView"
import { ChangeDeliveryTime } from "../../components/ChangeDeliveryTime"
import { HeaderCard } from "../../components/HeaderCard"

import { api } from "../../lib/axios"
import { clearCart } from "../../reducers/cart/cartReducer"
import { AddressProps } from "../../@types/address"
import { theme } from "../../global/styles/theme"

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
])

type DeliveryType = 'default' | 'scheduled' | string

const deliveryTypeData = {  
  default: {
    type: 'Padrão',
    time: 'Hoje, entre 11h e 16h',
    saturdayTime: 'Hoje, entre 08h e 14h',
    deliveryRate: 'Grátis'
  },
  scheduled: {
    type: 'Agendada',
    time: 'Escolha um horário',
    deliveryRate: 'Grátis'
  }
}

export function OrderAddress({ navigation }) {
  const [address, setAddress] = useState({} as AddressProps)      
  const [value, setValue] = useState<DeliveryType>('default')  
  const [openAddressModal, setOpenModal] = useState(false)    
  const [hourSelected, setHourSelected] = useState('')
  const [storeStatus, setStoreStatus] = useState(true)

  const currentDate = utcToZonedTime(new Date(), 'America/Sao_Paulo')
  const currentHour = currentDate.getHours()     

  const dispatch = useDispatch()      

  useEffect(() => {
    handleGetCurrentAddress()
    handleGetStoreStatus()
    
    if (currentHour < 7 || currentHour >= 16) {      
      setValue('scheduled')
    }    
  }, [])  

  async function handleGetStoreStatus() {
    await api.get('/users/XSDFppAtfSZHHGAClq5CniDLiVG3/store/26eVBKGkAIu5O1horIB3').then(response => {
      setStoreStatus(response.data.isClose)  
      
      if (response.data.isClose) {        
        setValue('scheduled')

        showToast('A loja está fechada no momento. Agende um horário para entrega.', "#dc3545")
      }
    })
  }
  
  async function handleGetCurrentAddress() {
    const response = await AsyncStorage.getItem('@currentAddress')
    const data = JSON.parse(response)        

    if (data === null) {
      return
    }

    const fullAddress = await AsyncStorage.getItem(`@address:${data.addressId}`)
    const parsedFullAddress = JSON.parse(fullAddress)    

    if (parsedFullAddress !== null) {
      setAddress(parsedFullAddress)
    }
  }
    
  function handleReplaceAddress() {
    navigation.navigate('address', {      
      addressId: address.id, 
      onSelected: handleGetCurrentAddress,         
      beforeScreen: 'orderAddress'
    })
  }  

  function handleGoToOrderReviewScreen() {        
    if (value === 'scheduled' && hourSelected === '') {
      showToast('Selecione um horário para a entrega agendada.', "#dc3545")
      handleOpenModal()
      return
    }

    if (!address.id) {      
      showToast('Selecione um endereço para a entrega.', "#dc3545")      
      handleReplaceAddress()
      return
    }        

    let data = {
      deliveryFullAddress: address,      
      deliveryData: {}
    }
    
    value === 'default' ? data.deliveryData = deliveryTypeData.default : {}
    value === 'scheduled' ? data.deliveryData = { ...deliveryTypeData.scheduled, time: hourSelected  } : {}    
   
    navigation.navigate('orderReview', data)
  }

  function handleOpenModal() {
    setValue('scheduled')
    setOpenModal(true)
  }  

  function handleHourSelected(hourValue: string) {  
    setHourSelected(hourValue)
    
    setOpenModal(false)
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

  function handleCartCleaning() {
    dispatch(clearCart())

    showClearCartToast()

    navigation.navigate('home', { action: "clear", message: "Seu carrinho está vazio." })
  }

  const showClearCartToast = () => {
    Toast.show('O carrinho está vazio', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      backgroundColor: "#dc3545",
      opacity: 1,
      textColor: "#FFF",
      containerStyle: {
        borderRadius: 100,
        paddingHorizontal: 24,
        marginTop: 24
      }      
    })
  }

  const isClosedStore = 
    currentHour >= 16 
    || currentHour < 7 
    || storeStatus 
    || (currentDate.getDay() === 6 && currentHour >= 14) 
    || currentDate.getDay() === 0

  return (
    <Background>
      <Header 
        title="entrega" 
        action={
          <TouchableOpacity
            onPress={handleCartCleaning}            
          >
            <Text className={`text-sm font-text500 text-yellow-500`}>
              Limpar
            </Text>
          </TouchableOpacity>
        }
      />

      <View className="px-4 flex-1">
        <HeaderCard 
          title="Entregar no endereço"
          onPress={handleReplaceAddress}
          onPressTitle="Trocar"
        />        
        
        <TouchableOpacity 
          className="flex-row items-center justify-start"
          onPress={handleReplaceAddress}
        >
          <View className="bg-zinc-200 p-2 rounded-full">
            <MapPinIcon size={16} color={theme.colors.gray} />
          </View>

          <View className="ml-4 flex-1">            
            <Text className="text-sm font-text500 text-black/80">              
              {!address.id ? "Selecione o endereço" : `${address.street}, ${address.number}`}              
            </Text>

            <Text className="text-xs font-text400 text-black/80">
              {!address.id ? "Nenhum endereço selecionado" : `${address.district}, ${address.city} - ${address.uf}`}
            </Text>
          </View>
        </TouchableOpacity>

        <View className="mt-10">
          <Text className="text-base text-black/80 font-title700 mb-2">
            Tipos de entrega
          </Text>

          <RadioButton.Group 
            onValueChange={newValue => setValue(newValue)} 
            value={value}
          >            
              <TouchableOpacity
                onPress={() => setValue('default')}
                disabled={isClosedStore}
              >
                <View className={`border border-zinc-200 p-4 rounded-md flex-row items-center justify-between mb-4 ${isClosedStore ? "opacity-40" : ""}`}>
                  <View>
                    <Text className="text-sm font-text500 text-black/80">
                      {deliveryTypeData.default.type}
                    </Text>

                    <Text className="text-sm font-text400 text-black/80">
                      {currentDate.getDay() === 6 ? deliveryTypeData.default.saturdayTime : deliveryTypeData.default.time}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-center">
                    <Text className="text-sm font-text500 text-emerald-500 mr-2">
                      {deliveryTypeData.default.deliveryRate}
                    </Text>

                    <RadioButton 
                      value="default"
                      uncheckedColor={theme.colors.lightGray}
                      color={theme.colors.primary}       
                      disabled={isClosedStore}               
                    />                  
                  </View>
                </View> 
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setValue('scheduled')}
              >              
                <View className="border border-zinc-200 p-4 rounded-md">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-sm font-text500 text-black/80">
                        {deliveryTypeData.scheduled.type}
                      </Text>

                      <Text className="text-sm font-text400 text-black/80">
                        {hourSelected.length === 0 ? deliveryTypeData.scheduled.time : hourSelected}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-center">
                      <Text className="text-sm font-text500 text-emerald-500 mr-2">
                        {deliveryTypeData.scheduled.deliveryRate}
                      </Text>

                      <RadioButton 
                        value="scheduled"
                        uncheckedColor={theme.colors.lightGray}
                        color={theme.colors.primary}
                      />                  
                    </View>
                  </View>

                  <Separator />

                  <TouchableOpacity
                    onPress={handleOpenModal}
                  >
                    <Text className="text-sm font-text500 text-red-500">
                      Trocar horário
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
          </RadioButton.Group>
        </View>        
      </View>

      <ModalView 
        visible={openAddressModal}
        onClose={() => setOpenModal(false)} 
      >
        <ChangeDeliveryTime 
          deliveryRate={deliveryTypeData.scheduled.deliveryRate}                    
          onSelect={handleHourSelected}                
        />     
      </ModalView>

      <View className="p-4">
        <Text className="text-xs font-text400 text-black/60 mb-2">
          As entregas são realizadas de segunda a sexta, das 11:00 até 16:00. E aos sábados das 08:30 até 14:00.
        </Text>

        <Button 
          title="Continuar"
          onPress={handleGoToOrderReviewScreen}                    
        />
      </View>
    </Background>
  )
}