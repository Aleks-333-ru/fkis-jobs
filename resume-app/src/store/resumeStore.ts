import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  DEFAULT_SECTION_ORDER,
  type CertificateItem,
  type CourseItem,
  type CustomSection,
  type EducationItem,
  type Entry,
  type ExperienceItem,
  type LanguageItem,
  type ProjectItem,
  type ResumeData,
  type ResumeSettings,
  type SectionKey,
  type SkillItem,
} from '../types/resume'
import { uid } from '../utils/format'

/** Ключи ResumeData, значение которых — массив записей. */
export type ListKey =
  | 'experience'
  | 'education'
  | 'courses'
  | 'skills'
  | 'languages'
  | 'certificates'
  | 'projects'

/** Тип записи для каждого списка — чтобы add/update были типобезопасны. */
interface ListItemMap {
  experience: ExperienceItem
  education: EducationItem
  courses: CourseItem
  skills: SkillItem
  languages: LanguageItem
  certificates: CertificateItem
  projects: ProjectItem
}

/** Заготовки новых записей. */
const BLANKS: { [K in ListKey]: () => ListItemMap[K] } = {
  experience: () => ({
    id: uid(),
    company: '',
    position: '',
    city: '',
    start: '',
    end: '',
    current: false,
    description: '',
  }),
  education: () => ({
    id: uid(),
    institution: '',
    faculty: '',
    degree: '',
    start: '',
    end: '',
  }),
  courses: () => ({ id: uid(), name: '', organization: '', year: '' }),
  skills: () => ({ id: uid(), name: '', level: 0 }),
  languages: () => ({ id: uid(), name: '', level: '' }),
  certificates: () => ({ id: uid(), name: '', issuer: '', year: '' }),
  projects: () => ({ id: uid(), name: '', role: '', year: '', description: '' }),
}

const EMPTY_DATA: ResumeData = {
  basic: {
    lastName: '',
    firstName: '',
    middleName: '',
    position: '',
    city: '',
    birthDate: '',
    photo: '',
  },
  contacts: { phone: '', email: '', telegram: '', vk: '', website: '' },
  about: '',
  experience: [],
  education: [],
  courses: [],
  skills: [],
  languages: [],
  certificates: [],
  projects: [],
  custom: [],
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  enabledSections: [
    'about',
    'experience',
    'education',
    'courses',
    'skills',
    'languages',
  ],
}

const DEFAULT_SETTINGS: ResumeSettings = {
  template: 'classic',
  theme: 'blue',
  font: 'inter',
  showPhoto: true,
  showAge: true,
  showCity: true,
  showIcons: true,
  compact: false,
  spacious: false,
  columns: 2,
  zoom: 1,
  pageSize: 'a4',
}

/** Пример резюме — чтобы предпросмотр не был пустым при первом входе. */
const SAMPLE_DATA: ResumeData = {
  ...EMPTY_DATA,
  basic: {
    lastName: 'Иванов',
    firstName: 'Иван',
    middleName: 'Иванович',
    position: 'Тренер по общей физической подготовке',
    city: 'Санкт-Петербург',
    birthDate: '1994-05-12',
    photo: '',
  },
  contacts: {
    phone: '+7 999 123-45-67',
    email: 'ivanov@example.ru',
    telegram: '@ivanov',
    vk: '',
    website: '',
  },
  about:
    'Тренер с опытом работы более 6 лет. Готовлю спортсменов юношеского разряда, ' +
    'веду групповые и индивидуальные занятия. Умею выстраивать программу под цель ' +
    'и удерживать мотивацию группы.',
  experience: [
    {
      id: uid(),
      company: 'СШОР №2',
      position: 'Тренер-преподаватель',
      city: 'Санкт-Петербург',
      start: '09.2020',
      end: '',
      current: true,
      description:
        'Ведение групп начальной подготовки (до 20 человек)\n' +
        'Подготовка спортсменов к городским соревнованиям\n' +
        'Разработка годовых тренировочных планов',
    },
    {
      id: uid(),
      company: 'Фитнес-клуб «Атлант»',
      position: 'Инструктор тренажёрного зала',
      city: 'Санкт-Петербург',
      start: '06.2018',
      end: '08.2020',
      current: false,
      description:
        'Индивидуальные тренировки и составление программ\n' +
        'Вводный инструктаж для новых клиентов',
    },
  ],
  education: [
    {
      id: uid(),
      institution: 'НГУ им. П.Ф. Лесгафта',
      faculty: 'Факультет физической культуры',
      degree: 'Бакалавр, физическая культура',
      start: '2012',
      end: '2016',
    },
  ],
  courses: [
    {
      id: uid(),
      name: 'Спортивная нутрициология',
      organization: 'Центр повышения квалификации',
      year: '2023',
    },
  ],
  skills: [
    { id: uid(), name: 'Групповые тренировки', level: 5 },
    { id: uid(), name: 'ОФП и СФП', level: 5 },
    { id: uid(), name: 'Составление программ', level: 4 },
    { id: uid(), name: 'Спортивная первая помощь', level: 4 },
  ],
  languages: [
    { id: uid(), name: 'Русский', level: 'родной' },
    { id: uid(), name: 'Английский', level: 'B1' },
  ],
}

