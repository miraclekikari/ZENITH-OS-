import { supabase } from './supabaseClient';
import { DEFAULT_USER_ID } from './constants';
import { UserId } from '../types';

// =====================================================
// TYPES pour les fonctionnalités Zenith
// =====================================================

export type UserStatus = 'online' | 'offline' | 'deep_sleep' | 'away';

export interface UserStatusData {
  author_id: UserId;
  status: UserStatus;
  last_seen: string;
  session_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NeuralSearchResult {
  post_id: string;
  relevance_score: number;
  match_type: 'image_match' | 'theme_match' | 'text_match';
}

export interface DataFragment {
  id: string;
  original_post_id: string;
  collector_author_id: UserId;
  fragment_type: 'copy' | 'analysis' | 'bookmark' | 'lab_sample';
  fragment_data?: Record<string, any>;
  collection_reason: string;
  tags: string[];
  is_public: boolean;
  collected_at: string;
  last_accessed: string;
  access_count: number;
}

export interface UserLab {
  author_id: UserId;
  lab_name: string;
  lab_description?: string;
  fragment_count: number;
  public_fragments: number;
  lab_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface NeuralSearchIndex {
  id: string;
  post_id: string;
  search_vector: string;
  image_analysis: string;
  themes: string[];
  confidence_score: number;
  indexed_at: string;
  updated_at: string;
}

// =====================================================
// 1. STATUS OS: Gestion du statut utilisateur
// =====================================================

export const updateUserStatus = async (
  userId: UserId = DEFAULT_USER_ID as UserId,
  status: UserStatus = 'online'
) => {
  const { data, error } = await supabase.rpc('update_user_status', {
    author_id_param: userId,
    status_param: status
  });

  return { data, error };
};

export const getUserStatus = async (userId: UserId = DEFAULT_USER_ID as UserId) => {
  const { data, error } = await supabase
    .from('user_status')
    .select('*')
    .eq('author_id', userId)
    .single();

  return { data: data as UserStatusData, error };
};

export const getAllActiveUsers = async () => {
  const { data, error } = await supabase
    .from('user_status')
    .select('*')
    .eq('is_active', true)
    .order('last_seen', { ascending: false });

  return { data: data as UserStatusData[], error };
};

// =====================================================
// 2. NEURAL SEARCH: Recherche IA avancée
// =====================================================

export const neuralSearch = async (
  queryText: string,
  imageQuery?: string
) => {
  const { data, error } = await supabase.rpc('neural_search', {
    query_text: queryText,
    image_query: imageQuery || null
  });

  return { data: data as NeuralSearchResult[], error };
};

export const indexPostForNeuralSearch = async (
  postId: string,
  content: string,
  imageAnalysis?: string,
  themes: string[] = []
) => {
  const searchIndex: Partial<NeuralSearchIndex> = {
    id: `ns-${postId}`,
    post_id: postId,
    search_vector: content.toLowerCase(),
    image_analysis: imageAnalysis || '',
    themes,
    confidence_score: themes.length > 0 ? 0.8 : 0.5
  };

  const { data, error } = await supabase
    .from('neural_search_index')
    .upsert(searchIndex)
    .select()
    .single();

  return { data: data as NeuralSearchIndex, error };
};

export const getPostThemes = async (postId: string) => {
  const { data, error } = await supabase
    .from('neural_search_index')
    .select('themes')
    .eq('post_id', postId)
    .single();

  return { data, error };
};

// =====================================================
// 3. DATA FRAGMENTS: Système de collection
// =====================================================

export const collectDataFragment = async (
  postId: string,
  collectorId: UserId = DEFAULT_USER_ID as UserId,
  fragmentType: DataFragment['fragment_type'] = 'copy',
  reason: string = 'Collection personnelle',
  tags: string[] = [],
  isPublic: boolean = false
) => {
  const { data, error } = await supabase.rpc('collect_data_fragment', {
    post_id_param: postId,
    collector_id: collectorId,
    fragment_type_param: fragmentType,
    reason_param: reason,
    tags_param: tags,
    is_public_param: isPublic
  });

  return { data, error };
};

export const getUserFragments = async (
  userId: UserId = DEFAULT_USER_ID as UserId,
  includePublic: boolean = false
) => {
  let query = supabase
    .from('data_fragments')
    .select('*')
    .eq('collector_author_id', userId);

  if (includePublic) {
    query = query.or('is_public.eq.true');
  }

  const { data, error } = await query
    .order('collected_at', { ascending: false });

  return { data: data as DataFragment[], error };
};

export const getPublicFragments = async () => {
  const { data, error } = await supabase
    .from('data_fragments')
    .select('*')
    .eq('is_public', true)
    .order('collected_at', { ascending: false });

  return { data: data as DataFragment[], error };
};

export const updateFragmentAccess = async (fragmentId: string) => {
  const { data, error } = await supabase.rpc('increment', {
    table_name: 'data_fragments',
    column_name: 'access_count',
    row_id: fragmentId
  });

  return { data, error };
};

// =====================================================
// 4. USER LABS: Gestion des labos personnels
// =====================================================

export const getUserLab = async (userId: UserId = DEFAULT_USER_ID as UserId) => {
  const { data, error } = await supabase
    .from('user_labs')
    .select('*')
    .eq('author_id', userId)
    .single();

  return { data: data as UserLab, error };
};

export const updateUserLab = async (
  userId: UserId = DEFAULT_USER_ID as UserId,
  updates: Partial<UserLab>
) => {
  const { data, error } = await supabase
    .from('user_labs')
    .update(updates)
    .eq('author_id', userId)
    .select()
    .single();

  return { data: data as UserLab, error };
};

// =====================================================
// 5. VUES UTILITAIRES
// =====================================================

export const getUserActivity = async () => {
  const { data, error } = await supabase
    .from('user_activity_view')
    .select('*')
    .order('last_seen', { ascending: false });

  return { data, error };
};

export const getLabFragments = async (userId: UserId = DEFAULT_USER_ID as UserId) => {
  const { data, error } = await supabase
    .from('lab_fragments_view')
    .select('*')
    .eq('collector_author_id', userId)
    .order('collected_at', { ascending: false });

  return { data, error };
};

// =====================================================
// 6. FONCTIONS UTILITAIRES
// =====================================================

export const initializeUserLab = async (
  userId: UserId = DEFAULT_USER_ID as UserId,
  labName?: string,
  labDescription?: string
) => {
  const { data, error } = await supabase
    .from('user_labs')
    .upsert({
      author_id: userId,
      lab_name: labName || 'Mon Labo Zenith',
      lab_description: labDescription || 'Laboratoire personnel Zenith'
    })
    .select()
    .single();

  return { data: data as UserLab, error };
};

export const deleteFragment = async (fragmentId: string) => {
  const { data, error } = await supabase
    .from('data_fragments')
    .delete()
    .eq('id', fragmentId)
    .select()
    .single();

  return { data, error };
};

export const updateFragment = async (
  fragmentId: string,
  updates: Partial<DataFragment>
) => {
  const { data, error } = await supabase
    .from('data_fragments')
    .update(updates)
    .eq('id', fragmentId)
    .select()
    .single();

  return { data: data as DataFragment, error };
};

// =====================================================
// 7. SYNC automatique du statut
// =====================================================

export const startStatusSync = (userId: UserId = DEFAULT_USER_ID as UserId) => {
  // Mettre à jour le statut toutes les 2 minutes
  const interval = setInterval(() => {
    updateUserStatus(userId, 'online');
  }, 2 * 60 * 1000);

  // Nettoyer quand la page se ferme
  window.addEventListener('beforeunload', () => {
    clearInterval(interval);
    updateUserStatus(userId, 'offline');
  });

  return interval;
};

// Export par défaut
export default {
  // Status OS
  updateUserStatus,
  getUserStatus,
  getAllActiveUsers,
  startStatusSync,
  
  // Neural Search
  neuralSearch,
  indexPostForNeuralSearch,
  getPostThemes,
  
  // Data Fragments
  collectDataFragment,
  getUserFragments,
  getPublicFragments,
  updateFragmentAccess,
  deleteFragment,
  updateFragment,
  
  // User Labs
  getUserLab,
  updateUserLab,
  initializeUserLab,
  
  // Views
  getUserActivity,
  getLabFragments
};
