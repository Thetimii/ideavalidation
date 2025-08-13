import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PageSpecSchema, CopySpecSchema } from '@/lib/schemas'

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
)

async function callOpenRouter(messages: any[]) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout
  
  try {
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
        temperature: 0.7, // Slightly lower for faster response
        max_tokens: 3000, // Reduced for faster generation
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
    
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('AI request timed out - please try again')
    }
    throw error
  }
}

function createPrompt(userPrompt: string) {
  return `You are an expert website conversion specialist. Create a high-converting landing page for: "${userPrompt}"

CRITICAL: You must respond with ONLY valid JSON. No explanations, no markdown, no code blocks - just the JSON object.

Required JSON structure:
{
  "pageSpec": {
    "meta": {
      "title": "SEO-optimized title under 60 chars",
      "description": "Meta description under 155 chars",
      "locale": "en"
    },
    "brand": {
      "name": "Business/product name from the prompt",
      "tone": "professional|friendly|bold|elegant",
      "palette": {
        "primary": "#3B82F6",
        "neutral": "#374151", 
        "accent": "#10B981"
      },
      "fonts": {
        "heading": "Inter|Poppins|Roboto",
        "body": "Inter|Open Sans|Source Sans Pro"
      },
      "radius": "sm|md|lg|xl|2xl"
    },
    "goals": ["collect-waitlist"],
    "sections": [
      {
        "id": "hero1",
        "type": "Hero",
        "variant": "centered"
      },
      {
        "id": "features1", 
        "type": "FeaturesGrid",
        "columns": 3
      },
      {
        "id": "socialproof1",
        "type": "SocialProof",
        "variant": "quotes"
      },
      {
        "id": "cta1",
        "type": "CTA",
        "variant": "card"
      },
      {
        "id": "footer1",
        "type": "Footer"
      }
    ],
    "images": {
      "hero1": {
        "query": "professional hero image description",
        "orientation": "landscape"
      }
    }
  },
  "copySpec": {
    "hero1": {
      "headline": "Compelling headline addressing customer pain point",
      "subhead": "Supporting subheading with benefits",
      "primaryCta": "Get Started Free",
      "secondaryCta": "Learn More"
    },
    "features1": [
      {
        "title": "Key Benefit 1",
        "desc": "Description of how this helps customers"
      },
      {
        "title": "Key Benefit 2", 
        "desc": "Description of how this helps customers"
      },
      {
        "title": "Key Benefit 3",
        "desc": "Description of how this helps customers"
      }
    ],
    "socialproof1": [
      {
        "quote": "Authentic customer testimonial",
        "author": "Customer Name"
      }
    ],
    "cta1": {
      "headline": "Ready to get started?",
      "subhead": "Join thousands of satisfied customers",
      "cta": "Start Your Free Trial"
    },
    "footer1": {
      "links": ["Privacy", "Terms", "Contact"]
    }
  },
  "themeTokens": {
    "colors": {
      "primary": "#3B82F6",
      "neutral": "#374151",
      "accent": "#10B981"
    },
    "fonts": {
      "heading": "Inter",
      "body": "Inter"
    },
    "radius": "lg"
  }
}

Generate this exact structure for: "${userPrompt}"`
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

    // Store in Supabase (simplified approach without projects for now)
    const { error: insertError } = await supabase
      .from('pages')
      .insert({
        slug: pageId,
        page_spec: parsedResponse.pageSpec,
        copy_spec: parsedResponse.copySpec,
        tokens: parsedResponse.themeTokens,
        published: true,
        project_id: null // Allow null for generated pages without projects
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
