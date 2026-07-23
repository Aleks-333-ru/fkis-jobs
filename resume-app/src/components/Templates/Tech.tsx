import type { TemplateProps } from '../../types/resume'
import { ageLabel, contactLines, fullName } from '../../utils/format'
import Avatar from './Avatar'
import { SectionBody, isSidebarSection, sectionTitle, visibleSections } from './parts'

/**
 * Tech — «айтишный» вид: моноширинные акценты, заголовки с префиксом «#»,
 * тёмная тонкая колонка контактов. Хорош для тренеров-методистов,
 * аналитиков спорта, тех, кто работает с данными и ПО.
 */
export default function Tech(props: TemplateProps) {
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
  const mono = "'Roboto Mono', ui-monospace, monospace"
  const pad = settings.compact ? 28 : 36

  return (
    <div style={{ display: 'flex', flexDirection: twoCol ? 'row' : 'column', minHeight: '100%' }}>
      {twoCol && (
        <aside
          style={{
            width: '32%',
            flexShrink: 0,
            background: theme.dark,
            color: theme.onPrimary,
            padding: pad,
          }}
        >
          {settings.showPhoto && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
              <Avatar basic={data.basic} theme={theme} size={104} shape="square" ring="rgba(255,255,255,.2)" />
            </div>
          )}
          {contacts.length > 0 && (
            <div style={{ fontFamily: mono, fontSize: '0.85em' }}>
              {contacts.map((c) => (
                <div key={c.key} style={{ marginTop: 5, wordBreak: 'break-word', opacity: 0.9 }}>
                  {c.label}
                </div>
              ))}
            </div>
          )}
          {side.map((id) => (
            <div key={id} style={{ marginTop: 20 }}>
              <h2 style={{ margin: 0, fontFamily: mono, fontSize: 12, opacity: 0.7 }}>
                # {sectionTitle(data, id).toLowerCase()}
              </h2>
              <div style={{ marginTop: 4 }}>
                <SectionBody id={id} {...props} />
              </div>
            </div>
          ))}
        </aside>
      )}

      <main style={{ flex: 1, padding: pad + 2 }}>
        <h1 style={{ margin: 0, fontSize: 28, color: theme.dark, fontWeight: 700 }}>
          {fullName(data.basic) || 'Фамилия Имя Отчество'}
        </h1>
        {data.basic.position && (
          <div style={{ marginTop: 4, fontFamily: mono, fontSize: 13, color: theme.primary }}>
            &gt; {data.basic.position}
          </div>
        )}
        {meta.length > 0 && (
          <div style={{ marginTop: 3, opacity: 0.6, fontSize: '0.9em' }}>{meta.join(' · ')}</div>
        )}

        {main.map((id) => (
          <section key={id} style={{ marginTop: settings.spacious ? 24 : 17 }}>
            <h2
              style={{
                margin: 0,
                fontFamily: mono,
                fontSize: 13,
                color: theme.primary,
                fontWeight: 600,
              }}
            >
              # {sectionTitle(data, id)}
            </h2>
            <SectionBody id={id} {...props} />
          </section>
        ))}
      </main>
    </div>
  )
}
