import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'

// 会員登録画面
export default function Signup() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ログイン済みなら物件一覧へ
  if (!loading && session) return <Navigate to="/properties" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setSubmitting(true)

    const { data, error } = await supabase.auth.signUp({ email, password })

    setSubmitting(false)
    if (error) {
      setError(`会員登録に失敗しました: ${error.message}`)
      return
    }

    if (data.session) {
      // メール確認が不要な設定の場合はそのままログイン状態になる
      navigate('/properties')
    } else {
      // メール確認が必要な設定の場合は案内を表示する
      setInfo('確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。')
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>会員登録</h1>
        <label>
          メールアドレス
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          パスワード（6文字以上）
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        {info && <p className="info">{info}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? '登録中...' : '会員登録'}
        </button>
        <p className="switch">
          既にアカウントをお持ちの方は <Link to="/login">ログイン</Link>
        </p>
      </form>
    </div>
  )
}
