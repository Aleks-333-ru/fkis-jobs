import type {
  CertificateItem,
  CourseItem,
  EducationItem,
  ExperienceItem,
  LanguageItem,
  ProjectItem,
  SkillItem,
} from '../../types/resume'
import { Field, TextField } from '../ui/Field'
import ListCard from './ListCard'

/* Каждый раздел описывает только свои поля — остальное берёт на себя ListCard. */

export function ExperienceCard() {
  return (
    <ListCard<ExperienceItem>
      listKey="experience"
      title="Опыт работы"
      addLabel="Добавить место работы"
      emptyHint="Начните с последнего места работы — его читают в первую очередь."
      entryTitle={(i) => i.position || i.company}
      fields={(item, patch) => (
        <>
          <Field
            label="Должность"
            value={item.position}
            onChange={(e) => patch({ position: e.target.value })}
            placeholder="Тренер-преподаватель"
          />
          <div className="grid grid-cols-2 gap-2.5">
            <Field
              label="Организация"
              value={item.company}
              onChange={(e) => patch({ company: e.target.value })}
              placeholder="СШОР №2"
            />
            <Field
              label="Город"
              value={item.city}
              onChange={(e) => patch({ city: e.target.value })}
              placeholder="Санкт-Петербург"
            />
            <Field
              label="Начало"
              value={item.start}
              onChange={(e) => patch({ start: e.target.value })}
              placeholder="09.2020"
            />
            <Field
              label="Окончание"
              value={item.end}
              onChange={(e) => patch({ end: e.target.value })}
              placeholder="05.2024"
              disabled={item.current}
            />
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={item.current}
              onChange={(e) => patch({ current: e.target.checked })}
              className="h-3.5 w-3.5 accent-navy-2"
            />
            Работаю здесь сейчас
          </label>
          <TextField
            label="Обязанности и результаты"
            hint="По одному пункту на строку — в резюме получится маркированный список."
            rows={4}
            value={item.description}
            onChange={(e) => patch({ description: e.target.value })}
            placeholder={'Ведение групп начальной подготовки\nПодготовка к городским соревнованиям'}
          />
        </>
      )}
    />
  )
}

export function EducationCard() {
  return (
    <ListCard<EducationItem>
      listKey="education"
      title="Образование"
      addLabel="Добавить образование"
      entryTitle={(i) => i.institution}
      fields={(item, patch) => (
        <>
          <Field
            label="Учебное заведение"
            value={item.institution}
            onChange={(e) => patch({ institution: e.target.value })}
            placeholder="НГУ им. П.Ф. Лесгафта"
          />
          <Field
            label="Факультет"
            value={item.faculty}
            onChange={(e) => patch({ faculty: e.target.value })}
            placeholder="Факультет физической культуры"
          />
          <Field
            label="Специальность и степень"
            value={item.degree}
            onChange={(e) => patch({ degree: e.target.value })}
            placeholder="Бакалавр, физическая культура"
          />
          <div className="grid grid-cols-2 gap-2.5">
            <Field
              label="Год поступления"
              value={item.start}
              onChange={(e) => patch({ start: e.target.value })}
              placeholder="2012"
            />
            <Field
              label="Год окончания"
              value={item.end}
              onChange={(e) => patch({ end: e.target.value })}
              placeholder="2016"
            />
          </div>
        </>
      )}
    />
  )
}

export function CoursesCard() {
  return (
    <ListCard<CourseItem>
      listKey="courses"
      title="Курсы и повышение квалификации"
      addLabel="Добавить курс"
      entryTitle={(i) => i.name}
      fields={(item, patch) => (
        <>
          <Field
            label="Название курса"
            value={item.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder="Спортивная нутрициология"
          />
          <div className="grid grid-cols-2 gap-2.5">
            <Field
              label="Организация"
              value={item.organization}
              onChange={(e) => patch({ organization: e.target.value })}
            />
            <Field
              label="Год"
              value={item.year}
              onChange={(e) => patch({ year: e.target.value })}
              placeholder="2023"
            />
          </div>
        </>
      )}
    />
  )
}

export function SkillsCard() {
  return (
    <ListCard<SkillItem>
      listKey="skills"
      title="Навыки"
      addLabel="Добавить навык"
      emptyHint="6–10 конкретных навыков работают лучше, чем длинный общий список."
      entryTitle={(i) => i.name}
      fields={(item, patch) => (
        <>
          <Field
            label="Навык"
            value={item.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder="Групповые тренировки"
          />
          <div>
            <span className="mb-1 block text-xs font-medium text-slate-600">
              Уровень владения
            </span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => patch({ level: n })}
                  className={`h-7 flex-1 rounded-md border text-xs transition ${
                    item.level === n
                      ? 'border-navy-2 bg-navy-soft font-semibold text-navy'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {n === 0 ? 'без шкалы' : n}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    />
  )
}

export function LanguagesCard() {
  return (
    <ListCard<LanguageItem>
      listKey="languages"
      title="Языки"
      addLabel="Добавить язык"
      entryTitle={(i) => i.name}
      fields={(item, patch) => (
        <div className="grid grid-cols-2 gap-2.5">
          <Field
            label="Язык"
            value={item.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder="Английский"
          />
          <Field
            label="Уровень"
            value={item.level}
            onChange={(e) => patch({ level: e.target.value })}
            placeholder="B1"
          />
        </div>
      )}
    />
  )
}

export function CertificatesCard() {
  return (
    <ListCard<CertificateItem>
      listKey="certificates"
      title="Сертификаты"
      addLabel="Добавить сертификат"
      entryTitle={(i) => i.name}
      fields={(item, patch) => (
        <>
          <Field
            label="Название"
            value={item.name}
            onChange={(e) => patch({ name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2.5">
            <Field
              label="Кем выдан"
              value={item.issuer}
              onChange={(e) => patch({ issuer: e.target.value })}
            />
            <Field
              label="Год"
              value={item.year}
              onChange={(e) => patch({ year: e.target.value })}
            />
          </div>
        </>
      )}
    />
  )
}

export function ProjectsCard() {
  return (
    <ListCard<ProjectItem>
      listKey="projects"
      title="Проекты и достижения"
      addLabel="Добавить проект"
      entryTitle={(i) => i.name}
      fields={(item, patch) => (
        <>
          <Field
            label="Название"
            value={item.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder="Городская спартакиада школьников"
          />
          <div className="grid grid-cols-2 gap-2.5">
            <Field
              label="Роль"
              value={item.role}
              onChange={(e) => patch({ role: e.target.value })}
              placeholder="Главный судья"
            />
            <Field
              label="Год"
              value={item.year}
              onChange={(e) => patch({ year: e.target.value })}
            />
          </div>
          <TextField
            label="Описание"
            rows={3}
            value={item.description}
            onChange={(e) => patch({ description: e.target.value })}
          />
        </>
      )}
    />
  )
}
