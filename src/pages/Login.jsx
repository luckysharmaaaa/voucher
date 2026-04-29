import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTimeout(() => {
      const result = login(form.username, form.password)
      if (result.success) {
        navigate('/vouchers')
      } else {
        setError(result.error)
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)',
      backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(79,124,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(124,92,252,0.06) 0%, transparent 50%)'
    }}>
      <div style={{ width: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(79,124,255,0.35)'
          }}>⬡</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>VoucherMS</h1>
          <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>Voucher Management System</p>
        </div>

        {/* Card */}
        <div className="card" style={{ borderColor: 'var(--border2)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Sign in to continue</h2>

          {error && (
            <div style={{
              background: 'rgba(255,79,79,0.1)', border: '1px solid rgba(255,79,79,0.3)',
              borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 16,
              color: 'var(--accent-red)', fontSize: 13
            }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text" placeholder="Enter username"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                required autoFocus
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password" placeholder="Enter password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
              />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: 4, padding: '10px', fontSize: 14 }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
        </div>

        {/* Hints */}
        <div style={{
          marginTop: 20, padding: '14px 16px',
          background: 'rgba(79,124,255,0.06)', border: '1px solid rgba(79,124,255,0.15)',
          borderRadius: 'var(--radius)', fontSize: 12, color: 'var(--text3)'
        }}>
          <p style={{ marginBottom: 6, color: 'var(--text2)', fontWeight: 600 }}>Demo credentials:</p>
          <p>Admin: <code style={{ color: 'var(--accent)' }}>admin / admin123</code></p>
          <p style={{ marginTop: 2 }}>Staff: <code style={{ color: 'var(--accent-green)' }}>staff / staff123</code></p>
        </div>
      </div>
    </div>
  )
}
