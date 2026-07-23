import type { TemplateProps } from '../../types/resume'
import { ageLabel, contactLines, fullName } from '../../utils/format'
import Avatar from './Avatar'
import { SectionBody, isSidebarSection, sectionTitle, visibleSections } from './parts'

/**
 * Corporate — цветная шапка во всю ширину, ниже две колонки.
 * Деловой вариант для бюджетных и государственных организаций.
 */
export default function Corporate(props: TemplateProps) {
  const { data, settings, theme } = props
  const sections = visibleSections(data)
  const twoCol = settings.columns === 2
  const side = twoCol ? sections.filter(isSidebarSection) : []
  const main = sections.filter((id) => !side.includes(id))
  const contacts = contactLines(data.contacts)
  const meta = [
    settings.showCity ? data.basic.city : '',
    settings.showAge ? ageLabel(data.basic.birthDate) : '',
  ].filter(Boolean)

  return (
    <div>
      <header
        style={{
          background: theme.primary,
          color: theme.onPrimary,
          padding: settings.compact ? '26px 40px' : '34px 48px',
          display: 'flex',
          alignItems: 'center',
          gap: 22,
        }}
      >
        {settings.showPhoto && (
          <Avatar
            basic={data.basic}
            theme={theme}
            size={92}
            shape="square"
            ring="rgba(255,255,255,.3)"
          />
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 27, lineHeight: 1.15 }}>
            {fullName(data.basic) || 'Фамилия Имя Отчество'}
          </h1>
          {data.basic.position && (
            <div style={{ marginTop: 4, fontSize: 14, opacity: 0.92 }}>
              {data.basic.position}
            </div>
          )}
          {meta.length > 0 && (
            <div style={{ marginTop: 4, fontSize: '0.9em', opacity: 0.8 }}>
              {meta.join(' · ')}
            </div>
          )}
        </div>
      </header>

      {contacts.length > 0 && (
        <div
          style={{
            background: theme.soft,
            color: theme.dark,
            padding: '9px 48px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px 20px',
            fontSize: '0.92em',
          }}
        >
          {contacts.map((c) => (
            <span key={c.key} style={{ display: 'inline-flex', gap: 6 }}>
              {settings.showIcons && <span>{c.icon}</span>}
              {c.label}
            </span>
          ))}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: 28,
          padding: settings.compact ? '22px 40px' : '28px 48px',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {main.map((id) => (
            <Block key={id} title={sectionTitle(data, id)} theme={theme} spacious={settings.spacious}>
              <SectionBody id={id} {...props} />
            </Block>
          ))}
        </div>
        {side.length > 0 && (
          <div style={{ width: '32%', flexShrink: 0 }}>
            {side.map((id) => (
              <Block key={id} title={sectionTitle(data, id)} theme={theme} spacious={settings.spacious}>
                <SectionBody id={id} {...props} />
              </Block>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Block({
  title,
  theme,
  spacious,
  children,
}: {
  title: string
  theme: TemplateProps['theme']
  spacious: boolean
  children: React.ReactNode
}) {
  return (
    <section style={{ marginBottom: spacious ? 24 : 16 }}>
      <h2
        style={{
          margin: 0,
          fontSize: 12,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          color: theme.onPrimary,
          background: theme.primary,
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: 3,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
