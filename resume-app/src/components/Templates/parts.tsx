import {
  SECTION_TITLES,
  type ResumeData,
  type ResumeSettings,
  type ResumeTheme,
  type SectionId,
  type SectionKey,
} from '../../types/resume'
import { periodLabel, toLines } from '../../utils/format'

export interface PartProps {
  data: ResumeData
  settings: ResumeSettings
  theme: ResumeTheme
}

/** true — это произвольный пользовательский раздел. */
export function isCustom(id: SectionKey): id is `custom:${string}` {
  return id.startsWith('custom:')
}

/** Находит данные произвольного раздела по ключу «custom:<id>». */
function customOf(data: ResumeData, id: SectionKey) {
  const cid = id.slice('custom:'.length)
  return data.custom.find((c) => c.id === cid)
}

/** Заголовок раздела — стандартный из словаря или заданный пользователем. */
export function sectionTitle(data: ResumeData, id: SectionKey): string {
  if (isCustom(id)) return customOf(data, id)?.title || 'Раздел'
  return SECTION_TITLES[id]
}

/** Разделы, которые включены и реально содержат данные. */
export function visibleSections(data: ResumeData): SectionKey[] {
  return data.sectionOrder
    .filter((id) => data.enabledSections.includes(id))
    .filter((id) => hasContent(data, id))
}

export function hasContent(data: ResumeData, id: SectionKey): boolean {
  if (isCustom(id)) return (customOf(data, id)?.content.trim().length ?? 0) > 0
  if (id === 'about') return data.about.trim().length > 0
  return data[id].length > 0
}

/** Разделы-«списки», которые логично уводить в узкую колонку сайдбара. */
export const SIDEBAR_SECTIONS: SectionId[] = ['skills', 'languages', 'certificates']

/** Уместен ли раздел в сайдбаре. Произвольные разделы всегда в основной колонке. */
export function isSidebarSection(id: SectionKey): boolean {
  return !isCustom(id) && SIDEBAR_SECTIONS.includes(id)
}

/* ---------- Мелкие примитивы ---------- */

export function Bullets({ text, color }: { text: string; color: string }) {
  const lines = toLines(text)
  if (lines.length === 0) return null
  if (lines.length === 1) {
    return <p style={{ margin: '4px 0 0' }}>{lines[0]}</p>
  }
  return (
    <ul style={{ margin: '4px 0 0', paddingLeft: 16, listStyle: 'none' }}>
      {lines.map((line, i) => (
        <li key={i} style={{ position: 'relative', marginTop: 2 }}>
          <span
            style={{
              position: 'absolute',
              left: -12,
              top: 0,
              color,
              fontWeight: 700,
            }}
          >
            •
          </span>
          {line}
        </li>
      ))}
    </ul>
  )
}

/** Строка «слева период — справа содержимое», база для опыта и образования. */
function EntryRow({
  period,
  title,
  subtitle,
  children,
  theme,
}: {
  period: string
  title: string
  subtitle?: string
  children?: React.ReactNode
  theme: ResumeTheme
}) {
  return (
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          alignItems: 'baseline',
        }}
      >
        <strong style={{ fontWeight: 700 }}>{title}</strong>
        {period && (
          <span style={{ whiteSpace: 'nowrap', opacity: 0.7, fontSize: '0.9em' }}>
            {period}
          </span>
        )}
      </div>
      {subtitle && (
        <div style={{ color: theme.primary, fontWeight: 600, fontSize: '0.95em' }}>
          {subtitle}
        </div>
      )}
      {children}
    </div>
  )
}

/* ---------- Тело каждого раздела ---------- */

/**
 * Содержимое раздела без заголовка.
 * Заголовок рисует сам шаблон — в этом и вся разница между шаблонами.
 */
export function SectionBody({ id, data, theme, settings }: PartProps & { id: SectionKey }) {
  if (isCustom(id)) {
    return <Bullets text={customOf(data, id)?.content ?? ''} color={theme.primary} />
  }
  switch (id) {
    case 'about':
      return <Bullets text={data.about} color={theme.primary} />

    case 'experience':
      return (
        <>
          {data.experience.map((item) => (
            <EntryRow
              key={item.id}
              theme={theme}
              period={periodLabel(item)}
              title={item.position || item.company}
              subtitle={[item.company, settings.showCity ? item.city : '']
                .filter(Boolean)
                .join(', ')}
            >
              <Bullets text={item.description} color={theme.primary} />
            </EntryRow>
          ))}
        </>
      )

    case 'education':
      return (
        <>
          {data.education.map((item) => (
            <EntryRow
              key={item.id}
              theme={theme}
              period={[item.start, item.end].filter(Boolean).join(' — ')}
              title={item.institution}
              subtitle={[item.faculty, item.degree].filter(Boolean).join(' · ')}
            />
          ))}
        </>
      )

    case 'courses':
      return (
        <>
          {data.courses.map((item) => (
            <EntryRow
              key={item.id}
              theme={theme}
              period={item.year}
              title={item.name}
              subtitle={item.organization}
            />
          ))}
        </>
      )

    case 'certificates':
      return (
        <>
          {data.certificates.map((item) => (
            <EntryRow
              key={item.id}
              theme={theme}
              period={item.year}
              title={item.name}
              subtitle={item.issuer}
            />
          ))}
        </>
      )

    case 'projects':
      return (
        <>
          {data.projects.map((item) => (
            <EntryRow
              key={item.id}
              theme={theme}
              period={item.year}
              title={item.name}
              subtitle={item.role}
            >
              <Bullets text={item.description} color={theme.primary} />
            </EntryRow>
          ))}
        </>
      )

    case 'skills':
      return <SkillList data={data} theme={theme} settings={settings} />

    case 'languages':
      return (
        <div style={{ marginTop: 6 }}>
          {data.languages.map((item) => (
            <div
              key={item.id}
              style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}
            >
              <span>{item.name}</span>
              <span style={{ opacity: 0.7 }}>{item.level}</span>
            </div>
          ))}
        </div>
      )

    default:
      return null
  }
}

/** Навыки чипами; если задан уровень — рядом шкала из точек. */
function SkillList({ data, theme }: PartProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
      {data.skills.map((item) => (
        <span
          key={item.id}
          style={{
            background: theme.soft,
            color: theme.dark,
            borderRadius: 999,
            padding: '3px 10px',
            fontSize: '0.9em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {item.name}
          {item.level > 0 && (
            <span style={{ display: 'inline-flex', gap: 2 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <i
                  key={n}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: n <= item.level ? theme.primary : 'rgba(0,0,0,.18)',
                  }}
                />
              ))}
            </span>
          )}
        </span>
      ))}
    </div>
  )
}
