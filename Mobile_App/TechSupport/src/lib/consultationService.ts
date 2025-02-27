import { supabase } from '../lib/supabase';

// Type for consultation data
interface ConsultationData {
  title: string;
  description: string;
  type: string;
  status?: string;
  solution_method?: string;
}

// Type for user error
interface UserError {
  message?: string;
}

/**
 * Save consultation data to both Supabase and localStorage
 * @param consultationData The consultation data to save
 * @returns Promise with the result of the operation
 */
export const saveConsultation = async (consultationData: ConsultationData) => {
  try {
    // First, check if we're logged in
    const { user, error: userError } = await getCurrentUser();
    
    if (userError || !user) {
      console.error('User not logged in:', userError ? 'Auth error' : 'Unknown error');
      // Fall back to localStorage only
      return saveToLocalStorage(consultationData);
    }
    
    // If logged in, save to Supabase
    const { data, error } = await supabase
      .from('consultations')
      .insert({
        user_id: user.id,
        title: consultationData.title,
        description: consultationData.description,
        type: consultationData.type,
        status: consultationData.status || 'pending',
        solution_method: consultationData.solution_method || null
      })
      .select();
    
    if (error) {
      console.error('Error saving to Supabase:', error.message);
      // Fall back to localStorage
      return saveToLocalStorage(consultationData);
    }
    
    // Also save to localStorage for offline access
    saveToLocalStorage(consultationData);
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in saveConsultation:', error instanceof Error ? error.message : 'Unknown error');
    // Fall back to localStorage
    return saveToLocalStorage(consultationData);
  }
};

/**
 * Get consultations from Supabase, falling back to localStorage if needed
 * @returns Promise with the consultation data
 */
export const getConsultations = async () => {
  try {
    // First, check if we're logged in
    const { user, error: userError } = await getCurrentUser();
    
    if (userError || !user) {
      console.error('User not logged in:', userError ? 'Auth error' : 'Unknown error');
      // Fall back to localStorage only
      return getFromLocalStorage();
    }
    
    // If logged in, get from Supabase
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error getting from Supabase:', error.message);
      // Fall back to localStorage
      return getFromLocalStorage();
    }
    
    // If no data in Supabase, fall back to localStorage
    if (!data || data.length === 0) {
      const localData = getFromLocalStorage();
      
      // If we have local data, sync it to Supabase
      if (localData && localData.length > 0) {
        await syncLocalToSupabase(localData, user.id);
        return localData;
      }
      
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error in getConsultations:', error instanceof Error ? error.message : 'Unknown error');
    // Fall back to localStorage
    return getFromLocalStorage();
  }
};

/**
 * Save consultation data to localStorage
 * @param consultationData The consultation data to save
 * @returns The saved data
 */
const saveToLocalStorage = (consultationData: ConsultationData) => {
  try {
    // Get existing consultations
    const existingConsultations = localStorage.getItem('consultations');
    let consultations = existingConsultations ? JSON.parse(existingConsultations) : [];
    
    // Add new consultation with timestamp
    const newConsultation = {
      id: `local-${Date.now()}`,
      ...consultationData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    consultations = [newConsultation, ...consultations];
    
    // Save back to localStorage
    localStorage.setItem('consultations', JSON.stringify(consultations));
    
    return { data: newConsultation, error: null };
  } catch (error) {
    console.error('Error saving to localStorage:', error instanceof Error ? error.message : 'Unknown error');
    return { data: null, error };
  }
};

/**
 * Get consultations from localStorage
 * @returns Array of consultations
 */
const getFromLocalStorage = () => {
  try {
    const consultations = localStorage.getItem('consultations');
    return consultations ? JSON.parse(consultations) : [];
  } catch (error) {
    console.error('Error getting from localStorage:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
};

/**
 * Sync local consultations to Supabase
 * @param localConsultations Array of local consultations
 * @param userId The user ID to associate with the consultations
 */
const syncLocalToSupabase = async (localConsultations: any[], userId: string) => {
  try {
    // Filter out consultations that don't have a local- prefix in their ID
    const onlyLocalConsultations = localConsultations.filter(c => 
      c.id && typeof c.id === 'string' && c.id.startsWith('local-')
    );
    
    if (onlyLocalConsultations.length === 0) return;
    
    // Prepare consultations for Supabase
    const consultationsForSupabase = onlyLocalConsultations.map(c => ({
      title: c.title,
      description: c.description,
      type: c.type,
      status: c.status || 'pending',
      solution_method: c.solution_method || null,
      user_id: userId,
      created_at: c.created_at || new Date().toISOString(),
      updated_at: c.updated_at || new Date().toISOString()
    }));
    
    // Insert into Supabase
    const { error } = await supabase
      .from('consultations')
      .insert(consultationsForSupabase);
    
    if (error) {
      console.error('Error syncing to Supabase:', error.message);
    } else {
      console.log('Successfully synced local consultations to Supabase');
      
      // Remove local consultations from localStorage
      const remainingConsultations = localConsultations.filter(c => 
        !c.id || typeof c.id !== 'string' || !c.id.startsWith('local-')
      );
      
      localStorage.setItem('consultations', JSON.stringify(remainingConsultations));
    }
  } catch (error) {
    console.error('Error in syncLocalToSupabase:', error instanceof Error ? error.message : 'Unknown error');
  }
};

/**
 * Get the current user
 * @returns Promise with the user data
 */
const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    console.error('Error getting current user:', error instanceof Error ? error.message : 'Unknown error');
    return { user: null, error };
  }
};
