import type { TemplateProps } from '../../types/resume'
import { ageLabel, contactLines, fullName } from '../../utils/format'
import Avatar from './Avatar'
import { SectionBody, sectionTitle, visibleSections } from './parts'

/**
 * Classic — строгое одноколоночное резюме: шапка по центру,
 * разделы с подчёркнутыми заголовками. Самый «безопасный» вариант для ГОСТ-глаза HR.
 */
export default function Classic({ data, settings, theme }: TemplateProps) {
  const sections = visibleSections(data)
  const contacts = contactLines(data.contacts)
  const meta = [
    settings.showCity ? data.basic.city : '',
    settings.showAge ? ageLabel(data.basic.birthDate) : '',
  ].filter(Boolean)

  return (
    <div style={{ padding: settings.compact ? '32px 40px' : '44px 52px' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          paddingBottom: 18,
          borderBottom: `3px solid ${theme.primary}`,
        }}
      >
        {settings.showPhoto && (
          <Avatar basic={data.basic} theme={theme} size={96} shape="square" />
        )}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              lineHeight: 1.15,
              color: theme.dark,
              letterSpacing: -0.3,
            }}
          >
            {fullName(data.basic) || 'Фамилия Имя Отчество'}
          </h1>
          {data.basic.position && (
            <div
              style={{
                marginTop: 4,
                fontSize: 15,
                fontWeight: 600,
                color: theme.primary,
              }}
            >
              {data.basic.position}
            </div>
          )}
          {meta.length > 0 && (
            <div style={{ marginTop: 4, opacity: 0.75 }}>{meta.join(' · ')}</div>
          )}
        </div>
      </header>

      {contacts.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px 20px',
            padding: '12px 0',
            borderBottom: `1px solid ${theme.soft}`,
          }}
        >
          {contacts.map((c) => (
            <span key={c.key} style={{ display: 'inline-flex', gap: 6 }}>
              {settings.showIcons && <span style={{ color: theme.primary }}>{c.icon}</span>}
              {c.label}
            </span>
          ))}
        </div>
      )}

      {sections.map((id) => (
        <section key={id} style={{ marginTop: settings.spacious ? 26 : 18 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 13,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              color: theme.primary,
              paddingBottom: 4,
              borderBottom: `1px solid ${theme.soft}`,
            }}
          >
            {sectionTitle(data, id)}
          </h2>
          <SectionBody id={id} data={data} settings={settings} theme={theme} />
        </section>
      ))}
    </div>
  )
}
