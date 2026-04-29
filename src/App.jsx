import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { VoucherProvider } from './context/VoucherContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import VoucherIndex from './pages/VoucherIndex'
import CreateVoucher from './pages/CreateVoucher'
import EditVoucher from './pages/EditVoucher'

export default function App() {
  return (
    <AuthProvider>
      <VoucherProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/vouchers" element={
                <ProtectedRoute><VoucherIndex /></ProtectedRoute>
              } />
              <Route path="/vouchers/new" element={
                <ProtectedRoute><CreateVoucher /></ProtectedRoute>
              } />
              <Route path="/vouchers/edit/:id" element={
                <ProtectedRoute adminOnly><EditVoucher /></ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/vouchers" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </VoucherProvider>
    </AuthProvider>
  )
}
