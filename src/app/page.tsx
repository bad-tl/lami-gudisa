
import { Header } from "@/components/portfolio/header";
import { HeroVisual } from "@/components/portfolio/hero/hero-visual";
import { AboutSection } from "@/components/portfolio/about-section";
import { SkillsSection } from "@/components/portfolio/skills-section";
import { ExperienceSection } from "@/components/portfolio/experience-section";
import { EducationSection } from "@/components/portfolio/education-section";

import { getPublishedSkills } from "@/lib/public/skills";
import { getPublishedEducations } from "@/lib/public/education";
import { getPublishedHero } from "@/lib/public/hero";
import { getPublishedAbout } from "@/lib/public/about";
import { getPublishedExperiences } from "@/lib/public/experience";
import { getPublishedGalleryItems } from "@/lib/public/gallery";
import { getFeaturedCertificate } from "@/lib/public/certificates";
import { getPublicContactData } from "@/lib/public/contact";

import { GalleryPreview } from "@/components/public/gallery/gallery-preview";
import { CertificatesPreview } from "@/components/public/certificates/certificates-preview";
import ContactSection from "@/components/public/contact/contact-section";
import Footer from "@/components/public/footer/footer";

export default async function Home() {
  const galleryItems = await getPublishedGalleryItems();

  const featuredGalleryItem = galleryItems[0] ?? null;

  const featuredCertificate = await getFeaturedCertificate();

  const contactData = await getPublicContactData();

  const [hero, about, experiences, educations, skills] =
    await Promise.all([
      getPublishedHero(),
      getPublishedAbout(),
      getPublishedExperiences(),
      getPublishedEducations(),
      getPublishedSkills(),
    ]);

  return (
    <main id="home">
      <Header />

      {hero && (
        <HeroVisual
          eyebrow={hero.eyebrow}
          name={hero.name}
          title={hero.title}
          headline={hero.headline}
          description={hero.description}
          imageUrl={hero.imageUrl}
          primaryButtonText={hero.primaryButtonText}
          primaryButtonUrl={hero.primaryButtonUrl}
          secondaryButtonText={hero.secondaryButtonText}
          secondaryButtonUrl={hero.secondaryButtonUrl}
        />
      )}

      {about && <AboutSection about={about} />}

      <ExperienceSection experiences={experiences} />

      <EducationSection educations={educations} />

      <SkillsSection skills={skills} />

      <GalleryPreview item={featuredGalleryItem} />

      <CertificatesPreview certificate={featuredCertificate} />

      <ContactSection data={contactData} />

      <Footer data={contactData} />
    </main>
  );
}

