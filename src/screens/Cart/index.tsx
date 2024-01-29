import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { selectCartItems } from "../../reducers/cart/cartReducer"
import Toast from "react-native-root-toast"
import { clearCart, selectTotalPrice } from "../../reducers/cart/cartReducer"

import { Header } from "../../components/Header"
import { Background } from "../../components/Background"
import { NotFound } from "../../components/NotFound"
import { ProductOrderCard } from "../../components/ProductOrderCard"
import { Button } from "../../components/Button"

import EmptyCartSvg from "../../assets/empty-cart.svg"

export function Cart({ navigation }) {
  const dispatch = useDispatch()  
  const cartItems = useSelector(selectCartItems)    
  const totalPrice = useSelector(selectTotalPrice)  

  const restain = 20 - totalPrice  

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

  return (
    <Background>
      <Header 
        title="Carrinho" 
        action={
          <TouchableOpacity
            onPress={handleCartCleaning}
            disabled={cartItems.length === 0}
          >
            <Text className={`text-sm font-text500 text-yellow-500 ${cartItems.length === 0 ? "hidden" : ""}`}>
              Limpar
            </Text>
          </TouchableOpacity>
        }
        removeBackButton
      />

      <View className={`flex-1 ${cartItems.length === 0 ? "flex-row items-center" : ""}`}>
        <ScrollView>
          {cartItems.length === 0 && (          
            <NotFound   
              image={ <EmptyCartSvg width={160} height={160} /> }
              title="Seu carrinho está vazio..."              
            />                            
          )}
          
          <View className="px-4">
            {cartItems.map(item => (              
              <ProductOrderCard 
                key={item.id}  
                item={item}              
              />                        
            ))}
          </View>
          
          {totalPrice < 20 && cartItems.length > 0 && (
            <View className="mx-4 bg-zinc-200 rounded-md items-center justify-center p-4">
              <Text className="text-sm font-text500 text-black/80 text-center font-bold">
                O valor mínimo para o pedido é de R$ 20,00.
              </Text>

              <Text className="text-sm font-text500 text-black/80 text-center font-bold mt-1">
                Restam R$ {restain.toFixed(2).replace('.', ',')} para completar o valor.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {cartItems.length > 0 && (
        <View className="p-4 border-t border-t-zinc-200">
          <View className="flex-row justify-between pb-6">
            <Text>
              Total
            </Text>
            
            <Text>
              R$ {totalPrice.toFixed(2).replace('.', ',')}
            </Text>
          </View>

          <Button 
            onPress={() => navigation.push('orderAddress')}
            title="Continuar"
            disabled={totalPrice < 20}           
          />
        </View>
      )}
    </Background>
  );
}