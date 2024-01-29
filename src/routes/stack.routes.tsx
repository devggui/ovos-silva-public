import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack" 

import { TabRoutes } from "./tab.routes"

import { Product } from '../screens/Product'
import { Address } from "../screens/Address"
import { Payment } from "../screens/Payment"
import { OrderAddress } from "../screens/OrderAddress"
import { OrderReview } from "../screens/OrderReview"
import { OrderCompleted } from "../screens/OrderCompleted"
import { Profile } from "../screens/Profile"
import { Cart } from "../screens/Cart"
import { Notifications } from "../screens/Notifications"
import { Login } from "../screens/Login"
import { LoginUsername } from "../screens/LoginUsername"
import { LoginAddress } from "../screens/LoginAddress"
import { Personal } from "../screens/Personal"
import { OrderDetails } from "../screens/OrderDetails"

const { Navigator, Screen } = createNativeStackNavigator()

export function StackRoutes({ hasUser }) {   

  const initialRouteName = hasUser ? 'tab' : 'login'

  return (
    <Navigator       
      initialRouteName={initialRouteName}
      screenOptions={{ 
        headerShown: false, 
        contentStyle: { 
          backgroundColor: 'transparent' 
        } 
      }}
    >
      <Screen name="login" component={Login} />      
      <Screen name="loginUsername" component={LoginUsername} />
      <Screen name="loginAddress" component={LoginAddress} />
      <Screen name="tab" component={TabRoutes}/>
      <Screen name="product" component={Product} />                              
      <Screen name="address" component={Address} />                              
      <Screen name="cart" component={Cart} />
      <Screen name="orderAddress" component={OrderAddress} />
      <Screen name="payment" component={Payment} />
      <Screen name="orderReview" component={OrderReview} />      
      <Screen name="orderCompleted" component={OrderCompleted} />
      <Screen name="profile" component={Profile} />                              
      <Screen name="notifications" component={Notifications} />                              
      <Screen name="personal" component={Personal} />                              
      <Screen name="orderDetails" component={OrderDetails} />                                    
    </Navigator>
  )
}