interface ResumeState {
  data: ResumeData
  settings: ResumeSettings

  setBasic: (patch: Partial<ResumeData['basic']>) => void
  setContacts: (patch: Partial<ResumeData['contacts']>) => void
  setAbout: (value: string) => void

  addItem: (key: ListKey) => void
  updateItem: <K extends ListKey>(
    key: K,
    id: string,
    patch: Partial<ListItemMap[K]>,
  ) => void
  removeItem: (key: ListKey, id: string) => void
  reorderItems: (key: ListKey, from: number, to: number) => void

  toggleSection: (id: SectionKey) => void
  reorderSections: (from: number, to: number) => void

  addCustomSection: () => void
  updateCustomSection: (id: string, patch: Partial<CustomSection>) => void
  removeCustomSection: (id: string) => void

  setSettings: (patch: Partial<ResumeSettings>) => void
  resetAll: () => void
  loadSample: () => void
}

/** Перестановка элемента массива — общая для записей и разделов. */
function move<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) {
    return list
  }
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      data: SAMPLE_DATA,
      settings: DEFAULT_SETTINGS,

      setBasic: (patch) =>
        set((s) => ({ data: { ...s.data, basic: { ...s.data.basic, ...patch } } })),

      setContacts: (patch) =>
        set((s) => ({
          data: { ...s.data, contacts: { ...s.data.contacts, ...patch } },
        })),

      setAbout: (value) => set((s) => ({ data: { ...s.data, about: value } })),

      addItem: (key) =>
        set((s) => ({
          data: {
            ...s.data,
            [key]: [...(s.data[key] as Entry[]), BLANKS[key]()],
          },
        })),

      updateItem: (key, id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            [key]: (s.data[key] as Entry[]).map((item) =>
              item.id === id ? { ...item, ...patch } : item,
            ),
          },
        })),

      removeItem: (key, id) =>
        set((s) => ({
          data: {
            ...s.data,
            [key]: (s.data[key] as Entry[]).filter((item) => item.id !== id),
          },
        })),

      reorderItems: (key, from, to) =>
        set((s) => ({
          data: { ...s.data, [key]: move(s.data[key] as Entry[], from, to) },
        })),

      toggleSection: (id) =>
        set((s) => {
          const on = s.data.enabledSections.includes(id)
          return {
            data: {
              ...s.data,
              enabledSections: on
                ? s.data.enabledSections.filter((x) => x !== id)
                : [...s.data.enabledSections, id],
            },
          }
        }),

      reorderSections: (from, to) =>
        set((s) => ({
          data: { ...s.data, sectionOrder: move(s.data.sectionOrder, from, to) },
        })),

      addCustomSection: () =>
        set((s) => {
          const id = uid()
          const key: SectionKey = `custom:${id}`
          return {
            data: {
              ...s.data,
              custom: [...s.data.custom, { id, title: '', content: '' }],
              sectionOrder: [...s.data.sectionOrder, key],
              enabledSections: [...s.data.enabledSections, key],
            },
          }
        }),

      updateCustomSection: (id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            custom: s.data.custom.map((c) => (c.id === id ? { ...c, ...patch } : c)),
          },
        })),

      removeCustomSection: (id) =>
        set((s) => {
          const key: SectionKey = `custom:${id}`
          return {
            data: {
              ...s.data,
              custom: s.data.custom.filter((c) => c.id !== id),
              sectionOrder: s.data.sectionOrder.filter((k) => k !== key),
              enabledSections: s.data.enabledSections.filter((k) => k !== key),
            },
          }
        }),

      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      resetAll: () => set({ data: { ...EMPTY_DATA }, settings: { ...DEFAULT_SETTINGS } }),

      loadSample: () => set({ data: { ...SAMPLE_DATA } }),
    }),
    {
      name: 'fkis_resume_v2',
      version: 2,
      // Старые сохранения могли не знать про произвольные разделы.
      migrate: (persisted) => {
        const state = persisted as { data?: Partial<ResumeData> } | undefined
        if (state?.data && !state.data.custom) state.data.custom = []
        return state as never
      },
    },
  ),
)
