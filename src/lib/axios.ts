import axios from "axios"

// Client API
export const api = axios.create({  
  baseURL: 'https://ovos-silva-server.vercel.app'
})

// Admin API
export const admin = axios.create({
  baseURL: 'https://ovos-silva-server.vercel.app/users/YOUR_FIREBASE_USER_KEY'
})