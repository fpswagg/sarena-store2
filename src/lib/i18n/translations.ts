export type Locale = 'fr' | 'en'

const fr = {
  siteName: 'Boutique Sarena',
  siteDescription:
    'Votre destination shopping premium au Cameroun. Produits de qualité, prix imbattables.',

  nav: {
    products: 'Produits',
    team: 'Équipe',
    contact: 'Contact',
    login: 'Connexion',
    logout: 'Déconnexion',
    viewLogs: 'Voir les logs',
  },

  hero: {
    badge: 'Sécurisé & Fiable',
    title: 'Shopping',
    titleHighlight: 'de Confiance',
    subtitle:
      'Achetez en toute sécurité. Satisfait ou remboursé. Livraison disponible à Douala et Yaoundé.',
    cta: 'Voir les produits',
    whatsapp: 'Nous contacter',
    trust1: 'Paiement sécurisé',
    trust2: 'Satisfait ou remboursé',
    trust3: 'Support réactif',
  },

  products: {
    title: 'Nos Produits',
    subtitle: 'Une sélection de produits premium pour vous',
    badge: 'Nos produits',
    all: 'Tous',
    new: 'Nouveautés',
    popular: 'Populaires',
    inStock: 'Disponible',
    outOfStock: 'Épuisé',
    order: 'Commander',
    viewProduct: 'Voir',
    limitedStock: 'Stock limité',
    count: 'produit | produits',
    soldOut: 'Produit épuisé',
    notifyMe: 'Me notifier',
  },

  productDetail: {
    back: 'Retour',
    orderVia: 'Commander via WhatsApp',
    description: 'Description',
    reviews: 'Avis clients',
    rate: 'Donner mon avis',
    related: 'Vous aimerez aussi',
    noReviews: 'Aucun avis pour le moment',
    beFirst: 'Soyez le premier à donner votre avis !',
    legendary: '👑 Produit Légendaire',
    unavailable: "Ce produit n'est plus disponible",
  },

  team: {
    title: 'Notre Équipe',
    subtitle: 'Des passionnés à votre service',
    badge: 'Notre équipe',
    socialMedia: 'Réseaux sociaux',
    noSocialMedia: 'Aucun réseau social disponible pour le moment.',
  },

  contact: {
    title: 'Une Question ?',
    subtitle: 'Notre équipe est là pour vous aider',
    badge: 'Contact',
    report: 'Signaler un problème',
    supplierNote: 'Les fournisseurs ne peuvent pas envoyer de plaintes.',
    loginNote: 'Connectez-vous pour nous contacter.',
  },

  footer: {
    description: 'Votre boutique en ligne de confiance au Cameroun.',
    navigation: 'Navigation',
    home: 'Accueil',
    info: 'Informations',
    legal: 'Mentions légales',
    privacy: 'Confidentialité',
    terms: 'CGV',
    madeWith: 'Fait avec',
    inCameroon: 'au Cameroun',
  },

  ratings: {
    caillou: 'Caillou',
    tortue: 'Tortue',
    cool: 'Cool',
    feu: 'Feu',
    legendaire: 'Légendaire',
  },

  rating: {
    title: '✍️ Votre avis',
    successTitle: '🎉 Merci !',
    howWasProduct: 'Comment était ce produit ?',
    optionalComment: 'Un petit commentaire ? (optionnel)',
    commentPlaceholder: 'Partagez votre expérience avec ce produit...',
    change: 'Changer',
    skip: 'Passer',
    send: 'Envoyer',
    success: 'Votre avis a été enregistré avec succès !',
    close: 'Fermer',
  },

  complaint: {
    title: 'Signaler un problème',
    concerning: 'Concernant',
    chooseAdmin: 'Choisir un administrateur',
    adminWillContact: 'L\'administrateur choisi vous contactera pour résoudre le problème.',
    describeProblem: 'Décrivez votre problème *',
    problemPlaceholder: 'Expliquez-nous en détail le problème rencontré...',
    notLinkedToProduct: '💡 Cette plainte n\'est pas liée à un produit spécifique.',
    complaintSent: 'Plainte envoyée !',
    adminWillProcess: 'va traiter votre demande.',
    willBeSentTo: 'Votre plainte sera envoyée à',
    cancel: 'Annuler',
    send: 'Envoyer',
    error: 'Une erreur est survenue. Réessayez.',
    close: 'Fermer',
  },

  common: {
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    cancel: 'Annuler',
    submit: 'Envoyer',
    close: 'Fermer',
  },

  notFound: {
    title: 'Produit introuvable',
    description: 'Désolé, le produit que vous recherchez n\'existe pas ou a été supprimé.',
    backHome: 'Retour à l\'accueil',
    viewAll: 'Voir tous les produits',
    suggestions: 'Suggestions :',
    suggestion1: 'Vérifiez que l\'URL est correcte',
    suggestion2: 'Le produit a peut-être été supprimé ou déplacé',
    suggestion3: 'Essayez de rechercher le produit depuis la page d\'accueil',
  },
}

