import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

// 未ログインの場合はログイン画面へリダイレクトするルート保護コンポーネント
export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) return <p className="message">読み込み中...</p>
  if (!session) return <Navigate to="/login" replace />

  return children
}
