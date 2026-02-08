import React, { useState, useEffect } from 'react';
import { 
  DataFragment, 
  UserLab, 
  collectDataFragment, 
  getUserFragments, 
  getUserLab, 
  deleteFragment,
  updateFragment,
  getPublicFragments
} from '../lib/zenithService';
import { DEFAULT_USER_ID } from '../lib/constants';

interface ZenithDataLabProps {
  userId?: string;
  showPublicFragments?: boolean;
}

const ZenithDataLab: React.FC<ZenithDataLabProps> = ({
  userId = DEFAULT_USER_ID,
  showPublicFragments = false
}) => {
  const [lab, setLab] = useState<UserLab | null>(null);
  const [fragments, setFragments] = useState<DataFragment[]>([]);
  const [publicFragments, setPublicFragments] = useState<DataFragment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my' | 'public'>('my');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [labRes, fragmentsRes, publicRes] = await Promise.all([
        getUserLab(userId as any),
        getUserFragments(userId as any),
        showPublicFragments ? getPublicFragments() : Promise.resolve({ data: [] })
      ]);

      setLab(labRes.data);
      setFragments(fragmentsRes.data || []);
      setPublicFragments(publicRes.data || []);
    } catch (error) {
      console.error('Erreur chargement labo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectFragment = async (postId: string, fragmentType: DataFragment['fragment_type']) => {
    try {
      await collectDataFragment(
        postId,
        userId as any,
        fragmentType,
        `Collection ${fragmentType}`,
        [fragmentType],
        false
      );
      await loadData();
      setShowAddModal(false);
      setSelectedPost('');
    } catch (error) {
      console.error('Erreur collection fragment:', error);
    }
  };

  const handleDeleteFragment = async (fragmentId: string) => {
    if (!confirm('Supprimer ce fragment ?')) return;
    
    try {
      await deleteFragment(fragmentId);
      await loadData();
    } catch (error) {
      console.error('Erreur suppression fragment:', error);
    }
  };

  const handleTogglePublic = async (fragment: DataFragment) => {
    try {
      await updateFragment(fragment.id, { is_public: !fragment.is_public });
      await loadData();
    } catch (error) {
      console.error('Erreur mise à jour fragment:', error);
    }
  };

  const getFragmentIcon = (type: DataFragment['fragment_type']) => {
    switch (type) {
      case 'copy':
        return '📋';
      case 'analysis':
        return '🔬';
      case 'bookmark':
        return '🔖';
      case 'lab_sample':
        return '🧪';
      default:
        return '📦';
    }
  };

  const getFragmentLabel = (type: DataFragment['fragment_type']) => {
    switch (type) {
      case 'copy':
        return 'Copie';
      case 'analysis':
        return 'Analyse';
      case 'bookmark':
        return 'Signet';
      case 'lab_sample':
        return 'Échantillon';
      default:
        return 'Fragment';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-2 border-zenith-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header du Labo */}
      <div className="p-4 bg-gradient-to-r from-zenith-greenDim/20 to-transparent border border-zenith-greenDim/50 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              🔬 {lab?.lab_name || 'Mon Labo Zenith'}
            </h2>
            <p className="text-xs text-zenith-dim">
              {lab?.lab_description || 'Laboratoire personnel pour la collecte de données'}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-2 bg-zenith-green text-black rounded-lg text-xs font-bold hover:shadow-[0_0_10px_var(--z-primary)] transition-all"
          >
            ➕ Collecter
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-black/30 rounded-lg p-2">
            <div className="text-lg font-bold text-zenith-green">{lab?.fragment_count || 0}</div>
            <div className="text-xs text-zenith-dim">Total</div>
          </div>
          <div className="bg-black/30 rounded-lg p-2">
            <div className="text-lg font-bold text-blue-400">{lab?.public_fragments || 0}</div>
            <div className="text-xs text-zenith-dim">Public</div>
          </div>
          <div className="bg-black/30 rounded-lg p-2">
            <div className="text-lg font-bold text-purple-400">{(lab?.fragment_count || 0) - (lab?.public_fragments || 0)}</div>
            <div className="text-xs text-zenith-dim">Privé</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      {showPublicFragments && (
        <div className="flex gap-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'my'
                ? 'border-b-2 border-zenith-green text-white'
                : 'text-zenith-dim hover:text-white'
            }`}
          >
            🧪 Mes Fragments
          </button>
          <button
            onClick={() => setActiveTab('public')}
            className={`px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'public'
                ? 'border-b-2 border-zenith-green text-white'
                : 'text-zenith-dim hover:text-white'
            }`}
          >
            🌐 Fragments Publics
          </button>
        </div>
      )}

      {/* Liste des fragments */}
      <div className="space-y-3">
        {(activeTab === 'my' ? fragments : publicFragments).map((fragment) => (
          <div
            key={fragment.id}
            className="p-4 bg-black/30 border border-zenith-greenDim/50 rounded-lg hover:border-zenith-green/50 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getFragmentIcon(fragment.fragment_type)}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {getFragmentLabel(fragment.fragment_type)}
                    </span>
                    {fragment.is_public && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                        Public
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zenith-dim">
                    Collecté: {new Date(fragment.collected_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-zenith-dim">
                    Accès: {fragment.access_count} fois
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {activeTab === 'my' && (
                  <>
                    <button
                      onClick={() => handleTogglePublic(fragment)}
                      className="p-2 text-xs hover:bg-white/10 rounded transition-colors"
                      title={fragment.is_public ? 'Rendre privé' : 'Rendre public'}
                    >
                      {fragment.is_public ? '🔒' : '🌐'}
                    </button>
                    <button
                      onClick={() => handleDeleteFragment(fragment.id)}
                      className="p-2 text-xs hover:bg-red-500/20 text-red-400 rounded transition-colors"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Tags */}
            {fragment.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {fragment.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-zenith-green/20 text-zenith-green text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Raison */}
            {fragment.collection_reason && (
              <div className="text-xs text-zenith-dim italic">
                "{fragment.collection_reason}"
              </div>
            )}

            {/* Post ID */}
            <div className="text-xs text-gray-500 font-mono mt-2">
              Source: {fragment.original_post_id}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {(activeTab === 'my' ? fragments : publicFragments).length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🧪</div>
            <h3 className="text-white font-bold mb-2">
              {activeTab === 'my' ? 'Aucun fragment collecté' : 'Aucun fragment public'}
            </h3>
            <p className="text-zenith-dim text-sm mb-4">
              {activeTab === 'my' 
                ? 'Commencez à collecter des fragments de posts pour votre labo'
                : 'Aucun fragment public disponible pour le moment'
              }
            </p>
            {activeTab === 'my' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-zenith-green text-black rounded-lg font-bold hover:shadow-[0_0_10px_var(--z-primary)] transition-all"
              >
                ➕ Premier Fragment
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md rounded-2xl p-6 border border-zenith-green">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-tech text-white">🧪 Collecter un Fragment</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zenith-dim hover:text-white"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-zenith-dim font-bold">ID du Post</label>
                <input
                  type="text"
                  value={selectedPost}
                  onChange={(e) => setSelectedPost(e.target.value)}
                  placeholder="Entrez l'ID du post à collecter..."
                  className="w-full bg-black/50 border border-zenith-greenDim rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-zenith-dim font-bold">Type de Fragment</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['copy', 'analysis', 'bookmark', 'lab_sample'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => selectedPost && handleCollectFragment(selectedPost, type)}
                      disabled={!selectedPost}
                      className="p-3 bg-black/50 border border-zenith-greenDim rounded-lg hover:border-zenith-green disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <div className="text-2xl mb-1">{getFragmentIcon(type)}</div>
                      <div className="text-xs text-white">{getFragmentLabel(type)}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZenithDataLab;
