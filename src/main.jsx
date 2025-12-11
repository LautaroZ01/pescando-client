import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PomodoroProvider } from './views/pomodoro/PomodoroContext'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PomodoroProvider>
        <Router />
      </PomodoroProvider>
    </QueryClientProvider>
  </StrictMode>,
)
