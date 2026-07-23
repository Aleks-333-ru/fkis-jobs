import type { BasicInfo, Contacts, ExperienceItem } from '../types/resume'

/** Уникальный id для новой записи. */
export const uid = () => Math.random().toString(36).slice(2, 10)

/** «Иванов Иван Иванович» без лишних пробелов. */
export function fullName(basic: BasicInfo): string {
  return [basic.lastName, basic.firstName, basic.middleName]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(' ')
}

/** Инициалы для аватара-заглушки, когда фото не загружено. */
export function initials(basic: BasicInfo): string {
  const a = basic.firstName.trim()[0] ?? ''
  const b = basic.lastName.trim()[0] ?? ''
  return (b + a).toUpperCase()
}

/** Возраст с правильным русским склонением: «34 года». */
export function ageLabel(birthDate: string): string {
  if (!birthDate) return ''
  const born = new Date(birthDate)
  if (Number.isNaN(born.getTime())) return ''
  const now = new Date()
  let age = now.getFullYear() - born.getFullYear()
  const m = now.getMonth() - born.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < born.getDate())) age--
  if (age < 0 || age > 120) return ''
  return `${age} ${plural(age, 'год', 'года', 'лет')}`
}

/** Выбор формы слова по числу: 1 год, 2 года, 5 лет. */
export function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

/** «03.2021 — по настоящее время» */
export function periodLabel(item: ExperienceItem): string {
  const end = item.current ? 'по настоящее время' : item.end.trim()
  const start = item.start.trim()
  if (start && end) return `${start} — ${end}`
  return start || end
}

/** Многострочный текст → массив непустых строк (для маркированных списков). */
export function toLines(text: string): string[] {
  return text
    .split('\n')
    .map((s) => s.replace(/^[\s•\-–—*]+/, '').trim())
    .filter(Boolean)
}

interface ContactLine {
  key: keyof Contacts
  label: string
  icon: string
}

/** Заполненные контакты в фиксированном порядке, с иконкой-эмодзи. */
export function contactLines(contacts: Contacts): ContactLine[] {
  const defs: ContactLine[] = [
    { key: 'phone', label: contacts.phone, icon: '☎' },
    { key: 'email', label: contacts.email, icon: '✉' },
    { key: 'telegram', label: contacts.telegram, icon: '✈' },
    { key: 'vk', label: contacts.vk, icon: '❖' },
    { key: 'website', label: contacts.website, icon: '🔗' },
  ]
  return defs.filter((d) => d.label.trim().length > 0)
}
