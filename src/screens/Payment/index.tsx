import { ReactNode, useEffect, useState } from "react"
import { LogBox, TouchableOpacity, View } from "react-native"
import { RadioButton } from "react-native-paper"

import { Background } from "../../components/Background"
import { Header } from "../../components/Header"
import { PaymentCard } from "../../components/PaymentCard"
import { Button } from "../../components/Button"
import { HeaderCard } from "../../components/HeaderCard"

import PixSvg from "../../assets/pix.svg"
import MoneySvg from "../../assets/money.svg"
import CreditCardSvg from "../../assets/red-card.svg"
import DebitCardSvg from "../../assets/blue-card.svg"

import { theme } from "../../global/styles/theme"
import AsyncStorage from "@react-native-async-storage/async-storage"

export function Payment({ navigation, route }) {  
  const [method, setMethod] = useState('')      

  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state.',
  ])

  useEffect(() => {
    handleTogglePaymentMethod()
  }, [method])

  async function handleTogglePaymentMethod() {
    const currentPaymenyMethod = await AsyncStorage.getItem('@paymentMethod')          

    if (currentPaymenyMethod !== null) {
      await AsyncStorage.removeItem('@paymentMethod')      
    }

    if (currentPaymenyMethod === null) {
      await AsyncStorage.setItem('@paymentMethod', JSON.stringify(method))
    }

    if (currentPaymenyMethod !== null) {
      await AsyncStorage.mergeItem('@paymentMethod', JSON.stringify(method)) 
    }         
  }

  function handleConfirmPaymentMethod() {                
    route.params.onSelected(method)

    navigation.goBack()
  }

  return (
    <Background>
      <Header 
        title="Pagamento"
      />

      <View className="px-4 flex-1">              
        <RadioButton.Group
          onValueChange={choseMethod => setMethod(choseMethod)} 
          value={method}
        >
          <View className="space-y-4">
            {/* <View>
              <HeaderCard 
                title="Pagamento no Aplicativo"
              />

              <TouchableOpacity
                onPress={() => setMethod('Pix')}
              >
                <PaymentCard 
                  icon={ <PixSvg width={20} height={20} /> }             
                  title="Pix" 
                  radio={
                    <RadioButton 
                      value="Pix" 
                      uncheckedColor={theme.colors.lightGray}
                      color={theme.colors.primary}
                    />
                  }
                />
              </TouchableOpacity>
            </View> */}

            <View className="space-y-4">
              <HeaderCard 
                title="Pagamento na entrega"
              />               

              <TouchableOpacity
                onPress={() => setMethod('Dinheiro')}
              >        
                <PaymentCard 
                  icon={ <MoneySvg width={20} height={20} /> }             
                  title="Dinheiro" 
                  radio={
                    <RadioButton 
                      value="Dinheiro" 
                      uncheckedColor={theme.colors.lightGray}
                      color={theme.colors.primary}
                    />
                  }
                />
              </TouchableOpacity>
              
              <View>              
                <TouchableOpacity
                  onPress={() => setMethod('Crédito')}
                >
                  <PaymentCard 
                    icon={ <CreditCardSvg width={20} height={20} /> }             
                    title="Crédito" 
                    radio={
                      <RadioButton 
                        value="Crédito" 
                        uncheckedColor={theme.colors.lightGray}
                        color={theme.colors.primary}
                      />
                    }
                  />
                </TouchableOpacity>
              </View>

              <View>              
                <TouchableOpacity
                  onPress={() => setMethod('Débito')}
                >
                  <PaymentCard 
                    icon={ <DebitCardSvg width={20} height={20} /> }             
                    title="Débito" 
                    radio={
                      <RadioButton 
                        value="Débito" 
                        uncheckedColor={theme.colors.lightGray}
                        color={theme.colors.primary}
                      />
                    }
                  />
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity
                  onPress={() => setMethod('Pix (pagamento na entrega)')}
                >
                  <PaymentCard 
                    icon={ <PixSvg width={20} height={20} /> }             
                    title="Pix (pagamento na entrega)" 
                    radio={
                      <RadioButton 
                        value="Pix (pagamento na entrega)" 
                        uncheckedColor={theme.colors.lightGray}
                        color={theme.colors.primary}
                      />
                    }
                  />
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </RadioButton.Group>
      </View>

      <View className="p-4">
        <Button 
          onPress={handleConfirmPaymentMethod}
          title="Confirmar" 
        />
      </View>
    </Background>
  )
}