import React, { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"

import { StackRoutes } from "./stack.routes"
import { Loading } from "../components/Loading"

export function Routes() {  
  const [user, setUser] = useState<boolean>()

  useEffect(() => {    
    getData()          
  }, [])  

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user')      
      
      if (value !== null) {
        setUser(true)
      } else {
        setUser(false)
      }
    } catch (e) {
      console.log(e)
    }
  }    

  return (
    <NavigationContainer theme={DefaultTheme}>      
      {user === undefined ? <Loading /> : <StackRoutes hasUser={user} /> }
    </NavigationContainer>
  )
}