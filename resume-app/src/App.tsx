import { useState } from 'react'
import DesignPanel from './components/Editor/DesignPanel'
import EditorPanel from './components/Editor/EditorPanel'
import TemplatesPanel from './components/Editor/TemplatesPanel'
import PreviewToolbar from './components/Preview/PreviewToolbar'
import ResumePreview from './components/Preview/ResumePreview'
import { useResumeStore } from './store/resumeStore'

type Tab = 'editor' | 'templates' | 'design'

const TABS: { id: Tab; label: string }[] = [
  { id: 'editor', label: 'Редактор' },
  { id: 'templates', label: 'Шаблоны' },
  { id: 'design', label: 'Оформление' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('editor')
  const resetAll = useResumeStore((s) => s.resetAll)

  return (
    <div className="flex h-full flex-col">
      <header className="no-print flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-3">
        <a href="/" className="text-sm font-semibold text-navy transition hover:text-navy-2">
          ← Вакансии ФКиС
        </a>
        <h1 className="text-base font-bold text-slate-800">Конструктор резюме</h1>
        <span className="hidden text-xs text-slate-400 sm:inline">
          изменения сохраняются автоматически
        </span>
        <button
          type="button"
          onClick={() => {
            if (confirm('Очистить все поля резюме? Действие нельзя отменить.')) resetAll()
          }}
          className="ml-auto rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-500 transition hover:border-red-200 hover:text-red-600"
        >
          Очистить
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="no-print flex w-[420px] shrink-0 flex-col border-r border-slate-200 bg-slate-50">
          <nav className="flex gap-1 border-b border-slate-200 bg-white px-3 pt-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`relative px-3 py-2 text-sm font-medium transition ${
                  tab === t.id ? 'text-navy' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.label}
                {tab === t.id && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-navy-2" />
                )}
              </button>
            ))}
          </nav>

          <div className="thin-scroll flex-1 overflow-y-auto p-3">
            {tab === 'editor' && <EditorPanel />}
            {tab === 'templates' && <TemplatesPanel />}
            {tab === 'design' && <DesignPanel />}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <PreviewToolbar />
          <ResumePreview />
        </main>
      </div>
    </div>
  )
}
