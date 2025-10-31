import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import FixHydra from "../componentes/FixHydra";
import LangSwitch from "../componentes/LangSwitch";
import "../globals.css";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // (Opcional pero recomendado) Cargar mensajes del locale
  let messages: Record<string, unknown> | undefined;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    // Si no tienes archivos de mensajes, puedes omitir 'messages'
  }

  return (
    <html lang={locale}>
      <body>
        <FixHydra>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {/* ⬇️ AHORA el LangSwitch está dentro del provider */}
            <div className="fixed right-4 top-4 z-[1100]">
              <LangSwitch supportedLocales={routing.locales} showLocales={['es','fr']} />
            </div>

            {children}
          </NextIntlClientProvider>
        </FixHydra>
      </body>
    </html>
  );
}
