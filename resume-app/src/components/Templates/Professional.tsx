import type { TemplateProps } from '../../types/resume'
import { ageLabel, contactLines, fullName } from '../../utils/format'
import Avatar from './Avatar'
import { SectionBody, isSidebarSection, sectionTitle, visibleSections } from './parts'

/**
 * Professional — светлый сайдбар вместо тёмного и заголовки с вертикальной
 * акцентной полосой. Спокойнее Modern, но не такой сухой, как Classic.
 */
export default function Professional(props: TemplateProps) {
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
  const pad = settings.compact ? 28 : 36

  return (
    <div>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: `${pad}px ${pad + 8}px ${pad - 12}px`,
          borderBottom: `1px solid ${theme.soft}`,
        }}
      >
        {settings.showPhoto && (
          <Avatar basic={data.basic} theme={theme} size={88} />
        )}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              lineHeight: 1.15,
              color: theme.dark,
              fontWeight: 700,
            }}
          >
            {fullName(data.basic) || 'Фамилия Имя Отчество'}
          </h1>
          {data.basic.position && (
            <div style={{ marginTop: 3, fontSize: 14, color: theme.primary, fontWeight: 600 }}>
              {data.basic.position}
            </div>
          )}
          {meta.length > 0 && (
            <div style={{ marginTop: 3, fontSize: '0.9em', opacity: 0.65 }}>
              {meta.join(' · ')}
            </div>
          )}
        </div>
      </header>

      <div style={{ display: 'flex', gap: 26, padding: `${pad - 12}px ${pad + 8}px` }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {main.map((id) => (
            <Section key={id} title={sectionTitle(data, id)} theme={theme} spacious={settings.spacious}>
              <SectionBody id={id} {...props} />
            </Section>
          ))}
        </div>

        {(side.length > 0 || contacts.length > 0) && twoCol && (
          <aside
            style={{
              width: '31%',
              flexShrink: 0,
              background: theme.soft,
              borderRadius: 8,
              padding: 16,
              alignSelf: 'flex-start',
            }}
          >
            {contacts.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <SideTitle theme={theme}>Контакты</SideTitle>
                {contacts.map((c) => (
                  <div key={c.key} style={{ display: 'flex', gap: 6, marginTop: 4, wordBreak: 'break-word' }}>
                    {settings.showIcons && <span style={{ color: theme.primary }}>{c.icon}</span>}
                    <span>{c.label}</span>
                  </div>
                ))}
              </div>
            )}
            {side.map((id) => (
              <div key={id} style={{ marginTop: 14 }}>
                <SideTitle theme={theme}>{sectionTitle(data, id)}</SideTitle>
                <SectionBody id={id} {...props} />
              </div>
            ))}
          </aside>
        )}
      </div>

      {/* В одноколоночном режиме контакты уходят под шапку */}
      {!twoCol && contacts.length > 0 && (
        <div style={{ padding: `0 ${pad + 8}px ${pad}px`, display: 'flex', flexWrap: 'wrap', gap: '4px 18px' }}>
          {contacts.map((c) => (
            <span key={c.key}>{c.label}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function Section({
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
    <section style={{ marginBottom: spacious ? 24 : 17 }}>
      <h2
        style={{
          margin: 0,
          fontSize: 12.5,
          letterSpacing: 1.1,
          textTransform: 'uppercase',
          color: theme.dark,
          borderLeft: `3px solid ${theme.primary}`,
          paddingLeft: 9,
        }}
      >
        {title}
      </h2>
      <div style={{ paddingLeft: 12 }}>{children}</div>
    </section>
  )
}

function SideTitle({ children, theme }: { children: React.ReactNode; theme: TemplateProps['theme'] }) {
  return (
    <h2
      style={{
        margin: 0,
        fontSize: 11.5,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        color: theme.primary,
        paddingBottom: 4,
        borderBottom: `1px solid ${theme.primary}33`,
      }}
    >
      {children}
    </h2>
  )
}
