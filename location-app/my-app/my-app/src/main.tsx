import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LocationSelector from './LocationSelector.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocationSelector />
  </StrictMode>,
)
