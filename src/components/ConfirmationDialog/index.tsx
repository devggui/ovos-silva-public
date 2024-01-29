import { useState } from "react"
import { TouchableOpacity, View } from "react-native"
import { TrashIcon } from "react-native-heroicons/outline"
import { Button, Dialog, Portal, Text } from "react-native-paper"
import { theme } from "../../global/styles/theme"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-root-toast"

type Props = {
  title?: string
  text?: string
  successText?: string
  errorText?: string
  addressId?: string
  checked?: boolean
  onDelete?: () => void  
  onSelected?: () => void
}

export function ConfirmationDialog({ addressId, onDelete, onSelected, checked, ...props }: Props) {
  const [visible, setVisible] = useState(false)

  const showDialog = () => {
    if (checked) {
      Toast.show('Você não pode excluir o endereço que está usando no momento.', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        backgroundColor: "#dc3545",
        opacity: 1,
        textColor: "#FFF",
        containerStyle: {
          borderRadius: 100,
          paddingHorizontal: 24,
          marginTop: 24
        }    
      })
    } else {
      setVisible(true)
    }
  }

  const hideDialog = () => setVisible(false)

  async function handleDeleteAddress() {
    await AsyncStorage.removeItem(`@address:${addressId}`)
    
    const currentAddress = JSON.parse(await AsyncStorage.getItem('@currentAddress'))

    if (currentAddress.addressId === addressId) {
      await AsyncStorage.removeItem('@currentAddress')     
      
      onSelected()
    }

    hideDialog()

    showToast()

    onDelete()
  }

  const showToast = () => {
    Toast.show(props.successText, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      backgroundColor: "#dc3545",
      opacity: 1,
      textColor: "#FFF",
      containerStyle: {
        borderRadius: 100,
        paddingHorizontal: 24,
        marginTop: 24
      }    
    })
  }

  return (    
    <View>
      <TouchableOpacity
        onPress={showDialog}
        className="ml-4 w-16 h-8 flex-row rounded-lg bg-red-500  items-center justify-center text-center self-center"
      >                
        <Text className="text-sm text-center text-white font-text500">
          Excluir
        </Text>
      </TouchableOpacity>
            
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Atenção</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{props.text}</Text>
          </Dialog.Content>
          <Dialog.Actions>            
            <Button onPress={hideDialog}>Cancelar</Button>
            <Button onPress={handleDeleteAddress} textColor="red">Excluir</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>    
  )
}