import { z } from 'zod'

// Theme and brand schemas
export const BrandSchema = z.object({
  name: z.string(),
  tone: z.string(),
  palette: z.object({
    primary: z.string(),
    neutral: z.string(),
    accent: z.string(),
  }),
  fonts: z.object({
    heading: z.string(),
    body: z.string(),
  }),
  radius: z.enum(['sm', 'md', 'lg', 'xl', '2xl']),
})

// Section schemas
export const SectionSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string(),
    type: z.literal('Hero'),
    variant: z.enum(['image-left', 'image-right', 'centered']),
  }),
  z.object({
    id: z.string(),
    type: z.literal('FeaturesGrid'),
    columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional().default(3),
  }),
  z.object({
    id: z.string(),
    type: z.literal('SocialProof'),
    variant: z.enum(['logos', 'quotes']).optional().default('logos'),
  }),
  z.object({
    id: z.string(),
    type: z.literal('Pricing'),
  }),
  z.object({
    id: z.string(),
    type: z.literal('Steps'),
  }),
  z.object({
    id: z.string(),
    type: z.literal('FAQ'),
  }),
  z.object({
    id: z.string(),
    type: z.literal('CTA'),
    variant: z.enum(['card', 'banner']).optional().default('card'),
  }),
  z.object({
    id: z.string(),
    type: z.literal('Footer'),
    links: z.array(z.string()).optional(),
  }),
])

// Main PageSpec schema
export const PageSpecSchema = z.object({
  meta: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.string().default('en'),
  }),
  brand: BrandSchema,
  goals: z.array(z.enum(['collect-waitlist', 'pre-sell', 'book-calls'])),
  sections: z.array(SectionSchema).min(4).max(6),
  forms: z.array(z.object({
    id: z.string(),
    fields: z.array(z.string()),
    submitAction: z.string(),
  })).optional(),
  images: z.record(z.string(), z.object({
    query: z.string(),
    orientation: z.enum(['landscape', 'portrait']).optional().default('landscape'),
  })).optional(),
})

// CopySpec schemas
export const HeroCopySchema = z.object({
  eyebrow: z.string().optional(),
  headline: z.string(),
  subhead: z.string().optional(),
  primaryCta: z.string(),
  secondaryCta: z.string().optional(),
})

export const FeatureItemSchema = z.object({
  title: z.string(),
  desc: z.string(),
  iconKey: z.string().optional(),
})

export const PricingPlanSchema = z.object({
  name: z.string(),
  price: z.string(),
  period: z.string().optional(),
  features: z.array(z.string()),
  cta: z.string(),
})

export const QuoteSchema = z.object({
  quote: z.string(),
  author: z.string().optional(),
})

export const FAQItemSchema = z.object({
  q: z.string(),
  a: z.string(),
})

export const StepItemSchema = z.object({
  title: z.string(),
  desc: z.string(),
})

export const CTACopySchema = z.object({
  headline: z.string(),
  subhead: z.string().optional(),
  cta: z.string(),
})

export const FooterCopySchema = z.object({
  links: z.array(z.string()),
})

export const CopySpecSchema = z.record(z.string(), z.any()) // Flexible structure for copy content

// TypeScript types
export type PageSpec = z.infer<typeof PageSpecSchema>
export type CopySpec = z.infer<typeof CopySpecSchema>
export type Section = z.infer<typeof SectionSchema>
export type Brand = z.infer<typeof BrandSchema>
export type HeroCopy = z.infer<typeof HeroCopySchema>
export type FeatureItem = z.infer<typeof FeatureItemSchema>
export type PricingPlan = z.infer<typeof PricingPlanSchema>
export type Quote = z.infer<typeof QuoteSchema>
export type FAQItem = z.infer<typeof FAQItemSchema>
export type StepItem = z.infer<typeof StepItemSchema>
export type CTACopy = z.infer<typeof CTACopySchema>
export type FooterCopy = z.infer<typeof FooterCopySchema>

// Theme tokens type
export interface ThemeTokens {
  colors: {
    primary: string
    neutral: string
    accent: string
  }
  fonts: {
    heading: string
    body: string
  }
  radius: string
}

// Pexels API types
export interface NormalizedPhoto {
  id: string | number
  alt: string
  width: number
  height: number
  src: {
    tiny: string
    small: string
    medium: string
    large: string
    original: string
  }
  photographer: string
  photographer_url: string
  pexels_url: string
}
