import React, { useState, useCallback } from 'react';
import { neuralSearch, NeuralSearchResult } from '../lib/zenithService';

interface ZenithNeuralSearchProps {
  onResults?: (results: NeuralSearchResult[]) => void;
  placeholder?: string;
  showImageSearch?: boolean;
}

const ZenithNeuralSearch: React.FC<ZenithNeuralSearchProps> = ({
  onResults,
  placeholder = "Recherche neurale...",
  showImageSearch = true
}) => {
  const [query, setQuery] = useState('');
  const [imageQuery, setImageQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'text' | 'image'>('text');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<NeuralSearchResult[]>([]);

  const handleSearch = useCallback(async () => {
    if (!query.trim() && !imageQuery.trim()) return;
    
    setLoading(true);
    try {
      const { data } = await neuralSearch(
        searchMode === 'text' ? query : '',
        searchMode === 'image' ? imageQuery : undefined
      );
      
      const searchResults = data || [];
      setResults(searchResults);
      onResults?.(searchResults);
    } catch (error) {
      console.error('Erreur recherche neurale:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, imageQuery, searchMode, onResults]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const getMatchTypeIcon = (type: NeuralSearchResult['match_type']) => {
    switch (type) {
      case 'image_match':
        return '🖼️';
      case 'theme_match':
        return '🏷️';
      case 'text_match':
        return '📝';
      default:
        return '🔍';
    }
  };

  const getMatchTypeLabel = (type: NeuralSearchResult['match_type']) => {
    switch (type) {
      case 'image_match':
        return 'Correspondance image';
      case 'theme_match':
        return 'Correspondance thème';
      case 'text_match':
        return 'Correspondance texte';
      default:
        return 'Correspondance';
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 0.9) return 'text-green-400';
    if (score >= 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-4">
      {/* Formulaire de recherche */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Sélecteur de mode */}
        {showImageSearch && (
          <div className="flex gap-2 p-1 bg-black/50 rounded-lg border border-zenith-greenDim">
            <button
              type="button"
              onClick={() => setSearchMode('text')}
              className={`flex-1 px-3 py-2 rounded text-xs font-bold transition-all ${
                searchMode === 'text'
                  ? 'bg-zenith-green text-black'
                  : 'text-zenith-dim hover:text-white'
              }`}
            >
              📝 Texte
            </button>
            <button
              type="button"
              onClick={() => setSearchMode('image')}
              className={`flex-1 px-3 py-2 rounded text-xs font-bold transition-all ${
                searchMode === 'image'
                  ? 'bg-zenith-green text-black'
                  : 'text-zenith-dim hover:text-white'
              }`}
            >
              🖼️ Image
            </button>
          </div>
        )}

        {/* Champ de recherche */}
        <div className="relative">
          <input
            type="text"
            value={searchMode === 'text' ? query : imageQuery}
            onChange={(e) => searchMode === 'text' ? setQuery(e.target.value) : setImageQuery(e.target.value)}
            placeholder={searchMode === 'text' ? placeholder : "Décrire l'image recherchée..."}
            className="w-full bg-black/50 border border-zenith-greenDim rounded-lg px-4 py-3 pr-12 text-white placeholder-zenith-dim focus:border-zenith-green focus:outline-none text-sm"
          />
          <button
            type="submit"
            disabled={loading || (!query.trim() && !imageQuery.trim())}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-zenith-green text-black rounded disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_10px_var(--z-primary)] transition-all"
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin text-xs"></i>
            ) : (
              <i className="fas fa-search text-xs"></i>
            )}
          </button>
        </div>
      </form>

      {/* Résultats */}
      {results.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zenith-green">
              🧠 Résultats neurals ({results.length})
            </h3>
            <button
              onClick={() => setResults([])}
              className="text-xs text-zenith-dim hover:text-white transition-colors"
            >
              Effacer
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={`${result.post_id}-${index}`}
                className="p-3 bg-black/30 border border-zenith-greenDim/50 rounded-lg hover:border-zenith-green/50 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {getMatchTypeIcon(result.match_type)}
                    </span>
                    <span className="text-xs text-zenith-dim">
                      {getMatchTypeLabel(result.match_type)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono ${getRelevanceColor(result.relevance_score)}`}>
                      {(result.relevance_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Barre de pertinence */}
                <div className="w-full bg-black/50 rounded-full h-1 mb-2">
                  <div
                    className={`h-1 rounded-full transition-all ${
                      result.relevance_score >= 0.9
                        ? 'bg-green-500'
                        : result.relevance_score >= 0.7
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${result.relevance_score * 100}%` }}
                  ></div>
                </div>

                <div className="text-xs text-gray-400 font-mono">
                  Post ID: {result.post_id}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message si aucun résultat */}
      {!loading && results.length === 0 && (query.trim() || imageQuery.trim()) && (
        <div className="text-center py-4">
          <div className="text-zenith-dim text-sm">
            🧠 Aucune correspondance neurale trouvée
          </div>
          <div className="text-xs text-zenith-dim/50 mt-1">
            Essayez des termes plus spécifiques ou changez le mode de recherche
          </div>
        </div>
      )}
    </div>
  );
};

export default ZenithNeuralSearch;
