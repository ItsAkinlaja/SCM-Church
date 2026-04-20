import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

// Prevent browser translation from breaking React reconciliation
document.documentElement.setAttribute('translate', 'no');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Toaster position="top-right" />
      <App />
    </HelmetProvider>
  </StrictMode>,
)
