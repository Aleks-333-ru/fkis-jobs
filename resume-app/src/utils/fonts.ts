import type { FontId } from '../types/resume'

interface FontDef {
  id: FontId
  label: string
  /** Значение для CSS font-family. */
  stack: string
}

/** Все шрифты подключены в index.html и поддерживают кириллицу. */
export const FONTS: Record<FontId, FontDef> = {
  inter: { id: 'inter', label: 'Inter', stack: "'Inter', sans-serif" },
  roboto: { id: 'roboto', label: 'Roboto', stack: "'Roboto', sans-serif" },
  openSans: {
    id: 'openSans',
    label: 'Open Sans',
    stack: "'Open Sans', sans-serif",
  },
  lato: { id: 'lato', label: 'Lato', stack: "'Lato', sans-serif" },
  montserrat: {
    id: 'montserrat',
    label: 'Montserrat',
    stack: "'Montserrat', sans-serif",
  },
  merriweather: {
    id: 'merriweather',
    label: 'Merriweather',
    stack: "'Merriweather', serif",
  },
  playfair: {
    id: 'playfair',
    label: 'Playfair Display',
    stack: "'Playfair Display', serif",
  },
  sourceSans: {
    id: 'sourceSans',
    label: 'Source Sans',
    stack: "'Source Sans 3', sans-serif",
  },
}

export const FONT_LIST = Object.values(FONTS)
