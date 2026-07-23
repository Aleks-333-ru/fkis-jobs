import { useResumeStore } from '../../store/resumeStore'
import Card from '../ui/Card'
import EntryCard, { AddButton } from '../ui/EntryCard'
import { Field, TextField } from '../ui/Field'

/**
 * Произвольные разделы: пользователь задаёт заголовок и содержимое.
 * Появляются в списке разделов и участвуют в сортировке наравне со стандартными.
 */
export default function CustomSectionsCard() {
  const custom = useResumeStore((s) => s.data.custom)
  const addCustomSection = useResumeStore((s) => s.addCustomSection)
  const updateCustomSection = useResumeStore((s) => s.updateCustomSection)
  const removeCustomSection = useResumeStore((s) => s.removeCustomSection)

  return (
    <Card title="Дополнительные разделы" badge={custom.length || ''} defaultOpen={false}>
      <p className="text-xs text-slate-400">
        Например: «Достижения», «Публикации», «Рекомендации». Порядок настраивается в разделе
        «Разделы резюме».
      </p>

      {custom.map((item) => (
        <EntryCard
          key={item.id}
          title={item.title}
          onRemove={() => removeCustomSection(item.id)}
        >
          <Field
            label="Заголовок раздела"
            value={item.title}
            onChange={(e) => updateCustomSection(item.id, { title: e.target.value })}
            placeholder="Достижения"
          />
          <TextField
            label="Содержимое"
            hint="Каждая строка станет отдельным пунктом."
            rows={3}
            value={item.content}
            onChange={(e) => updateCustomSection(item.id, { content: e.target.value })}
          />
        </EntryCard>
      ))}

      <AddButton label="Добавить раздел" onClick={addCustomSection} />
    </Card>
  )
}
