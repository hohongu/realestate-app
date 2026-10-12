import { createClient } from '@supabase/supabase-js'

// 環境変数からSupabaseの接続情報を取得する
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('.env に VITE_SUPABASE_URL と VITE_SUPABASE_PUBLISHABLE_KEY を設定してください')
}

// アプリ全体で共有するSupabaseクライアント
export const supabase = createClient(supabaseUrl, supabaseKey)
