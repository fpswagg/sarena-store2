export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Africa/Douala',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
