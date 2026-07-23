import type { TemplateProps } from '../../types/resume'
import { ageLabel, contactLines, fullName } from '../../utils/format'
import { SectionBody, sectionTitle, visibleSections } from './parts'

/**
 * Executive — представительский вариант: имя по центру вразрядку,
 * двойная линейка и центрированные заголовки разделов.
 * Рассчитан на руководящие позиции, где фото скорее мешает.
 */
export default function Executive(props: TemplateProps) {
  const { data, settings, theme } = props
  const sections = visibleSections(data)
  const contacts = contactLines(data.contacts)
  const meta = [
    settings.showCity ? data.basic.city : '',
    settings.showAge ? ageLabel(data.basic.birthDate) : '',
  ].filter(Boolean)

  return (
    <div style={{ padding: settings.compact ? '42px 52px' : '56px 62px' }}>
      <header style={{ textAlign: 'center' }}>
        <h1
          style={{
            margin: 0,
            fontSize: 25,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: theme.dark,
          }}
        >
          {fullName(data.basic) || 'Фамилия Имя Отчество'}
        </h1>
        {data.basic.position && (
          <div
            style={{
              marginTop: 8,
              fontSize: 13,
              letterSpacing: 1.6,
              textTransform: 'uppercase',
              color: theme.primary,
            }}
          >
            {data.basic.position}
          </div>
        )}

        <div
          style={{
            margin: '16px auto 0',
            width: '100%',
            borderTop: `2px solid ${theme.primary}`,
            borderBottom: `1px solid ${theme.primary}`,
            height: 4,
          }}
        />

        <div
          style={{
            marginTop: 12,
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '4px 16px',
            fontSize: '0.92em',
            opacity: 0.8,
          }}
        >
          {meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
          {contacts.map((c) => (
            <span key={c.key}>{c.label}</span>
          ))}
        </div>
      </header>

      {sections.map((id) => (
        <section key={id} style={{ marginTop: settings.spacious ? 28 : 20 }}>
          <h2
            style={{
              margin: '0 0 2px',
              fontSize: 12,
              letterSpacing: 2.4,
              textTransform: 'uppercase',
              color: theme.primary,
              textAlign: 'center',
            }}
          >
            {sectionTitle(data, id)}
          </h2>
          <div
            style={{
              width: 44,
              height: 1,
              background: theme.primary,
              margin: '0 auto 6px',
              opacity: 0.5,
            }}
          />
          <SectionBody id={id} {...props} />
        </section>
      ))}
    </div>
  )
}
