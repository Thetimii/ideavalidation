import React from 'react'
import { Section, CopySpec, ThemeTokens, NormalizedPhoto } from '@/lib/schemas'
import { Hero } from './blocks/hero'
import { FeaturesGrid } from './blocks/features-grid'
import { SocialProof } from './blocks/social-proof'
import { Pricing } from './blocks/pricing'
import { Steps } from './blocks/steps'
import { FAQ } from './blocks/faq'
import { CTA } from './blocks/cta'
import { Footer } from './blocks/footer'

interface PageRendererProps {
  sections: Section[]
  copySpec: CopySpec
  tokens: ThemeTokens
  images?: Record<string, NormalizedPhoto>
}

export function PageRenderer({ sections, copySpec, tokens, images }: PageRendererProps) {
  const renderSection = (section: Section) => {
    const sectionCopy = copySpec[section.id]
    const sectionImage = images?.[section.id]

    switch (section.type) {
      case 'Hero':
        return (
          <Hero
            key={section.id}
            variant={section.variant}
            content={sectionCopy}
            tokens={tokens}
            image={sectionImage ? {
              src: sectionImage.src.large,
              alt: sectionImage.alt,
              width: sectionImage.width,
              height: sectionImage.height
            } : undefined}
          />
        )

      case 'FeaturesGrid':
        return (
          <FeaturesGrid
            key={section.id}
            columns={section.columns}
            items={sectionCopy || []}
            tokens={tokens}
          />
        )

      case 'SocialProof':
        return (
          <SocialProof
            key={section.id}
            variant={section.variant}
            content={sectionCopy || {}}
            tokens={tokens}
          />
        )

      case 'Pricing':
        return (
          <Pricing
            key={section.id}
            plans={sectionCopy?.plans || []}
            tokens={tokens}
            note={sectionCopy?.note}
          />
        )

      case 'Steps':
        return (
          <Steps
            key={section.id}
            items={sectionCopy || []}
            tokens={tokens}
          />
        )

      case 'FAQ':
        return (
          <FAQ
            key={section.id}
            items={sectionCopy || []}
            tokens={tokens}
          />
        )

      case 'CTA':
        return (
          <CTA
            key={section.id}
            variant={section.variant}
            content={sectionCopy}
            tokens={tokens}
          />
        )

      case 'Footer':
        return (
          <Footer
            key={section.id}
            content={sectionCopy}
            links={section.links}
            tokens={tokens}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen">
      {sections.map(renderSection)}
    </div>
  )
}
