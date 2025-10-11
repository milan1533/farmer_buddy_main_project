import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import './index.css'
import './i18n'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { CartProvider } from './assets/pages/CartContext'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          <App />
          <Toaster />
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
