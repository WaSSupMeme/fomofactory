import { useEffect, type ReactNode, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const STORAGE_KEY = 'theme'

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

const SYSTEM_THEME = 'system'

const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)')

const getSystemTheme = () => (darkThemeMq.matches ? Theme.DARK : Theme.LIGHT)

const isTheme = (v: unknown): v is Theme | typeof SYSTEM_THEME =>
  typeof v === 'string' && [SYSTEM_THEME, ...Object.values(Theme)].includes(v)

const getValidTheme = (theme?: string) => (theme && isTheme(theme) ? theme : getSystemTheme())

const setThemeAttr = (theme: string) => {
  const rootEl = window.document.documentElement
  rootEl.classList.remove(...Object.values(Theme))
  rootEl.classList.add(theme)
}

const themePersistedAtom = atomWithStorage<Theme | typeof SYSTEM_THEME>(
  STORAGE_KEY,
  getValidTheme(localStorage.getItem(STORAGE_KEY) ?? ''),
)

export const useTheme = () => {
  const { t } = useTranslation()

  const [theme, setTheme] = useAtom(themePersistedAtom)

  const themes = useMemo(
    () => [
      { value: Theme.LIGHT, label: t('global:theme.light') },
      { value: Theme.DARK, label: t('global:theme.dark') },
      { value: SYSTEM_THEME, label: t('global:theme.system') },
    ],
    [t],
  )

  return useMemo(
    () =>
      ({
        theme: theme === SYSTEM_THEME ? getSystemTheme() : theme,
        rawTheme: theme,
        setTheme: (theme: string) => setTheme(getValidTheme(theme)),
        themes,
      }) as const,
    [theme, setTheme, themes],
  )
}

interface Props {
  children: ReactNode
}

const ThemeProvider = ({ children }: Props) => {
  const { theme, rawTheme } = useTheme()

  useEffect(() => setThemeAttr(theme), [theme])

  const mqListener = useCallback(() => {
    if (rawTheme === SYSTEM_THEME) {
      setThemeAttr(getSystemTheme())
    }
  }, [rawTheme])

  useEffect(() => {
    darkThemeMq.addEventListener('change', mqListener)
    return () => darkThemeMq.removeEventListener('change', mqListener)
  }, [mqListener])

  return children
}

export default ThemeProvider
