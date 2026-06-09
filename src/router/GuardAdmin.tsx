import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const GuardAdmin = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading, sandboxUser } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  if (sandboxUser?.blocked) return <Navigate to="/error/blocked" replace />
  if (sandboxUser && !sandboxUser.approved) return <Navigate to="/pending-approval" replace />
  if (sandboxUser && !sandboxUser.admin) return <Navigate to="/error/forbidden" replace />

  return <>{children}</>
}

export default GuardAdmin
