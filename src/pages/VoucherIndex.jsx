import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVouchers } from '../context/VoucherContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Topbar from '../components/Topbar'

export default function VoucherIndex() {
  const { vouchers, deleteVoucher, SAMPLE_ACCOUNTS } = useVouchers()
  const { isAdmin } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const today = new Date().toISOString().split('T')[0]
  const [filters, setFilters] = useState({
    fromDate: '2026-01-01', toDate: today,
    vocType: 'ALL', mode: 'ALL', accountHead: 'ALL',
    narration: '', fromVocNo: '', toVocNo: ''
  })
  const [deleteId, setDeleteId] = useState(null)
  const [applied, setApplied] = useState(filters)

  const setF = (k, v) => setFilters(p => ({ ...p, [k]: v }))

  const filtered = vouchers.filter(v => {
    if (applied.fromDate && v.date < applied.fromDate) return false
    if (applied.toDate && v.date > applied.toDate) return false
    if (applied.vocType !== 'ALL' && v.vocType !== applied.vocType) return false
    if (applied.accountHead !== 'ALL' && v.accountHead !== applied.accountHead) return false
    if (applied.narration) {
      const has = v.rows?.some(r => r.narration?.toLowerCase().includes(applied.narration.toLowerCase()))
      if (!has) return false
    }
    if (applied.fromVocNo && v.vocNo < parseInt(applied.fromVocNo)) return false
    if (applied.toVocNo && v.vocNo > parseInt(applied.toVocNo)) return false
    return true
  })

  const handleDelete = () => {
    deleteVoucher(deleteId)
    setDeleteId(null)
    toast('Voucher deleted successfully!')
  }

  return (
    <div className="page">
      <Topbar />
      <div style={{ padding: 24 }}>
        {/* Filters */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="form-row" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 14 }}>
            <div className="form-group">
              <label>From Date</label>
              <input type="date" value={filters.fromDate} onChange={e => setF('fromDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label>To Date</label>
              <input type="date" value={filters.toDate} onChange={e => setF('toDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Voucher Type</label>
              <select value={filters.vocType} onChange={e => setF('vocType', e.target.value)}>
                <option>ALL</option>
                <option>Payment</option>
                <option>Received</option>
              </select>
            </div>
            <div className="form-group">
              <label>Mode</label>
              <select value={filters.mode} onChange={e => setF('mode', e.target.value)}>
                <option>ALL</option>
                <option>Cash</option>
                <option>Bank</option>
                <option>NA</option>
              </select>
            </div>
            <div className="form-group">
              <label>Account Head</label>
              <select value={filters.accountHead} onChange={e => setF('accountHead', e.target.value)}>
                <option>ALL</option>
                {SAMPLE_ACCOUNTS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr auto' }}>
            <div className="form-group">
              <label>Narration Search</label>
              <input placeholder="Search narration..." value={filters.narration} onChange={e => setF('narration', e.target.value)} />
            </div>
            <div className="form-group">
              <label>From Voc No</label>
              <input placeholder="e.g. 1" value={filters.fromVocNo} onChange={e => setF('fromVocNo', e.target.value)} type="number" />
            </div>
            <div className="form-group">
              <label>To Voc No</label>
              <input placeholder="e.g. 50" value={filters.toVocNo} onChange={e => setF('toVocNo', e.target.value)} type="number" />
            </div>
            <div className="form-group" style={{ justifyContent: 'flex-end' }}>
              <label>&nbsp;</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-primary" onClick={() => setApplied({ ...filters })}>Search</button>
                <button className="btn-secondary" onClick={() => {
                  const reset = { fromDate: '2026-01-01', toDate: today, vocType: 'ALL', mode: 'ALL', accountHead: 'ALL', narration: '', fromVocNo: '', toVocNo: '' }
                  setFilters(reset); setApplied(reset)
                }}>Reset</button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '14px 20px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <h2 style={{ fontSize: 14, fontWeight: 600 }}>Voucher Entry | Index</h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>{filtered.length} records</span>
              <button className="btn-primary btn-sm" onClick={() => navigate('/vouchers/new')}>+ New</button>
            </div>
          </div>
          <div className="table-wrap" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Voc Date</th>
                  <th>Voc No</th>
                  <th>Type</th>
                  <th>Account Head</th>
                  <th>Narration</th>
                  <th>Total Debit</th>
                  <th>Total Credit</th>
                  {isAdmin && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 8 : 7} style={{ textAlign: 'center', padding: 32, color: 'var(--text3)' }}>
                      No data found
                    </td>
                  </tr>
                ) : filtered.map(v => {
                  const dr = (v.rows || []).reduce((s, r) => r.vocType === 'Debit' ? s + (parseFloat(r.amt) || 0) : s, 0)
                  const cr = (v.rows || []).reduce((s, r) => r.vocType === 'Credit' ? s + (parseFloat(r.amt) || 0) : s, 0)
                  const narrations = [...new Set((v.rows || []).map(r => r.narration).filter(Boolean))].join(', ')
                  return (
                    <tr key={v.id}>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{v.date}</td>
                      <td>
                        <span className="badge badge-blue">V{String(v.vocNo).padStart(4, '0')}</span>
                      </td>
                      <td>
                        <span className={`badge ${v.vocType === 'Payment' ? 'badge-red' : 'badge-green'}`}>
                          {v.vocType}
                        </span>
                      </td>
                      <td>{v.accountHead || '—'}</td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text2)' }}>
                        {narrations || '—'}
                      </td>
                      <td style={{ fontFamily: 'var(--mono)', color: 'var(--accent-red)' }}>
                        {dr > 0 ? dr.toFixed(2) : '—'}
                      </td>
                      <td style={{ fontFamily: 'var(--mono)', color: 'var(--accent-green)' }}>
                        {cr > 0 ? cr.toFixed(2) : '—'}
                      </td>
                      {isAdmin && (
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn-primary btn-sm" onClick={() => navigate(`/vouchers/edit/${v.id}`)}>Edit</button>
                            <button className="btn-danger btn-sm" onClick={() => setDeleteId(v.id)}>Delete</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>⚠ Confirm Delete</h3>
            <p>Are you sure you want to delete this voucher? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
