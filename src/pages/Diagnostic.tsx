import React from 'react';
import { useUser } from '../context/UserContext';

const Diagnostic: React.FC = () => {
  const { session, user, profile, loading, isAdmin } = useUser();

  const renderObject = (title: string, data: object | null | undefined) => (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <h2 className="text-xl font-bold text-zenith-primary mb-2">{title}</h2>
      <pre className="text-sm text-white whitespace-pre-wrap break-all">
        {JSON.stringify(data, null, 2) || 'null'}
      </pre>
    </div>
  );

  return (
    <div className="p-4 md:p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Page de Diagnostic</h1>
      
      <div className="space-y-2 mb-6 bg-gray-900 p-4 rounded-lg">
        <p><strong>État du chargement:</strong> {loading ? 'En cours...' : 'Terminé'}</p>
        <p><strong>Rôle Administrateur:</strong> {isAdmin ? 'Oui' : 'Non'}</p>
      </div>

      {renderObject('Session (Badge d\'accès)', session)}
      {renderObject('User (Informations brutes)', user)}
      {renderObject('Profile (Dossier utilisateur)', profile)}

    </div>
  );
};

export default Diagnostic;
