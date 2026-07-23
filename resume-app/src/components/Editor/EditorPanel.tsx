import AboutCard from './AboutCard'
import BasicInfoCard from './BasicInfoCard'
import ContactsCard from './ContactsCard'
import CustomSectionsCard from './CustomSectionsCard'
import {
  CertificatesCard,
  CoursesCard,
  EducationCard,
  ExperienceCard,
  LanguagesCard,
  ProjectsCard,
  SkillsCard,
} from './ListSections'
import SectionsCard from './SectionsCard'

/** Левая панель: все карточки редактора сверху вниз. */
export default function EditorPanel() {
  return (
    <div className="space-y-3">
      <BasicInfoCard />
      <ContactsCard />
      <AboutCard />
      <ExperienceCard />
      <EducationCard />
      <CoursesCard />
      <SkillsCard />
      <LanguagesCard />
      <CertificatesCard />
      <ProjectsCard />
      <CustomSectionsCard />
      <SectionsCard />
    </div>
  )
}
