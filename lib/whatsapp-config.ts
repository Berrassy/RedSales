// WhatsApp configuration
export const WHATSAPP_CONFIG = {
  // Update this phone number with your actual WhatsApp business number
  PHONE_NUMBER: "212XXXXXXXXX", // Replace with your actual phone number (e.g., "212612345678")
  
  // Default message template
  DEFAULT_MESSAGE_TEMPLATE: "Bonjour, je veux commander",
  
  // Business hours (optional)
  BUSINESS_HOURS: {
    start: "09:00",
    end: "18:00",
    timezone: "Africa/Casablanca"
  },
  
  // Auto-reply messages (optional)
  AUTO_REPLY: {
    outOfHours: "Merci pour votre message. Nous vous répondrons dès que possible pendant nos heures d'ouverture (9h-18h).",
    inStock: "Parfait ! Ce produit est disponible. Nous vous enverrons les détails de livraison.",
    outOfStock: "Désolé, ce produit n'est plus en stock. Nous vous proposerons des alternatives similaires."
  }
};

// Helper function to format phone number for WhatsApp
export function formatWhatsAppNumber(phoneNumber: string): string {
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Ensure it starts with country code
  if (cleaned.startsWith('212')) {
    return cleaned;
  } else if (cleaned.startsWith('0')) {
    return '212' + cleaned.substring(1);
  } else {
    return '212' + cleaned;
  }
}

// Helper function to generate WhatsApp URL
export function generateWhatsAppUrl(phoneNumber: string, message: string): string {
  const formattedNumber = formatWhatsAppNumber(phoneNumber);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
}
