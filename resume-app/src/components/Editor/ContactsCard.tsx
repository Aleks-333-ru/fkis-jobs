import { useResumeStore } from '../../store/resumeStore'
import Card from '../ui/Card'
import { Field } from '../ui/Field'

export default function ContactsCard() {
  const contacts = useResumeStore((s) => s.data.contacts)
  const setContacts = useResumeStore((s) => s.setContacts)

  return (
    <Card title="Контакты">
      <div className="grid grid-cols-2 gap-2.5">
        <Field
          label="Телефон"
          value={contacts.phone}
          onChange={(e) => setContacts({ phone: e.target.value })}
          placeholder="+7 999 123-45-67"
        />
        <Field
          label="E-mail"
          type="email"
          value={contacts.email}
          onChange={(e) => setContacts({ email: e.target.value })}
          placeholder="name@example.ru"
        />
        <Field
          label="Telegram"
          value={contacts.telegram}
          onChange={(e) => setContacts({ telegram: e.target.value })}
          placeholder="@nickname"
        />
        <Field
          label="ВКонтакте"
          value={contacts.vk}
          onChange={(e) => setContacts({ vk: e.target.value })}
          placeholder="vk.com/nickname"
        />
      </div>
      <Field
        label="Сайт или портфолио"
        value={contacts.website}
        onChange={(e) => setContacts({ website: e.target.value })}
        placeholder="example.ru"
      />
    </Card>
  )
}
