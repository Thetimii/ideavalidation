import React from 'react'
import { FooterCopy, ThemeTokens } from '@/lib/schemas'

interface FooterProps {
  content?: FooterCopy
  links?: string[]
  tokens: ThemeTokens
}

export function Footer({ content, links, tokens }: FooterProps) {
  const footerLinks = content?.links || links || ['Privacy', 'Terms', 'Contact']

  return (
    <footer 
      className="py-12 px-4 border-t"
      style={{ borderColor: `${tokens.colors.neutral}20` }}
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div 
            className="text-sm"
            style={{ 
              fontFamily: tokens.fonts.body,
              color: `${tokens.colors.neutral}80` 
            }}
          >
            © 2024 AI Website Builder. All rights reserved.
          </div>
          <div className="flex space-x-6">
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href={`#${link.toLowerCase()}`}
                className="text-sm hover:underline transition-colors"
                style={{ 
                  fontFamily: tokens.fonts.body,
                  color: `${tokens.colors.neutral}80` 
                }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
