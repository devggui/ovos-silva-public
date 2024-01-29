import { 
  View, 
  Text, 
  TouchableOpacity, 
  TouchableOpacityProps,
  Image 
} from "react-native"
import { ArrowSmallLeftIcon } from "react-native-heroicons/solid"
import { theme } from "../../global/styles/theme"

type Props = TouchableOpacityProps & {  
  name: string
  imageUrl?: string
  checked?: boolean
  backButton?: boolean
}

export function CategoryCard({  
  name,
  imageUrl,
  checked = false,
  backButton = false,
  ...props
}: Props) {         
  return (
    <TouchableOpacity 
      className="flex-col items-center justify-center text-center mr-4"
      {...props}
    >
      {backButton ? (
        <View className="h-14 w-14 items-center justify-center">
          <ArrowSmallLeftIcon width={24} height={24} color={theme.colors.primary} />
        </View>
      ) : (
        <Image        
          source={{ uri: imageUrl }}          
          className="w-14 h-14 rounded-full object-cover"
        />              
      )}

      <View className={`border-b-2 ${checked ? "border-b-yellow-500" : "border-b-white"}`}>
        <Text className="font-text500">
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  )
}