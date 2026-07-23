import type { ResumeTheme, ThemeId } from '../types/resume'

/**
 * Цветовые темы. Шаблон никогда не хардкодит цвет — он берёт его отсюда,
 * поэтому 9 шаблонов × 7 тем не превращаются в 63 варианта кода.
 */
export const THEMES: Record<ThemeId, ResumeTheme> = {
  blue: {
    id: 'blue',
    label: 'Синяя',
    primary: '#173f7d',
    dark: '#102a55',
    soft: '#eaf1fa',
    onPrimary: '#ffffff',
  },
  green: {
    id: 'green',
    label: 'Зелёная',
    primary: '#1b6b4a',
    dark: '#124a34',
    soft: '#e6f4ee',
    onPrimary: '#ffffff',
  },
  black: {
    id: 'black',
    label: 'Чёрная',
    primary: '#1f2430',
    dark: '#11141c',
    soft: '#eef0f4',
    onPrimary: '#ffffff',
  },
  orange: {
    id: 'orange',
    label: 'Оранжевая',
    primary: '#c96a15',
    dark: '#9c500c',
    soft: '#fdf0e2',
    onPrimary: '#ffffff',
  },
  purple: {
    id: 'purple',
    label: 'Фиолетовая',
    primary: '#5b3a9b',
    dark: '#402873',
    soft: '#f0ebfa',
    onPrimary: '#ffffff',
  },
  red: {
    id: 'red',
    label: 'Красная',
    primary: '#a52a2a',
    dark: '#7a1c1c',
    soft: '#fbeaea',
    onPrimary: '#ffffff',
  },
  gray: {
    id: 'gray',
    label: 'Серая',
    primary: '#4a5568',
    dark: '#2d3748',
    soft: '#eef1f5',
    onPrimary: '#ffffff',
  },
}

export const THEME_LIST = Object.values(THEMES)
