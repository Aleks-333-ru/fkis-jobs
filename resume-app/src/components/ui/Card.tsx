import { useState, type ReactNode } from 'react'

interface Props {
  title: string
  /** Подпись справа от заголовка — обычно количество записей. */
  badge?: string | number
  defaultOpen?: boolean
  children: ReactNode
}

/** Складывающаяся карточка раздела в левой панели редактора. */
export default function Card({ title, badge, defaultOpen = true, children }: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left transition hover:bg-slate-50"
      >
        <span className="flex-1 text-sm font-semibold text-slate-800">{title}</span>
        {badge !== undefined && badge !== '' && (
          <span className="rounded-full bg-navy-soft px-2 py-0.5 text-[11px] font-semibold text-navy">
            {badge}
          </span>
        )}
        <svg
          viewBox="0 0 20 20"
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className="grid transition-all duration-200"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 border-t border-slate-100 px-4 py-4">{children}</div>
        </div>
      </div>
    </section>
  )
}
