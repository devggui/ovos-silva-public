import { View, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import WelcomeSvg from "../../assets/welcome.svg"

type Props = {
  firstName: string
  lastName: string
}

export function UserCard({ firstName, lastName }: Props) {  
  return (
    <SafeAreaView className="mx-4 my-4 items-center">           
      <WelcomeSvg width={160} height={160} />

      <View className="mt-6 self-start">
        <Text className="text-2xl font-text500 text-black/60">
          Bem-vindo(a),
        </Text>
        
        <Text className="text-2xl font-text500 text-black/60">
          {firstName} {lastName}
        </Text>
      </View>     
    </SafeAreaView>    
  )
}