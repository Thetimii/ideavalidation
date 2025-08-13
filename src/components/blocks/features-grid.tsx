import React from 'react'
import { FeatureItem, ThemeTokens } from '@/lib/schemas'
import { cn } from '@/lib/utils'

interface FeaturesGridProps {
  columns?: 2 | 3 | 4
  items: FeatureItem[]
  tokens: ThemeTokens
}

export function FeaturesGrid({ columns = 3, items, tokens }: FeaturesGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className={cn("grid gap-8", gridCols[columns])}>
          {items.map((item, index) => (
            <div 
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-200"
            >
              {item.iconKey && (
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${tokens.colors.primary}20`,
                    borderRadius: tokens.radius 
                  }}
                >
                  <div 
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: tokens.colors.primary }}
                  />
                </div>
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
    </section>
  )
}
