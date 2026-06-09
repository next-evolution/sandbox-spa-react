import { useEffect, useState } from 'react'

export interface Toast {
  msg: string
  type: 'info' | 'error'
}

export const useToast = () => {
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  const showToast = (msg: string, type: 'info' | 'error') => setToast({ msg, type })

  return { toast, showToast }
}
