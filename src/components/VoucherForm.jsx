import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVouchers } from '../context/VoucherContext'
import { useToast } from '../context/ToastContext'

const newRow = () => ({
  id: Date.now() + Math.random(),
  accountHead: '',
  narration: 'On Account',
  billNo: '',
  amt: '',
  mode: 'NA',
  referenceNo: '',
  vocType: 'Debit',
  tdsApplicable: 'No',
  tdsType: '',
})

export default function VoucherForm({ editId }) {
  const { addVoucher, updateVoucher, getVoucher, SAMPLE_ACCOUNTS, TDS_TYPES } = useVouchers()
  const { toast } = useToast()
  const navigate = useNavigate()
  const isEdit = !!editId

  const [header, setHeader] = useState({
    group: 'CASH',
    date: new Date().toISOString().split('T')[0],
    vocType: 'Payment',
    remarks: '',
    accountHead: '',
    closingBal: '',
  })
  const [rows, setRows] = useState([newRow()])

  useEffect(() => {
    if (isEdit) {
      const v = getVoucher(editId)
      if (v) {
        setHeader({
          group: v.group, date: v.date, vocType: v.vocType,
          remarks: v.remarks, accountHead: v.accountHead, closingBal: v.closingBal
        })
        setRows(v.rows)
      }
    }
  }, [editId])

  const totalDR = rows.reduce((s, r) => r.vocType === 'Debit' ? s + (parseFloat(r.amt) || 0) : s, 0)
  const totalCR = rows.reduce((s, r) => r.vocType === 'Credit' ? s + (parseFloat(r.amt) || 0) : s, 0)

  const updateRow = (id, field, value) => {
    setRows(prev => prev.map(r => r.id === id ? {
      ...r, [field]: value,
      ...(field === 'tdsApplicable' && value === 'No' ? { tdsType: '' } : {})
    } : r))
  }

  const addRow = () => setRows(prev => [...prev, newRow()])
  const removeRow = (id) => setRows(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev)

  const handleSave = () => {
    if (!header.date || !header.vocType) { toast('Please fill required header fields', 'error'); return }
    const payload = { ...header, rows }
    if (isEdit) {
      updateVoucher(editId, payload)
      toast('Voucher updated successfully!')
    } else {
      addVoucher(payload)
      toast('Voucher created successfully!')
    }
    navigate('/vouchers')
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-secondary btn-sm" onClick={() => navigate('/vouchers')}>← Show All</button>
          <button className="btn-primary btn-sm" onClick={() => navigate('/vouchers/new')}>+ Add New Voucher</button>
        </div>
        <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text2)' }}>
          Voucher Entry | <span style={{ color: 'var(--text)' }}>{isEdit ? 'Edit' : 'Create'}</span>
        </div>
        <button className="btn-success" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          💾 Save
        </button>
      </div>

      {/* Header fields */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="form-row" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
          <div className="form-group">
            <label>Group</label>
            <input value={header.group} onChange={e => setHeader(p => ({ ...p, group: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={header.date} onChange={e => setHeader(p => ({ ...p, date: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Voc Type</label>
            <select value={header.vocType} onChange={e => setHeader(p => ({ ...p, vocType: e.target.value }))}>
              <option>Payment</option>
              <option>Received</option>
            </select>
          </div>
          <div className="form-group">
            <label>Remarks</label>
            <input value={header.remarks} onChange={e => setHeader(p => ({ ...p, remarks: e.target.value }))} placeholder="Remarks" />
          </div>
          <div className="form-group">
            <label>Account Head</label>
            <select value={header.accountHead} onChange={e => setHeader(p => ({ ...p, accountHead: e.target.value }))}>
              <option value="">Select Account Head</option>
              {SAMPLE_ACCOUNTS.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Closing Balance</label>
            <input value={header.closingBal} onChange={e => setHeader(p => ({ ...p, closingBal: e.target.value }))} placeholder="0.00" type="number" />
          </div>
        </div>
      </div>

      {/* Rows Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th style={{ minWidth: 160 }}>Account Head</th>
                <th style={{ minWidth: 120 }}>Narration</th>
                <th style={{ minWidth: 90 }}>Bill No</th>
                <th style={{ minWidth: 90 }}>Amount</th>
                <th style={{ minWidth: 80 }}>Mode</th>
                <th style={{ minWidth: 100 }}>Reference No</th>
                <th style={{ minWidth: 80 }}>Voc Type</th>
                <th style={{ minWidth: 60 }}>TDS</th>
                <th style={{ minWidth: 130 }}>TDS Type</th>
                <th style={{ minWidth: 70 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td>
                    <select value={row.accountHead} onChange={e => updateRow(row.id, 'accountHead', e.target.value)}>
                      <option value="">Select</option>
                      {SAMPLE_ACCOUNTS.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </td>
                  <td>
                    <input
                      value={row.narration}
                      onFocus={e => { if (e.target.value === 'On Account') updateRow(row.id, 'narration', '') }}
                      onChange={e => updateRow(row.id, 'narration', e.target.value)}
                      onBlur={e => { if (!e.target.value) updateRow(row.id, 'narration', 'On Account') }}
                    />
                  </td>
                  <td>
                    <button className="btn-warning btn-sm" style={{ fontSize: 11 }}>Select</button>
                  </td>
                  <td>
                    <input type="number" value={row.amt} onChange={e => updateRow(row.id, 'amt', e.target.value)} placeholder="0.00" />
                  </td>
                  <td>
                    <input value={row.mode} onChange={e => updateRow(row.id, 'mode', e.target.value)} placeholder="NA" />
                  </td>
                  <td>
                    <input value={row.referenceNo} onChange={e => updateRow(row.id, 'referenceNo', e.target.value)} />
                  </td>
                  <td>
                    <select value={row.vocType} onChange={e => updateRow(row.id, 'vocType', e.target.value)}>
                      <option>Debit</option>
                      <option>Credit</option>
                    </select>
                  </td>
                  <td>
                    <select value={row.tdsApplicable} onChange={e => updateRow(row.id, 'tdsApplicable', e.target.value)}>
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </td>
                  <td>
                    {row.tdsApplicable === 'Yes' ? (
                      <select value={row.tdsType} onChange={e => updateRow(row.id, 'tdsType', e.target.value)}>
                        <option value="">Select</option>
                        {TDS_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    ) : (
                      <span style={{ color: 'var(--text3)', fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <button className="btn-primary btn-icon" title="Add row" onClick={addRow}>+</button>
                      <button className="btn-danger btn-icon" title="Remove row" onClick={() => removeRow(row.id)}>×</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div style={{
          display: 'flex', gap: 24, padding: '14px 20px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg3)', alignItems: 'center', flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600, whiteSpace: 'nowrap' }}>Total DR Amt</label>
            <input
              readOnly value={totalDR.toFixed(2)}
              style={{ width: 120, background: 'var(--bg2)', cursor: 'default', fontFamily: 'var(--mono)', color: 'var(--accent-red)' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600, whiteSpace: 'nowrap' }}>Total CR Amt</label>
            <input
              readOnly value={totalCR.toFixed(2)}
              style={{ width: 120, background: 'var(--bg2)', cursor: 'default', fontFamily: 'var(--mono)', color: 'var(--accent-green)' }}
            />
          </div>
          <span style={{ fontSize: 12, color: 'var(--text3)', marginLeft: 'auto' }}>Bill Ref Module Totals</span>
        </div>
      </div>
    </div>
  )
}
