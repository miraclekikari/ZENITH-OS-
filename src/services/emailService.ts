import type { SupportTicket } from '../types';

// Configuration EmailJS (à remplacer avec vos vraies clés)
const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service_id',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'default_template_id',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'default_public_key'
};

export const sendSupportTicket = async (ticket: SupportTicket): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('📧 Envoi ticket support:', { subject: ticket.subject, email: ticket.email });

    // Validation EmailJS disponible
    if (!window.emailjs) {
      console.warn('⚠️ EmailJS non chargé, simulation du ticket');
      // Simulation pour développement
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { 
        success: true, 
        message: 'Ticket simulé avec succès (EmailJS non configuré)' 
      };
    }

    // Envoi réel avec EmailJS
    const response = await window.emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      {
        from_name: ticket.name,
        from_email: ticket.email,
        subject: ticket.subject,
        message: ticket.message,
        link: ticket.link || 'Non spécifié',
        to_email: 'support@zenith-os.com'
      },
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('✅ EmailJS response:', response);
    
    return { 
      success: true, 
      message: 'Ticket envoyé avec succès ! Nous vous répondrons dans les 24h.' 
    };

  } catch (error) {
    console.error('❌ Erreur EmailJS:', error);
    return { 
      success: false, 
      message: 'Erreur lors de l\'envoi. Veuillez réessayer plus tard.' 
    };
  }
};

// Fonction pour charger EmailJS
export const loadEmailJS = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.emailjs) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.async = true;
    
    script.onload = () => {
      if (window.emailjs) {
        window.emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS chargé et initialisé');
        resolve();
      } else {
        reject(new Error('EmailJS non disponible après chargement'));
      }
    };
    
    script.onerror = () => reject(new Error('Impossible de charger EmailJS'));
    
    document.head.appendChild(script);
  });
};

// Types pour window.emailjs
declare global {
  interface Window {
    emailjs?: {
      send: (serviceId: string, templateId: string, templateParams: any, publicKey: string) => Promise<any>;
      init: (publicKey: string) => void;
    };
  }
}
