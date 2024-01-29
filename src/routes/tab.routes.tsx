import React, { useEffect } from "react"
import { Alert, BackHandler, Text, View } from "react-native"
import { RouteProp, ParamListBase, useNavigation } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useSelector } from "react-redux"
import { countItems } from "../reducers/cart/cartReducer"
import { Badge } from "../components/Badge"

import { theme } from "../global/styles/theme"

import { Home } from "../screens/Home"
import { Orders } from "../screens/Orders"
import { Profile } from "../screens/Profile"
import { Cart } from "../screens/Cart"

import {
  HomeIcon as HomeOutline,   
  DocumentTextIcon as OrderOutline,   
  UserIcon as UserOutline,
  ShoppingCartIcon as CartOutline
} from "react-native-heroicons/outline"

import {
  HomeIcon as HomeSolid,   
  DocumentTextIcon as OrderSolid,   
  UserIcon as UserSolid,
  ShoppingCartIcon as CartSolid
} from "react-native-heroicons/solid"

const { Navigator, Screen } = createBottomTabNavigator()

export function TabRoutes() {
  const navigation = useNavigation()
  
  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert('Atenção!', 'Tem certeza que deseja sair do aplicativo?', [
          {
            text: 'Cancelar',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'SIM', onPress: () => BackHandler.exitApp()},
        ])          
      } else {
        navigation.goBack()
      }

      return true
    }  
    
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )

    return () => backHandler.remove()
  }, [])
  
  return (
    <Navigator 
      screenOptions={({ route }) => ({            
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,   
        tabBarIcon: ({ focused }) => menuIcons(route, focused),                     
        tabBarStyle: {                  
          height: 65,
          paddingVertical: 4,                                    
          backgroundColor: "white",          
        },         
      })}      
    >
      <Screen name="home" component={Home} />
      <Screen name="orders" component={Orders} />            
      <Screen name="cart" component={Cart} />
      <Screen name="profile" component={Profile} /> 
    </Navigator>    
  )
}

const menuIcons = (
  route: RouteProp<ParamListBase, string>, 
  focused: boolean
) => {
  const getCountItems = useSelector(countItems)  
  
  let icon: string | number | boolean | Iterable<React.ReactNode> | React.JSX.Element
  let text: string | Iterable<React.ReactNode> | React.JSX.Element
  let badge: string | number | boolean | Iterable<React.ReactNode> | React.JSX.Element

  if (route.name === "home") {
    icon =  focused ? <HomeSolid size={24} color={theme.colors.black80} /> : <HomeOutline size={24} strokeWidth={2} color={theme.colors.black80} />
    text = <Text className={focused ? `text-black/80 font-text400 font-bold` : `font-text400 text-black/80`}>Início</Text>
  } 
  
  if (route.name === "orders") {
    icon =  focused ? <OrderSolid size={24} color={theme.colors.black80} /> : <OrderOutline size={24} strokeWidth={2} color={theme.colors.black80} />
    text = <Text className={focused ? `text-black/80 font-text400 font-bold` : `font-text400 text-black/80`}>Pedidos</Text>
  } 
  
  if (route.name === "cart") {
    icon =  focused ? <CartSolid size={24} color={theme.colors.black80} /> : <CartOutline size={24} strokeWidth={2} color={theme.colors.black80} />
    text = <Text className={focused ? `text-black/80 font-text400 font-bold` : `font-text400 text-black/80`}>Carrinho</Text>
    badge = getCountItems > 0 ? <Badge count={getCountItems} bottomTabs /> : ""
  } 
  
  if (route.name === "profile") {
    icon =  focused ? <UserSolid size={24} color={theme.colors.black80} /> : <UserOutline size={24} strokeWidth={2} color={theme.colors.black80} />
    text = <Text className={focused ? `text-black/80 font-text400 font-bold` : `font-text400 text-black/80`}>Perfil</Text>    
  }  

  return (
    <View className="items-center">      
      {icon}
      {text}      
      {badge}
    </View>
  )
}