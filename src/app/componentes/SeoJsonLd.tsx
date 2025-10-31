// app/componentes/SeoJsonLd.tsx
export default function SeoJsonLd() {
    const base =
      process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? 'https://romyseb.ch'
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'Boda de Romina & Sebas',
      startDate: '2026-06-25T12:00:00+02:00',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: 'Finca Atlántida (Sens Restauración)',
        address: 'Lugar Atlántida s/n, 15800, Galicia, España'
      },
      image: [`${base}/og/cover.jpg`],
      organizer: { '@type': 'Organization', name: 'Romina & Sebas', url: base }
    }
  
    return (
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
    )
  }
  