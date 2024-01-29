import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { RadioButton } from "react-native-paper"
import { theme } from "../../global/styles/theme"
import { utcToZonedTime } from "date-fns-tz"

type Props = {
  deliveryRate: string    
  setHour: (value: string) => void
}

export function ChangeToTodayTime({ deliveryRate, setHour }: Props) {
  const [hours, setHours] = useState('')
  const [timeSlots, setTimeSlots] = useState([])          

  useEffect(() => {
    setHour(hours)
  }, [hours])

  useEffect(() => {
    generateTimeSlots()
  }, [])   

  function generateTimeSlots() {
    const deliverySchedule = []

    const currentDate = utcToZonedTime(new Date(), 'America/Sao_Paulo')            

    const startHour = currentDate.getDay() === 6 ? 8 : 11
    const endHour = currentDate.getDay() === 6 ? 14 : 16 // Verify if is Saturday
    
    const currentHour = currentDate.getHours()
  
    let hour = Math.max(startHour, currentHour)
  
    while (hour < endHour) {
      const formattedHour = hour.toString().padStart(2, '0')
      const nextHour = (hour + 1).toString().padStart(2, '0')
      const timeSlot = `Hoje, ${formattedHour}:30 - ${nextHour}:00`
  
      deliverySchedule.push({
        timeSlot,
      })
  
      hour++
    }
  
    setTimeSlots(deliverySchedule)
  }   

  return (
    <View className="px-4 w-full">
      <Text className="text-xl font-title700 text-black/80 self-start">
        Agendamento
      </Text>

      <View className="mt-4">
        <RadioButton.Group
          onValueChange={choseHour => setHours(choseHour)} 
          value={hours}
        >
          {timeSlots.length === 0 && (
            <>
              <Text className="text-sm font-text400 text-black/60">
                Já finalizamos as entregas por hoje, mas agende sua entrega para amanhã ou escolha o melhor dia para você.
              </Text>
            </>
          )}
          
          {timeSlots.map((slots, key) => (
            <TouchableOpacity 
              key={key} 
              className="border border-zinc-200 rounded-md p-2 flex-row items-center justify-between mb-4"
              onPress={() => setHours(slots.timeSlot)}
            >
              <Text className="text-sm font-text400 text-black/80 max-w-[200px]">{slots.timeSlot}</Text>

              <View className="flex-row items-center justify-center">
                <Text className="text-sm font-text400 text-emerald-500">{deliveryRate}</Text>
                <RadioButton value={slots.timeSlot} uncheckedColor={theme.colors.lightGray} color={theme.colors.primary} />            
              </View>
            </TouchableOpacity>
          ))}
        </RadioButton.Group>
      </View>
    </View>    
  )
}