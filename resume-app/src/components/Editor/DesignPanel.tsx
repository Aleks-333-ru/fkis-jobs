import { useResumeStore } from '../../store/resumeStore'
import { FONT_LIST } from '../../utils/fonts'
import { THEME_LIST } from '../../utils/themes'
import Card from '../ui/Card'
import { Toggle } from '../ui/Field'

/** Оформление: цвет, шрифт, что показывать и как плотно верстать. */
export default function DesignPanel() {
  const settings = useResumeStore((s) => s.settings)
  const setSettings = useResumeStore((s) => s.setSettings)

  return (
    <div className="space-y-3">
      <Card title="Цветовая тема">
        <div className="flex flex-wrap gap-2">
          {THEME_LIST.map((theme) => (
            <button
              key={theme.id}
              type="button"
              title={theme.label}
              onClick={() => setSettings({ theme: theme.id })}
              className={`h-9 w-9 rounded-full transition ${
                settings.theme === theme.id
                  ? 'ring-2 ring-navy-2 ring-offset-2'
                  : 'hover:scale-110'
              }`}
              style={{ background: theme.primary }}
            />
          ))}
        </div>
      </Card>

      <Card title="Шрифт">
        <div className="grid grid-cols-2 gap-2">
          {FONT_LIST.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => setSettings({ font: font.id })}
              style={{ fontFamily: font.stack }}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                settings.font === font.id
                  ? 'border-navy-2 bg-navy-soft text-navy'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {font.label}
            </button>
          ))}
        </div>
      </Card>

      <Card title="Что показывать">
        <Toggle
          label="Фотография"
          checked={settings.showPhoto}
          onChange={(v) => setSettings({ showPhoto: v })}
        />
        <Toggle
          label="Возраст"
          checked={settings.showAge}
          onChange={(v) => setSettings({ showAge: v })}
        />
        <Toggle
          label="Город"
          checked={settings.showCity}
          onChange={(v) => setSettings({ showCity: v })}
        />
        <Toggle
          label="Иконки у контактов"
          checked={settings.showIcons}
          onChange={(v) => setSettings({ showIcons: v })}
        />
      </Card>

      <Card title="Плотность вёрстки">
        <Toggle
          label="Компактный режим"
          checked={settings.compact}
          onChange={(v) => setSettings({ compact: v })}
        />
        <Toggle
          label="Большие интервалы"
          checked={settings.spacious}
          onChange={(v) => setSettings({ spacious: v })}
        />
        <div>
          <span className="mb-1.5 block text-xs font-medium text-slate-600">Колонки</span>
          <div className="flex gap-2">
            {([2, 1] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setSettings({ columns: n })}
                className={`flex-1 rounded-lg border py-2 text-sm transition ${
                  settings.columns === n
                    ? 'border-navy-2 bg-navy-soft font-medium text-navy'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {n === 2 ? 'Две колонки' : 'Одна колонка'}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Classic и Minimal всегда одноколоночные.
          </p>
        </div>
      </Card>
    </div>
  )
}
