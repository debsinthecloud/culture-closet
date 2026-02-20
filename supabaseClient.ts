import { createClient } from '@supabase/supabase-js'

// These lines pull your secret keys from Vercel/Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// This creates the "connection" your app will use
export const supabase = createClient(supabaseUrl, supabaseAnonKey)