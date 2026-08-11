import { createContext } from 'react'

export type ToastType = 'success' | 'error'

export interface IToastContext {
  notify: (type: ToastType, message: string) => void
}

export const ToastContext = createContext<IToastContext | null>(null)
