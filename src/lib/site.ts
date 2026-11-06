import type { Locale } from './i18n/translations'
import type { Product, Service, TeamMember } from './types'

/** Text from SSS, in the visitor's language (French is the base, English sits in metadata). */
export function productName(product: Product, locale: Locale): string {
  return (locale === 'en' && product.metadata?.i18n?.en?.name) || product.name
}

export function productDescription(product: Product, locale: Locale): string {
  return (locale === 'en' && product.metadata?.i18n?.en?.description) || product.description || ''
}

export function productCategory(product: Product, locale: Locale): string {
  return (locale === 'en' && product.metadata?.i18n?.en?.category) || product.category || ''
}

export function serviceName(service: Service, locale: Locale): string {
  return (locale === 'en' && service.metadata?.i18n?.en?.name) || service.name
}

export function serviceDescription(service: Service, locale: Locale): string {
  return (
    (locale === 'en' && service.metadata?.i18n?.en?.description) || service.data?.description || ''
  )
}

/** A service whose description already gives its prices needs no separate price. */
export function servicePrice(service: Service, locale: Locale): string | null {
  const price = Number(service.data?.price)
  if (!Number.isFinite(price) || price <= 0) return null
  if (/fcfa/i.test(serviceDescription(service, locale))) return null
  return formatPrice(price)
}

export function memberTitle(member: TeamMember, locale: Locale): string {
  return (locale === 'en' && member.en?.title) || member.title || ''
}

export function memberBio(member: TeamMember, locale: Locale): string {
  return (locale === 'en' && member.en?.bio) || member.bio || ''
}

export function isPriceOnRequest(product: Product): boolean {
  return Boolean(product.metadata?.priceOnRequest) || !(product.price > 0)
}

export function isOutOfStock(product: Product): boolean {
  return !product.unlimitedStock && !product.inStock
}

export function isLimited(product: Product): boolean {
  return !product.unlimitedStock && product.quantity > 0 && product.quantity <= 5
}

export function isFeatured(product: Product): boolean {
  return Boolean(product.metadata?.featured)
}

export function isNew(product: Product): boolean {
  return Boolean(product.metadata?.new)
}

export function formatPrice(price: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(price).replace(/\s/g, ' ')} FCFA`
}

export function formatAmount(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price).replace(/\s/g, ' ')
}

export function whatsappUrl(number: string, message?: string): string {
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${number}${text}`
}

export function productMessage(
  product: Product,
  siteUrl: string,
  locale: Locale
): string {
  const url = `${siteUrl}/products/${product.id}`
  const name = productName(product, locale)
  return locale === 'fr'
    ? `Bonjour, je suis intéressé(e) par ${name} (${url})`
    : `Hello, I'm interested in ${name} (${url})`
}

export function serviceMessage(service: Service, locale: Locale): string {
  const name = serviceName(service, locale)
  return locale === 'fr'
    ? `Bonjour, je voudrais en savoir plus sur : ${name}`
    : `Hello, I'd like to know more about: ${name}`
}

/** Opens the assistant, with a question already sent if there is one. */
export function askAssistant(question?: string) {
  window.dispatchEvent(new CustomEvent('sss:ask', { detail: question ?? '' }))
}
