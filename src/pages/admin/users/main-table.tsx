import type { SandboxUser } from '@/sandbox/dto/admin/users'

const dangerSm: React.CSSProperties = { padding: '6px 14px', fontSize: '0.75rem' }

interface Props {
  list: SandboxUser[]
  onApprove: (index: number) => void
  onAdmin: (index: number, isAdmin: boolean) => void
  onBlock: (index: number, blocked: boolean) => void
}

export const AdminUsersMainTable = ({ list, onApprove, onAdmin, onBlock }: Props) => {
  if (list.length === 0) {
    return <div className="country-empty">データがありません</div>
  }

  return (
    <div className="country-table-wrap">
      <table className="country-table">
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>No.</th>
            <th>UserId / Email</th>
            <th>NickName</th>
            <th style={{ textAlign: 'center' }}>Approved</th>
            <th style={{ textAlign: 'center' }}>Admin</th>
            <th style={{ textAlign: 'center' }}>Blocked</th>
            <th>Created / Updated</th>
          </tr>
        </thead>
        <tbody>
          {list.map((user, index) => (
            <tr key={user.id} style={{ cursor: 'default' }}>
              <td style={{ textAlign: 'center' }}>{user.id}</td>
              <td>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {user.userId}
                </span>
                <br />
                {user.emailAddress}
              </td>
              <td>{user.nickName}</td>
              <td style={{ textAlign: 'center' }}>
                {user.approved ? (
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {user.approvedAt?.split('T')[0] ?? ''}
                  </span>
                ) : (
                  <button className="btn-primary btn-sm" onClick={() => onApprove(index)}>
                    承認
                  </button>
                )}
              </td>
              <td style={{ textAlign: 'center' }}>
                {user.admin ? (
                  <button className="btn-danger" style={dangerSm} onClick={() => onAdmin(index, false)}>
                    剥奪
                  </button>
                ) : (
                  <button className="btn-outline-sm" onClick={() => onAdmin(index, true)}>
                    割当
                  </button>
                )}
              </td>
              <td style={{ textAlign: 'center' }}>
                {user.blocked ? (
                  <button className="btn-outline-sm" onClick={() => onBlock(index, false)}>
                    unblock
                  </button>
                ) : (
                  <button className="btn-danger" style={dangerSm} onClick={() => onBlock(index, true)}>
                    block
                  </button>
                )}
              </td>
              <td>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  C: {user.createdAt}
                  <br />
                  U: {user.updatedAt}
                </small>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
