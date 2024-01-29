import { Text } from "react-native"
import { Avatar, Card } from "react-native-paper"
import { NotificationProps } from "../../@types/notification"

const LeftContent = props => <Avatar.Image {...props} source={require('../../../assets/icon.png')} />

export function NotificationCard({ ...props }: NotificationProps) {
  return (
    <Card className="m-4" style={{ backgroundColor: "#fef9e8" }}>
      <Card.Title 
        title={props.title} 
        titleVariant="titleLarge"                
        subtitle={props.subtitle} 
        left={LeftContent}               
      />      

      <Card.Content>
        <Text className="font-text400 text-black text-base">
          {props.content}
        </Text>        

        {props.image && <Card.Cover className="mt-4" source={{ uri: props.image }} />}        
      </Card.Content>
    </Card>
  )
}