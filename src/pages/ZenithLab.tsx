import React, { useState, useEffect } from 'react';
import ZenithStatusBadge from '../components/ZenithStatusBadge';
import ZenithNeuralSearch from '../components/ZenithNeuralSearch';
import ZenithDataLab from '../components/ZenithDataLab';
import { getAllActiveUsers, getUserActivity, NeuralSearchResult } from '../lib/zenithService';
import { DEFAULT_USER_ID } from '../lib/constants';

const ZenithLab: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<NeuralSearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveUsers();
  }, []);

  const loadActiveUsers = async () => {
    try {
      const { data } = await getAllActiveUsers();
      setActiveUsers(data || []);
    } catch (error) {
      console.error('Erreur chargement utilisateurs actifs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (results: NeuralSearchResult[]) => {
    setSearchResults(results);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-tech text-white mb-4">
          🧪 ZENITH LAB
        </h1>
        <p className="text-zenith-dim">
          Système d'Exploitation Social - Laboratoire Avancé
        </p>
      </div>

      {/* Status OS Section */}
      <section className="glass-card p-6 border border-zenith-green rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          🟢 STATUS OS
          <span className="text-sm text-zenith-green font-mono">Badges de connexion</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Utilisateur actuel */}
          <div className="p-4 bg-black/30 rounded-lg border border-zenith-greenDim/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-bold">Zenith_Operative</span>
              <ZenithStatusBadge userId={DEFAULT_USER_ID} size="medium" />
            </div>
            <div className="text-xs text-zenith-dim">
              Statut principal du système
            </div>
          </div>

          {/* Autres utilisateurs actifs */}
          {activeUsers.slice(0, 5).map((user) => (
            <div key={user.user_id} className="p-4 bg-black/30 rounded-lg border border-zenith-greenDim/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-bold text-sm">
                  Operative_{user.user_id}
                </span>
                <ZenithStatusBadge userId={user.user_id} size="small" showLabel={false} />
              </div>
              <div className="text-xs text-zenith-dim">
                Dernière activité: {new Date(user.last_seen).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="w-8 h-8 border-2 border-zenith-green border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}
      </section>

      {/* Neural Search Section */}
      <section className="glass-card p-6 border border-zenith-green rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          🧠 NEURAL SEARCH
          <span className="text-sm text-zenith-green font-mono">Recherche IA avancée</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interface de recherche */}
          <div>
            <ZenithNeuralSearch 
              onResults={handleSearchResults}
              placeholder="Rechercher dans les posts et images..."
              showImageSearch={true}
            />
          </div>

          {/* Résultats de recherche */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">
              🎯 Résultats ({searchResults.length})
            </h3>
            
            {searchResults.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div key={`${result.post_id}-${index}`} className="p-3 bg-black/30 border border-zenith-greenDim/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white font-mono">
                        Post: {result.post_id}
                      </span>
                      <span className="text-xs text-zenith-green">
                        {(result.relevance_score * 100).toFixed(0)}% match
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-zenith-green/20 text-zenith-green rounded-full">
                        {result.match_type}
                      </span>
                      <div className="flex-1 bg-black/50 rounded-full h-2">
                        <div 
                          className="bg-zenith-green h-2 rounded-full"
                          style={{ width: `${result.relevance_score * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-zenith-dim">
                <div className="text-4xl mb-4">🔍</div>
                <p>Aucun résultat de recherche</p>
                <p className="text-sm mt-2">Essayez une recherche neurale</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Data Fragments Section */}
      <section className="glass-card p-6 border border-zenith-green rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          🧪 DATA FRAGMENTS
          <span className="text-sm text-zenith-green font-mono">Collection de données</span>
        </h2>
        
        <ZenithDataLab 
          userId={DEFAULT_USER_ID}
          showPublicFragments={true}
        />
      </section>

      {/* Instructions */}
      <section className="glass-card p-6 border border-zenith-green rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-4">
          📖 Guide d'utilisation
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="text-zenith-green font-bold flex items-center gap-2">
              🟢 Status OS
            </h3>
            <ul className="text-sm text-zenith-dim space-y-1">
              <li>• Badges automatiques de connexion</li>
              <li>• Statuts: Online, Away, Deep Sleep, Offline</li>
              <li>• Mise à jour toutes les 2 minutes</li>
              <li>• Synchronisation automatique</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-zenith-green font-bold flex items-center gap-2">
              🧠 Neural Search
            </h3>
            <ul className="text-sm text-zenith-dim space-y-1">
              <li>• Recherche texte et image</li>
              <li>• Analyse thématique IA</li>
              <li>• Scores de pertinence</li>
              <li>• Types de correspondance</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-zenith-green font-bold flex items-center gap-2">
              🧪 Data Fragments
            </h3>
            <ul className="text-sm text-zenith-dim space-y-1">
              <li>• Collection de posts</li>
              <li>• Types: Copie, Analyse, Signet, Échantillon</li>
              <li>• Labos personnels</li>
              <li>• Fragments publics/privés</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ZenithLab;
