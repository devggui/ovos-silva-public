import { useEffect, useState } from "react"
import { ScrollView } from "react-native"

import { Header } from "../../components/Header"
import { NotFound } from "../../components/NotFound"
import { Background } from "../../components/Background"
import { NotificationCard } from "../../components/NotificationCard"
import { HeaderButton } from "../../components/HeaderButton"
import { Loading } from "../../components/Loading"

import { api } from "../../lib/axios"
import { useToast } from "../../hooks/toast"

import NotificationsSvg from "../../assets/notifications.svg"

export function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)  
  
  const notificationCount = notifications.length    

  useEffect(() => {
    getNotifications()
  }, [])

  const getNotifications = async () => {
    setIsLoading(true)

    await api.get('/notifications')
      .then(response => response.data)
      .then(data => {        
        const keys = Object.keys(data)
        const notificationsArray = keys.map((id) => {
          return {
            id: id,
            ...data[id]
          }
        })

        setNotifications(notificationsArray)
      })
      .catch(error => {
        useToast('Erro ao buscar as notificações.', "#dc3545")        
        console.log(error)
      })

    setIsLoading(false)
  } 

  return (
    <Background>
      <Header 
        title="Notificações" 
        action={ <HeaderButton onPress={getNotifications} /> }        
      />

      {notificationCount === 0 && !isLoading && (
        <NotFound 
          image={ <NotificationsSvg width={160} height={160} /> } 
          title="Não há nenhuma notificação..." 
        />
      )}

      {isLoading && <Loading />}

      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {!isLoading && notifications.map(notification => (
          <NotificationCard
            key={notification.id}
            id={notification.id}
            title={notification.title} 
            subtitle={notification.subtitle}
            content={notification.content} 
            image={notification.image}
          />
        ))}        
      </ScrollView>
    </Background>
  )
}