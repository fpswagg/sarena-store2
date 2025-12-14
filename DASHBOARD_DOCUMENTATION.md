# 📊 Documentation du Dashboard Sarena

## Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Système d'authentification](#système-dauthentification)
4. [Gestion des rôles](#gestion-des-rôles)
5. [Fonctionnalités par page](#fonctionnalités-par-page)
6. [Structure des données](#structure-des-données)
7. [Composants principaux](#composants-principaux)
8. [Intégration dans votre e-commerce](#intégration-dans-votre-e-commerce)
9. [Style et responsive design](#style-et-responsive-design)

---

## Vue d'ensemble

Le Dashboard Sarena est un système de gestion complet pour une plateforme e-commerce, permettant aux administrateurs et fournisseurs de gérer leurs produits, suivre les statistiques, gérer les plaintes et consulter les logs système.

### Technologies utilisées
- **Next.js 15** (App Router) - Framework React
- **TypeScript** - Typage statique
- **Prisma** - ORM pour la base de données
- **Supabase** - Authentification OAuth (Google)
- **Tailwind CSS + DaisyUI** - Framework CSS
- **PostgreSQL** - Base de données

---

## Architecture

### Structure des dossiers

```
app/
├── dashboard/              # Routes du dashboard
│   ├── page.tsx           # Page d'accueil avec statistiques
│   ├── layout.tsx         # Layout avec sidebar et header
│   ├── products/          # Gestion des produits
│   ├── complaints/        # Gestion des plaintes (Admin uniquement)
│   └── logs/              # Logs système (Admin uniquement)
├── actions/               # Server Actions (mutations)
│   ├── products.ts
│   ├── complaints.ts
│   ├── ratings.ts
│   └── logs.ts
├── auth/                  # Routes d'authentification
│   ├── callback/          # Callback OAuth
│   └── logout/           # Déconnexion
└── login/                 # Page de connexion

components/
├── DashboardHeader.tsx    # En-tête avec menu utilisateur
├── DashboardSidebar.tsx   # Navigation latérale
├── StatsCards.tsx         # Cartes de statistiques
├── ProductTable.tsx       # Tableau des produits
├── ProductForm.tsx        # Formulaire produit
├── ComplaintsTable.tsx    # Tableau des plaintes
├── LogsTable.tsx          # Tableau des logs
└── ThemeProvider.tsx      # Gestion du thème clair/sombre

lib/
├── supabase/              # Clients Supabase
│   ├── client.ts          # Client navigateur
│   ├── server.ts          # Client serveur
│   └── middleware.ts      # Gestion des sessions
├── utils/
│   ├── auth.ts            # Fonctions d'authentification
│   └── logs.ts            # Utilitaires de logging
└── prisma.ts              # Client Prisma
```

---

## Système d'authentification

### Flux d'authentification

1. **Connexion** (`/login`)
   - L'utilisateur clique sur "Sign in with Google"
   - Redirection vers Supabase OAuth
   - Après authentification, redirection vers `/auth/callback`

2. **Callback** (`/auth/callback`)
   - Échange du code OAuth pour une session
   - Récupération des données utilisateur Supabase
   - Synchronisation avec la base de données Prisma
   - Création ou mise à jour de l'utilisateur
   - Redirection vers `/dashboard`

3. **Middleware** (`middleware.ts`)
   - Vérifie l'authentification sur chaque requête
   - Redirige vers `/login` si non authentifié
   - Gère les cookies de session Supabase
   - Met à jour automatiquement les sessions

### Configuration requise

**Variables d'environnement :**
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
DATABASE_URL=postgresql://user:password@host:5432/database
```

**Configuration Supabase :**
- Activer le provider Google OAuth
- Ajouter l'URL de redirection : `https://votre-domaine.com/auth/callback`
- Configurer le Site URL dans les paramètres Supabase

---

## Gestion des rôles

Le système utilise trois rôles définis dans Prisma :

### 1. **ADMIN** (Administrateur)
- Accès complet au dashboard
- Gestion de tous les produits (tous les fournisseurs)
- Gestion des plaintes
- Consultation des logs système
- Suppression de produits
- Réassignation de plaintes

**Pages accessibles :**
- `/dashboard` - Vue d'ensemble avec statistiques
- `/dashboard/products` - Liste de tous les produits
- `/dashboard/complaints` - Gestion des plaintes
- `/dashboard/logs` - Logs système

### 2. **SUPPLIER** (Fournisseur)
- Gestion de ses propres produits uniquement
- Création, modification de produits
- Marquer produits comme indisponibles
- Vue d'ensemble limitée à ses produits

**Pages accessibles :**
- `/dashboard` - Vue d'ensemble (produits du fournisseur uniquement)
- `/dashboard/products` - Liste de ses produits

### 3. **USER** (Utilisateur standard)
- Pas d'accès au dashboard
- Peut noter et déposer des plaintes sur les produits
- Accès uniquement au site e-commerce public

### Fonctions de contrôle d'accès

```typescript
// lib/utils/auth.ts

requireAuth()           // Vérifie qu'un utilisateur est connecté
requireRole([...])     // Vérifie que l'utilisateur a un rôle spécifique
requireAdmin()         // Vérifie que l'utilisateur est admin
requireDashboardAccess() // Vérifie ADMIN ou SUPPLIER
```

---

## Fonctionnalités par page

### 🏠 Page d'accueil (`/dashboard`)

**Fonctionnalités :**
- **Statistiques en temps réel** :
  - Total des produits
  - Produits en rupture de stock
  - Note moyenne des produits
  - Nouveaux produits (7 derniers jours)
- **Logs récents** (Admin uniquement) : Affiche les 10 dernières actions

**Composants utilisés :**
- `StatsCards` - Affiche 4 cartes de statistiques
- `RecentLogs` - Tableau des logs récents

**Filtrage par rôle :**
- **Admin** : Statistiques sur tous les produits
- **Supplier** : Statistiques uniquement sur ses produits

---

### 📦 Gestion des produits (`/dashboard/products`)

#### Liste des produits (`/dashboard/products`)

**Fonctionnalités :**
- Affichage de tous les produits (Admin) ou produits du fournisseur (Supplier)
- Informations affichées :
  - Image miniature
  - Nom du produit
  - Ville
  - Prix (FCFA)
  - Stock (avec badge visuel)
  - Note moyenne et nombre d'avis
  - Fournisseur (Admin uniquement)
- Actions disponibles :
  - ✏️ Éditer le produit
  - 🚫 Marquer comme indisponible (si stock > 0)
  - 🗑️ Supprimer (Admin uniquement)

**Composant :** `ProductTable`

#### Créer un produit (`/dashboard/products/new`)

**Formulaire bilingue (FR/EN) :**
- Nom (français et anglais)
- Description courte (français et anglais)
- Description longue (français et anglais)
- Prix (FCFA)
- Stock
- Ville
- Thumbnail (image principale)
- Images supplémentaires
- Sélection du fournisseur (Admin uniquement)

**Fonctionnalités :**
- Upload d'images via Supabase Storage
- Ou saisie d'URL d'image
- Prévisualisation des images
- Validation des champs
- Création automatique des statistiques produit

**Composant :** `ProductForm`

#### Éditer un produit (`/dashboard/products/[id]`)

**Fonctionnalités similaires à la création :**
- Pré-remplissage du formulaire avec les données existantes
- Vérification des permissions :
  - Supplier ne peut éditer que ses propres produits
  - Admin peut éditer tous les produits

---

### 📋 Gestion des plaintes (`/dashboard/complaints`) - Admin uniquement

**Fonctionnalités :**
- Liste de toutes les plaintes
- Informations affichées :
  - Utilisateur qui a déposé la plainte
  - Message de la plainte
  - Produit concerné (si applicable)
  - Statut (RECEIVED, IN_PROGRESS, RESOLVED)
  - Admin assigné
- Actions disponibles :
  - Changer le statut de la plainte
  - Réassigner à un autre admin

**Statuts :**
- `RECEIVED` - Plainte reçue (badge warning)
- `IN_PROGRESS` - En cours de traitement (badge info)
- `RESOLVED` - Résolue (badge success)

**Composant :** `ComplaintsTable`

---

### 📊 Logs système (`/dashboard/logs`) - Admin uniquement

**Fonctionnalités :**
- Affichage des 100 derniers logs
- Informations affichées :
  - Timestamp
  - Utilisateur (nom, email)
  - Rôle de l'utilisateur
  - Action (CREATE, UPDATE, DELETE)
  - Cible (Product, Complaint, Rating, etc.)
  - ID de la cible
  - Adresse IP
- Téléchargement des logs en CSV

**Types d'actions :**
- `CREATE` - Création (badge success)
- `UPDATE` - Mise à jour (badge warning)
- `DELETE` - Suppression (badge error)

**Composant :** `LogsTable`, `DownloadLogsButton`

---

## Structure des données

### Modèles Prisma

#### User
```prisma
- id: UUID
- supabaseId: String? (unique) - ID Supabase pour l'authentification
- fullName: String?
- email: String? (unique)
- role: Role (ADMIN, SUPPLIER, USER)
- avatar: String?
- createdAt, updatedAt
```

#### Product
```prisma
- id: UUID
- name: Json { fr: string, en: string } - Nom bilingue
- shortDesc: Json { fr: string, en: string }
- longDesc: Json { fr: string, en: string }
- price: Float (en FCFA)
- stock: Int
- city: String
- thumbnail: String (URL)
- images: String[] (URLs)
- supplierId: String (relation User)
- isNew: Boolean
- createdAt
```

#### Rating
```prisma
- id: UUID
- level: RatingLevel (CAILLOU, TORTUE, COOL, FEU, LEGENDAIRE)
- comment: String?
- userId, productId
- createdAt
```

#### Complaint
```prisma
- id: UUID
- message: String
- status: ComplaintStatus (RECEIVED, IN_PROGRESS, RESOLVED)
- productId: String? (optionnel)
- userId: String? (utilisateur qui a déposé)
- assignedAdminId: String (admin assigné)
- createdAt
```

#### ProductStat
```prisma
- id: UUID
- productId: String (unique)
- views: Int
- clicks: Int
- complaints: Int
- ratingAvg: Float
```

#### Log
```prisma
- id: UUID
- userId: String
- userRole: Role
- action: String (CREATE, UPDATE, DELETE)
- target: String (Product, Complaint, etc.)
- targetId: String?
- ip: String?
- createdAt
```

---

## Composants principaux

### DashboardHeader
**Fichier :** `components/DashboardHeader.tsx`

**Fonctionnalités :**
- En-tête sticky avec backdrop blur
- Menu hamburger pour mobile
- Titre avec gradient
- Bouton de basculement thème clair/sombre
- Menu utilisateur avec :
  - Avatar ou initiales
  - Nom, email, rôle
  - Bouton de déconnexion

**Props :**
```typescript
{
  user: {
    id: string
    fullName: string | null
    email: string | null
    avatar: string | null
    role: Role
  }
}
```

### DashboardSidebar
**Fichier :** `components/DashboardSidebar.tsx`

**Fonctionnalités :**
- Navigation latérale responsive
- Menu différent selon le rôle :
  - **Admin** : Home, Products, Complaints, Logs
  - **Supplier** : Home, My Products
- Indication de la page active
- Drawer pour mobile (se ferme automatiquement)

**Props :**
```typescript
{
  user: {
    role: Role
  }
}
```

### ProductForm
**Fichier :** `components/ProductForm.tsx`

**Fonctionnalités :**
- Formulaire bilingue complet
- Gestion des images (upload ou URL)
- Validation côté client
- États de chargement
- Gestion des erreurs
- Prévisualisation des images

**Props :**
```typescript
{
  product?: Product & { supplier: User }  // Pour l'édition
  suppliers?: User[]                      // Pour admin
  currentUser: User
}
```

### StatsCards
**Fichier :** `components/StatsCards.tsx`

**Fonctionnalités :**
- 4 cartes de statistiques
- Animations au chargement
- Icônes et couleurs différenciées
- Responsive (1 colonne mobile, 2 tablette, 4 desktop)

**Props :**
```typescript
{
  totalProducts: number
  outOfStock: number
  avgRating: number
  newProducts: number
}
```

---

## Intégration dans votre e-commerce

### Étapes d'intégration

#### 1. **Vérifier le schéma Prisma**

Assurez-vous que votre `schema.prisma` contient tous les modèles nécessaires :
- User (avec les champs Supabase)
- Product (avec les champs JSON pour les traductions)
- Rating, Complaint, ProductStat, Log, Interaction

Si certains modèles manquent, ajoutez-les depuis le dashboard.

#### 2. **Copier les fichiers**

**Dossiers à copier :**
```
app/dashboard/          → Votre dossier app/
app/actions/            → Votre dossier app/
app/auth/               → Votre dossier app/
components/             → Votre dossier components/
lib/supabase/           → Votre dossier lib/
lib/utils/auth.ts       → Votre dossier lib/utils/
lib/utils/logs.ts       → Votre dossier lib/utils/
middleware.ts           → Racine du projet
```

**Fichiers à adapter :**
- `app/layout.tsx` - Ajouter ThemeProvider si nécessaire
- `app/globals.css` - Fusionner avec vos styles existants
- `tailwind.config.ts` - Adapter les couleurs à votre thème

#### 3. **Configurer les routes**

Le dashboard utilise les routes suivantes :
- `/dashboard` - Page d'accueil
- `/dashboard/products` - Liste produits
- `/dashboard/products/new` - Créer produit
- `/dashboard/products/[id]` - Éditer produit
- `/dashboard/complaints` - Plaintes (Admin)
- `/dashboard/logs` - Logs (Admin)
- `/login` - Connexion
- `/auth/callback` - Callback OAuth
- `/auth/logout` - Déconnexion

#### 4. **Adapter le style**

**Couleurs principales :**
Le dashboard utilise actuellement :
- Primary : `#FFD700` (or)
- Primary Dark : `#FFA500` (orange)
- Primary Light : `#FFED4E`

**Pour utiliser votre style :**
1. Modifier `tailwind.config.ts` :
```typescript
primary: {
  DEFAULT: '#VOTRE_COULEUR_PRINCIPALE',
  light: '#VOTRE_COULEUR_CLAIRE',
  dark: '#VOTRE_COULEUR_FONCEE',
}
```

2. Modifier `app/globals.css` :
```css
:root {
  --primary: #VOTRE_COULEUR_PRINCIPALE;
  --primary-dark: #VOTRE_COULEUR_FONCEE;
  --primary-light: #VOTRE_COULEUR_CLAIRE;
}
```

3. Les classes CSS personnalisées :
- `.cartoon-heading` - Titres avec gradient
- `.premium-card` - Cartes avec effet hover
- `.animate-fade-in` - Animation d'apparition
- `.gradient-text` - Texte avec gradient

#### 5. **Intégrer avec votre navigation**

**Option 1 : Lien direct**
Ajoutez un lien dans votre navigation principale :
```tsx
<Link href="/dashboard" className="btn btn-primary">
  Dashboard
</Link>
```

**Option 2 : Menu conditionnel**
Affichez le lien uniquement pour les utilisateurs autorisés :
```tsx
{user && (user.role === 'ADMIN' || user.role === 'SUPPLIER') && (
  <Link href="/dashboard">Dashboard</Link>
)}
```

#### 6. **Synchroniser les produits**

Les produits créés dans le dashboard sont automatiquement disponibles sur votre site e-commerce via :
- La route `/products/[id]` (si elle existe)
- La route `/` (page d'accueil avec liste des produits)

Assurez-vous que vos pages publiques utilisent les mêmes modèles Prisma.

---

## Style et responsive design

### Design System

**Breakpoints :**
- Mobile : `< 768px`
- Tablet : `768px - 1024px`
- Desktop : `> 1024px`

**Composants responsive :**

1. **DashboardLayout**
   - Drawer pour mobile (menu latéral qui s'ouvre)
   - Sidebar fixe pour desktop
   - Header sticky avec backdrop blur

2. **StatsCards**
   - 1 colonne (mobile)
   - 2 colonnes (tablet)
   - 4 colonnes (desktop)

3. **ProductTable**
   - Scroll horizontal sur mobile
   - Tableau complet sur desktop
   - Actions adaptées à la taille d'écran

4. **ProductForm**
   - Champs en colonne unique (mobile)
   - Grille 2 colonnes (desktop)
   - Boutons empilés (mobile) / côte à côte (desktop)

### Animations

**Animations disponibles :**
- `animate-fade-in` - Apparition en fondu
- `animate-slide-in` - Glissement depuis la gauche
- `animate-scale-in` - Zoom d'apparition
- `pulse` - Pulsation (pour les badges "NEW")

**Utilisation :**
```tsx
<div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
  Contenu animé
</div>
```

### Thème clair/sombre

Le dashboard supporte le thème clair et sombre via DaisyUI :
- Toggle dans le header
- Préférence sauvegardée dans localStorage
- Transition automatique des couleurs

**Configuration :**
- Thème clair : Primary = Or (#FFD700)
- Thème sombre : Primary = Orange (#FFA500)

### Accessibilité

**Fonctionnalités incluses :**
- ARIA labels sur les boutons
- Navigation au clavier
- Focus visible amélioré
- Contraste des couleurs respecté
- Touch targets minimum 44px sur mobile

---

## Actions serveur (Server Actions)

Toutes les mutations passent par des Server Actions dans `app/actions/` :

### Products (`app/actions/products.ts`)
- `createProduct(formData)` - Créer un produit
- `updateProduct(id, formData)` - Mettre à jour
- `deleteProduct(id)` - Supprimer (Admin)
- `markProductUnavailable(id)` - Mettre stock à 0

### Complaints (`app/actions/complaints.ts`)
- `createComplaint(formData)` - Créer une plainte
- `updateComplaintStatus(id, status)` - Changer statut
- `reassignComplaint(id, adminId)` - Réassigner

### Ratings (`app/actions/ratings.ts`)
- `createRating(formData)` - Noter un produit

### Logs (`app/actions/logs.ts`)
- `getLogs(limit)` - Récupérer les logs
- `downloadLogs()` - Télécharger tous les logs

**Toutes les actions :**
- Vérifient les permissions
- Créent des logs d'audit
- Revalident les chemins Next.js
- Gèrent les erreurs

---

## Sécurité

### Mesures de sécurité implémentées

1. **Authentification obligatoire**
   - Middleware vérifie chaque requête
   - Redirection automatique si non authentifié

2. **Contrôle d'accès par rôle**
   - Vérification du rôle avant chaque action
   - Supplier ne peut modifier que ses produits

3. **Validation des données**
   - Validation côté client (formulaires)
   - Validation côté serveur (Server Actions)

4. **Logs d'audit**
   - Toutes les actions sont loggées
   - IP et utilisateur enregistrés

5. **Protection CSRF**
   - Server Actions de Next.js
   - Cookies sécurisés en production

---

## Points d'attention pour l'intégration

### 1. **Base de données**
- Vérifiez que tous les modèles Prisma existent
- Exécutez `prisma generate` après modification du schema
- Exécutez `prisma db push` pour appliquer les changements

### 2. **Variables d'environnement**
- Configurez toutes les variables nécessaires
- Utilisez des valeurs différentes pour dev/prod

### 3. **Supabase**
- Configurez les redirect URLs
- Activez le provider Google OAuth
- Vérifiez les RLS (Row Level Security) si nécessaire

### 4. **Images**
- Configurez Supabase Storage avec un bucket "products"
- Vérifiez les permissions de lecture/écriture

### 5. **Style**
- Adaptez les couleurs à votre charte graphique
- Testez sur mobile, tablette et desktop
- Vérifiez le thème clair/sombre

---

## Support et maintenance

### Logs et debugging

**Console navigateur :**
- Erreurs d'authentification
- Erreurs de formulaires

**Logs serveur :**
- Actions utilisateur dans `/dashboard/logs`
- Erreurs Prisma dans les logs Next.js

**Base de données :**
- Utilisez Prisma Studio : `npm run db:studio`

### Améliorations possibles

1. **Pagination** sur les listes (produits, logs, plaintes)
2. **Recherche et filtres** avancés
3. **Export de données** (produits, statistiques)
4. **Notifications** en temps réel
5. **Gestion des commandes** (si applicable)
6. **Statistiques avancées** avec graphiques

---

## Conclusion

Le Dashboard Sarena est un système complet et modulaire qui peut être facilement intégré dans votre site e-commerce. Il offre :

✅ Gestion complète des produits (CRUD)
✅ Système d'authentification robuste
✅ Contrôle d'accès par rôle
✅ Interface responsive et moderne
✅ Logs d'audit complets
✅ Gestion des plaintes
✅ Statistiques en temps réel

Pour toute question ou problème, référez-vous à cette documentation ou consultez les commentaires dans le code source.

---

**Version :** 1.0.0  
**Dernière mise à jour :** 2024

