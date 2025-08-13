import React from 'react'
import { Quote, ThemeTokens } from '@/lib/schemas'

interface SocialProofProps {
  variant?: 'logos' | 'quotes'
  content: {
    logos?: string[]
    quotes?: Quote[]
  }
  tokens: ThemeTokens
}

export function SocialProof({ variant = 'logos', content, tokens }: SocialProofProps) {
  if (variant === 'quotes' && content.quotes) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <h2 
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              style={{ 
                fontFamily: tokens.fonts.heading,
                color: tokens.colors.neutral 
              }}
            >
              What Our Customers Say
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.quotes.map((quote, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl border"
                  style={{ 
                    borderColor: `${tokens.colors.neutral}20`,
                    borderRadius: tokens.radius 
                  }}
                >
                  <blockquote 
                    className="text-lg mb-4"
                    style={{ 
                      fontFamily: tokens.fonts.body,
                      color: tokens.colors.neutral 
                    }}
                  >
                    "{quote.quote}"
                  </blockquote>
                  {quote.author && (
                    <cite 
                      className="text-sm font-medium not-italic"
                      style={{ 
                        fontFamily: tokens.fonts.heading,
                        color: `${tokens.colors.neutral}80` 
                      }}
                    >
                      — {quote.author}
                    </cite>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Logos variant
  if (content.logos) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h3 
              className="text-lg font-medium mb-8"
              style={{ 
                fontFamily: tokens.fonts.heading,
                color: `${tokens.colors.neutral}80` 
              }}
            >
              Trusted by leading companies
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
              {content.logos.map((logo, index) => (
                <div
                  key={index}
                  className="w-24 h-12 flex items-center justify-center p-2 rounded"
                  style={{ 
                    backgroundColor: `${tokens.colors.neutral}10`,
                    borderRadius: tokens.radius 
                  }}
                >
                  <span 
                    className="text-sm font-semibold"
                    style={{ 
                      fontFamily: tokens.fonts.heading,
                      color: `${tokens.colors.neutral}60` 
                    }}
                  >
                    {logo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return null
}
