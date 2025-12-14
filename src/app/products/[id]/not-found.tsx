import Link from 'next/link'
import { FiArrowLeft, FiPackage, FiHome } from 'react-icons/fi'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function ProductNotFound() {
  return (
    <main className="min-h-screen bg-base-100">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-error/10 mb-6">
            <FiPackage className="w-12 h-12 sm:w-16 sm:h-16 text-error" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4">
            Produit introuvable
          </h1>
          <p className="text-base sm:text-lg text-base-content/70 mb-8 max-w-2xl mx-auto">
            Désolé, le produit que vous recherchez n'existe pas ou a été supprimé.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="btn btn-primary btn-lg gap-2"
          >
            <FiHome className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          <Link
            href="/"
            className="btn btn-ghost btn-lg gap-2"
          >
            <FiArrowLeft className="w-5 h-5" />
            Voir tous les produits
          </Link>
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-base-200/50 border border-base-300">
          <p className="text-sm text-base-content/60 mb-4">
            Suggestions :
          </p>
          <ul className="text-left text-sm text-base-content/70 space-y-2 max-w-md mx-auto">
            <li>• Vérifiez que l'URL est correcte</li>
            <li>• Le produit a peut-être été supprimé ou déplacé</li>
            <li>• Essayez de rechercher le produit depuis la page d'accueil</li>
          </ul>
        </div>
      </div>

      <Footer whatsappNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+221770000000'} />
    </main>
  )
}
