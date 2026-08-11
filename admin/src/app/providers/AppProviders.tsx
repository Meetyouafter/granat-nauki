import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ToastProvider } from '@shared/ui/Toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default AppProviders
