import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import { searchUsers, approveUser, updateAdminUser, blockUser } from '@/sandbox/api/admin/usersApi'
import type { SandboxUser, UsersSearchRequest, UserSearchResponse } from '@/sandbox/dto/admin/users'
import { AdminUsersHeaderRow } from './header-row'
import { AdminUsersMainTable } from './main-table'

const DEFAULT_REQUEST: UsersSearchRequest = {
  page: 1,
  size: 10,
  emailAddress: '',
  approved: null,
}

const emptyResponse = (): UserSearchResponse => ({
  returnCode: 0,
  totalCount: 0,
  searchCount: 0,
  totalPage: 1,
  list: [],
})

const AdminUsersPage = () => {
  const { toast, showToast } = useToast()
  const [searchReq, setSearchReq] = useState<UsersSearchRequest>(DEFAULT_REQUEST)
  const [searchRes, setSearchRes] = useState<UserSearchResponse>(emptyResponse())
  const [userList, setUserList] = useState<SandboxUser[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const doSearch = async (req: UsersSearchRequest) => {
    setIsLoading(true)
    try {
      const res = await searchUsers(req)
      setSearchRes(res)
      setUserList(res.list)
      setSearchReq(req)
    } catch (e) {
      showToast((e as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void doSearch(DEFAULT_REQUEST)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleApprove = async (index: number) => {
    if (!window.confirm('承認しますか？')) return
    setIsLoading(true)
    try {
      const res = await approveUser(userList[index].userId)
      if (res.returnCode !== 0) {
        showToast(res.message ?? 'エラーが発生しました', 'error')
      } else {
        setUserList((prev) => prev.map((u, i) => (i === index ? res.user : u)))
        showToast('ユーザーを承認しました', 'info')
      }
    } catch (e) {
      showToast((e as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdmin = async (index: number, admin: boolean) => {
    if (!window.confirm(admin ? '管理者権限を割り当てますか？' : '管理者権限を削除しますか？'))
      return
    setIsLoading(true)
    try {
      const res = await updateAdminUser(userList[index].userId, admin)
      if (res.returnCode !== 0) {
        showToast(res.message ?? 'エラーが発生しました', 'error')
      } else {
        setUserList((prev) => prev.map((u, i) => (i === index ? res.user : u)))
        showToast(admin ? '管理者権限を割り当てました' : '管理者権限を削除しました', 'info')
      }
    } catch (e) {
      showToast((e as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBlock = async (index: number, blocked: boolean) => {
    if (!window.confirm(blocked ? 'blockしますか？' : 'blockを解除しますか？')) return
    setIsLoading(true)
    try {
      const res = await blockUser(userList[index].userId, blocked)
      if (res.returnCode !== 0) {
        showToast(res.message ?? 'エラーが発生しました', 'error')
      } else {
        setUserList((prev) => prev.map((u, i) => (i === index ? res.user : u)))
        showToast(blocked ? 'ユーザーをblockしました' : 'ユーザーのblockを解除しました', 'info')
      }
    } catch (e) {
      showToast((e as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header" style={{ marginBottom: 8 }}>
        <div>
          <div className="page-eyebrow">Admin</div>
          <h1 className="page-title">Users</h1>
        </div>
        {isLoading && (
          <div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
        )}
      </div>

      <AdminUsersHeaderRow
        searchReq={searchReq}
        searchRes={searchRes}
        onPageChange={(p) => void doSearch({ ...searchReq, page: p })}
        onSizeChange={(s) => void doSearch({ ...searchReq, page: 1, size: s })}
        onFilterChange={setSearchReq}
        onSearch={() => void doSearch({ ...searchReq, page: 1 })}
      />

      <AdminUsersMainTable
        list={userList}
        onApprove={(i) => void handleApprove(i)}
        onAdmin={(i, a) => void handleAdmin(i, a)}
        onBlock={(i, b) => void handleBlock(i, b)}
      />

      {toast && <div className={`country-toast country-toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}

export default AdminUsersPage
