import { View, Text } from "react-native"
import { ClockIcon } from "react-native-heroicons/outline"
import { CheckCircleIcon, TruckIcon, XCircleIcon } from "react-native-heroicons/solid"
import { theme } from "../../global/styles/theme"

type Props = {
  status: string
}

export function OrderStatusCard({ status }: Props) {
  return (
    <>
      {status === 'created' && (
          <View className="flex-row items-center">
            <ClockIcon width={16} height={16} color={theme.colors.gray} />
            <Text className="text-sm font-text400 text-black/80 ml-2">
              Em preparação
            </Text>
          </View>
        )}

        {status === 'road' && (
          <View className="flex-row items-center">
            <TruckIcon width={16} height={16} color={theme.colors.primary} />
            <Text className="text-sm font-text400 text-black/80 ml-2">
              A caminho...
            </Text>
          </View>
        )}
        
        {status === 'success' && (
          <View className="flex-row items-center">
            <CheckCircleIcon width={16} height={16} color={theme.colors.success} />
            <Text className="text-sm font-text400 text-black/80 ml-2">
              Pedido concluído
            </Text>
          </View>
        )}
        
        {status === 'canceled' && (
          <View className="flex-row items-center">
            <XCircleIcon width={16} height={16} color={theme.colors.red} />
            <Text className="text-sm font-text400 text-black/80 ml-2">
              Pedido cancelado
            </Text>
          </View>          
        )}
    </>
  )
}