import { supabase } from './supabase';

// Type for expert response data
interface ExpertResponseData {
  consultation_id: string;
  complexity: number;
  estimated_time: string;
  suggested_price: string;
  response_message: string;
  status: string;
}

/**
 * Save expert's response to a consultation request
 * @param responseData The expert's response data
 * @returns Promise with the result of the operation
 */
export const saveExpertResponse = async (responseData: ExpertResponseData) => {
  try {
    // Get the current user (expert)
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('Expert not logged in:', userError ? userError.message : 'Unknown error');
      throw new Error('Authentication error');
    }
    
    // Save the response to Supabase
    const { data, error } = await supabase
      .from('expert_responses')
      .insert({
        expert_id: userData.user.id,
        consultation_id: responseData.consultation_id,
        complexity: responseData.complexity,
        estimated_time: responseData.estimated_time,
        suggested_price: responseData.suggested_price,
        response_message: responseData.response_message,
        status: responseData.status || 'pending'
      })
      .select();
    
    if (error) {
      console.error('Error saving expert response:', error.message);
      throw error;
    }
    
    // Update the consultation status
    const { error: updateError } = await supabase
      .from('consultations')
      .update({ status: responseData.status })
      .eq('id', responseData.consultation_id);
    
    if (updateError) {
      console.error('Error updating consultation status:', updateError.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error in saveExpertResponse:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

/**
 * Get all pending consultation requests
 * @returns Promise with the consultation requests
 */
export const getPendingConsultations = async () => {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        profiles:user_id (username, full_name, avatar_url)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error getting pending consultations:', error.message);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getPendingConsultations:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

/**
 * Get a specific consultation request by ID
 * @param consultationId The ID of the consultation to retrieve
 * @returns Promise with the consultation data
 */
export const getConsultationById = async (consultationId: string) => {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        profiles:user_id (username, full_name, avatar_url)
      `)
      .eq('id', consultationId)
      .single();
    
    if (error) {
      console.error('Error getting consultation:', error.message);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getConsultationById:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

/**
 * Accept a consultation request
 * @param consultationId The ID of the consultation to accept
 * @returns Promise with the result of the operation
 */
export const acceptConsultation = async (consultationId: string) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('Expert not logged in:', userError ? userError.message : 'Unknown error');
      throw new Error('Authentication error');
    }
    
    const { data, error } = await supabase
      .from('consultations')
      .update({
        status: 'accepted',
        expert_id: userData.user.id
      })
      .eq('id', consultationId)
      .select();
    
    if (error) {
      console.error('Error accepting consultation:', error.message);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in acceptConsultation:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

/**
 * Get all consultations for the current expert
 * @param status Optional status filter ('pending', 'active', 'completed', or 'all')
 * @returns Promise with the consultation requests
 */
export const getExpertConsultations = async (status?: string) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('Expert not logged in:', userError ? userError.message : 'Unknown error');
      throw new Error('Authentication error');
    }
    
    let query = supabase
      .from('consultations')
      .select(`
        *,
        profiles:user_id (username, full_name, avatar_url),
        expert_responses(complexity, estimated_time, suggested_price, response_message)
      `)
      .eq('expert_id', userData.user.id);
    
    // Apply status filter if provided
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query.order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error getting expert consultations:', error.message);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getExpertConsultations:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

/**
 * Mark a consultation as completed
 * @param consultationId The ID of the consultation to mark as completed
 * @returns Promise with the result of the operation
 */
export const completeConsultation = async (consultationId: string) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('Expert not logged in:', userError ? userError.message : 'Unknown error');
      throw new Error('Authentication error');
    }
    
    // Verify that this expert is assigned to this consultation
    const { data: consultationData, error: consultationError } = await supabase
      .from('consultations')
      .select('expert_id')
      .eq('id', consultationId)
      .single();
    
    if (consultationError) {
      console.error('Error verifying consultation:', consultationError.message);
      throw consultationError;
    }
    
    if (consultationData.expert_id !== userData.user.id) {
      throw new Error('You are not authorized to complete this consultation');
    }
    
    const { data, error } = await supabase
      .from('consultations')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', consultationId)
      .select();
    
    if (error) {
      console.error('Error completing consultation:', error.message);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in completeConsultation:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

/**
 * Get statistics for the expert's consultations
 * @returns Promise with the statistics
 */
export const getExpertStatistics = async () => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('Expert not logged in:', userError ? userError.message : 'Unknown error');
      throw new Error('Authentication error');
    }
    
    const { data, error } = await supabase
      .from('consultations')
      .select('status')
      .eq('expert_id', userData.user.id);
    
    if (error) {
      console.error('Error getting expert statistics:', error.message);
      throw error;
    }
    
    const total = data.length;
    const pending = data.filter(c => c.status === 'pending').length;
    const active = data.filter(c => c.status === 'active').length;
    const completed = data.filter(c => c.status === 'completed').length;
    
    return {
      total,
      pending,
      active,
      completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  } catch (error) {
    console.error('Error in getExpertStatistics:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};
