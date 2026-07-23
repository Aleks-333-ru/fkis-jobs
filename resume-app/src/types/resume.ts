/**
 * Модель данных резюме.
 * Все шаблоны получают ровно этот объект и ничего кроме него —
 * поэтому новый шаблон не требует правок в редакторе или сторе.
 */

/** Идентификаторы стандартных разделов. */
export type SectionId =
  | 'about'
  | 'experience'
  | 'education'
  | 'courses'
  | 'skills'
  | 'languages'
  | 'certificates'
  | 'projects'

/**
 * Ключ раздела в порядке вывода: стандартный id либо произвольный
 * пользовательский раздел с префиксом «custom:».
 */
export type SectionKey = SectionId | `custom:${string}`

/** Человекочитаемые названия разделов для редактора и шаблонов. */
export const SECTION_TITLES: Record<SectionId, string> = {
  about: 'О себе',
  experience: 'Опыт работы',
  education: 'Образование',
  courses: 'Курсы и повышение квалификации',
  skills: 'Навыки',
  languages: 'Языки',
  certificates: 'Сертификаты',
  projects: 'Проекты и достижения',
}

/** Порядок разделов по умолчанию. */
export const DEFAULT_SECTION_ORDER: SectionId[] = [
  'about',
  'experience',
  'education',
  'courses',
  'skills',
  'languages',
  'certificates',
  'projects',
]

export interface BasicInfo {
  lastName: string
  firstName: string
  middleName: string
  /** Желаемая должность — главный заголовок резюме. */
  position: string
  city: string
  /** ISO-дата YYYY-MM-DD, из неё считается возраст. */
  birthDate: string
  /** data:URL загруженного фото. */
  photo: string
}

export interface Contacts {
  phone: string
  email: string
  telegram: string
  vk: string
  website: string
}

/** Общее поле всех записей — нужно для сортировки drag&drop. */
export interface Entry {
  id: string
}

export interface ExperienceItem extends Entry {
  company: string
  position: string
  city: string
  /** Период в свободной форме: «03.2021». */
  start: string
  end: string
  /** «по настоящее время» вместо end. */
  current: boolean
  description: string
}

export interface EducationItem extends Entry {
  institution: string
  faculty: string
  degree: string
  start: string
  end: string
}

export interface CourseItem extends Entry {
  name: string
  organization: string
  year: string
}

export interface SkillItem extends Entry {
  name: string
  /** 0 — уровень не показываем, 1–5 — шкала. */
  level: number
}

export interface LanguageItem extends Entry {
  name: string
  level: string
}

export interface CertificateItem extends Entry {
  name: string
  issuer: string
  year: string
}

export interface ProjectItem extends Entry {
  name: string
  role: string
  year: string
  description: string
}

/** Произвольный раздел: заголовок задаёт пользователь. */
export interface CustomSection extends Entry {
  title: string
  content: string
}

export interface ResumeData {
  basic: BasicInfo
  contacts: Contacts
  about: string
  experience: ExperienceItem[]
  education: EducationItem[]
  courses: CourseItem[]
  skills: SkillItem[]
  languages: LanguageItem[]
  certificates: CertificateItem[]
  projects: ProjectItem[]
  /** Произвольные разделы; ключ в порядке — «custom:<id>». */
  custom: CustomSection[]
  /** Порядок вывода разделов в шаблоне. */
  sectionOrder: SectionKey[]
  /** Какие разделы вообще показывать. */
  enabledSections: SectionKey[]
}

export type TemplateId =
  | 'classic'
  | 'modern'
  | 'minimal'
  | 'corporate'
  | 'creative'
  | 'professional'
  | 'tech'
  | 'designer'
  | 'executive'

export type ThemeId =
  | 'blue'
  | 'green'
  | 'black'
  | 'orange'
  | 'purple'
  | 'red'
  | 'gray'

export type FontId =
  | 'inter'
  | 'roboto'
  | 'openSans'
  | 'lato'
  | 'montserrat'
  | 'merriweather'
  | 'playfair'
  | 'sourceSans'

export type PageSize = 'a4' | 'letter'

export interface ResumeSettings {
  template: TemplateId
  theme: ThemeId
  font: FontId
  showPhoto: boolean
  showAge: boolean
  showCity: boolean
  showIcons: boolean
  /** Компактный режим — мельче шрифт и отступы. */
  compact: boolean
  /** Увеличенные интервалы между разделами. */
  spacious: boolean
  /** Одна или две колонки (шаблон может игнорировать). */
  columns: 1 | 2
  /** Масштаб предпросмотра, 0.5–1.5. */
  zoom: number
  pageSize: PageSize
}

/** Всё, что нужно шаблону для отрисовки. */
export interface TemplateProps {
  data: ResumeData
  settings: ResumeSettings
  /** Готовая палитра выбранной темы. */
  theme: ResumeTheme
}

export interface ResumeTheme {
  id: ThemeId
  label: string
  /** Основной цвет — заголовки, плашки. */
  primary: string
  /** Тёмный оттенок — сайдбар, шапка. */
  dark: string
  /** Светлая заливка — фон плашек и чипов. */
  soft: string
  /** Цвет текста поверх primary/dark. */
  onPrimary: string
}
