import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext(null)

// ログイン状態をアプリ全体に提供するプロバイダー
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  // セッション確認が終わるまでtrue
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 初回表示時に現在のセッションを取得する
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // ログイン・ログアウトなどの状態変化を監視する
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// 認証情報を取得するカスタムフック
export function useAuth() {
  return useContext(AuthContext)
}
