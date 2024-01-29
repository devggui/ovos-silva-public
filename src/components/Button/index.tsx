import React from "react"
import {
  Text,  
  TouchableOpacity,
  TouchableOpacityProps
} from "react-native"
import { Loading } from "../Loading"

type Props = TouchableOpacityProps & {
  title: string
  outline?: boolean
  loading?: boolean
}

export function Button({ title, outline, loading = false, ...props }: Props) {  
  return (
    <TouchableOpacity      
      className={`w-full h-14 flex-row items-center rounded-lg ${outline ? "bg-transparent border border-yellow-500" : "bg-yellow-400"} ${props.disabled ? "opacity-50" : "opacity-100"}`}      
      {...props}
    >     
      {loading ? <Loading /> : (
        <Text className={`flex-1 text-base text-center text-black font-text500`}>
          {title}
        </Text>
      )}

    </TouchableOpacity>
  )
}