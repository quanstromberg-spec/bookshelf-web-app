import { supabase } from './supabase'

export async function testSupabaseConnection() {
  console.log('Testing Supabase connection...')

  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('books')
      .select('count', { count: 'exact' })

    if (error) {
      console.error('Supabase connection error:', error)
      return { success: false, error }
    }

    console.log('Supabase connection successful. Book count:', data)
    return { success: true, data }
  } catch (err) {
    console.error('Connection test failed:', err)
    return { success: false, error: err }
  }
}

// Test the connection immediately
testSupabaseConnection()