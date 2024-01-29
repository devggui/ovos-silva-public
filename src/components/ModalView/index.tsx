import React, { ReactNode } from "react"
import { 
  View, 
  Modal, 
  ModalProps,  
  Pressable
} from "react-native"

import { Background } from "../Background"
import { XMarkIcon } from "react-native-heroicons/solid"
import { theme } from "../../global/styles/theme"

type Props = ModalProps & {
  children: ReactNode
  onClose: () => void
}

export function ModalView({ children, onClose, ...props }: Props) {
  return (
    <Modal
      transparent
      animationType="slide"
      {...props}
    >
        <View className="flex-1 bg-black/70">          
          <View className="flex-1">
            <Background>
              <View className="w-10 h-[2px] border-2 bg-secondary30-0 self-center my-3 rounded-full" />
              
              <Pressable 
                className="p-4"
                onPress={onClose}
              >
                <XMarkIcon 
                  size={24}
                  color={theme.colors.gray}          
                />
              </Pressable>     
                 
              {children}
            </Background>
          </View>
        </View>      
    </Modal>
  )
}