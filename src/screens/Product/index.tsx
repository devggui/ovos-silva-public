import React, { useEffect, useState } from "react"
import { 
  View, 
  Text, 
  ImageBackground, 
  TouchableOpacity, 
  StatusBar,   
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native"
import { TextInput } from "react-native-paper"
import { ChatBubbleBottomCenterTextIcon, MinusIcon, PlusIcon } from "react-native-heroicons/solid"
import { useDispatch } from "react-redux"
import { addToCart } from "../../reducers/cart/cartReducer"

import { theme } from "../../global/styles/theme"

import { ButtonBack } from "../../components/ButtonBack"
import { Separator } from "../../components/Separator"
import Toast from "react-native-root-toast"

export function Product({ route, navigation }) {    
  const [quantity, setQuantity] = useState<number>(1)
  const [observation, setObservation] = useState<string | ''>('')
  const [total, setTotal] = useState<string | ''>('')    

  const { ...product } = route.params  

  const dispatch = useDispatch()  

  function handleCalculateTotal() {
    const initialPrice = product.promotionalPrice 
      ? parseFloat(product.promotionalPrice.replace(',', '.')) 
      : parseFloat(product.price.replace(',', '.'))
        
    const calc = initialPrice * quantity
    
    const formattedTotal = calc.toFixed(2).replace('.', ',')
    
    setTotal(formattedTotal)
  }

  useEffect(() => {      
    handleCalculateTotal()    
  }, [quantity])

  const incrementQuantity = () => {
    if (quantity < 20) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  function handleAddToCart() {      
    const data = {
      id: product.id,
      name: product.name,
      price: product.promotionalPrice ? product.promotionalPrice : product.price,
      quantity: quantity,
      observation: observation,
      image: product.imageUrl   
    }
    
    dispatch(addToCart(data))    

    showToast('Adicionado ao carrinho', "#28a745")

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >      
      <View className="flex-col w-full h-full justify-between">
        <StatusBar 
          barStyle="light-content"
          backgroundColor="transparent"  
          translucent      
        />            

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="space-y-4">        
            <ImageBackground 
              source={{ uri: product.imageUrl }}
              className="w-full h-80"              
            >
              <View>
                <ButtonBack hasBackground />
              </View>
            </ImageBackground>

            <View className="space-y-6">
              <Text className="text-black/80 text-2xl font-bold tracking-widest px-4">{product.name}</Text>

              <View className="px-4">
                <Text className="text-black/60 text-lg font-text500 pb-2">{product.description}</Text>
                <Text className="font-text400 font-bold text-sm">{product.volume}</Text>
              </View>

              <View className="px-4 flex-row items-center">
                <Text className={`mr-4 text-xl font-text500 text-green-500 ${product.promotionalPrice ? "block" : "hidden"}`}>R$ {product.promotionalPrice}</Text>
                <Text className={`text-xl font-text500 ${product.promotionalPrice ? "text-black/20 line-through" : "text-black/80"}`}>R$ {product.price}</Text> 
              </View>

              <Separator />
            
              <View className="px-4 mb-24">
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
                  placeholder="Digite aqui..."
                  placeholderTextColor={theme.colors.black40}           
                  onChangeText={observation => setObservation(observation)}
                  value={observation}
                  maxLength={140}
                  activeOutlineColor={theme.colors.black80}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="flex-row w-full items-center justify-between p-4 border-t border-t-zinc-200">
          <View className="flex-row justify-between flex-1 px-3">
            <TouchableOpacity onPress={decrementQuantity}>
              <MinusIcon size={24} color={quantity === 1 ? theme.colors.lightGray : theme.colors.primary} />
            </TouchableOpacity>
            
            <Text className="text-sm font-text400 text-black/80">{quantity}</Text>

            <TouchableOpacity onPress={incrementQuantity}>
              <PlusIcon size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={handleAddToCart}
            className="flex-row items-center justify-between p-3 w-2/3 rounded-md bg-[#facf28]"
          >
            <Text className="text-black text-sm font-bold tracking-wide">Adicionar</Text>

            <Text className="text-black text-sm font-bold tracking-wide">R$ {total}</Text>
          </TouchableOpacity>
        </View>
      </View>      
    </KeyboardAvoidingView>
  )
}