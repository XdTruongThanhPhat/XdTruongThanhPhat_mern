import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)

// Báo hiệu cho vite-plugin-prerender biết React đã render xong
// Chỉ chạy trong môi trường prerender (build), không ảnh hưởng production runtime
document.dispatchEvent(new Event('render-event'))
