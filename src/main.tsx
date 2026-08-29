import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { initAuth } from './store/authStore'
import './store/installPromptStore'
// themeStore NO se importa a proposito: la app es solo modo oscuro. El store
// aplica el tema al cargarse el modulo, asi que basta con no importarlo para
// desactivarlo sin borrar nada. El fichero sigue en src/store/themeStore.ts
// por si se quiere recuperar el selector claro/oscuro.

initAuth()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
