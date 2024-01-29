import { CartItem } from "../reducers/cart/types"

export type OrderProps = {
  createdAt: {
    seconds: number
    nanoseconds: number
  }
  deliveryAddress: {
    cep: string
    city: string
    complement: string | null
    district: string
    id: string
    number: string
    reference: string | null
    street: string
    uf: string
  }
  deliveryDetails: {
    deliveryRate: string
    time: string
    type: string
  }
  id: string
  items: CartItem[]
  observation: string
  paymentMethod: string
  paymentValues: {
    deliveryRate: string
    subTotal: number
    total: number
  }
  status: string
}