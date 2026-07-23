import type { ComponentType } from 'react'
import type { TemplateId, TemplateProps } from '../../types/resume'
import Classic from './Classic'
import Corporate from './Corporate'
import Creative from './Creative'
import Designer from './Designer'
import Executive from './Executive'
import Minimal from './Minimal'
import Modern from './Modern'
import Professional from './Professional'
import Tech from './Tech'

export interface TemplateMeta {
  id: TemplateId
  label: string
  hint: string
  component: ComponentType<TemplateProps>
}

/**
 * Реестр шаблонов. Добавить новый — значит дописать сюда одну строку:
 * данные и настройки во все шаблоны приходят одинаковые.
 */
export const TEMPLATES: TemplateMeta[] = [
  { id: 'classic', label: 'Classic', hint: 'Строгий, одна колонка', component: Classic },
  { id: 'modern', label: 'Modern', hint: 'Тёмный сайдбар с фото', component: Modern },
  { id: 'minimal', label: 'Minimal', hint: 'Много воздуха, без заливок', component: Minimal },
  { id: 'corporate', label: 'Corporate', hint: 'Цветная шапка, деловой', component: Corporate },
  { id: 'professional', label: 'Professional', hint: 'Светлый сайдбар, акценты', component: Professional },
  { id: 'creative', label: 'Creative', hint: 'Градиентная шапка, номера', component: Creative },
  { id: 'tech', label: 'Tech', hint: 'Моноширинный, «айтишный»', component: Tech },
  { id: 'designer', label: 'Designer', hint: 'Крупная цветная колонка', component: Designer },
  { id: 'executive', label: 'Executive', hint: 'Представительский, по центру', component: Executive },
]

export function getTemplate(id: TemplateId): TemplateMeta {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}
