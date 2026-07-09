import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'URL_CỦA_BẠN'
const supabaseKey = 'ANON_KEY_CỦA_BẠN'
export const supabase = createClient(supabaseUrl, supabaseKey)