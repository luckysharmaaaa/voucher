import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Topbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <span className="topbar-brand">⬡ VoucherMS</span>
        <nav style={{ display: 'flex', gap: 4 }}>
          <button className="btn-secondary btn-sm" onClick={() => navigate('/vouchers')}>
            Index
          </button>
          <button className="btn-primary btn-sm" onClick={() => navigate('/vouchers/new')}>
            + New Voucher
          </button>
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className={`badge ${isAdmin ? 'badge-blue' : 'badge-green'}`}>
          {isAdmin ? '◈ Admin' : '◇ Staff'}
        </span>
        <span style={{ color: 'var(--text2)', fontSize: 13 }}>{user?.username}</span>
        <button className="btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
}
