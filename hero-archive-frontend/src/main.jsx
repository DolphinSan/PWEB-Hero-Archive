import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Urutan import CSS:
import "./styles/theme.css"       // 1. Variables dulu
import "./styles/globals.css"     // 2. Global reset
import "./index.css"              // 3. Base styles
import "./App.css"                // 4. App layout & navbar
import "./styles/LoginPage.css"   // 5. Page styles

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)