import { addDays, format } from "date-fns"
import { utcToZonedTime } from "date-fns-tz"
import { useEffect, useRef, useState } from "react"
import { View, Text, TouchableOpacity, findNodeHandle } from "react-native"
import { RadioButton } from "react-native-paper"
import { theme } from "../../global/styles/theme"
import { pt } from "date-fns/locale"

type Props = {
  deliveryRate: string
  setHour: (value: string) => void
  scrollViewCurrent: any
  scrollToTop?: (y: number) => void 
}

export function ChangeToOtherTime({ deliveryRate, setHour, scrollViewCurrent, scrollToTop }: Props) {
  const [availableDays, setAvailableDays] = useState([])
  const [timeSlots, setTimeSlots] = useState([])        
  const [weekDay, setWeekDay] = useState('')
  const [day, setDay] = useState('')
  const [hours, setHours] = useState('')  

  const viewRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    setHour(hours)
  }, [hours])

  useEffect(() => {
    generateTimeSlots()
  }, [day])

  useEffect(() => {
    generateAvailableDays()    
  }, [])  
  
  function generateAvailableDays() {    
    const currentDate = utcToZonedTime(new Date(), 'America/Sao_Paulo')  
  
    const tomorrowDate = addDays(currentDate, 1)
  
    let startDate: any

    if (currentDate.getDay() === 0) {      
      startDate = addDays(currentDate, 1)
    } else if (currentDate.getDay() === 6) {
      startDate = addDays(currentDate, 2)
    } else {
      startDate = tomorrowDate 
    }

    const days = []
    const daysUntilFriday = 6 - startDate.getDay()          

    for (let i = 0; i <= daysUntilFriday; i++) {      
      const date = addDays(startDate, i)                    
      const weekDay = format(date, 'eee', { locale: pt }).replace(/^\w/, (char) => char.toUpperCase())          
      const formattedDate = format(date, 'dd/MM', { locale: pt })

      days.push({
        weekDay,
        formattedDate
      })
    }    

    setAvailableDays(days)
  }
  
  function generateTimeSlots() {
    const deliverySchedule = []    

    const startHour = weekDay === 'Sáb' ? 8 : 11
    const endHour = weekDay === 'Sáb' ? 14 : 16 // Verify if is Saturday  
  
    let hour = startHour
  
    while (hour < endHour) {
      const formattedHour = hour.toString().padStart(2, '0')
      const nextHour = (hour + 1).toString().padStart(2, '0')
      const timeSlot = `${weekDay}, ${day}, ${formattedHour}:30 - ${nextHour}:00`
  
      deliverySchedule.push({
        timeSlot,
      })
  
      hour++
    }
  
    setTimeSlots(deliverySchedule)
  }

  function handleSetDay(weekDay: string, day: string) {
    setWeekDay(weekDay)
    setDay(day)

    textRef.current.measureLayout(
      findNodeHandle(scrollViewCurrent),
      (x: any, y: any) => {
        scrollToTop(y)
      }
    )
  }

  return (
    <View className="px-4 w-full" ref={viewRef}>      
      <Text className="text-xl font-title700 text-black/80 self-start">
        Dias disponíveis
      </Text>

      <RadioButton.Group
        onValueChange={choseDay => setDay(choseDay)}
        value={day}
      >
        <View className="flex-row items-center justify-start">             
          {availableDays.map((day, key) => (
            <TouchableOpacity 
              key={key} 
              className="border border-zinc-200 pt-2 px-2 mr-4 mt-4 items-center justify-center text-center"
              onPress={() => handleSetDay(day.weekDay, day.formattedDate)}              
            >
              <Text className="text-sm font-text400 text-black/80">{day.weekDay}</Text>
              <Text className="text-sm font-text400 text-black/80">{day.formattedDate}</Text>

              <RadioButton 
                value={day.formattedDate} 
                uncheckedColor={theme.colors.lightGray} 
                color={theme.colors.primary} 
              />
            </TouchableOpacity>
          ))}
        </View>
      </RadioButton.Group>

      <Text className="text-xl font-title700 text-black/80 self-start my-4" ref={textRef}>
        Agendamento
      </Text>

      {day.length === 0 && (
        <Text className="text-sm font-text400 text-black/60">
          Selecione uma data acima.
        </Text>
      )}

      <RadioButton.Group
        onValueChange={choseHour => setHours(choseHour)} 
        value={hours}
      >
        {day.length !== 0 && timeSlots.map((slots, key) => (
          <TouchableOpacity 
            key={key} 
            className="border border-zinc-200 rounded-md p-2 flex-row items-center justify-between mb-4"
            onPress={() => setHours(slots.timeSlot)}
          >
            <Text className="text-sm font-text400 text-black/80 max-w-[200px]">{slots.timeSlot}</Text>

            <View className="flex-row items-center justify-center">
              <Text className="text-sm font-text400 text-emerald-500">{deliveryRate}</Text>
              <RadioButton 
                value={slots.timeSlot} 
                uncheckedColor={theme.colors.lightGray} 
                color={theme.colors.primary} 
              />            
            </View>
          </TouchableOpacity>
        ))}
      </RadioButton.Group>
    </View>
  )
}