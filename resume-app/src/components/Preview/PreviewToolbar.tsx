import { useResumeStore } from '../../store/resumeStore'
import type { PageSize } from '../../types/resume'
import { exportToPdf } from '../../utils/pdfExport'

const ZOOMS = [0.5, 0.75, 1, 1.25, 1.5]

/** Панель над листом: масштаб, формат страницы, выгрузка в PDF. */
export default function PreviewToolbar() {
  const settings = useResumeStore((s) => s.settings)
  const setSettings = useResumeStore((s) => s.setSettings)

  return (
    <div className="no-print flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
      <div className="flex items-center gap-1">
        <span className="mr-1 text-xs text-slate-500">Масштаб</span>
        {ZOOMS.map((z) => (
          <button
            key={z}
            type="button"
            onClick={() => setSettings({ zoom: z })}
            className={`rounded-md px-2 py-1 text-xs transition ${
              settings.zoom === z
                ? 'bg-navy-soft font-semibold text-navy'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {Math.round(z * 100)}%
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1">
        <span className="mr-1 text-xs text-slate-500">Формат</span>
        {(['a4', 'letter'] as PageSize[]).map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => setSettings({ pageSize: size })}
            className={`rounded-md px-2 py-1 text-xs transition ${
              settings.pageSize === size
                ? 'bg-navy-soft font-semibold text-navy'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {size === 'a4' ? 'A4' : 'Letter'}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={exportToPdf}
        className="ml-auto flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-2 active:scale-95"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M10 3v9m0 0l-3.5-3.5M10 12l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 15v2h12v-2" strokeLinecap="round" />
        </svg>
        Скачать PDF
      </button>
    </div>
  )
}
