import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'

// 表示用のダミー物件データ
const PROPERTIES = [
  { id: 1, name: 'グランドメゾン渋谷', rent: 185000, area: '東京都渋谷区' },
  { id: 2, name: 'パークハイツ新宿', rent: 142000, area: '東京都新宿区' },
  { id: 3, name: 'シティコート横浜', rent: 98000, area: '神奈川県横浜市' },
  { id: 4, name: 'リバーサイド大阪', rent: 86000, area: '大阪府大阪市' },
  { id: 5, name: 'サンライズ名古屋', rent: 74000, area: '愛知県名古屋市' },
  { id: 6, name: 'ベイサイド福岡', rent: 68000, area: '福岡県福岡市' },
]

// 物件一覧画面（ログイン必須）
export default function Properties() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // ログアウトしてログイン画面へ戻る
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="page">
      <header className="header">
        <h1>物件一覧</h1>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button className="logout" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </header>

      <ul className="card-list">
        {PROPERTIES.map((p) => (
          <li key={p.id} className="card">
            <h2>{p.name}</h2>
            <p className="rent">¥{p.rent.toLocaleString()} / 月</p>
            <p className="area">{p.area}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
