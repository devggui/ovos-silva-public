import React, { useState } from "react"
import { View, Text, TouchableOpacity, TouchableOpacityProps } from "react-native"
import { MapIcon } from "react-native-heroicons/outline"
import { CheckCircleIcon as CheckSolid } from "react-native-heroicons/solid"
import { CheckCircleIcon  as CheckOutline} from "react-native-heroicons/outline"

import { theme } from "../../global/styles/theme"
import { AddressProps } from "../../@types/address"
import { ModalView } from "../ModalView"
import { AddressUpdate } from "../AddressUpdate"
import { ConfirmationDialog } from "../ConfirmationDialog"

type Props = TouchableOpacityProps & {
  data: AddressProps
  checked?: boolean 
  onUpdated: () => void 
  onDelete: () => void 
  onSelected: () => void
}

export function AddressCard({ 
  data,  
  checked = false,
  onUpdated,
  onDelete,
  onSelected,
  ...props
}: Props) {     
  const [openAddressSettingsModal, setOpenAddressUpdateModal] = useState(false)      

  function handleOpenAddressUpdateModal() {
    setOpenAddressUpdateModal(true)
  }

  function handleOnClose() {
    setOpenAddressUpdateModal(false)
  }  

  return (
    <View className="w-full my-2 p-4 flex-row items-center justify-between rounded-md border border-gray-300 relative">
      <View className="flex-1 items-center space-y-4">
        <TouchableOpacity 
          className="flex-row items-center w-full"
          {...props}
        >
          <MapIcon size={25} color={theme.colors.gray} />

          <View className="ml-4">
            <Text className="font-bold max-w-[260px]">{data.street}, {data.number}</Text>
            <Text>{data.district}, {data.city} - {data.uf}</Text>
          </View>
        </TouchableOpacity>

        <View className="flex-row items-center justify-around space-x-4">                  
          <TouchableOpacity 
            {...props}
            className="w-16 h-8 flex-row rounded-lg bg-[#28a745]  items-center justify-center text-center self-center"
          >
            <Text className="text-sm text-center text-white font-text500">
              Usar
            </Text>

            <ModalView 
              visible={openAddressSettingsModal}
              onClose={() => setOpenAddressUpdateModal(false)} 
            >
              <AddressUpdate 
                onUpdated={onUpdated}
                onClose={handleOnClose}
                data={data}
              /> 
            </ModalView>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleOpenAddressUpdateModal}
            className="w-16 h-8 flex-row rounded-lg bg-yellow-400  items-center justify-center text-center self-center"
          >
            <Text className="text-sm text-center text-black/80 font-text500">
              Editar
            </Text>

            <ModalView 
              visible={openAddressSettingsModal}
              onClose={() => setOpenAddressUpdateModal(false)} 
            >
              <AddressUpdate 
                onUpdated={onUpdated}
                onClose={handleOnClose}
                data={data}
              /> 
            </ModalView>
          </TouchableOpacity>        

          <ConfirmationDialog
            text="Tem certeza que dejesa excluir esse endereço?"
            successText="Endereço excluido"
            addressId={data.id}
            onDelete={onDelete}
            onSelected={onSelected}
            checked={checked}          
          />
        </View>
      </View>

      <View className="absolute top-4 right-4">
        {checked ? <CheckSolid size={20} color={theme.colors.primary} /> : <CheckOutline size={20} color={theme.colors.primary} />}
      </View>
    </View>
  )
}