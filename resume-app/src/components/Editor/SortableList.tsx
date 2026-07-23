import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ReactNode } from 'react'
import type { Entry } from '../../types/resume'

interface Props<T extends Entry> {
  items: T[]
  onReorder: (from: number, to: number) => void
  children: (item: T, dragHandle: ReactNode) => ReactNode
}

/**
 * Обёртка перетаскивания для любого списка записей.
 * Списки отличаются только полями, логика сортировки у них одна.
 */
export default function SortableList<T extends Entry>({
  items,
  onReorder,
  children,
}: Props<T>) {
  const sensors = useSensors(
    // Небольшой порог, иначе обычный клик по полю воспринимается как перетаскивание.
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const from = items.findIndex((i) => i.id === active.id)
    const to = items.findIndex((i) => i.id === over.id)
    if (from !== -1 && to !== -1) onReorder(from, to)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2.5">
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              {(handle) => children(item, handle)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

function SortableRow({
  id,
  children,
}: {
  id: string
  children: (handle: ReactNode) => ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const handle = (
    <button
      type="button"
      title="Перетащить"
      className="cursor-grab rounded p-0.5 text-slate-300 transition hover:text-slate-500 active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
        <circle cx="7" cy="5" r="1.4" />
        <circle cx="13" cy="5" r="1.4" />
        <circle cx="7" cy="10" r="1.4" />
        <circle cx="13" cy="10" r="1.4" />
        <circle cx="7" cy="15" r="1.4" />
        <circle cx="13" cy="15" r="1.4" />
      </svg>
    </button>
  )

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : undefined,
        position: 'relative',
        opacity: isDragging ? 0.9 : 1,
      }}
    >
      {children(handle)}
    </div>
  )
}
