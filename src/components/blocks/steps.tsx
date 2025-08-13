import React from 'react'
import { StepItem, ThemeTokens } from '@/lib/schemas'

interface StepsProps {
  items: StepItem[]
  tokens: ThemeTokens
}

export function Steps({ items, tokens }: StepsProps) {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ 
              fontFamily: tokens.fonts.heading,
              color: tokens.colors.neutral 
            }}
          >
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.map((item, index) => (
              <div key={index} className="relative text-center">
                {/* Step number */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10"
                  style={{ 
                    backgroundColor: tokens.colors.primary,
                    borderRadius: tokens.radius 
                  }}
                >
                  <span 
                    className="text-white font-bold text-lg"
                    style={{ fontFamily: tokens.fonts.heading }}
                  >
                    {index + 1}
                  </span>
                </div>
                
                {/* Connecting line (except for last item) */}
                {index < items.length - 1 && (
                  <div 
                    className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 -translate-y-1/2 -z-10"
                    style={{ 
                      backgroundColor: `${tokens.colors.primary}30`,
                      marginLeft: '24px',
                      width: 'calc(100% - 48px)'
                    }}
                  />
                )}
                
                <h3 
                  className="text-xl font-semibold mb-3"
                  style={{ 
                    fontFamily: tokens.fonts.heading,
                    color: tokens.colors.neutral 
                  }}
                >
                  {item.title}
                </h3>
                <p 
                  className="text-base leading-relaxed"
                  style={{ 
                    fontFamily: tokens.fonts.body,
                    color: `${tokens.colors.neutral}cc` 
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
