import { useResumeStore } from '../../store/resumeStore'
import Card from '../ui/Card'
import { TextField } from '../ui/Field'

export default function AboutCard() {
  const about = useResumeStore((s) => s.data.about)
  const setAbout = useResumeStore((s) => s.setAbout)

  return (
    <Card title="О себе">
      <TextField
        label="Краткий рассказ о себе"
        hint="3–5 строк: опыт, сильные стороны, чем полезны работодателю. Каждая новая строка станет отдельным пунктом списка."
        rows={5}
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        placeholder="Тренер с опытом работы более 6 лет..."
      />
    </Card>
  )
}
