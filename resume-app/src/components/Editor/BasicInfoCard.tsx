import { useRef } from 'react'
import { useResumeStore } from '../../store/resumeStore'
import Card from '../ui/Card'
import { Field } from '../ui/Field'

/** Максимальный размер фото — большие картинки раздувают localStorage. */
const MAX_PHOTO_BYTES = 2 * 1024 * 1024

export default function BasicInfoCard() {
  const basic = useResumeStore((s) => s.data.basic)
  const setBasic = useResumeStore((s) => s.setBasic)
  const fileRef = useRef<HTMLInputElement>(null)

  function onPhoto(file: File | undefined) {
    if (!file) return
    if (file.size > MAX_PHOTO_BYTES) {
      alert('Фото больше 2 МБ. Выберите файл поменьше.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setBasic({ photo: String(reader.result) })
    reader.readAsDataURL(file)
  }

  return (
    <Card title="Основная информация">
      <div className="flex gap-4">
        <div className="shrink-0 text-center">
          <div className="h-24 w-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            {basic.photo ? (
              <img src={basic.photo} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-[11px] text-slate-400">
                нет фото
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPhoto(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-1.5 w-full rounded-md border border-slate-200 py-1 text-[11px] font-medium text-slate-600 transition hover:border-navy-2 hover:text-navy"
          >
            Загрузить
          </button>
          {basic.photo && (
            <button
              type="button"
              onClick={() => setBasic({ photo: '' })}
              className="mt-1 w-full text-[11px] text-slate-400 transition hover:text-red-600"
            >
              Удалить
            </button>
          )}
        </div>

        <div className="grid flex-1 grid-cols-2 gap-2.5">
          <Field
            label="Фамилия"
            value={basic.lastName}
            onChange={(e) => setBasic({ lastName: e.target.value })}
            placeholder="Иванов"
          />
          <Field
            label="Имя"
            value={basic.firstName}
            onChange={(e) => setBasic({ firstName: e.target.value })}
            placeholder="Иван"
          />
          <Field
            label="Отчество"
            value={basic.middleName}
            onChange={(e) => setBasic({ middleName: e.target.value })}
            placeholder="Иванович"
          />
          <Field
            label="Дата рождения"
            type="date"
            value={basic.birthDate}
            onChange={(e) => setBasic({ birthDate: e.target.value })}
          />
        </div>
      </div>

      <Field
        label="Желаемая должность"
        value={basic.position}
        onChange={(e) => setBasic({ position: e.target.value })}
        placeholder="Тренер по общей физической подготовке"
      />
      <Field
        label="Город"
        value={basic.city}
        onChange={(e) => setBasic({ city: e.target.value })}
        placeholder="Санкт-Петербург"
      />
    </Card>
  )
}
