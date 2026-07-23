import type { BasicInfo, ResumeTheme } from '../../types/resume'
import { initials } from '../../utils/format'

interface Props {
  basic: BasicInfo
  theme: ResumeTheme
  size: number
  /** 'circle' — круглое фото, 'square' — со скруглением. */
  shape?: 'circle' | 'square'
  /** Рамка поверх тёмного фона. */
  ring?: string
}

/** Фото кандидата, а если его нет — аккуратная заглушка с инициалами. */
export default function Avatar({ basic, theme, size, shape = 'circle', ring }: Props) {
  const radius = shape === 'circle' ? '50%' : Math.round(size * 0.12)
  const base: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: radius,
    flexShrink: 0,
    objectFit: 'cover',
    boxShadow: ring ? `0 0 0 3px ${ring}` : undefined,
  }

  if (basic.photo) {
    return <img src={basic.photo} alt="" style={base} />
  }

  const text = initials(basic)
  if (!text) return null

  return (
    <div
      style={{
        ...base,
        background: theme.soft,
        color: theme.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: size * 0.36,
        letterSpacing: 1,
      }}
    >
      {text}
    </div>
  )
}
