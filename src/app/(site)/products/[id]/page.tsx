import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSite } from '@/lib/sss'
import { ProductDetailPage } from './ProductDetailPage'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const site = await getSite()
  const product = site.products.find(p => p.id === id)
  if (!product) return {}
  const description = (product.description || site.seoDescription).slice(0, 180)
  const image = product.images[0]?.url
  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      type: 'website',
      url: `/products/${product.id}`,
      title: product.name,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  const site = await getSite()
  const product = site.products.find(p => p.id === id)
  if (!product) notFound()
  // Same category first, then the rest: never more than four.
  const others = site.products.filter(p => p.id !== product.id)
  const related = [
    ...others.filter(p => p.category && p.category === product.category),
    ...others.filter(p => !p.category || p.category !== product.category),
  ].slice(0, 4)
  return <ProductDetailPage product={product} related={related} />
}
