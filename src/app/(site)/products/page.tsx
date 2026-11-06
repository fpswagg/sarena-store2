import type { Metadata } from 'next'
import { getSite } from '@/lib/sss'
import { ProductsPage } from './ProductsPage'

export const metadata: Metadata = {
  title: 'Produits',
  alternates: { canonical: '/products' },
}

export default async function Page() {
  const site = await getSite()
  return <ProductsPage products={site.products} />
}
