/** @type {import('tailwindcss').Config} */
module.exports = {  
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        title700: ['Rajdhani_700Bold'],
        title500: ['Rajdhani_500Medium'],
        text400: ['Inter_400Regular'],
        text500: ['Inter_500Medium'],
      }, 
    },
  },
  plugins: [],
}

