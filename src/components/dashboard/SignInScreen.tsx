import Link from 'next/link'
import { Suspense } from 'react'
import { FiArrowLeft, FiLogIn, FiLogOut } from 'react-icons/fi'
import { SignInError } from './SignInError'
import type { DashboardAccess } from '@/lib/dashboard/session'

const ERRORS: Record<string, string> = {
  access_denied: 'Connexion annulée.',
  expired: 'La connexion a pris trop de temps. Réessayez.',
  bad_state: "Ce lien de connexion n'est plus valable. Réessayez.",
  session: 'Votre session a expiré. Reconnectez-vous.',
  invalid_scope: "L'application SSS ne permet pas l'accès à la boutique.",
  invalid_client: "L'application SSS est mal configurée.",
}

/** /dashboard when nobody (or the wrong person) is signed in. */
export function SignInScreen({ access }: { access: Exclude<DashboardAccess, { ok: true }> }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      <div className="premium-card w-full max-w-md rounded-2xl p-6 sm:p-8 text-center animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold gradient-text mb-2">
          Dashboard Sarena
        </h1>

        {access.reason === 'off' ? (
          <p className="text-sm text-base-content/70 mt-4">
            La connexion n&apos;est pas configurée sur ce serveur. {access.detail}
          </p>
        ) : access.reason === 'wrong_business' || access.reason === 'no_business' ? (
          <>
            <p className="font-semibold mt-4">
              {access.reason === 'wrong_business'
                ? `Vous êtes connecté(e) à « ${access.detail} », pas à Sarena.`
                : "Aucune boutique n'a été choisie à la connexion."}
            </p>
            <p className="text-sm text-base-content/70 mt-2">
              Reconnectez-vous et choisissez Sarena dans SSS.
            </p>
            <form action="/auth/sss/sign-out" method="post" className="mt-6">
              <button className="btn btn-primary w-full gap-2 font-heading">
                <FiLogOut className="w-5 h-5" />
                Changer de compte
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="text-sm text-base-content/70">
              Connectez-vous avec votre compte SSS pour gérer les produits, les services, l&apos;équipe
              et le service client.
            </p>
            <Suspense>
              <SignInError messages={ERRORS} />
            </Suspense>
            <Link
              href="/auth/sss?next=/dashboard"
              prefetch={false}
              className="btn btn-primary btn-lg w-full gap-2 font-heading mt-6"
            >
              <FiLogIn className="w-5 h-5" />
              Se connecter avec SSS
            </Link>
          </>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 mt-5 text-sm text-base-content/60 hover:text-primary transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Retour au site
        </Link>
      </div>
    </main>
  )
}
