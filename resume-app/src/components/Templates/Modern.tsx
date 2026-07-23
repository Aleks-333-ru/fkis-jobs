import type { TemplateProps } from '../../types/resume'
import { ageLabel, contactLines, fullName } from '../../utils/format'
import Avatar from './Avatar'
import { SectionBody, isSidebarSection, sectionTitle, visibleSections } from './parts'

/**
 * Modern — тёмный сайдбар с фото и контактами слева, содержание справа.
 * При settings.columns === 1 сайдбар превращается в верхнюю плашку.
 */
export default function Modern(props: TemplateProps) {
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

  const gap = settings.spacious ? 22 : 16
  const pad = settings.compact ? 26 : 34

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: twoCol ? 'row' : 'column',
        minHeight: '100%',
        alignItems: 'stretch',
      }}
    >
      <aside
        style={{
          width: twoCol ? '34%' : '100%',
          background: theme.dark,
          color: theme.onPrimary,
          padding: pad,
        }}
      >
        {settings.showPhoto && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              basic={data.basic}
              theme={theme}
              size={116}
              ring="rgba(255,255,255,.25)"
            />
          </div>
        )}

        {contacts.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <SideHeading theme={theme}>Контакты</SideHeading>
            {contacts.map((c) => (
              <div
                key={c.key}
                style={{
                  display: 'flex',
                  gap: 8,
                  marginTop: 5,
                  wordBreak: 'break-word',
                }}
              >
                {settings.showIcons && <span style={{ opacity: 0.7 }}>{c.icon}</span>}
                <span>{c.label}</span>
              </div>
            ))}
          </div>
        )}

        {side.map((id) => (
          <div key={id} style={{ marginTop: 20 }}>
            <SideHeading theme={theme}>{sectionTitle(data, id)}</SideHeading>
            <div style={{ opacity: 0.95 }}>
              <SectionBody id={id} {...props} />
            </div>
          </div>
        ))}
      </aside>

      <main style={{ flex: 1, padding: pad + 4 }}>
          <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.1, color: theme.dark }}>
            {fullName(data.basic) || 'Фамилия Имя Отчество'}
          </h1>
          {data.basic.position && (
            <div
              style={{
                marginTop: 6,
                fontSize: 15,
                fontWeight: 600,
                color: theme.primary,
              }}
            >
              {data.basic.position}
            </div>
          )}
          {meta.length > 0 && (
            <div style={{ marginTop: 4, opacity: 0.7 }}>{meta.join(' · ')}</div>
          )}

          {main.map((id) => (
            <section key={id} style={{ marginTop: gap + 8 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 13,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  color: theme.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                {sectionTitle(data, id)}
                <i
                  style={{
                    flex: 1,
                    height: 2,
                    background: theme.soft,
                    borderRadius: 2,
                  }}
                />
              </h2>
              <SectionBody id={id} {...props} />
            </section>
          ))}
      </main>
    </div>
  )
}

function SideHeading({
  children,
  theme,
}: {
  children: React.ReactNode
  theme: TemplateProps['theme']
}) {
  return (
    <h2
      style={{
        margin: 0,
        fontSize: 12,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        opacity: 0.85,
        paddingBottom: 5,
        borderBottom: `1px solid rgba(255,255,255,.22)`,
        color: theme.onPrimary,
      }}
    >
      {children}
    </h2>
  )
}
