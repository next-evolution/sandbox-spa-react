import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const GuardRegistration = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading, sandboxUser } = useAuth()

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (sandboxUser) return <Navigate to="/menu" replace />

  return <>{children}</>
}

export default GuardRegistration
