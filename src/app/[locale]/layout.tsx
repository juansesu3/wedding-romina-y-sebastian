import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import FixHydra from "../componentes/FixHydra";
import { getMessages } from 'next-intl/server';
import "../globals.css";

type Locale = 'es' | 'fr';

interface RootLayoutProps {
  children: ReactNode;
  params: { locale: Locale };
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = params;

  let messages;
  try {
    messages = await getMessages({ locale });
  } catch (error) {
    console.error(`Error fetching messages for locale: ${locale}`, error);
    messages = {};
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
