import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import { getUserProfile, updateUser } from '@/sandbox/api/user/userApi'
import type { SandboxUser } from '@/sandbox/dto/sandboxUser'
import { UserForm } from '@/pages/user/UserForm'

const ProfilePage = () => {
  const { sandboxUser, updateSandboxUser } = useAuth()
  const navigate = useNavigate()
  const { toast, showToast } = useToast()
  const [profile, setProfile] = useState<SandboxUser | null>(sandboxUser)
  const [isLoading, setIsLoading] = useState(!sandboxUser)

  useEffect(() => {
    if (sandboxUser) return
    void fetchProfile()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const res = await getUserProfile()
      if (res.returnCode === 0) {
        setProfile(res.user)
        updateSandboxUser(res.user)
      } else {
        showToast(res.message ?? 'プロフィールの取得に失敗しました', 'error')
      }
    } catch (e) {
      showToast((e as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (nickName: string) => {
    if (!profile) return
    if (nickName === profile.nickName) {
      showToast('変更なし', 'info')
      return
    }
    setIsLoading(true)
    try {
      const res = await updateUser(profile.userId, { nickName })
      if (res.returnCode !== 0) {
        showToast(res.message ?? 'エラーが発生しました', 'error')
      } else {
        updateSandboxUser(res.user)
        showToast('プロフィールを更新しました', 'info')
        navigate('/menu')
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
        isNew={false}
        email={profile?.emailAddress ?? ''}
        defaultNickName={profile?.nickName ?? ''}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
      {toast && <div className={`country-toast country-toast-${toast.type}`}>{toast.msg}</div>}
    </>
  )
}

export default ProfilePage
