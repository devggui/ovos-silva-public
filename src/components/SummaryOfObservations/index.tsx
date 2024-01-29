import { View, Text } from "react-native"
import { HeaderCard } from "../HeaderCard"

type Props = {
  observation: string
}

export function SummaryOfObservations({ ...props }: Props) {  
  return (
    <View>
      <HeaderCard 
        title="Observações"
      />

      <View className="flex-row items-center justify-start">
        <Text className="text-sm font-text500 text-black/80">              
          {props.observation}
        </Text>
      </View>
    </View>
  )
}