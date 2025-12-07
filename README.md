# 🛍️ Sarena Store

<div align="center">
  <img src="https://via.placeholder.com/200x80?text=Sarena+Store" alt="Sarena Store Logo" />
  <p><strong>Boutique Premium - Catalogue Dynamique</strong></p>
</div>

## ✨ Fonctionnalités

- 🛒 **Catalogue One-Page** - Affichage premium de tous les produits
- 📱 **WhatsApp Click-to-Chat** - Vente directe via WhatsApp
- 🏷️ **Badges Animés** - Nouveau, Populaire, Stock Limité
- ⭐ **Système de Notation Fun** - 5 niveaux (Caillou → Légendaire)
- 📝 **Plaintes & Support** - Avec assignation automatique aux admins
- 📊 **Logs Complets** - Exportables en JSON/CSV
- 🌙 **Dark/Light Mode** - Thème personnalisable
- 🔐 **Auth Supabase** - Connexion Google via Supabase

## 🛠️ Stack Technique

- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS + DaisyUI
- **Animations**: Framer Motion
- **Base de données**: PostgreSQL (Docker local + Supabase Auth)
- **ORM**: Prisma
- **Auth**: Supabase Auth (Google OAuth)

## 🚀 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Docker & Docker Compose
- Compte Supabase

### 1. Cloner le projet

```bash
git clone https://github.com/votre-repo/sarena-store.git
cd sarena-store
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration environnement

Créez un fichier `.env` à partir de `env.txt` :

```bash
cp env.txt .env
```

Puis modifiez `.env` avec vos valeurs :

```env
# Database - Docker PostgreSQL (Local)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sarena_store?schema=public"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://votre-projet.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre-anon-key"
SUPABASE_SERVICE_ROLE_KEY="votre-service-role-key"

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER="+221770000000"

# Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. Démarrer la base de données Docker

```bash
# Démarrer PostgreSQL
npm run db:up

# Vérifier les logs
npm run db:logs

# Arrêter (si besoin)
npm run db:down
```

### 5. Configuration Supabase Auth

1. Créez un projet sur [Supabase](https://supabase.com)
2. Allez dans **Settings > API**
3. Copiez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Secret, jamais exposé au client)
4. Allez dans **Authentication > Providers**
5. Activez **Google** et configurez :
   - Client ID (depuis Google Cloud Console)
   - Client Secret
   - Redirect URL: `http://localhost:3000/auth/callback`

### 6. Configuration Google OAuth

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Créez un projet et activez l'API Google+ ou People API
3. Créez des identifiants OAuth 2.0
4. Ajoutez les URI de redirection :
   - `http://localhost:3000/auth/callback` (dev)
   - `https://votre-domaine.com/auth/callback` (prod)
5. Copiez Client ID et Secret dans Supabase

### 7. Initialisation base de données

```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers la DB Docker
npm run db:push

# Seeder la base de données
npm run db:seed
```

### 8. Lancer le projet

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
sarena-store/
├── docker-compose.yml     # Configuration PostgreSQL Docker
├── env.txt                # Template variables d'environnement
├── prisma/
│   ├── schema.prisma      # Schéma de base de données
│   └── seed.ts            # Données de test
├── src/
│   ├── app/
│   │   ├── actions/       # Server Actions
│   │   ├── api/user/      # API route pour user data
│   │   ├── auth/callback/ # Callback Supabase Auth
│   │   ├── globals.css    # Styles globaux + tokens
│   │   ├── layout.tsx     # Layout principal
│   │   ├── page.tsx       # Page d'accueil
│   │   └── HomePage.tsx   # Client component principal
│   ├── components/        # Composants React
│   ├── hooks/
│   │   └── useAuth.ts     # Hook Supabase Auth
│   ├── lib/
│   │   ├── prisma.ts      # Client Prisma singleton
│   │   ├── auth.ts        # Helpers auth Supabase
│   │   ├── supabase/      # Clients Supabase
│   │   └── motion.ts      # Variants Framer Motion
│   └── types/
│       └── index.ts       # Types TypeScript
└── package.json
```

## 🐳 Docker Commands

```bash
# Démarrer PostgreSQL
npm run db:up

# Arrêter PostgreSQL
npm run db:down

# Voir les logs
npm run db:logs

# Redémarrer
npm run db:down && npm run db:up
```

## 🔧 Commandes Utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Lancer en production
npm run start

# Linting
npm run lint

# Base de données
npm run db:generate    # Générer client Prisma
npm run db:push        # Push schema vers DB
npm run db:seed        # Seeder la DB
npm run db:studio      # Ouvrir Prisma Studio
```

## 🔐 Authentification Supabase

L'authentification utilise Supabase Auth avec Google OAuth :

1. **Client-side** : `useAuth()` hook pour les composants
2. **Server-side** : `getSession()` pour les Server Actions
3. **Auto-sync** : Les utilisateurs Supabase sont automatiquement créés dans Prisma

### Utilisation

```typescript
// Client component
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user, loading, signIn, signOut } = useAuth()
  // ...
}

// Server Action
import { getSession } from '@/lib/auth'

export async function myAction() {
  const { user } = await getSession()
  if (!user) return { error: 'Unauthorized' }
  // ...
}
```

## 📊 Server Actions

### Interactions

```typescript
import { recordInteraction, recordView } from '@/app/actions'

await recordInteraction(productId)
await recordView(productId)
```

### Ratings

```typescript
import { submitRating } from '@/app/actions'

await submitRating(productId, 'LEGENDAIRE', 'Super produit !')
```

### Plaintes

```typescript
import { submitComplaint } from '@/app/actions'

await submitComplaint('Mon problème...', productId)
```

### Export Logs

```typescript
import { exportLogs } from '@/app/actions'

const { data } = await exportLogs('json')
const { data } = await exportLogs('csv')
```

## 🎭 Niveaux de Notation

| Niveau     | Emoji | Description          |
| ---------- | ----- | -------------------- |
| CAILLOU    | 🪨    | Nul comme un caillou |
| TORTUE     | 🐢    | Ça avance doucement  |
| COOL       | 😎    | Carrément cool       |
| FEU        | 🔥    | Ça envoie du feu     |
| LEGENDAIRE | 👑    | Légendaire Supreme   |

## ♿ Accessibilité (WCAG AA)

- ✅ Focus visible sur tous les éléments interactifs
- ✅ Contraste couleurs conforme
- ✅ Support `prefers-reduced-motion`
- ✅ Labels et ARIA attributes
- ✅ Navigation clavier complète
- ✅ Trap focus dans les modales

## ⚡ Performance

- **ISR**: Revalidation toutes les 30 secondes
- **Images**: Format AVIF/WebP optimisé
- **Lazy Loading**: Chargement différé des images
- **Critical CSS**: Styles critiques inline
- **Tree Shaking**: Framer Motion optimisé

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connectez votre repo GitHub à Vercel
2. Configurez les variables d'environnement
3. **Important** : Ajoutez `DATABASE_URL` pour votre DB de production (Supabase PostgreSQL)
4. Déployez !

### Variables à configurer :

- `DATABASE_URL` (Supabase PostgreSQL en production)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_SITE_URL`

## 📜 Licence

MIT © Sarena Store

---

<div align="center">
  <p>Fait avec ❤️ au Sénégal</p>
</div>
