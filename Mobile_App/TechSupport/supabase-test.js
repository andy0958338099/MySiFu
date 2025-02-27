const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://betmdsszdrsxcubpzhlx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJldG1kc3N6ZHJzeGN1YnB6aGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NjU0NDgsImV4cCI6MjA1NjE0MTQ0OH0.nPc07oVXTZvRHn5ZwNdf9QmxPMDQoJwdiCnk_AHuvIU';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

async function testSupabaseConnection() {
  try {
    // Test general connection
    console.log('Testing Supabase connection...');
    
    // Test auth
    console.log('Testing auth service...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('Auth error:', authError.message);
    } else {
      console.log('Auth service is working');
    }
    
    // Try to list all tables
    console.log('Trying to list available tables...');
    try {
      // This is a PostgreSQL query to list all tables in the public schema
      const { data: tables, error: tablesError } = await supabase
        .rpc('get_tables');
      
      if (tablesError) {
        console.error('Tables query error:', tablesError.message);
        
        // Try a different approach - check if consultations table exists
        console.log('Checking for consultations table...');
        const { data: consultations, error: consultationsError } = await supabase
          .from('consultations')
          .select('count');
          
        if (consultationsError) {
          console.error('Consultations table error:', consultationsError.message);
        } else {
          console.log('Consultations table exists:', consultations);
        }
      } else {
        console.log('Available tables:', tables);
      }
    } catch (e) {
      console.error('Table listing error:', e.message);
    }
    
    // Test if we can access storage
    console.log('Testing storage...');
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    if (storageError) {
      console.error('Storage error:', storageError.message);
    } else {
      console.log('Storage is working, buckets:', buckets);
    }
    
    return true;
  } catch (error) {
    console.error('Test failed:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

testSupabaseConnection();
