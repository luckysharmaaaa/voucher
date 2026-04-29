import { createContext, useContext, useState } from 'react'

const VoucherContext = createContext(null)

const SAMPLE_ACCOUNTS = [
  'Cash', 'Bank', 'Sales', 'Purchase', 'Salary',
  'Rent', 'Electricity', 'Sundry Debtors', 'Sundry Creditors', 'Capital'
]

const TDS_TYPES = ['194A - Interest', '194C - Contractor', '194H - Commission', '194I - Rent', '194J - Professional']

export function VoucherProvider({ children }) {
  const [vouchers, setVouchers] = useState(() => {
    const saved = localStorage.getItem('vms_vouchers')
    return saved ? JSON.parse(saved) : []
  })

  const save = (updated) => {
    setVouchers(updated)
    localStorage.setItem('vms_vouchers', JSON.stringify(updated))
  }

  const addVoucher = (voucher) => {
    const newVoucher = {
      ...voucher,
      id: Date.now().toString(),
      vocNo: vouchers.length + 1,
      createdAt: new Date().toISOString(),
    }
    save([...vouchers, newVoucher])
    return newVoucher
  }

  const updateVoucher = (id, data) => {
    save(vouchers.map(v => v.id === id ? { ...v, ...data } : v))
  }

  const deleteVoucher = (id) => {
    save(vouchers.filter(v => v.id !== id))
  }

  const getVoucher = (id) => vouchers.find(v => v.id === id)

  return (
    <VoucherContext.Provider value={{
      vouchers, addVoucher, updateVoucher, deleteVoucher, getVoucher,
      SAMPLE_ACCOUNTS, TDS_TYPES
    }}>
      {children}
    </VoucherContext.Provider>
  )
}

export const useVouchers = () => useContext(VoucherContext)
