// Import createClient from the ESM build of supabase-js (works in browser modules)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://xoygtzpykudnstssnraz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveWd0enB5a3VkbnN0c3NucmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNjIxNzksImV4cCI6MjA5ODczODE3OX0.Ry8St4767fSYaUwcVcEpoTfM0iGSuPI-kQXAtwW4ZU4'

export const Supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Basic runtime check to help debug loading issues
if (!Supabase) console.error('Supabase client failed to initialize')