import { View, Text } from "react-native";

import PixSvg from "../../assets/pix.svg"
import MoneySvg from "../../assets/money.svg"
import CreditCardSvg from "../../assets/red-card.svg"
import DebitCardSvg from "../../assets/blue-card.svg"
import { HeaderCard } from "../HeaderCard";

type Props = {
  payment: string
  onPress?: () => void
}

export function SummaryOfPayment({ payment, onPress }: Props) {
  return (
    <View>
      <HeaderCard 
        title="Pagamento"
        onPress={onPress}
        onPressTitle={payment === '' ? "Escolher" : "Trocar"}
      />
      
      <View className="flex-row items-center justify-start">
        <View className="bg-zinc-200 p-2 rounded-full">
          {payment === 'Pix' && <PixSvg width={14} height={14} />}
          {payment === 'Dinheiro' && <MoneySvg width={14} height={14} />}
          {payment === 'Crédito' && <CreditCardSvg width={14} height={14} />}
          {payment === 'Débito' && <DebitCardSvg width={14} height={14} />}
          {payment === 'Pix (pagamento na entrega)' && <PixSvg width={14} height={14} />}
        </View>
        
        <View className="ml-4 flex-1">            
          <Text className="text-sm font-text500 font-bold text-black/80">              
            {payment}
          </Text>                  
        </View>
      </View>
    </View>
  )
}