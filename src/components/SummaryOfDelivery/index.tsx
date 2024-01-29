import { View, Text } from "react-native";
import { HeaderCard } from "../HeaderCard";
import { MapPinIcon } from "react-native-heroicons/solid";
import { theme } from "../../global/styles/theme";

type Props = {
  street: string
  number: string
  district: string
  time: string
}

export function SummaryOfAddress({ ...props }: Props) {
  return (
    <View>
      <HeaderCard 
        title="Entrega"
      />

      <View className="flex-row items-center justify-start">
        <View className="bg-zinc-200 p-2 rounded-full">
          <MapPinIcon size={16} color={theme.colors.gray} />
        </View>

        <View className="ml-4 flex-1">
          
          <Text className="text-sm font-text500 text-black/80">              
            {`${props.street}, ${props.number}`}              
          </Text>

          <Text className="text-xs font-text400 text-black/80">
            {props.district}
          </Text>                                        

          <Text className="text-xs font-text400 text-black/80">
            {props.time}
          </Text>                                        
        </View>
      </View>
    </View>
  )
}