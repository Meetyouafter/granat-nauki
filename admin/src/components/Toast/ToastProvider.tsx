import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import classNames from 'classnames'
import styles from './Toast.module.scss'

type ToastType = 'success' | 'error'

interface IToast {
  id: number
  type: ToastType
  message: string
}

interface IToastContext {
  notify: (type: ToastType, message: string) => void
}

const ToastContext = createContext<IToastContext | null>(null)

let nextToastId = 0

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<IToast[]>([])

  const notify = useCallback((type: ToastType, message: string) => {
    const id = nextToastId++
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className={styles.stack}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={classNames(styles.toast, toast.type === 'error' && styles.error)}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export default ToastProvider
