import type { ReactNode } from 'react'
import { useResumeStore, type ListKey } from '../../store/resumeStore'
import type { Entry } from '../../types/resume'
import Card from '../ui/Card'
import EntryCard, { AddButton } from '../ui/EntryCard'
import SortableList from './SortableList'

interface Props<T extends Entry> {
  listKey: ListKey
  title: string
  addLabel: string
  /** Заголовок свёрнутой записи. */
  entryTitle: (item: T) => string
  /** Поля записи; patch пишет изменения в стор. */
  fields: (item: T, patch: (p: Partial<T>) => void) => ReactNode
  emptyHint?: string
}

/**
 * Карточка раздела-списка: добавление, удаление и перетаскивание записей.
 * Конкретный раздел задаёт только свои поля.
 */
export default function ListCard<T extends Entry>({
  listKey,
  title,
  addLabel,
  entryTitle,
  fields,
  emptyHint,
}: Props<T>) {
  const items = useResumeStore((s) => s.data[listKey]) as unknown as T[]
  const addItem = useResumeStore((s) => s.addItem)
  const updateItem = useResumeStore((s) => s.updateItem)
  const removeItem = useResumeStore((s) => s.removeItem)
  const reorderItems = useResumeStore((s) => s.reorderItems)

  return (
    <Card title={title} badge={items.length || ''} defaultOpen={false}>
      {items.length === 0 && emptyHint && (
        <p className="text-xs text-slate-400">{emptyHint}</p>
      )}

      <SortableList
        items={items}
        onReorder={(from, to) => reorderItems(listKey, from, to)}
      >
        {(item, handle) => (
          <EntryCard
            title={entryTitle(item)}
            dragHandle={handle}
            onRemove={() => removeItem(listKey, item.id)}
          >
            {fields(item, (patch) =>
              // Ключ и тип записи согласованы вызывающим кодом.
              updateItem(listKey, item.id, patch as never),
            )}
          </EntryCard>
        )}
      </SortableList>

      <AddButton label={addLabel} onClick={() => addItem(listKey)} />
    </Card>
  )
}
