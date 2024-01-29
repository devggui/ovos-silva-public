import { useEffect, useState } from "react"
import { FlatList, Linking, Text, TouchableOpacity } from "react-native"
import { api } from "../../lib/axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AnimatedFAB } from 'react-native-paper'

import { Background } from "../../components/Background"
import { Header } from "../../components/Header"
import { NotFound } from "../../components/NotFound"

import CreateOrderSvg from "../../assets/create-order.svg"
import { Loading } from "../../components/Loading"
import { OrderCard } from "../../components/OrderCard"
import { useIsFocused } from "@react-navigation/native"
import Toast from "react-native-root-toast"

export function Orders() {  
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)  

  const isFocused = useIsFocused()

  useEffect(() => {
    getOrders()          
  }, [])

  useEffect(() => {
    if (isFocused) {
      getOrders()
    }
  }, [isFocused]) 

  async function getOrders() {
    setLoading(true)

    const response = await AsyncStorage.getItem('@user')
    const client = JSON.parse(response)        

    const clientId = client.id

    await api.get(`/clients/${clientId}/orders`)
      .then(response => response.data)
      .then(data => setOrders(data))      
      .catch(error => {
        console.log(error)
        showToast('Erro ao buscar produtos.', "#dc3545")
      })  
    
      setLoading(false)
  }

  function openWhatsApp() {    
    const phoneNumber = '+5514998937468';
    const message = 'Olá, gostaria de conversar sobre meus pedidos!'
    
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
      <Header 
        title="pedidos" 
        removeBackButton
        action={
          <TouchableOpacity
            onPress={getOrders}
          >
            <Text className="text-sm font-text500 text-yellow-500">
              Atualizar
            </Text>
          </TouchableOpacity>
        }
      />     

      {loading && <Loading />}

      {!loading && orders.length === 0 && (
        <NotFound
          image={ <CreateOrderSvg width={160} height={160} /> }
          title="Você ainda não fez pedidos..."           
        />        
      )}     

      {!loading && orders.length > 0 && (
        <FlatList                    
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          data={orders.slice().sort((a, b) => b.id - a.id)}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <OrderCard order={item} />}
        />
      )}

      <AnimatedFAB
        icon={'whatsapp'}
        label={''}
        extended={false}
        onPress={openWhatsApp}          
        animateFrom={'right'}
        iconMode={'static'}          
        className="absolute bottom-4 right-4 bg-emerald-300"
      />        
    </Background>
  )
}