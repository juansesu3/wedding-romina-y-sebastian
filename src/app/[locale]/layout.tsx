
import { NextIntlClientProvider } from 'next-intl';
import FixHydra from "../componentes/FixHydra";
import { getMessages } from 'next-intl/server';
import "../globals.css";

type Locale = 'es' | 'fr';
// const availableLocales: Locale[] = ["es", "fr",];


export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params:{ locale: Locale };
}) {
  // Aquí simplemente destructurasmos el locale sin await
  const {locale }=  params
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