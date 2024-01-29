import Toast from "react-native-root-toast"

export const useToast = (message: string, background: string) => {
  Toast.show(message, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.TOP,
    backgroundColor: background,
    opacity: 1,
    textColor: "#FFF",
    containerStyle: {
      borderRadius: 100,
      paddingHorizontal: 24,
      marginTop: 24
    }    
  })
}