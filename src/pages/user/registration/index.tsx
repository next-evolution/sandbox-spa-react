import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import { registerUser } from '@/sandbox/api/user/userApi'
import { UserForm } from '@/pages/user/UserForm'

const RegistrationPage = () => {
  const { email, updateSandboxUser } = useAuth()
  const navigate = useNavigate()
  const { toast, showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (nickName: string) => {
    setIsLoading(true)
    try {
      const res = await registerUser({ nickName })
      if (res.returnCode !== 0) {
        showToast(res.message ?? 'エラーが発生しました', 'error')
      } else {
        updateSandboxUser(res.user)
        navigate('/menu', { replace: true })
      }
    } catch (e) {
      showToast((e as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <UserForm
        isNew={true}
        email={email ?? ''}
        defaultNickName=""
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
      {toast && <div className={`country-toast country-toast-${toast.type}`}>{toast.msg}</div>}
    </>
  )
}

export default RegistrationPage
