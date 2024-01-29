import { View, Text, Image, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { PhotoIcon } from 'react-native-heroicons/solid'
import { theme } from "../../global/styles/theme";
import { ProductProps } from '../../@types/product';
import { Loading } from "../Loading";
import Toast from "react-native-root-toast";

type Props = TouchableOpacityProps & {
  product: ProductProps
}

export function ProductCard({ product }: Props) {  
  const navigation = useNavigation<any>()  
  
  function handleNavigateToProduct() {
    if (!product.active) {
      showToast('Produto indísponível.', "#dc3545")
  
      return
    }
    
    navigation.navigate('product', { ...product })
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
      <TouchableOpacity 
        onPress={handleNavigateToProduct}  
        className="flex-col items-start justify-start text-left ml-4 max-w-[160px] h-auto"
      >        
        {!product && (
          <View className="w-40 h-40 bg-gray-200 rounded-md items-center justify-center">
            <PhotoIcon size={30} color={theme.colors.primary} />
          </View>
        )}
        
        {!product.imageUrl && (
          <View className="w-40 h-40">
            <Loading />
          </View>
        )}

        {!product.active && (
          <View className="w-40 h-40 bg-gray-200 rounded-md items-center justify-center">
            <Text className="text-xs font-text400 text-black/60">
              Indísponível
            </Text>
          </View>
        )}

        {product.imageUrl && product.active && <Image source={{ uri: product.imageUrl }} className="w-40 h-40 rounded-md" />}

        <View className="items-start w-full max-w-[160px] mt-2">
          <Text className={`text-lg font-title700 text-green-500 ${product.promotionalPrice ? "block" : "hidden"}`}>R$ {product.promotionalPrice}</Text>                         
          <Text className={`text-lg font-title700 text-black/80 ${product.promotionalPrice ? "line-through text-black/20" : ""}`}>R$ {product.price}</Text>
        </View>

        <Text className="text-sm font-text500 text-black/80">{product.name}</Text>
        {product.categoryId === 'PR45EFuKdsbE2Ipe59Cz' && <Text className="text-sm font-text500 text-black/80">30 unidades</Text>}


      </TouchableOpacity>    
  )
}