import React from 'react'
import { Button } from '@/components/ui/button'
import { PricingPlan, ThemeTokens } from '@/lib/schemas'
import { Check } from 'lucide-react'

interface PricingProps {
  plans: PricingPlan[]
  tokens: ThemeTokens
  note?: string
}

export function Pricing({ plans, tokens, note }: PricingProps) {
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
            Choose Your Plan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="relative border rounded-2xl p-8 hover:shadow-lg transition-shadow"
                style={{ 
                  borderColor: `${tokens.colors.neutral}20`,
                  borderRadius: tokens.radius 
                }}
              >
                <div className="text-center mb-6">
                  <h3 
                    className="text-xl font-semibold mb-2"
                    style={{ 
                      fontFamily: tokens.fonts.heading,
                      color: tokens.colors.neutral 
                    }}
                  >
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center">
                    <span 
                      className="text-4xl font-bold"
                      style={{ 
                        fontFamily: tokens.fonts.heading,
                        color: tokens.colors.primary 
                      }}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span 
                        className="text-sm ml-1"
                        style={{ 
                          fontFamily: tokens.fonts.body,
                          color: `${tokens.colors.neutral}80` 
                        }}
                      >
                        /{plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check 
                        className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0"
                        style={{ color: tokens.colors.primary }}
                      />
                      <span 
                        className="text-sm"
                        style={{ 
                          fontFamily: tokens.fonts.body,
                          color: tokens.colors.neutral 
                        }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  size="lg"
                  style={{ 
                    backgroundColor: tokens.colors.primary,
                    borderRadius: tokens.radius 
                  }}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>

          {note && (
            <p 
              className="text-center text-sm mt-8"
              style={{ 
                fontFamily: tokens.fonts.body,
                color: `${tokens.colors.neutral}80` 
              }}
            >
              {note}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
