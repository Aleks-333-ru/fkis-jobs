import type { ReactNode } from 'react'

interface Props {
  title: string
  onRemove: () => void
  /** Ручка перетаскивания — пробрасывается из dnd-kit. */
  dragHandle?: ReactNode
  children: ReactNode
}

/** Одна запись внутри раздела: опыт, образование, курс и т.д. */
export default function EntryCard({ title, onRemove, dragHandle, children }: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 transition hover:border-slate-300">
      <div className="mb-2 flex items-center gap-2">
        {dragHandle}
        <span className="flex-1 truncate text-xs font-semibold text-slate-500">
          {title || 'Новая запись'}
        </span>
        <button
          type="button"
          onClick={onRemove}
          title="Удалить"
          className="rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6l8 8M14 6l-8 8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  )
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-2 text-sm font-medium text-slate-500 transition hover:border-navy-2 hover:bg-navy-soft/50 hover:text-navy"
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 5v10M5 10h10" strokeLinecap="round" />
      </svg>
      {label}
    </button>
  )
}
