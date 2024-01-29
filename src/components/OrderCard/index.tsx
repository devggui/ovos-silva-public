import { TouchableOpacity, View, Text, TouchableOpacityProps } from "react-native"
import { OrderProps } from "../../@types/order"
import { ArrowRightCircleIcon } from "react-native-heroicons/solid"
import { theme } from "../../global/styles/theme"
import { ShoppingBagIcon } from "react-native-heroicons/solid"
import { useNavigation } from "@react-navigation/native"
import { Separator } from "../Separator"
import { OrderStatusCard } from "../OrderStatusCard"
import { format, utcToZonedTime } from "date-fns-tz"
import { pt } from "date-fns/locale"

type Props = TouchableOpacityProps & {
  order: OrderProps  
}

export function OrderCard({ order }: Props) {  
  const navigation = useNavigation<any>()  

  const timestampData = {
    "nanoseconds": order.createdAt.nanoseconds,
    "seconds": order.createdAt.seconds
  }
  
  const milliseconds = (timestampData.seconds * 1000) + (timestampData.nanoseconds / 1000000);
  const date = utcToZonedTime(new Date(milliseconds), 'America/Sao_Paulo')  
  
  const orderWeekDay = format(date, 'eee', { locale: pt }).replace(/^\w/, (char) => char.toUpperCase())            
  const orderDay = format(date, 'dd')    
  const orderMonth = format(date, 'MMMM', { locale: pt })
  const orderYear = format(date, 'yyyy')        
  const orderHour = format(date, 'HH:mm')      

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('orderDetails', { ...order })}
      className="mx-4 mb-4 p-4 border border-zinc-200 py-4 rounded-md flex-col"
    >
      <View className="space-y-1">        
        <View className="flex-row items-center justify-between w-full">
          <Text className="text-sm font-title500 font-bold text-black/80">
            Pedido Nº {order.id}
          </Text>

          <View className="flex-row items-center">         
            <ArrowRightCircleIcon width={24} height={24} color={theme.colors.primary} />        
          </View>
        </View>

        <Text className="text-sm font-text400 text-black/80">
          {orderWeekDay}, {orderDay} {orderMonth} {orderYear} ás {orderHour}
        </Text>              
      </View>      

      <Separator />

      <View>
        <View className="mb-2">
          <OrderStatusCard status={order.status} />
        </View>

        <View className="flex-row items-center">
          <ShoppingBagIcon width={16} height={16} color={theme.colors.primary} />

          <Text className="text-sm font-text400 font-bold text-black/60 ml-2">
            {order.items[0].quantity} {order.items[0].name}
          </Text>
          <Text> </Text>
          {order.items.length > 1 && (
            <Text className="text-sm font-text400 font-bold text-black/60">
              e mais {order.items.length - 1} itens
            </Text>
          )}
        </View>                
      </View>      
    </TouchableOpacity>
  )
}