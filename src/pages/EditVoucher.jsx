import { useParams } from 'react-router-dom'
import Topbar from '../components/Topbar'
import VoucherForm from '../components/VoucherForm'

export default function EditVoucher() {
  const { id } = useParams()
  return (
    <div className="page">
      <Topbar />
      <VoucherForm editId={id} />
    </div>
  )
}
