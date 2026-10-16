import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import PropertyForm from '../components/PropertyForm'

// 物件一覧画面（ログイン必須）。一覧表示・登録・編集・削除を行う
export default function Properties() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // フォーム表示状態: null=非表示 / 'new'=新規登録 / 物件オブジェクト=編集対象
  const [formTarget, setFormTarget] = useState(null)

  // 物件一覧を取得する（RLSにより自分の物件のみ返る）
  const fetchProperties = useCallback(async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(`物件の取得に失敗しました: ${error.message}`)
    } else {
      setProperties(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  // 新規登録または更新を行う
  const handleSave = async (values) => {
    setError('')
    const isEdit = formTarget !== 'new'

    // 更新時は id で対象を絞る。登録時の user_id はDB側で自動設定される
    const { error } = isEdit
      ? await supabase.from('properties').update(values).eq('id', formTarget.id)
      : await supabase.from('properties').insert(values)

    if (error) {
      setError(`保存に失敗しました: ${error.message}`)
      return
    }
    setFormTarget(null)
    await fetchProperties()
  }

  // 物件を削除する
  const handleDelete = async (property) => {
    if (!window.confirm(`「${property.name}」を削除しますか？`)) return
    setError('')

    const { error } = await supabase.from('properties').delete().eq('id', property.id)

    if (error) {
      setError(`削除に失敗しました: ${error.message}`)
      return
    }
    await fetchProperties()
  }

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

      {error && <p className="error">{error}</p>}

      {formTarget ? (
        // key を変えて、編集対象が変わったときにフォームの入力値を初期化する
        <PropertyForm
          key={formTarget === 'new' ? 'new' : formTarget.id}
          initial={formTarget === 'new' ? null : formTarget}
          onSubmit={handleSave}
          onCancel={() => setFormTarget(null)}
        />
      ) : (
        <button className="add-button" onClick={() => setFormTarget('new')}>
          ＋ 物件を登録
        </button>
      )}

      {loading ? (
        <p className="message">読み込み中...</p>
      ) : properties.length === 0 ? (
        <p className="message">登録された物件はありません。</p>
      ) : (
        <ul className="card-list">
          {properties.map((p) => (
            <li key={p.id} className="card">
              <h2>{p.name}</h2>
              <p className="rent">¥{p.rent.toLocaleString()} / 月</p>
              <p className="area">
                {p.area}・{p.floor_plan}
              </p>
              <div className="card-actions">
                <button onClick={() => setFormTarget(p)}>編集</button>
                <button className="danger" onClick={() => handleDelete(p)}>
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
