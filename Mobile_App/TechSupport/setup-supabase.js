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

async function setupDatabase() {
  try {
    console.log('Setting up Supabase database tables...');
    
    // Create profiles table
    console.log('Creating profiles table...');
    const createProfilesTable = await supabase.rpc('create_profiles_table', {});
    if (createProfilesTable.error) {
      console.error('Error creating profiles table:', createProfilesTable.error.message);
      
      // Alternative approach using REST API
      console.log('Trying alternative approach for profiles table...');
      // This is a PostgreSQL query that will be executed via the REST API
      const { error: restError } = await supabase.from('profiles').insert([
        { 
          id: '00000000-0000-0000-0000-000000000000',
          username: 'test_user',
          email: 'test@example.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ], { upsert: true });
      
      if (restError) {
        if (restError.message.includes('does not exist')) {
          console.log('Profiles table does not exist. You need to create it in the Supabase dashboard.');
          console.log('SQL to create profiles table:');
          console.log(`
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);
          `);
        } else {
          console.error('Error with profiles table:', restError.message);
        }
      } else {
        console.log('Successfully created a test profile!');
      }
    } else {
      console.log('Successfully created profiles table!');
    }
    
    // Create consultations table
    console.log('Creating consultations table...');
    const createConsultationsTable = await supabase.rpc('create_consultations_table', {});
    if (createConsultationsTable.error) {
      console.error('Error creating consultations table:', createConsultationsTable.error.message);
      
      // Alternative approach using REST API
      console.log('Trying alternative approach for consultations table...');
      const { error: restError } = await supabase.from('consultations').insert([
        { 
          id: '00000000-0000-0000-0000-000000000000',
          user_id: '00000000-0000-0000-0000-000000000000',
          title: 'Test Consultation',
          description: 'This is a test consultation',
          type: 'AI對話',
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ], { upsert: true });
      
      if (restError) {
        if (restError.message.includes('does not exist')) {
          console.log('Consultations table does not exist. You need to create it in the Supabase dashboard.');
          console.log('SQL to create consultations table:');
          console.log(`
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own consultations" 
  ON public.consultations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consultations" 
  ON public.consultations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consultations" 
  ON public.consultations FOR UPDATE 
  USING (auth.uid() = user_id);
          `);
        } else {
          console.error('Error with consultations table:', restError.message);
        }
      } else {
        console.log('Successfully created a test consultation!');
      }
    } else {
      console.log('Successfully created consultations table!');
    }
    
    // Create storage bucket for consultation attachments
    console.log('Creating storage bucket for consultation attachments...');
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('consultation-attachments', {
      public: false,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'application/pdf', 'text/plain'],
      fileSizeLimit: 10485760 // 10MB
    });
    
    if (bucketError) {
      console.error('Error creating storage bucket:', bucketError.message);
    } else {
      console.log('Successfully created storage bucket!', bucket);
    }
    
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Setup failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

setupDatabase();
