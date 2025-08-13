import React from 'react'
import { Button } from '@/components/ui/button'
import { CTACopy, ThemeTokens } from '@/lib/schemas'
import { cn } from '@/lib/utils'

interface CTAProps {
  variant?: 'card' | 'banner'
  content: CTACopy
  tokens: ThemeTokens
}

export function CTA({ variant = 'card', content, tokens }: CTAProps) {
  if (variant === 'banner') {
    return (
      <section 
        className="py-20 px-4"
        style={{ backgroundColor: `${tokens.colors.primary}10` }}
      >
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ 
                fontFamily: tokens.fonts.heading,
                color: tokens.colors.neutral 
              }}
            >
              {content.headline}
            </h2>
            {content.subhead && (
              <p 
                className="text-lg mb-8"
                style={{ 
                  fontFamily: tokens.fonts.body,
                  color: `${tokens.colors.neutral}cc` 
                }}
              >
                {content.subhead}
              </p>
            )}
            <Button
              size="lg"
              style={{ 
                backgroundColor: tokens.colors.primary,
                borderRadius: tokens.radius 
              }}
            >
              {content.cta}
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto">
          <div 
            className="rounded-2xl p-12 text-center shadow-xl"
            style={{ 
              backgroundColor: `${tokens.colors.primary}05`,
              border: `1px solid ${tokens.colors.primary}20`,
              borderRadius: tokens.radius 
            }}
          >
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ 
                fontFamily: tokens.fonts.heading,
                color: tokens.colors.neutral 
              }}
            >
              {content.headline}
            </h2>
            {content.subhead && (
              <p 
                className="text-lg mb-8"
                style={{ 
                  fontFamily: tokens.fonts.body,
                  color: `${tokens.colors.neutral}cc` 
                }}
              >
                {content.subhead}
              </p>
            )}
            <Button
              size="lg"
              style={{ 
                backgroundColor: tokens.colors.primary,
                borderRadius: tokens.radius 
              }}
            >
              {content.cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
