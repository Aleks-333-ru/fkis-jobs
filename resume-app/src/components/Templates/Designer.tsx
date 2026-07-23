import type { TemplateProps } from '../../types/resume'
import { ageLabel, contactLines, fullName } from '../../utils/format'
import Avatar from './Avatar'
import { SectionBody, isSidebarSection, sectionTitle, visibleSections } from './parts'

/**
 * Designer — асимметричная сетка: широкая цветная левая колонка с крупным
 * именем и фото, узкая правая с содержанием. Выразительный, «портфолийный» вид.
 */
export default function Designer(props: TemplateProps) {
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
  const pad = settings.compact ? 30 : 40

  return (
    <div style={{ display: 'flex', flexDirection: twoCol ? 'row' : 'column', minHeight: '100%' }}>
      <aside
        style={{
          width: twoCol ? '40%' : '100%',
          flexShrink: 0,
          background: theme.primary,
          color: theme.onPrimary,
          padding: pad,
        }}
      >
        {settings.showPhoto && (
          <Avatar basic={data.basic} theme={theme} size={128} shape="square" ring="rgba(255,255,255,.3)" />
        )}
        <h1 style={{ margin: '18px 0 0', fontSize: 32, lineHeight: 1.05, fontWeight: 700 }}>
          {fullName(data.basic) || 'Фамилия\nИмя'}
        </h1>
        {data.basic.position && (
          <div style={{ marginTop: 8, fontSize: 14, opacity: 0.92, letterSpacing: 0.5 }}>
            {data.basic.position}
          </div>
        )}

        {(meta.length > 0 || contacts.length > 0) && (
          <div style={{ marginTop: 18, fontSize: '0.9em', opacity: 0.92 }}>
            {meta.map((m) => (
              <div key={m} style={{ marginTop: 3 }}>{m}</div>
            ))}
            {contacts.map((c) => (
              <div key={c.key} style={{ marginTop: 3, wordBreak: 'break-word' }}>
                {settings.showIcons && `${c.icon} `}
                {c.label}
              </div>
            ))}
          </div>
        )}

        {side.map((id) => (
          <div key={id} style={{ marginTop: 20 }}>
            <h2
              style={{
                margin: 0,
                fontSize: 12,
                letterSpacing: 1.6,
                textTransform: 'uppercase',
                opacity: 0.85,
                borderBottom: '1px solid rgba(255,255,255,.28)',
                paddingBottom: 4,
              }}
            >
              {sectionTitle(data, id)}
            </h2>
            <SectionBody id={id} {...props} />
          </div>
        ))}
      </aside>

      <main style={{ flex: 1, padding: pad + 2 }}>
        {main.map((id) => (
          <section key={id} style={{ marginBottom: settings.spacious ? 26 : 18 }}>
            <h2
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: theme.dark,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <i style={{ width: 18, height: 3, background: theme.primary, borderRadius: 3 }} />
              {sectionTitle(data, id)}
            </h2>
            <SectionBody id={id} {...props} />
          </section>
        ))}
      </main>
    </div>
  )
}
