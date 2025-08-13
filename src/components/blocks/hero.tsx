import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { HeroCopy, ThemeTokens } from '@/lib/schemas'
import { cn } from '@/lib/utils'

interface HeroProps {
  variant: 'image-left' | 'image-right' | 'centered'
  content: HeroCopy
  tokens: ThemeTokens
  image?: {
    src: string
    alt: string
    width: number
    height: number
  }
}

export function Hero({ variant, content, tokens, image }: HeroProps) {
  // Ensure we have content with fallbacks
  const heroContent = {
    headline: content?.headline || 'Welcome to Our Service',
    subhead: content?.subhead || 'Discover something amazing',
    primaryCta: content?.primaryCta || 'Get Started',
    secondaryCta: content?.secondaryCta || 'Learn More',
    eyebrow: content?.eyebrow
  }
  
  return (
    <section className="py-16 lg:py-24 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto max-w-7xl">
        {variant === 'centered' ? (
          <div className="max-w-4xl mx-auto text-center">
            {heroContent.eyebrow && (
              <div 
                className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm"
                style={{ 
                  backgroundColor: tokens.colors.primary,
                  color: 'white'
                }}
              >
                {heroContent.eyebrow}
              </div>
            )}
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{ 
                fontFamily: tokens.fonts.heading,
                color: tokens.colors.neutral 
              }}
            >
              {heroContent.headline}
            </h1>
            {heroContent.subhead && (
              <p 
                className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed"
                style={{ 
                  fontFamily: tokens.fonts.body,
                  color: '#6B7280'
                }}
              >
                {heroContent.subhead}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                className="px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                style={{ 
                  backgroundColor: tokens.colors.primary,
                  color: 'white',
                  borderRadius: tokens.radius 
                }}
              >
                {heroContent.primaryCta}
              </button>
              {heroContent.secondaryCta && (
                <button
                  className="px-8 py-4 text-lg font-semibold rounded-lg border-2 hover:shadow-lg transition-all duration-200"
                  style={{ 
                    borderColor: tokens.colors.primary,
                    color: tokens.colors.primary,
                    borderRadius: tokens.radius 
                  }}
                >
                  {heroContent.secondaryCta}
                </button>
              )}
            </div>
            {image && (
              <div className="mt-12">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="rounded-xl shadow-2xl mx-auto max-w-full h-auto"
                  style={{ borderRadius: tokens.radius }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={cn(
              "space-y-8",
              variant === 'image-left' && "lg:order-2",
              variant === 'image-right' && "lg:order-1"
            )}>
              {heroContent.eyebrow && (
                <div 
                  className="inline-block px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
                  style={{ 
                    backgroundColor: tokens.colors.primary,
                    color: 'white'
                  }}
                >
                  {heroContent.eyebrow}
                </div>
              )}
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                style={{ 
                  fontFamily: tokens.fonts.heading,
                  color: tokens.colors.neutral 
                }}
              >
                {heroContent.headline}
              </h1>
              {heroContent.subhead && (
                <p 
                  className="text-lg md:text-xl leading-relaxed"
                  style={{ 
                    fontFamily: tokens.fonts.body,
                    color: '#6B7280'
                  }}
                >
                  {heroContent.subhead}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  style={{ 
                    backgroundColor: tokens.colors.primary,
                    color: 'white',
                    borderRadius: tokens.radius 
                  }}
                >
                  {heroContent.primaryCta}
                </button>
                {heroContent.secondaryCta && (
                  <button
                    className="px-8 py-4 text-lg font-semibold rounded-lg border-2 hover:shadow-lg transition-all duration-200"
                    style={{ 
                      borderColor: tokens.colors.primary,
                      color: tokens.colors.primary,
                      borderRadius: tokens.radius 
                    }}
                  >
                    {heroContent.secondaryCta}
                  </button>
                )}
              </div>
            </div>
            
            {image && (
              <div className={cn(
                "relative",
                variant === 'image-left' && "lg:order-1",
                variant === 'image-right' && "lg:order-2"
              )}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="rounded-xl shadow-2xl w-full h-auto object-cover"
                  style={{ borderRadius: tokens.radius }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
