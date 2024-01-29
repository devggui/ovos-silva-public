import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native"

type Props = TouchableOpacityProps & {
  onPress: () => void  
}

export function HeaderButton({ ...props }: Props) {
  return (
    <TouchableOpacity 
      {...props}     
      onPress={props.onPress}
    >
      <Text className="text-sm font-text500 text-yellow-500">
        Atualizar
      </Text>
    </TouchableOpacity>
  )
}