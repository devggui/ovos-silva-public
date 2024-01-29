import { View, Text } from "react-native"
import { ClockIcon } from "react-native-heroicons/outline"
import { CheckCircleIcon, XCircleIcon } from "react-native-heroicons/solid"
import { theme } from "../../global/styles/theme"

type Props = {
  status: string
}

const statusMessages = {
  ATIVA: 'Aguardando pagamento...',      
  CONCLUIDA: 'Pagamento concluído!',
  REMOVIDA_PELO_USUARIO_RECEBEDOR: 'Pagamento cancelado!',
  REMOVIDA_PELO_PSP: 'Pagamento cancelado!'
}

export function PaymentStatusCard({ status }: Props) {  
  return (
    <>
      {status === 'ATIVA' && (
          <View className="flex-row items-center">
            <ClockIcon width={16} height={16} color={theme.colors.gray} />
            <Text className="text-sm font-text400 text-black/80 ml-2">
              {statusMessages[status]}
            </Text>
          </View>
        )}
        
        {status === 'CONCLUIDA' && (
          <View className="flex-row items-center">
            <CheckCircleIcon width={16} height={16} color={theme.colors.success} />
            <Text className="text-sm font-text400 text-black/80 ml-2">
              {statusMessages[status]}
            </Text>
          </View>
        )}
        
        {(status === 'REMOVIDA_PELO_USUARIO_RECEBEDOR' || status === 'REMOVIDA_PELO_PSP') && (
          <View className="flex-row items-center">
            <XCircleIcon width={16} height={16} color={theme.colors.red} />
            <Text className="text-sm font-text400 text-black/80 ml-2">
              {statusMessages[status]}
            </Text>
          </View>          
        )}
    </>
  )
}