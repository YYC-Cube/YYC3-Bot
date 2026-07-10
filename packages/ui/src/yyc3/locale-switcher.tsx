"use client"

import { cn } from "@yyc3/core"
import type { Locale } from "@yyc3/i18n"
import { i18n, SUPPORTED_LOCALES } from "@yyc3/i18n"
import { Globe } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  ja: "日本語",
  ko: "한국어",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  "pt-BR": "Português",
  ar: "العربية",
}

interface LocaleSwitcherProps {
  className?: string
}

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const [currentLocale, setCurrentLocale] = useState<Locale>(i18n.getLocale())
  const [open, setOpen] = useState(false)
  const [switching, setSwitching] = useState(false)

  useEffect(() => {
    const unsub = i18n.subscribe((locale) => {
      setCurrentLocale(locale)
    })
    return unsub
  }, [])

  const handleSwitch = useCallback(async (locale: Locale) => {
    if (locale === currentLocale || switching) return
    setSwitching(true)
    setOpen(false)
    try {
      await i18n.setLocale(locale)
    } finally {
      setSwitching(false)
    }
  }, [currentLocale, switching])

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setOpen(!open)}
        disabled={switching}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-sans",
          "text-white/60 hover:text-white hover:bg-white/10 transition-all",
          open && "text-white bg-white/10"
        )}
        aria-label="Switch language"
        title={LOCALE_LABELS[currentLocale]}
      >
        {switching ? (
          <span className="w-3.5 h-3.5 border border-white/40 border-t-white/80 rounded-full animate-spin" />
        ) : (
          <Globe className="w-3.5 h-3.5" />
        )}
        <span className="hidden sm:inline">{LOCALE_LABELS[currentLocale]}</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-50 w-44 bg-neutral-900 border border-white/10 rounded-xl shadow-xl overflow-hidden">
            <div className="py-1.5 max-h-64 overflow-y-auto">
              {SUPPORTED_LOCALES.map((locale) => (
                <button
                  key={locale}
                  onClick={() => handleSwitch(locale as Locale)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs font-sans transition-colors",
                    "hover:bg-white/10",
                    locale === currentLocale
                      ? "text-white bg-white/5"
                      : "text-white/60"
                  )}
                >
                  {LOCALE_LABELS[locale as Locale]}
                  {locale === currentLocale && (
                    <span className="ml-2 text-white/40">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
