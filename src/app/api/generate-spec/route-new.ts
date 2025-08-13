import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PageSpecSchema, CopySpecSchema } from '@/lib/schemas'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function callOpenRouter(messages: any[]) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
      'X-Title': 'AI Website Builder',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages,
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 4000,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

function createPrompt(userPrompt: string) {
  return `You are an expert website conversion specialist and landing page architect. Your role is to create high-converting, professional websites that drive business results.

MISSION: Transform the user's business concept into a conversion-optimized landing page that captures leads and drives sales.

CONTEXT: You're building for "${userPrompt}"

RESPONSE FORMAT: You must respond with ONLY a valid JSON object. No explanations, no markdown, no code blocks - just clean JSON.

=== CONVERSION PSYCHOLOGY PRINCIPLES ===
1. Address the primary pain point immediately in the headline
2. Build trust through social proof and testimonials
3. Create urgency with clear value propositions
4. Guide visitors through a logical conversion funnel
5. Use benefit-focused copy, not feature-focused
6. Include strong, action-oriented CTAs

=== SECTION STRATEGY ===
Choose 4-6 sections that create a complete conversion funnel:

HERO SECTION (Required first)
- Grab attention with pain point + solution
- Include compelling value proposition
- Strong primary CTA above the fold
- Variants: "centered", "image-left", "image-right"

SOCIAL PROOF (Recommended early)
- Build immediate credibility
- Variants: "logos" (for B2B), "testimonials" (for B2C), "stats" (for data-driven)

FEATURES/BENEFITS (Core value)
- FeaturesGrid: 2-3 columns, focus on benefits not features
- Transform features into customer outcomes

TRUST BUILDERS (Choose based on business type)
- Steps: For process-driven services
- FAQ: For complex products or services
- More testimonials: For relationship-based businesses

CONVERSION CATALYST (Required before footer)
- CTA: "centered" for single focus, "split" for dual offers
- Create urgency and remove friction

FOOTER (Always last)
- Professional closing with essential links

=== COPY GUIDELINES ===
- Headlines: Start with customer problem/desire, not product name
- Subheads: Quantify benefits where possible (save 5 hours/week, 3x faster, etc.)
- CTAs: Use action verbs + value (Get Free Audit, Start Saving Today)
- Social proof: Specific numbers and relatable customer stories
- Features: Format as customer benefits (Instead of "Real-time analytics" → "See exactly which campaigns drive revenue")

=== VISUAL STRATEGY ===
- Images should show the product in use or desired outcomes
- Use professional, high-quality imagery that supports the narrative
- Ensure visual hierarchy supports the conversion flow

=== SCHEMA REQUIREMENTS ===
{
  "pageSpec": {
    "meta": {
      "title": "Primary Keyword + Benefit + CTA (under 60 chars)",
      "description": "Value prop + social proof + CTA (under 155 chars)"
    },
    "sections": [
      {
        "id": "hero1",
        "type": "Hero",
        "variant": "centered|image-left|image-right"
      },
      // 3-5 more sections creating conversion funnel
      {
        "id": "footer1",
        "type": "Footer"
      }
    ],
    "images": {
      "sectionId": {
        "query": "specific, professional image description",
        "orientation": "landscape|portrait"
      }
    }
  },
  "copySpec": {
    "hero1": {
      "headline": "Problem/Desire + Solution + Benefit",
      "subhead": "Supporting detail with quantified benefit",
      "primaryCta": "Action + Value (Get, Start, Join, etc.)",
      "secondaryCta": "Lower-commitment option (Learn More, See Demo)"
    },
    "features1": [
      {
        "title": "Benefit-focused title",
        "desc": "How this specifically helps the customer achieve their goal"
      }
    ],
    "socialproof1": {
      "headline": "Social proof headline (Join 10,000+ customers)",
      "testimonials": [
        {
          "quote": "Specific, credible result or transformation",
          "author": "Real Name",
          "title": "Job Title, Company"
        }
      ]
    }
  },
  "themeTokens": {
    "colors": {
      "primary": "Brand color that converts (blues for trust, greens for growth)",
      "accent": "Supporting color for highlights",
      "neutral": "Professional text color"
    },
    "fonts": {
      "heading": "Professional, readable font (Inter, Roboto, Poppins)",
      "body": "Clean, scannable font (Inter, Open Sans, Source Sans)"
    },
    "radius": "lg|md|sm for modern feel"
  }
}

FINAL CHECK:
✓ Does the headline address a real pain point?
✓ Is the value proposition clear and quantified?
✓ Does each section move toward conversion?
✓ Are CTAs action-oriented and benefit-focused?
✓ Does social proof feel authentic and relatable?
✓ Is the visual narrative compelling and professional?

Now create a high-converting landing page for: "${userPrompt}"`
}

export async function POST(request: NextRequest) {
  try {
    const { prompt: userPrompt } = await request.json()

    if (!userPrompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Call OpenRouter API with improved prompt
    const messages = [
      {
        role: 'system',
        content: 'You are an expert website conversion specialist. Generate high-converting landing pages that drive business results. Always respond with valid JSON only.'
      },
      {
        role: 'user',
        content: createPrompt(userPrompt)
      }
    ]

    const aiResponse = await callOpenRouter(messages)

    // Parse the AI response
    let parsedResponse
    try {
      parsedResponse = JSON.parse(aiResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse)
      throw new Error('AI returned invalid JSON')
    }

    // Validate the response structure
    const pageSpecValidation = PageSpecSchema.safeParse(parsedResponse.pageSpec)
    const copySpecValidation = CopySpecSchema.safeParse(parsedResponse.copySpec)

    if (!pageSpecValidation.success) {
      console.error('PageSpec validation errors:', pageSpecValidation.error)
      throw new Error('Invalid pageSpec structure')
    }

    if (!copySpecValidation.success) {
      console.error('CopySpec validation errors:', copySpecValidation.error)
      throw new Error('Invalid copySpec structure')
    }

    // Generate unique page ID
    const pageId = `page-${Date.now()}`

    // Store in Supabase
    const { error: insertError } = await supabase
      .from('pages')
      .insert({
        id: pageId,
        page_spec: parsedResponse.pageSpec,
        copy_spec: parsedResponse.copySpec,
        theme_tokens: parsedResponse.themeTokens,
        user_prompt: userPrompt,
        created_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('Supabase insert error:', insertError)
      throw new Error('Failed to store page in database')
    }

    return NextResponse.json({
      success: true,
      pageId,
      pageSpec: parsedResponse.pageSpec,
      copySpec: parsedResponse.copySpec,
      themeTokens: parsedResponse.themeTokens
    })

  } catch (error) {
    console.error('API route error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate website',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}
