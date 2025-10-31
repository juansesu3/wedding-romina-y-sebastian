'use client'

import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useLocale} from 'next-intl'
import {useMemo} from 'react'
import clsx from 'clsx'

type Props = {
  /** Lista total de locales soportados (e.g. routing.locales) */
  supportedLocales: readonly string[]
  /** Limita los que se muestran (por ejemplo ['es','fr']) */
  showLocales?: string[]
  /** Clase extra para posicionamiento/estilo */
  className?: string
  /** Etiqueta accesible para el grupo */
  ariaLabel?: string
}

function replaceLocaleInPathname(pathname: string, newLocale: string, supported: readonly string[]) {
  if (!pathname) return `/${newLocale}`
  const segs = pathname.split('/')
  // segs[0] === '' por el prefijo '/'
  if (supported.includes(segs[1] || '')) {
    segs[1] = newLocale
    return segs.join('/') || `/${newLocale}`
  }
  // Si no hay prefijo de locale, lo añadimos
  return `/${newLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`
}

export default function LangSwitch({
  supportedLocales,
  showLocales = ['es', 'fr'],
  className,
  ariaLabel = 'Seleccionar idioma',
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = useLocale()

  const localesToRender = useMemo(
    () => showLocales.filter(l => supportedLocales.includes(l)),
    [showLocales, supportedLocales]
  )

  const go = (nextLocale: string) => {
    const base = replaceLocaleInPathname(pathname || '/', nextLocale, supportedLocales)
    const qs = searchParams?.toString()
    router.push(qs ? `${base}?${qs}` : base)
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={clsx(
        'inline-flex items-center rounded-xl  bg-white/90 backdrop-blur px-1 py-1 shadow-sm',
        'ring-1 ring-black/5',
        className
      )}
    >
      {localesToRender.map((loc) => {
        const active = current === loc
        return (
          <button
            key={loc}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => !active && go(loc)}
            className={clsx(
              'min-w-[42px] px-3 py-.5 text-sm rounded-lg transition',
              active
                ? 'bg-[#d49e7a] text-white shadow'
                : 'text-gray-700 hover:bg-black/5'
            )}
          >
            {loc.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
