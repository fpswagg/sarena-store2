import { notFound } from 'next/navigation'
import { getProduct, getProducts, getDefaultAdmin } from '@/app/actions'
import { ProductDetailPage } from './ProductDetailPage'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Generate metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { product } = await getProduct(id)

  if (!product) {
    return {
      title: 'Produit non trouvé | Boutique Sarena',
      description: 'Le produit demandé est introuvable.',
    }
  }

  // Get translated name and description
  const nameObj = product.name as { fr?: string; en?: string } | string
  const descObj = product.shortDesc as { fr?: string; en?: string } | string
  
  const productName = typeof nameObj === 'string' 
    ? nameObj 
    : nameObj?.fr || nameObj?.en || 'Produit'
  
  const productDesc = typeof descObj === 'string'
    ? descObj
    : descObj?.fr || descObj?.en || 'Découvrez ce produit sur Boutique Sarena'

  return {
    title: `${productName} | Boutique Sarena`,
    description: productDesc,
    openGraph: {
      title: productName,
      description: productDesc,
      images: [
        {
          url: product.thumbnail,
          width: 800,
          height: 800,
          alt: productName,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: productName,
      description: productDesc,
      images: [product.thumbnail],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [productResult, adminResult, productsResult] = await Promise.all([
    getProduct(id),
    getDefaultAdmin(),
    getProducts(),
  ])

  if (!productResult.product) {
    notFound()
  }

  const whatsappNumber =
    adminResult.admin?.phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+221770000000'

  // Get related products (same supplier, excluding current)
  const relatedProducts = productsResult.products.filter(p => p.id !== id).slice(0, 4)

  return (
    <ProductDetailPage
      product={productResult.product}
      relatedProducts={relatedProducts}
      whatsappNumber={whatsappNumber}
    />
  )
}
