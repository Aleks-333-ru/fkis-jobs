import type { ResumeData, ResumeSettings } from '../../types/resume'
import { FONTS } from '../../utils/fonts'
import { THEMES } from '../../utils/themes'
import { getTemplate } from '../Templates'

interface Props {
  data: ResumeData
  settings: ResumeSettings
}

/**
 * Единственное место, где выбирается шаблон.
 * Здесь же задаются шрифт и базовый кегль — шаблоны их не дублируют.
 */
export default function TemplateRenderer({ data, settings }: Props) {
  const { component: Template } = getTemplate(settings.template)
  const theme = THEMES[settings.theme]

  return (
    <div
      style={{
        fontFamily: FONTS[settings.font].stack,
        fontSize: settings.compact ? 12.2 : 13.2,
        lineHeight: settings.compact ? 1.38 : 1.5,
        color: '#1c2434',
        height: '100%',
      }}
    >
      <Template data={data} settings={settings} theme={theme} />
    </div>
  )
}
