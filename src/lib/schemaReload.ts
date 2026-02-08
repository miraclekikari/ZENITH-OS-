import { supabase } from './supabaseClient';

/**
 * Script de rechargement du schéma Supabase pour forcer PostgREST 
 * à reconnaître les nouvelles colonnes author_id
 */
export const reloadSchema = async () => {
  try {
    console.log('🔄 Rechargement du schéma Supabase...');
    
    // Forcer le rechargement du cache PostgREST
    const { error } = await supabase.rpc('pg_notify', {
      channel: 'supabase_realtime',
      payload: JSON.stringify({ 
        event: 'SCHEMA_RELOAD',
        timestamp: Date.now()
      })
    });

    if (error) {
      console.warn('⚠️ Erreur rechargement schéma:', error);
      // Alternative: faire une requête simple pour forcer le rechargement
      await supabase.from('posts').select('count').limit(1);
    } else {
      console.log('✅ Schéma rechargé avec succès');
    }

    // Test des nouvelles colonnes author_id
    const { data: testPosts, error: testError } = await supabase
      .from('posts')
      .select('id, author_id, content')
      .limit(1);

    if (testError) {
      console.error('❌ Erreur test author_id:', testError);
      return false;
    }

    console.log('✅ Colonnes author_id validées');
    return true;

  } catch (error) {
    console.error('❌ Erreur rechargement schéma:', error);
    return false;
  }
};

/**
 * Vérification complète du schéma
 */
export const validateSchema = async () => {
  const tables = ['posts', 'comments', 'post_likes', 'stories'];
  const results: Record<string, boolean> = {};

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('author_id')
        .limit(1);

      results[table] = !error;
      
      if (error) {
        console.error(`❌ Table ${table}:`, error.message);
      } else {
        console.log(`✅ Table ${table}: author_id valide`);
      }
    } catch (error) {
      console.error(`❌ Table ${table}:`, error);
      results[table] = false;
    }
  }

  return results;
};

export default { reloadSchema, validateSchema };
