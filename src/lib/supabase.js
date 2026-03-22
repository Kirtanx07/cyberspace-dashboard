// src/lib/supabase.js

import { createClient } from '@supabase/supabase-js'

// ✅ Check if env variables exist
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON

// ✅ Only create client if env exists
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

// ─────────────────────────────────────────────
// SAFE HELPERS (won’t break your app)
// ─────────────────────────────────────────────

// ✅ Resources
export async function fetchResources(userId) {
  if (!supabase) return [] // fallback

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase fetch error:', error)
    return []
  }

  return data
}

export async function upsertResource(userId, resource) {
  if (!supabase) return resource // fallback

  const { data, error } = await supabase
    .from('resources')
    .upsert({
      ...resource,
      user_id: userId,
      updated_at: new Date().toISOString(),
    })
    .select()

  if (error) {
    console.error('Supabase upsert error:', error)
    return resource
  }

  return data?.[0]
}

export async function removeResource(id) {
  if (!supabase) return

  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Supabase delete error:', error)
  }
}

// ─────────────────────────────────────────────
// FILE UPLOAD (SAFE)
// ─────────────────────────────────────────────

export async function uploadFile(file, userId) {
  if (!supabase) return null

  const path = `${userId}/${Date.now()}_${file.name}`

  const { error } = await supabase.storage
    .from('user-files')
    .upload(path, file)

  if (error) {
    console.error('Upload error:', error)
    return null
  }

  const { data } = supabase.storage
    .from('user-files')
    .getPublicUrl(path)

  return data?.publicUrl
}
