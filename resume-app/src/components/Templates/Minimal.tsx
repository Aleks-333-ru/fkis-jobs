import type { TemplateProps } from '../../types/resume'
import { ageLabel, contactLines, fullName } from '../../utils/format'
import { SectionBody, sectionTitle, visibleSections } from './parts'

/**
 * Minimal — максимум воздуха, никаких заливок.
 * Заголовки разделов уходят в узкую левую колонку, содержание — справа.
 */
export default function Minimal(props: TemplateProps) {
  const { data, settings, theme } = props
  const sections = visibleSections(data)
  const contacts = contactLines(data.contacts)
  const meta = [
    settings.showCity ? data.basic.city : '',
    settings.showAge ? ageLabel(data.basic.birthDate) : '',
  ].filter(Boolean)

  return (
    <div style={{ padding: settings.compact ? '40px 46px' : '56px 60px' }}>
      <h1
        style={{
          margin: 0,
          fontSize: 32,
          fontWeight: 400,
          letterSpacing: -0.5,
          color: '#111',
        }}
      >
        {fullName(data.basic) || 'Фамилия Имя Отчество'}
      </h1>
      {data.basic.position && (
        <div style={{ marginTop: 6, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', color: theme.primary }}>
          {data.basic.position}
        </div>
      )}

      <div
        style={{
          marginTop: 14,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px 18px',
          fontSize: '0.92em',
          opacity: 0.75,
        }}
      >
        {meta.map((m) => (
          <span key={m}>{m}</span>
        ))}
        {contacts.map((c) => (
          <span key={c.key}>{c.label}</span>
        ))}
      </div>

      <hr style={{ border: 0, borderTop: '1px solid #e3e3e3', margin: '22px 0 0' }} />

      {sections.map((id) => (
        <section
          key={id}
          style={{
            display: 'flex',
            gap: 22,
            marginTop: settings.spacious ? 28 : 20,
          }}
        >
          <h2
            style={{
              margin: 0,
              width: 120,
              flexShrink: 0,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 1.4,
              textTransform: 'uppercase',
              color: theme.primary,
              paddingTop: 3,
            }}
          >
            {sectionTitle(data, id)}
          </h2>
          <div style={{ flex: 1, minWidth: 0 }}>
            <SectionBody id={id} {...props} />
          </div>
        </section>
      ))}
    </div>
  )
}