const en: typeof fr = {
  siteName: 'Sarena Store',
  siteDescription:
    'Your premium shopping destination in Cameroon. Quality products, unbeatable prices.',

  nav: {
    products: 'Products',
    team: 'Team',
    contact: 'Contact',
    login: 'Login',
    logout: 'Logout',
    viewLogs: 'View logs',
  },

  hero: {
    badge: 'Secure & Trusted',
    title: 'Trusted',
    titleHighlight: 'Shopping',
    subtitle:
      'Shop with confidence. Money back guarantee. Delivery available in Douala and Yaoundé.',
    cta: 'View products',
    whatsapp: 'Contact us',
    trust1: 'Secure payment',
    trust2: 'Money back guarantee',
    trust3: 'Responsive support',
  },

  products: {
    title: 'Our Products',
    subtitle: 'A selection of premium products for you',
    badge: 'Our Products',
    all: 'All',
    new: 'New',
    popular: 'Popular',
    inStock: 'Available',
    outOfStock: 'Sold out',
    order: 'Order',
    viewProduct: 'View',
    limitedStock: 'Limited stock',
    count: 'product | products',
    soldOut: 'Sold out',
    notifyMe: 'Notify me',
  },

  productDetail: {
    back: 'Back',
    orderVia: 'Order via WhatsApp',
    description: 'Description',
    reviews: 'Customer reviews',
    rate: 'Leave a review',
    related: 'You may also like',
    noReviews: 'No reviews yet',
    beFirst: 'Be the first to leave a review!',
    legendary: '👑 Legendary Product',
    unavailable: 'This product is no longer available',
  },

  team: {
    title: 'Our Team',
    subtitle: 'Passionate people at your service',
    badge: 'Our Team',
    socialMedia: 'Social Media',
    noSocialMedia: 'No social media available at the moment.',
  },

  contact: {
    title: 'Got a Question?',
    subtitle: 'Our team is here to help',
    badge: 'Contact',
    report: 'Report an issue',
    supplierNote: 'Suppliers cannot submit complaints.',
    loginNote: 'Log in to contact us.',
  },

  footer: {
    description: 'Your trusted online store in Cameroon.',
    navigation: 'Navigation',
    home: 'Home',
    info: 'Information',
    legal: 'Legal notice',
    privacy: 'Privacy',
    terms: 'Terms',
    madeWith: 'Made with',
    inCameroon: 'in Cameroon',
  },

  ratings: {
    caillou: 'Rock',
    tortue: 'Turtle',
    cool: 'Cool',
    feu: 'Fire',
    legendaire: 'Legendary',
  },

  rating: {
    title: '✍️ Your review',
    successTitle: '🎉 Thank you!',
    howWasProduct: 'How was this product?',
    optionalComment: 'A little comment? (optional)',
    commentPlaceholder: 'Share your experience with this product...',
    change: 'Change',
    skip: 'Skip',
    send: 'Send',
    success: 'Your review has been successfully recorded!',
    close: 'Close',
  },

  complaint: {
    title: 'Report a problem',
    concerning: 'Concerning',
    chooseAdmin: 'Choose an administrator',
    adminWillContact: 'The chosen administrator will contact you to resolve the problem.',
    describeProblem: 'Describe your problem *',
    problemPlaceholder: 'Explain in detail the problem encountered...',
    notLinkedToProduct: '💡 This complaint is not linked to a specific product.',
    complaintSent: 'Complaint sent!',
    adminWillProcess: 'will process your request.',
    willBeSentTo: 'Your complaint will be sent to',
    cancel: 'Cancel',
    send: 'Send',
    error: 'An error occurred. Please try again.',
    close: 'Close',
  },

  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    submit: 'Submit',
    close: 'Close',
  },

  notFound: {
    title: 'Product Not Found',
    description: 'Sorry, the product you are looking for does not exist or has been removed.',
    backHome: 'Back to Home',
    viewAll: 'View All Products',
    suggestions: 'Suggestions:',
    suggestion1: 'Check that the URL is correct',
    suggestion2: 'The product may have been deleted or moved',
    suggestion3: 'Try searching for the product from the home page',
  },
}

export const translations = { fr, en }

export type Translations = typeof fr
