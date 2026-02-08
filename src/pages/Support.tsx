import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // <--- AJOUTE CETTE LIGNE

interface SupportTicket {
  name: string;
  email: string;
  subject: string;
  message: string;
  link?: string;
}

export const Support: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SupportTicket>({
    name: '',
    email: '',
    subject: '',
    message: '',
    link: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateURL = (url: string): boolean => {
    if (!url) return true; // Lien optionnel
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // --- NOUVELLE VÉRIFICATION SÉCURISÉE ---
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("Accès refusé. Identité ZENITH-OS non détectée.");
    return;
  }
  // ----------------------------------------

  // 2. Validation des champs (ton code actuel)
  if (!formData.name || !formData.email || !formData.subject || !formData.message) {
    alert('⚠️ Veuillez remplir tous les champs obligatoires.');
    return;
  }
  // ... la suite de ton code
    
    if (!validateURL(formData.link || '')) {
      alert('⚠️ Veuillez fournir une URL valide (commençant par http:// ou https://).');
      return;
    }

    setIsSubmitting(true);

try { 
  // 1. On crée la variable d'abord
  const user_token = user.id; 
  
  // 2. On peut maintenant l'utiliser
  console.log("Protocole d'authentification ID:", user_token);
  
  // 3. Suite de l'envoi...
  await new Promise(resolve => setTimeout(resolve, 1500));
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '', link: '' });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
      
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')}
            className="text-zenith-green hover:text-cyan-400 mb-4 flex items-center gap-2"
          >
            <i className="fas fa-arrow-left"></i>
            Retour à l'accueil
          </button>
          
          <h1 className="text-4xl font-bold text-zenith-green mb-2">
            <i className="fas fa-headset mr-3"></i>
            SUPPORT TECHNIQUE
          </h1>
          <p className="text-zenith-dim">
            Une panne ? Un bug ? Contactez l'équipe ZENITH-OS 24/7
          </p>
        </div>

        {/* Support Form */}
        <div className="glass-card p-6 rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Email */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-zenith-green mb-2">
                  <i className="fas fa-user mr-2"></i>
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-zenith-greenDim rounded px-4 py-3 text-white focus:outline-none focus:border-zenith-green focus:ring-1 focus:ring-zenith-green"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-zenith-green mb-2">
                  <i className="fas fa-envelope mr-2"></i>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-zenith-greenDim rounded px-4 py-3 text-white focus:outline-none focus:border-zenith-green focus:ring-1 focus:ring-zenith-green"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-bold text-zenith-green mb-2">
                <i className="fas fa-tag mr-2"></i>
                Sujet *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full bg-black border border-zenith-greenDim rounded px-4 py-3 text-white focus:outline-none focus:border-zenith-green focus:ring-1 focus:ring-zenith-green"
                required
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="bug">🐛 Bug technique</option>
                <option value="feature">✨ Demande de fonctionnalité</option>
                <option value="account">👤 Problème de compte</option>
                <option value="performance">⚡ Problème de performance</option>
                <option value="other">📝 Autre</option>
              </select>
            </div>

            {/* Link (optional) */}
            <div>
              <label className="block text-sm font-bold text-zenith-green mb-2">
                <i className="fas fa-link mr-2"></i>
                Lien vers la page (optionnel)
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full bg-black border border-zenith-greenDim rounded px-4 py-3 text-white focus:outline-none focus:border-zenith-green focus:ring-1 focus:ring-zenith-green"
                placeholder="https://zenith-os.com/page-problematique"
              />
              {formData.link && !validateURL(formData.link) && (
                <p className="text-red-400 text-sm mt-1">
                  ⚠️ URL invalide. Doit commencer par http:// ou https://
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-bold text-zenith-green mb-2">
                <i className="fas fa-message mr-2"></i>
                Description détaillée *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className="w-full bg-black border border-zenith-greenDim rounded px-4 py-3 text-white focus:outline-none focus:border-zenith-green focus:ring-1 focus:ring-zenith-green resize-none"
                placeholder="Décrivez votre problème en détail..."
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-zenith-dim">
                <i className="fas fa-lock mr-1"></i>
                Vos données sont sécurisées
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || (formData.link && !validateURL(formData.link))}
                className="px-6 py-3 bg-zenith-green text-black font-bold rounded-full hover:shadow-[0_0_20px_rgba(0,255,136,0.8)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Envoyer le ticket
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="mt-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
              <i className="fas fa-check-circle mr-2"></i>
              ✅ Ticket envoyé avec succès ! Nous vous répondrons dans les 24h.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
              <i className="fas fa-exclamation-circle mr-2"></i>
              ❌ Erreur lors de l'envoi. Veuillez réessayer plus tard.
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-xl text-center">
            <i className="fas fa-clock text-2xl text-zenith-green mb-2"></i>
            <h3 className="font-bold text-white mb-1">Temps de réponse</h3>
            <p className="text-sm text-zenith-dim">Moins de 24h</p>
          </div>
          
          <div className="glass-card p-4 rounded-xl text-center">
            <i className="fas fa-shield-alt text-2xl text-zenith-green mb-2"></i>
            <h3 className="font-bold text-white mb-1">Sécurisé</h3>
            <p className="text-sm text-zenith-dim">Données cryptées</p>
          </div>
          
          <div className="glass-card p-4 rounded-xl text-center">
            <i className="fas fa-globe text-2xl text-zenith-green mb-2"></i>
            <h3 className="font-bold text-white mb-1">Support 24/7</h3>
            <p className="text-sm text-zenith-dim">Toujours disponible</p>
          </div>
        </div>
      </div>
    </div>
  );
};
// À ajouter tout en bas de ton fichier Support.tsx
export default Support;
