import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from "react-native"
import { CreditCardIcon } from "react-native-heroicons/outline"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ChatBubbleBottomCenterTextIcon } from "react-native-heroicons/solid"
import { useDispatch, useSelector } from "react-redux"
import { clearCart } from "../../reducers/cart/cartReducer"
import { selectTotalPrice, selectCartItems } from "../../reducers/cart/cartReducer"
import NetInfo from '@react-native-community/netinfo'

import { Background } from "../../components/Background"
import { Header } from "../../components/Header"
import { SummaryOfValues } from "../../components/SummaryOfValues"
import { Button } from "../../components/Button"
import { HeaderCard } from "../../components/HeaderCard"
import { SummaryOfItems } from "../../components/SummaryOfItems"

import { theme } from "../../global/styles/theme"

import Toast from "react-native-root-toast"
import { TextInput } from "react-native-paper"
import { Separator } from "../../components/Separator"
import { admin, api } from "../../lib/axios"
import { SummaryOfPayment } from "../../components/SummaryOfPayment"
import { SummaryOfAddress } from "../../components/SummaryOfDelivery"
import axios from "axios"

export function OrderReview({ navigation, route }) {
  const [payment, setPayment] = useState('')      
  const [observation, setObservation] = useState('')
  const [loading, setLoading] = useState(false)
  const [clientId, setClientId] = useState('')
  const [clientName, setClientName] = useState('')
  const [isConnected, setIsConnected] = useState<boolean>()  

  const subTotal = useSelector(selectTotalPrice)  
  const rate = route.params.deliveryData.deliveryRate
  const total = rate === "Grátis" ? subTotal : subTotal + parseFloat(rate)  

  const dispatch = useDispatch()  
  const cartItems = useSelector(selectCartItems)          

  useEffect(() => {
    getPaymentMethodOfStorage()    

    getClientId()

    NetInfo.addEventListener(state => {      
      setIsConnected(state.isConnected)
    })
  }, [])

  async function getClientId() {
    const response = await AsyncStorage.getItem('@user')
    const user = JSON.parse(response)        

    const userFullName = `${user.firstName} ${user.lastName}`

    setClientName(userFullName)
    setClientId(user.id)
  }

  async function getPaymentMethodOfStorage() {
    const currentPaymenyMethod = await AsyncStorage.getItem('@paymentMethod')    

    if (currentPaymenyMethod === null) {
      return
    } 

    if (currentPaymenyMethod !== null) {
      setPayment(JSON.parse(currentPaymenyMethod))
    }
  }

  async function getCurrentPaymentMethod(method: string) {        
    setPayment(method)
  }

  function handleSelectedPayment() {    
    navigation.navigate('payment', { onSelected: getCurrentPaymentMethod })
  }

  async function handleFinalizeOrder() {            
    if (payment === '') {
      showToast('Selecione uma forma de pagamento.', "#dc3545")
      
      handleSelectedPayment()
      
      return
    }
    
    if (route.params.deliveryFullAddress.city.toLowerCase() !== 'bauru' || route.params.deliveryFullAddress.uf.toLowerCase() !== 'sp') {
      showToast('No momento só estamos entregando na cidade de Bauru - SP', "#dc3545")

      return
    }    
    
    if (!isConnected) {
      showToast('Sem conexão com a internet.', "#dc3545")

      return
    }    

    const order = {
      items: cartItems,
      deliveryAddress: route.params.deliveryFullAddress,
      deliveryDetails: route.params.deliveryData,
      paymentMethod: payment,
      paymentValues: {
        subTotal: subTotal,
        deliveryRate: rate,
        total: total
      },
      observation: observation,
      status: 'created',
      paymentStatus: payment === 'Pix' ? 'pending' : 'delivery payment'
    }        

    setLoading(true)                          
    
    // Diable push notifications in Public Mode
    const publicMode = "isPublic"

    if (publicMode !== 'isPublic') {
      await api.post(`/clients/${clientId}/orders`, order)
        .then(async response => {
  
          // Send notification to Ovos Silva para Administrador app                        
          try {
            const tokens = await admin.get('/pushTokens')                    
  
            tokens.data.map(async token => {
              const pushToken = await axios.post(
                'https://exp.host/--/api/v2/push/send',
                {
                  to: token.data,
                  title: "Você tem um novo pedido! 🥚",
                  body: "Clique aqui para visualizar",
                },
                {
                  headers: {
                    'Content-Type': 'application/json',                
                  },
                }
              )
          
              console.log('Notification sent:', pushToken.data);
            })  
            
          } catch (error) {
            console.error('Error sending notification:', error);
          }
        
          setLoading(false)                      
        })
        .catch(error => {
          console.log(error)
          showToast('Algo deu errado na conexão com o servidor.', "#dc3545")
          setLoading(false)   
        })
    }


      navigation.navigate('orderCompleted')
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

    showToast('O carrinho está vazio', "#dc3545")

    navigation.navigate('home', { action: "clear", message: "Seu carrinho está vazio." })
  }

  return (
    <Background>
      <Header 
        title="revisão"
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView showsVerticalScrollIndicator={false}>          
          <View className="flex-1 px-4">
            <View className="mb-6">
              <SummaryOfItems navigation={navigation} />
            </View>

            <View className="mb-6">
              <SummaryOfValues 
                subTotal={subTotal}
                rate={rate}
                total={total}
              />
            </View>

            <View className="mb-6">
              <TouchableOpacity
                onPress={handleSelectedPayment}
              >
                {payment === '' && (
                  <View>            
                    <HeaderCard 
                      title="Pagamento"
                      onPress={handleSelectedPayment}
                      onPressTitle={payment === '' ? "Escolher" : "Trocar"}
                    />
                    
                    <View className="flex-row items-center justify-start">
                      <View className="bg-zinc-200 p-2 rounded-full">
                        {payment === '' && <CreditCardIcon size={16} color={theme.colors.gray} />}                  
                      </View>
                      
                      <View className="ml-4 flex-1">            
                        <Text className="text-sm font-text500 font-bold text-black/80">              
                          Forma de pagamento
                        </Text>

                        <Text className="text-xs font-text400 text-black/80">
                          Escolha uma opção
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {payment !== '' && (
                  <SummaryOfPayment 
                    payment={payment} 
                    onPress={handleSelectedPayment}
                  /> 
                )}            
              </TouchableOpacity>
            </View>

            <SummaryOfAddress 
              street={route.params.deliveryFullAddress.street} 
              number={route.params.deliveryFullAddress.number} 
              district={`${route.params.deliveryFullAddress.district}, ${route.params.deliveryFullAddress.city} - ${route.params.deliveryFullAddress.uf}`} 
              time={route.params.deliveryData.time}              
            />

            <Separator />

            <View className="mb-24">
              <View className="flex-row justify-between">
                <View className="flex-row">
                  <ChatBubbleBottomCenterTextIcon 
                    size={24}
                    color={theme.colors.gray}
                  />

                  <Text className="text-sm text-black/80 font-text500 ml-4">
                    Alguma observação?
                  </Text>
                </View>

                <Text className="text-sm text-black/80 font-text400">
                  {observation.length}/140
                </Text>
              </View>

              <TextInput
                textColor="black" 
                mode="outlined"  
                className="mt-2 text-black bg-white"                
                placeholder="Troco para 50 reais, ..."
                placeholderTextColor={theme.colors.black40}           
                onChangeText={observation => setObservation(observation)}
                value={observation}
                maxLength={140}     
                activeOutlineColor={theme.colors.black80}           
              />
            </View>
          </View>

        </ScrollView>

        <View className="p-4">
          <Button 
            onPress={handleFinalizeOrder}
            title={payment === 'Pix' ? "Seguir para pagamento" : "Finalizar pedido"}     
            loading={loading}    
            disabled={loading}
          />
        </View>
      </KeyboardAvoidingView>
      
    </Background>
  )
}