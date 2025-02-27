import { supabase } from '../lib/supabase';

async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('count');
    if (error) {
      console.error('Connection error:', error.message);
      return false;
    }
    console.log('Successfully connected to Supabase!');
    return true;
  } catch (error) {
    console.error('Test failed:', error instanceof Error ? error.message : '未知錯誤');
    return false;
  }
}

testSupabaseConnection();
