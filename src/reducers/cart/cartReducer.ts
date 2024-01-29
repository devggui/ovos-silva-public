import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { CartItem } from './types'
import { RootState } from '../../../store'

export type CartState = {
  items: CartItem[]
}

const initialState: CartState = {
  items: []
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {      
      const newItem = action.payload
      const itemExists = state.items.find((item) => item.id === newItem.id)

      if (itemExists) {
        itemExists.quantity += 1
      } else {
        state.items.push({ ...newItem })
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    incrementQuantity: (state, action: PayloadAction<string>) => {      
      const itemId = action.payload
      const item = state.items.find((item) => item.id === itemId)

      if (item && item.quantity < 20) {
        item.quantity += 1
      }
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const itemId = action.payload
      const item = state.items.find((item) => item.id === itemId)

      if (item && item.quantity > 1) {
        item.quantity -= 1
      }      
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart, clearCart, incrementQuantity, decrementQuantity } = cartSlice.actions
export const selectCartItems = (state: RootState) => state.cart.items
export const countItems = (state: RootState) => state.cart.items.length
export const selectTotalPrice = (state: RootState) => {
  const initialPrice = state.cart.items

  return initialPrice.reduce((total, item) => total + parseFloat(item.price.replace(',', '.')) * item.quantity, 0)
}

export default cartSlice.reducer