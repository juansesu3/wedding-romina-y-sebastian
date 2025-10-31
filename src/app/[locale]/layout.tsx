// app/[locale]/layout.tsx
import type {Metadata} from 'next'
import {NextIntlClientProvider, hasLocale} from 'next-intl'
import {notFound} from 'next/navigation'
import {routing} from '@/i18n/routing'
import FixHydra from '../componentes/FixHydra'
import LangSwitch from '../componentes/LangSwitch'
import '../globals.css'
import SeoJsonLd from '../componentes/SeoJsonLd'

export async function generateMetadata(
  {params}: {params: Promise<{locale: string}>}
): Promise<Metadata> {
  const {locale} = await params
  const base = new URL(process.env.APP_URL ?? 'https://romyseb.ch')
  const metadataBase = new URL(base)

  // Elige imagen por idioma (o usa una sola)
  const ogImage = locale === 'fr' ? '/og-fr.jpg' : '/og-es.jpg'
  const titleBase =
    locale === 'fr'
      ? 'Romi & Sebas — Mariage 2026'
      : 'Romi & Sebas — Boda 2026'

  const description =
    locale === 'fr'
      ? 'Invitation de mariage de Romi et Sebas — 25 juin 2026 à la Finca Atlántida (Galice). Détails, accès, dress code, playlist et photos.'
      : 'Invitación de boda de Romi y Sebas — 25 de junio de 2026 en Finca Atlántida (Galicia). Detalles, cómo llegar, dress code, playlist y fotos.'

  return {
    metadataBase: base,
    title: {
      default: titleBase,
      template: `%s | Romi & Sebas`
    },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        es: '/es',
        fr: '/fr'
      }
    },
    icons: {
      icon: [{ url: '/icon.png' }, { url: '/favicon.ico' }],
      apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
      shortcut: ['/favicon.ico']
    },
    openGraph: {
      type: 'website',
      url: base.toString(),
      siteName: 'RomySeb',
      title: titleBase,
      description,
      images: [
        {
          url: new URL(ogImage, metadataBase).toString(),
          width: 1200,
          height: 630,
          alt:
            locale === 'fr'
              ? 'Romi et Sebas à la Finca Atlántida, Galice'
              : 'Romi y Sebas en Finca Atlántida, Galicia'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: titleBase,
      description,
      images: ['/og/cover.jpg']
      // creator: '@tu_usuario' // si quieres
    },
    manifest: '/site.webmanifest'
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{locale: string}>
}) {
  const {locale} = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  let messages: Record<string, unknown> | undefined
  try {
    messages = (await import(`@/messages/${locale}.json`)).default
  } catch {}

  return (
    <html lang={locale}>
      <body>
        <FixHydra>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="fixed left-2 top-2 z-[1100]">
              <LangSwitch supportedLocales={routing.locales} showLocales={['es','fr']} />
            </div>
            <SeoJsonLd />
            {children}
          </NextIntlClientProvider>
        </FixHydra>
      </body>
    </html>
  )
}
