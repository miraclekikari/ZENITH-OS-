import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { reloadSchema, validateSchema } from '../lib/schemaReload';

const SchemaDiagnostic: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [results, setResults] = useState<Record<string, any>>({});
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    runDiagnostic();
  }, []);

  const runDiagnostic = async () => {
    setStatus('loading');
    
    try {
      // 1. Test connexion Supabase
      const { data: connectionTest, error: connectionError } = await supabase
        .from('posts')
        .select('count')
        .limit(1);

      if (connectionError) {
        console.error('❌ Erreur connexion:', connectionError);
        setStatus('error');
        setResults({ 
          connection: false, 
          error: connectionError.message,
          details: 'Vérifiez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY'
        });
        return;
      }

      // 2. Validation du schéma
      const schemaResults = await validateSchema();
      
      // 3. Test des jointures avec profiles
      const { data: joinTest, error: joinError } = await supabase
        .from('posts')
        .select('*, profiles(username)')
        .limit(1);

      const results = {
        connection: true,
        schema: schemaResults,
        joins: !joinError,
        joinError: joinError?.message || null,
        timestamp: new Date().toISOString()
      };

      setResults(results);
      setStatus('success');

    } catch (error) {
      console.error('❌ Erreur diagnostic:', error);
      setStatus('error');
      setResults({ 
        connection: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  };

  const handleReloadSchema = async () => {
    setIsReloading(true);
    try {
      const success = await reloadSchema();
      if (success) {
        await runDiagnostic(); // Relancer le diagnostic
      }
    } catch (error) {
      console.error('❌ Erreur rechargement:', error);
    } finally {
      setIsReloading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-zenith-green border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-zenith-dim">Diagnostic du schéma...</span>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border border-zenith-green rounded-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <i className="fas fa-stethoscope text-zenith-green"></i>
          Diagnostic Supabase
        </h2>
        <div className="flex gap-2">
          <button
            onClick={runDiagnostic}
            className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Re-tester
          </button>
          <button
            onClick={handleReloadSchema}
            disabled={isReloading}
            className="px-4 py-2 bg-zenith-green text-black font-bold rounded-lg hover:shadow-[0_0_15px_var(--z-primary)] transition-all text-sm disabled:opacity-50"
          >
            {isReloading ? (
              <><i className="fas fa-spinner fa-spin mr-2"></i>Rechargement...</>
            ) : (
              <><i className="fas fa-database mr-2"></i>Recharger Schéma</>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Connexion */}
        <div className={`p-4 rounded-lg border ${
          results.connection 
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <i className={`fas ${results.connection ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500'}`}></i>
            <span className="font-bold text-white">Connexion Supabase</span>
          </div>
          <div className="text-sm text-zenith-dim">
            {results.connection ? '✅ Connecté' : '❌ Erreur de connexion'}
            {results.error && <div className="mt-1 text-red-400">{results.error}</div>}
          </div>
        </div>

        {/* Schéma */}
        {results.schema && (
          <div className="p-4 rounded-lg border border-zenith-greenDim bg-zinc-800/50">
            <div className="flex items-center gap-2 mb-3">
              <i className="fas fa-table text-zenith-green"></i>
              <span className="font-bold text-white">Validation Schéma (author_id)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(results.schema).map(([table, valid]) => (
                <div key={table} className="flex items-center gap-2">
                  <i className={`fas ${valid ? 'fa-check text-green-500' : 'fa-times text-red-500'} text-xs`}></i>
                  <span className="text-zenith-dim">{table}</span>
                  <span className={`text-xs ${valid ? 'text-green-500' : 'text-red-500'}`}>
                    {valid ? 'OK' : 'ERREUR'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jointures */}
        {results.joins !== undefined && (
          <div className={`p-4 rounded-lg border ${
            results.joins 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <i className={`fas ${results.joins ? 'fa-link text-green-500' : 'fa-unlink text-red-500'}`}></i>
              <span className="font-bold text-white">Jointures profiles</span>
            </div>
            <div className="text-sm text-zenith-dim">
              {results.joins ? '✅ Jointures fonctionnelles' : '❌ Erreur jointures'}
              {results.joinError && <div className="mt-1 text-red-400">{results.joinError}</div>}
            </div>
          </div>
        )}

        {/* Timestamp */}
        {results.timestamp && (
          <div className="text-xs text-zenith-dim text-center pt-2 border-t border-white/10">
            Dernier test: {new Date(results.timestamp).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaDiagnostic;
