import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LocationSelector from './LocationSelector.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocationSelector />
  </StrictMode>,
)
