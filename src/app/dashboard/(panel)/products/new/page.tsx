import { ProductForm } from '@/components/dashboard/ProductForm'
import { PageTitle } from '@/components/dashboard/fields'

export default function NewProductPage() {
  return (
    <div>
      <PageTitle>Nouveau produit</PageTitle>
      <ProductForm />
    </div>
  )
}
