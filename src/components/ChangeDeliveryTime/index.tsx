import React, { useRef, useState } from "react"
import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { format } from "date-fns"
import { utcToZonedTime } from "date-fns-tz"

import { Button } from "../Button"
import { Background } from "../Background"
import { RadioButton } from "react-native-paper"
import { theme } from "../../global/styles/theme"
import { ChangeToTodayTime } from "../ChangeToTodayTime"
import { ChangeToOtherTime } from "../ChangeToOtherTime"

type Props = {
  deliveryRate: string    
  onSelect: (value: string) => void
}

export function ChangeDeliveryTime({ deliveryRate, onSelect }: Props) {   
  const [day, setDay] = useState<'today' | 'other' | string>('today')    
  const [hour, setHour] = useState('')

  const date = utcToZonedTime(new Date(), 'America/Sao_Paulo')
  const currentDate = format(date, 'dd/MM')    

  function handleGetHour(hour: string) {
    setHour(hour)
  }

  const scrollViewRef = useRef(null)    

  function handleScrollToTop(y: number) {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: y, animated: true })
    }
  }

  return (
    <Background>      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        ref={scrollViewRef}               
      >         
        <View className="items-center justify-center text-center space-y-2">
          <Text className="text-xl font-title700 text-black/80">
            Entrega agendada
          </Text>

          <Text className="text-sm font-text400 text-black/60 text-center">
            Escolha o melhor horário para receber seu pedido.
          </Text>                              

          {/* Date time component */}
          <RadioButton.Group
            onValueChange={choseDay => setDay(choseDay)} 
            value={day}
          >
            <View className="flex-row items-center justify-center space-x-6">
              <TouchableOpacity 
                className="flex-row items-center justify-center border p-2 rounded-md border-zinc-300 my-4"
                onPress={() => setDay('today')}
              >
                <Text className="text-sm font-title700 text-black/60">Hoje, {currentDate}</Text>
                <RadioButton value="today" uncheckedColor={theme.colors.lightGray} color={theme.colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-row items-center justify-center border p-2 rounded-md border-zinc-200 my-4"
                onPress={() => setDay('other')}
              >
                <Text className="text-sm font-title700 text-black/60">Escolher o dia</Text>
                <RadioButton value="other" uncheckedColor={theme.colors.lightGray} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </RadioButton.Group>

          {day === 'today' && <ChangeToTodayTime setHour={handleGetHour} deliveryRate={deliveryRate} />}
          {day === 'other' && <ChangeToOtherTime setHour={handleGetHour} deliveryRate={deliveryRate} scrollViewCurrent={scrollViewRef.current} scrollToTop={handleScrollToTop} />}
          
        </View>              
      </ScrollView>

      <View className="p-4">        
        <Button
          title="Confirmar"
          onPress={() => onSelect(hour)}          
        />       
      </View>    
    </Background>
  )
}