import { useResumeStore } from '../../store/resumeStore'
import type { SectionKey } from '../../types/resume'
import { sectionTitle } from '../Templates/parts'
import Card from '../ui/Card'
import SortableList from './SortableList'

/**
 * Управление составом резюме: какие разделы показывать
 * и в каком порядке они идут в шаблоне.
 */
export default function SectionsCard() {
  const data = useResumeStore((s) => s.data)
  const toggleSection = useResumeStore((s) => s.toggleSection)
  const reorderSections = useResumeStore((s) => s.reorderSections)

  // SortableList работает с записями, у которых есть id.
  const items = data.sectionOrder.map((id) => ({ id }))

  return (
    <Card title="Разделы резюме" defaultOpen={false}>
      <p className="text-xs text-slate-400">
        Перетащите, чтобы поменять порядок. Выключенные разделы не попадут в резюме.
      </p>
      <SortableList items={items} onReorder={reorderSections}>
        {(item, handle) => {
          const id = item.id as SectionKey
          const on = data.enabledSections.includes(id)
          return (
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 py-2">
              {handle}
              <span
                className={`flex-1 text-sm transition ${
                  on ? 'text-slate-700' : 'text-slate-400 line-through'
                }`}
              >
                {sectionTitle(data, id)}
              </span>
              <button
                type="button"
                onClick={() => toggleSection(id)}
                className={`relative h-5 w-9 shrink-0 rounded-full transition ${
                  on ? 'bg-navy-2' : 'bg-slate-300'
                }`}
                title={on ? 'Скрыть раздел' : 'Показать раздел'}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                    on ? 'left-4.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          )
        }}
      </SortableList>
    </Card>
  )
}
