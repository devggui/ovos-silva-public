import { View, Text } from "react-native"

import { HeaderCard } from "../HeaderCard"

type Props = {  
  subTotal: number
  rate: string
  total: number
}

export function SummaryOfValues({ subTotal, rate, total }: Props) {        
  return (
    <View>
      <HeaderCard 
        title="Valores"
      />

      <View className="space-y-4">
        <View className="flex-row items-center text-center justify-between">
          <Text className="text-sm font-text500 text-black/80">
            Subtotal
          </Text>

          <Text className="text-sm font-text500 text-black/80">
            R$ {subTotal.toFixed(2).replace('.', ',')}
          </Text>
        </View>

        <View className="flex-row items-center text-center justify-between">
          <Text className="text-sm font-text400 text-black/60">
            Taxa de entrega
          </Text>

          <Text className={`text-sm font-text400 ${rate === 'Grátis' ? "text-emerald-500" : "text-black/60"}`}>
            {rate === "Grátis" ? "Grátis" : `R$ ${rate}`}
          </Text>
        </View>

        <View className="flex-row items-center text-center justify-between">
          <Text className="text-sm font-text500 text-black/80">
            Total
          </Text>

          <Text className="text-sm font-text500 text-black/80">
            R$ {total.toFixed(2).replace('.', ',')}
          </Text>
        </View>
      </View>
    </View>
  )
}