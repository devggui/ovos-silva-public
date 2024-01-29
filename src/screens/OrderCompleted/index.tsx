import { View, Text } from "react-native"
import LottieView from "lottie-react-native"

import { Button } from "../../components/Button"
import { Background } from "../../components/Background"

import { useEffect, useRef } from "react"
import { Header } from "../../components/Header"
import { useDispatch } from "react-redux"
import { clearCart } from "../../reducers/cart/cartReducer"

export function OrderCompleted({ navigation }) {
  const animation = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {    
    animation.current?.play()       
  }, [])  

  async function handleFinishOrder() {
    dispatch(clearCart())
    
    navigation.navigate('orders')
  }

  return (
    <Background>
      <Header 
        title="finalizado" 
        removeBackButton 
      />

      <View className="flex-1 items-center justify-center">
        <LottieView
          autoPlay
          loop={false}
          ref={animation}
          style={{
            width: 200,
            height: 200,            
          }}          
          source={require('../../assets/success-animation.json')}
        />

        <Text className="text-2xl font-text500 text-emerald-600 text-center max-w-sm">
          Seu pedido foi realizado com sucesso!!!
        </Text>
      </View>

      <View className="p-4">
        <Button 
          onPress={handleFinishOrder} 
          title="Ir para meus pedidos" 
        />
      </View>
    </Background>
  )
}