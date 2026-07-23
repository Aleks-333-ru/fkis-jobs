import { useResumeStore } from '../../store/resumeStore'
import TemplateRenderer from '../Preview/TemplateRenderer'
import { PAGE_SIZES } from '../Preview/ResumePreview'
import { TEMPLATES } from '../Templates'

const THUMB_W = 150
const THUMB_H = 200

/** Выбор шаблона. Миниатюра — тот же компонент, только уменьшенный. */
export default function TemplatesPanel() {
  const data = useResumeStore((s) => s.data)
  const settings = useResumeStore((s) => s.settings)
  const setSettings = useResumeStore((s) => s.setSettings)

  const page = PAGE_SIZES[settings.pageSize]
  const scale = THUMB_W / page.w

  return (
    <div className="grid grid-cols-2 gap-3">
      {TEMPLATES.map((tpl) => {
        const active = settings.template === tpl.id
        return (
          <button
            key={tpl.id}
            type="button"
            onClick={() => setSettings({ template: tpl.id })}
            className={`group overflow-hidden rounded-xl border-2 bg-white text-left transition ${
              active
                ? 'border-navy-2 shadow-md'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <div
              className="relative overflow-hidden bg-slate-100"
              style={{ height: THUMB_H }}
            >
              <div
                style={{
                  width: page.w,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  pointerEvents: 'none',
                }}
              >
                <TemplateRenderer
                  data={data}
                  settings={{ ...settings, template: tpl.id, zoom: 1 }}
                />
              </div>
              {active && (
                <span className="absolute right-1.5 top-1.5 rounded-full bg-navy-2 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  выбран
                </span>
              )}
            </div>
            <div className="border-t border-slate-100 px-3 py-2">
              <div className="text-sm font-semibold text-slate-800">{tpl.label}</div>
              <div className="text-[11px] text-slate-400">{tpl.hint}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
