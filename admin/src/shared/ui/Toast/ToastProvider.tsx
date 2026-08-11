import { type ReactNode, useCallback, useState } from 'react'

import classNames from 'classnames'

import { ToastContext, type ToastType } from './ToastContext'

import styles from './Toast.module.scss'

interface IToast {
  id: number
  type: ToastType
  message: string
}

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

export default ToastProvider
