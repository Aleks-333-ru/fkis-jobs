import { useEffect, useRef, useState } from 'react'
import type { PageSize } from '../../types/resume'
import { useResumeStore } from '../../store/resumeStore'
import TemplateRenderer from './TemplateRenderer'

/** Размеры листа в пикселях при 96 dpi. */
export const PAGE_SIZES: Record<PageSize, { w: number; h: number; label: string }> = {
  a4: { w: 794, h: 1123, label: 'A4' },
  letter: { w: 816, h: 1056, label: 'Letter' },
}

/**
 * Живой предпросмотр листа. Содержимое рендерится одним потоком,
 * а границы страниц показываются пунктиром по мере роста текста —
 * так видно, что уедет на второй лист, как в Word.
 */
export default function ResumePreview() {
  const data = useResumeStore((s) => s.data)
  const settings = useResumeStore((s) => s.settings)
  const page = PAGE_SIZES[settings.pageSize]

  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(page.h)

  // Пересчитываем высоту при любом изменении содержимого или настроек.
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const observer = new ResizeObserver(() => setHeight(el.scrollHeight))
    observer.observe(el)
    setHeight(el.scrollHeight)
    return () => observer.disconnect()
  }, [data, settings])

  const pages = Math.max(1, Math.ceil(height / page.h))
  const sheetHeight = pages * page.h

  return (
    <div
      className="print-root flex-1 overflow-auto thin-scroll bg-slate-100 p-8"
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}
    >
      <div
        style={{
          width: page.w * settings.zoom,
          height: sheetHeight * settings.zoom,
          flexShrink: 0,
        }}
      >
        <div
          className="resume-page bg-white shadow-xl"
          style={{
            width: page.w,
            height: sheetHeight,
            transform: `scale(${settings.zoom})`,
            transformOrigin: 'top left',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div ref={contentRef}>
            <TemplateRenderer data={data} settings={settings} />
          </div>

          {/* Границы листов */}
          {Array.from({ length: pages - 1 }, (_, i) => (
            <div
              key={i}
              className="no-print"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: (i + 1) * page.h,
                borderTop: '1px dashed #c3ccdb',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  right: 8,
                  top: 4,
                  fontSize: 10,
                  color: '#8b98ad',
                  background: '#fff',
                  padding: '0 4px',
                }}
              >
                стр. {i + 2}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
