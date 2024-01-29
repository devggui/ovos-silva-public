import { View, Text } from "react-native"
import { HeaderCard } from "../HeaderCard"

type Props = {
  solicitacaoPagador: string
  cpf: string
  nome: string
  valor: string  
}

export function SummaryOfPix({ ...props }: Props) {
  return (
    <View>
      <HeaderCard 
        title="Detalhes do pagamento"        
      />
      
      <View className="space-y-2">
        <View className="flex-row items-center text-center justify-between">
          <Text className="text-sm font-text500 text-black/80">
            Descrição: 
          </Text>

          <Text className="text-sm font-text500 text-black/80">
            {props.solicitacaoPagador}
          </Text>
        </View>

        <View className="flex-row items-center text-center justify-between">
          <Text className="text-sm font-text500 text-black/80">
            CPF: 
          </Text>

          <Text className="text-sm font-text500 text-black/80">
            {props.cpf}
          </Text>
        </View>

        <View className="flex-row items-center text-center justify-between">
          <Text className="text-sm font-text500 text-black/80">
            Nome: 
          </Text>

          <Text className="text-sm font-text500 text-black/80">
            {props.nome}
          </Text>
        </View>

        <View className="flex-row items-center text-center justify-between">
          <Text className="text-sm font-text500 text-black/80">
            Valor: 
          </Text>

          <Text className="text-sm font-text500 text-black/80">
            R$ {props.valor.replace('.', ',')}
          </Text>
        </View>
      </View>
    </View>
  )
}