import { View, Image, Text } from "react-native"
import { ToggleQuantity } from "../ToggleQuantity"
import { CartItem } from "../../reducers/cart/types"

type Props = {
  item: CartItem
  removeQuantityComponent?: boolean
  showOnlyQuantity?: boolean
}

export function ProductOrderCard({ item, removeQuantityComponent, showOnlyQuantity }: Props) {  
  return (
    <View className="flex-row justify-between mb-10">
      <View className="flex-row flex-1">
        <Image 
          source={{ uri: item.image }}
          className="w-16 h-16 rounded-md"
        />

        <View className="ml-4 flex-1">
          <Text className="text-sm font-text500 text-black/80 mb-2">
            {item.name}
          </Text>

          {item.observation ? (
            <Text className="text-sm font-text400 text-black/80 mb-2 pr-2">
              {item.observation}
            </Text>
          ) : <></>}

          <Text className="text-sm font-text500 font-bold text-black/80">
            R$ {item.price}
          </Text>
        </View>
      </View>

      {!removeQuantityComponent && (
        <View className="self-end">
          <ToggleQuantity
            itemId={item.id}          
            quantity={item.quantity}
          />
        </View>
      )}

      {showOnlyQuantity && (
        <View className="self-end">
          <Text className="text-sm font-text500 font-bold text-black/80">
            x{item.quantity}
          </Text>
        </View>
      )}
    </View>
  )
}