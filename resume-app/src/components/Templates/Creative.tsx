import type { TemplateProps } from '../../types/resume'
import { ageLabel, contactLines, fullName } from '../../utils/format'
import Avatar from './Avatar'
import { SectionBody, sectionTitle, visibleSections } from './parts'

/**
 * Creative — крупная градиентная шапка с фото и контактами прямо в ней,
 * заголовки разделов с цветным «пузырём»-номером. Живой, но не пёстрый.
 */
export default function Creative(props: TemplateProps) {
  const { data, settings, theme } = props
  const sections = visibleSections(data)
  const contacts = contactLines(data.contacts)
  const meta = [
    settings.showCity ? data.basic.city : '',
    settings.showAge ? ageLabel(data.basic.birthDate) : '',
  ].filter(Boolean)
  const pad = settings.compact ? 30 : 40

  return (
    <div>
      <header
        style={{
          background: `linear-gradient(135deg, ${theme.dark} 0%, ${theme.primary} 100%)`,
          color: theme.onPrimary,
          padding: `${pad + 4}px ${pad + 6}px`,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {settings.showPhoto && (
          <Avatar basic={data.basic} theme={theme} size={110} ring="rgba(255,255,255,.35)" />
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.1, fontWeight: 700 }}>
            {fullName(data.basic) || 'Фамилия Имя Отчество'}
          </h1>
          {data.basic.position && (
            <div style={{ marginTop: 6, fontSize: 15, opacity: 0.95 }}>{data.basic.position}</div>
          )}
          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: '0.88em', opacity: 0.9 }}>
            {meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
            {contacts.map((c) => (
              <span key={c.key}>
                {settings.showIcons && `${c.icon} `}
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div style={{ padding: `${pad - 8}px ${pad + 6}px` }}>
        {sections.map((id, i) => (
          <section key={id} style={{ marginTop: i === 0 ? 0 : settings.spacious ? 26 : 18 }}>
            <h2
              style={{
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 14,
                color: theme.dark,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: theme.primary,
                  color: theme.onPrimary,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              {sectionTitle(data, id)}
            </h2>
            <div style={{ paddingLeft: 34 }}>
              <SectionBody id={id} {...props} />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
