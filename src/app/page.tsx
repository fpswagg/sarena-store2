import { Suspense } from 'react'
import { getProducts, getDefaultAdmin } from './actions'
import { HomePage } from './HomePage'

// Force dynamic rendering since auth uses cookies
export const dynamic = 'force-dynamic'

export default async function Page() {
  // Fetch data in parallel
  const [productsResult, adminResult] = await Promise.all([getProducts(), getDefaultAdmin()])

  const whatsappNumber =
    adminResult.admin?.phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!

  return (
    <Suspense fallback={<LoadingScreen />}>
      <HomePage products={productsResult.products} whatsappNumber={whatsappNumber} logs={[]} />
    </Suspense>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="mt-4 text-base-content/60">Chargement...</p>
      </div>
    </div>
  )
}
