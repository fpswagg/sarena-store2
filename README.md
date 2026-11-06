# Sarena Store

Le site de Sarena. Toutes les données viennent de SSS (boutique `sarena`) : produits, services, équipe, assistant, messages.

- `src/app/(site)` : le site public (FR/EN), mis en cache, rafraîchi à chaque changement fait depuis le dashboard.
- `src/app/dashboard` : le tableau de bord, connexion avec un compte SSS. Chaque action part avec le compte de la personne connectée, donc son rôle dans SSS s'applique.
- Variables : voir `.env.example`.

```bash
pnpm install
pnpm dev
pnpm build
```
