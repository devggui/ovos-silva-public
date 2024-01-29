import { View, Text, TouchableOpacity } from "react-native"
import { ShoppingCartIcon } from "react-native-heroicons/outline"
import { countItems } from "../../reducers/cart/cartReducer"
import { useSelector } from "react-redux"

import { theme } from "../../global/styles/theme"

import { HeaderCard } from "../HeaderCard"

export function SummaryOfItems({ navigation }) {
  const getCountItems = useSelector(countItems)  

  function handleAddMoreItems() {
    navigation.navigate('tab')
  }
  
  return (
    <View>
      <HeaderCard 
        title="Itens"            
      />

      <View className="flex-row items-center justify-start">      
        <View className="bg-zinc-200 p-2 rounded-full">
          <ShoppingCartIcon size={16} color={theme.colors.gray} />
        </View>

        <View className="ml-4 flex-1">
          <View className="flex-row items-center justify-between text-center">
            <Text className="text-sm font-text500 text-black/60">
              Quantidade de itens no carrinho
            </Text>

            <Text className="text-sm font-text500 text-black/60">
              {getCountItems}
            </Text>
          </View>

          <TouchableOpacity 
            onPress={handleAddMoreItems}
          >              
            <Text className="text-sm font-text500 text-yellow-500">
              Adicionar mais itens
            </Text>
          </TouchableOpacity>        
        </View>
      </View>
    </View>
  )
}