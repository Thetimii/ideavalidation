import React from 'react'
import { FAQItem, ThemeTokens } from '@/lib/schemas'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'

interface FAQProps {
  items: FAQItem[]
  tokens: ThemeTokens
}

export function FAQ({ items, tokens }: FAQProps) {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto">
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ 
              fontFamily: tokens.fonts.heading,
              color: tokens.colors.neutral 
            }}
          >
            Frequently Asked Questions
          </h2>
          
          <Accordion.Root type="single" collapsible className="space-y-4">
            {items.map((item, index) => (
              <Accordion.Item 
                key={index}
                value={`item-${index}`}
                className="border rounded-lg overflow-hidden"
                style={{ 
                  borderColor: `${tokens.colors.neutral}20`,
                  borderRadius: tokens.radius 
                }}
              >
                <Accordion.Trigger className="flex justify-between items-center w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                  <span 
                    className="font-semibold"
                    style={{ 
                      fontFamily: tokens.fonts.heading,
                      color: tokens.colors.neutral 
                    }}
                  >
                    {item.q}
                  </span>
                  <ChevronDown 
                    className="w-5 h-5 transition-transform duration-200 data-[state=open]:rotate-180"
                    style={{ color: tokens.colors.neutral }}
                  />
                </Accordion.Trigger>
                <Accordion.Content className="px-6 pb-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                  <p 
                    className="leading-relaxed"
                    style={{ 
                      fontFamily: tokens.fonts.body,
                      color: `${tokens.colors.neutral}cc` 
                    }}
                  >
                    {item.a}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </section>
  )
}
