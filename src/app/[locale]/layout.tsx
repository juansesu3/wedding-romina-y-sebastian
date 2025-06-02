import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import "../globals.css";
import FixHydra from "../componentes/FixHydra";


type Locale = 'es' | 'fr';
const availableLocales: Locale[] = ["es", "fr",];

// ✅ Solución: Usar generateStaticParams para manejar los locales antes de `generateMetadata`
export function generateStaticParams() {
  return availableLocales.map((locale) => ({ locale }));
}

 export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  // ✅ Ahora los `params` se generan correctamente antes de ejecutar esta función
  const locale = params.locale;// Cast para asegurar que es un Locale válido

  const metadataTranslations = {

    es: {
      title: 'Romi & Sebas',
      description: 'Transforma tu comercio electrónico y soporte al cliente con las avanzadas soluciones de IA de PandorAI. Mejora las interacciones con los clientes, agiliza los procesos y fomenta el crecimiento empresarial con nuestros sistemas de IA personalizados.',
      keywords: 'IA para Comercio Electrónico, IA para Soporte al Cliente, Soluciones de IA, Automatización para Comercio Electrónico, Soporte al Cliente con IA, PandorAI',
      locale: 'es_ES',
    },
    fr: {
      title: 'Romi & Sebas',
      description: 'Transformez votre e-commerce et votre support client avec les solutions IA avancées de PandorAI. Améliorez les interactions avec les clients, rationalisez les processus et stimulez la croissance de votre entreprise avec nos systèmes IA sur mesure.',
      keywords: 'IA pour E-Commerce, IA pour Support Client, Solutions IA, Automatisation pour E-Commerce, Support Client IA, PandorAI',
      locale: 'fr_FR',
    },

  };

  const metadataLocale = metadataTranslations[locale as Locale] || metadataTranslations.fr;

  return {
    title: metadataLocale.title,
    description: metadataLocale.description,
    keywords: metadataLocale.keywords.split(', '), // Convertir a un array
    openGraph: {
      title: metadataLocale.title,
      description: metadataLocale.description,
      url: 'https://pandorai.ch',
      siteName: 'Romi & Sebas',
      images: [
        {
          url: 'https://my-page-negiupp.s3.amazonaws.com/1723452735373.PNG', // Reemplaza con la URL de tu imagen real
          width: 1200,
          height: 630,
          alt: 'AI Solutions for E-Commerce and Customer Support by PandorAI',
        },
      ],
      locale: metadataLocale.locale, // Formato locale como 'en_US'
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@romi&sebas',
      title: metadataLocale.title,
      description: metadataLocale.description,
      images: ['https://my-page-negiupp.s3.amazonaws.com/1723452735373.PNG'], // Reemplaza con la URL de tu imagen real
    },

    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, // Asegúrate de que tu variable de entorno esté configurada correctamente
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params:{ locale: string };
}) {
  // Aquí simplemente destructuramos el locale sin await
  const locale = params.locale;
  // Obtener los mensajes correspondientes al locale
  let messages;
  try {
    messages = await getMessages({ locale });
  } catch (error) {
    console.error(`Error fetching messages for locale: ${locale}`, error);
    messages = {}; // fallback para evitar errores si no se encuentran los mensajes
  }
  return (
    <html lang={locale}>
      <body>
        <FixHydra>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </FixHydra>
      </body>
    </html>
  );
}