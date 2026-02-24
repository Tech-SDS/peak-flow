import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    if (import.meta.env.PROD) {
        // Register SW in production
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
                .then(registration => console.log('SW registered: ', registration))
                .catch(error => console.log('SW registration failed: ', error))
        })
    } else {
        // Unregister SW in development to prevent it from intercepting Vite's HMR and causing "white screens"
        navigator.serviceWorker.getRegistrations().then(registrations => {
            for (let registration of registrations) {
                registration.unregister()
                console.log('Unregistered stale development service worker')
            }
        })
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>,
)
