import { useEffect, useState } from "react"
import { TouchableOpacity, View, Text } from "react-native"
import { MinusIcon, PlusIcon, TrashIcon } from "react-native-heroicons/solid"
import { useDispatch } from "react-redux"
import { incrementQuantity, decrementQuantity, removeFromCart } from "../../reducers/cart/cartReducer"

import { theme } from "../../global/styles/theme"

type Props = {
  itemId: string
  quantity: number
}

export function ToggleQuantity({ itemId, quantity }: Props) {    
  const dispatch = useDispatch() 

  function handleRemoveItem() {
    dispatch(removeFromCart(itemId))
  }

  const handleIncrementQuantity = () => {
    if (quantity < 20) {
      dispatch(incrementQuantity(itemId))
    }
  }

  const handleDecrementQuantity = () => {
    if (quantity > 1) {
      dispatch(decrementQuantity(itemId))
    }
  }

  return (
    <View className="border border-black/20 rounded-md flex-row items-center justify-between px-2 py-1 w-24">
      {quantity === 1 ? (
        <TouchableOpacity onPress={handleRemoveItem}>
          <TrashIcon size={14} color={theme.colors.primary} />
        </TouchableOpacity>        
      ) : (
        <TouchableOpacity onPress={handleDecrementQuantity}>
          <MinusIcon size={14} color={theme.colors.primary} />
        </TouchableOpacity>
      )}
        
      <Text className="text-sm font-text400">{quantity}</Text>

      <TouchableOpacity onPress={handleIncrementQuantity}>
        <PlusIcon size={20} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  )
}