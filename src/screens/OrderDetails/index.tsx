import { View, Text, TouchableOpacity, ScrollView, Pressable } from "react-native"
import { Background } from "../../components/Background"
import { Header } from "../../components/Header"
import { format, utcToZonedTime } from "date-fns-tz"
import { OrderStatusCard } from "../../components/OrderStatusCard"
import { ProductOrderCard } from "../../components/ProductOrderCard"
import { SummaryOfValues } from "../../components/SummaryOfValues"
import { SummaryOfPayment } from "../../components/SummaryOfPayment"
import { SummaryOfAddress } from "../../components/SummaryOfDelivery"
import { addToCart } from "../../reducers/cart/cartReducer"
import Toast from "react-native-root-toast"
import { useDispatch } from "react-redux"
import { useState } from "react"
import { Loading } from "../../components/Loading"
import { api } from "../../lib/axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Button, Dialog, Portal, Text as DialogText } from "react-native-paper"
import { SummaryOfObservations } from "../../components/SummaryOfObservations"

export function OrderDetails({ navigation, route }) {
  const [loading, setLoading] = useState<boolean>()
  const [visible, setVisible] = useState(false)

  const showDialog = () => setVisible(true)

  const hideDialog = () => setVisible(false)

  const { ...order } = route.params  

  const dispatch = useDispatch()    

  const timestampData = {
    "nanoseconds": order.createdAt.nanoseconds,
    "seconds": order.createdAt.seconds
  }
  
  const milliseconds = (timestampData.seconds * 1000) + (timestampData.nanoseconds / 1000000);
  const date = utcToZonedTime(new Date(milliseconds), 'America/Sao_Paulo')  
  const orderDate = format(date, 'dd/MM/yyyy')    
  const orderHour = format(date, 'HH:mm')      

  async function handleAddToCart() {
    setLoading(true)

    await order.items.map(item => {      
      const data = {
        id: item.id,
        name: item.name,
        price: item.promotionalPrice ? item.promotionalPrice : item.price,
        quantity: item.quantity,
        observation: item.observation,
        image: item.image   
      }
      
      dispatch(addToCart(data))    
    })

    setTimeout(() => {
      setLoading(false)
  
      showToast('Adicionado ao carrinho', "#28a745")
  
      navigation.goBack()
    }, 1000)
  }  

  async function handleCancelOrder() { 
    setLoading(true)
    
    const response = await AsyncStorage.getItem('@user')
    const user = JSON.parse(response)            

    const clientId = user.id
    const orderId = order.id    

    await api.put(`/clients/${clientId}/orders/${orderId}`, { paymentStatus: 'canceled', status: 'canceled' })

    setLoading(false)

    showToast("Pedido cancelado!", "#dc3545")    

    hideDialog()

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

  return (
    <Background>
      <Header 
        title="detalhes do pedido"
      />

      <ScrollView 
        className="px-4 space-y-6"
        showsVerticalScrollIndicator={false}         
      >
        <View className="space-y-1">
          <Text className="text-sm font-text500 text-black/80 font-bold">
            Pedido Nº {order.id}
          </Text>

          <Text className="text-sm font-text400 text-black/80">
            Realizado em {orderDate} ás {orderHour}
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('home')}
          >
            <Text className="text-sm font-text500 text-red-500 font-bold">
              Ver produtos
            </Text>
          </TouchableOpacity>
        </View>

        <View className="bg-zinc-200 rounded-md items-center justify-center text-center w-full h-10 mb-4">
          <OrderStatusCard status={order.status} />
        </View>
        
        <View>
          {order.items.map(item => (              
            <ProductOrderCard 
              key={item.id}  
              item={item}
              removeQuantityComponent  
              showOnlyQuantity           
            />                        
          ))}
        </View>
        
        <View>
          <SummaryOfValues 
            subTotal={order.paymentValues.subTotal} 
            rate={order.paymentValues.deliveryRate} 
            total={order.paymentValues.total} 
          />
        </View>

        <View>         
          <SummaryOfPayment 
            payment={order.paymentMethod} 
          />
        </View>

        <View>
          <SummaryOfAddress 
            street={order.deliveryAddress.street} 
            number={order.deliveryAddress.number} 
            district={order.deliveryAddress.district} 
            time={order.deliveryDetails.time}
          />
        </View>  

        <View className={(order.status === 'success' || order.status === 'canceled') ? 'mb-24' : ''}>
          {order.observation && <SummaryOfObservations observation={order.observation} />}          
        </View>      

        {order.status === 'success' && (
          <View className="border-t border-t-zinc-200 py-4 mt-4 mb-8">
            <TouchableOpacity onPress={handleAddToCart}>
              {loading ? (
                <Loading />
              ) : (
                <Text className="text-sm font-text500 text-center text-red-500">
                  Pedir novamente
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {order.status === 'created' && (                    
          <View className="border-t border-t-zinc-200 py-4 mt-4 mb-8">
            <TouchableOpacity onPress={showDialog}>
              <Text className="text-sm font-text500 text-center text-red-500">
                Cancelar
              </Text>
            </TouchableOpacity>

            <Portal>
              <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>Atenção</Dialog.Title>
                <Dialog.Content>
                  <DialogText variant="bodyMedium">Tem certeza que deseja cancelar o pedido? Essa ação não poderá ser desfeita!</DialogText>
                </Dialog.Content>
                <Dialog.Actions>            
                  {loading && <Loading />}

                  {!loading && (
                    <>                
                      <Button onPress={hideDialog}>Não</Button>
                      <Button onPress={handleCancelOrder} textColor="red">Cancelar</Button>
                    </>
                  )}
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </View>          
        )}
      </ScrollView>

    </Background>
  )
}
