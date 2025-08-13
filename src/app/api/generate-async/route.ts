import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
)

export async function POST(request: NextRequest) {
  try {
    const { prompt: userPrompt } = await request.json()

    if (!userPrompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Create a new job record
    const { data: job, error: jobError } = await supabase
      .from('generation_jobs')
      .insert({
        user_prompt: userPrompt,
        status: 'pending',
        progress: {
          step: 'initializing',
          message: 'Preparing AI generation...',
          progress_percent: 0
        }
      })
      .select()
      .single()

    if (jobError || !job) {
      console.error('Job creation error:', jobError)
      return NextResponse.json({ error: 'Failed to create generation job' }, { status: 500 })
    }

    // Start the async generation process (no await - fire and forget)
    processGenerationJob(job.id, userPrompt).catch(error => {
      console.error('Async job processing error:', error)
      // Update job with error
      supabase.rpc('complete_job', {
        job_id_param: job.id,
        error_message_param: error.message || 'Unknown error occurred'
      })
    })

    // Return immediately with job ID
    return NextResponse.json({
      success: true,
      jobId: job.id,
      status: 'started',
      message: 'Generation started! Use the job ID to track progress.'
    })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json({
      error: 'Failed to start generation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Async function to process the generation job
async function processGenerationJob(jobId: string, userPrompt: string) {
  try {
    // Step 1: Update progress
    await supabase.rpc('update_job_progress', {
      job_id_param: jobId,
      step_param: 'analyzing',
      message_param: 'Analyzing your business requirements...',
      progress_percent_param: 10
    })

    // Step 2: Prepare AI prompt
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate processing
    await supabase.rpc('update_job_progress', {
      job_id_param: jobId,
      step_param: 'generating',
      message_param: 'Generating website content with AI...',
      progress_percent_param: 30
    })

    // Step 3: Call AI API
    const aiResponse = await callOpenRouterAsync(userPrompt)
    
    await supabase.rpc('update_job_progress', {
      job_id_param: jobId,
      step_param: 'processing',
      message_param: 'Processing AI response...',
      progress_percent_param: 60
    })

    // Step 4: Parse and validate response
    let parsedResponse
    try {
      parsedResponse = JSON.parse(aiResponse)
    } catch (parseError) {
      throw new Error('AI returned invalid JSON')
    }

    await supabase.rpc('update_job_progress', {
      job_id_param: jobId,
      step_param: 'validating',
      message_param: 'Validating website structure...',
      progress_percent_param: 70
    })

    // Step 5: Validate schemas (import them here to avoid top-level imports)
    const { PageSpecSchema, CopySpecSchema } = await import('@/lib/schemas')
    
    const pageSpecValidation = PageSpecSchema.safeParse(parsedResponse.pageSpec)
    const copySpecValidation = CopySpecSchema.safeParse(parsedResponse.copySpec)

    if (!pageSpecValidation.success || !copySpecValidation.success) {
      throw new Error('Generated content failed validation')
    }

    await supabase.rpc('update_job_progress', {
      job_id_param: jobId,
      step_param: 'saving',
      message_param: 'Saving your website...',
      progress_percent_param: 85
    })

    // Step 6: Generate page ID and save to database
    const pageId = `page-${Date.now()}`

    const { error: insertError } = await supabase
      .from('pages')
      .insert({
        slug: pageId,
        page_spec: parsedResponse.pageSpec,
        copy_spec: parsedResponse.copySpec,
        tokens: parsedResponse.themeTokens,
        published: true,
        project_id: null
      })

    if (insertError) {
      throw new Error('Failed to save website to database')
    }

    await supabase.rpc('update_job_progress', {
      job_id_param: jobId,
      step_param: 'completed',
      message_param: 'Website ready! Redirecting...',
      progress_percent_param: 100
    })

    // Step 7: Complete the job
    await supabase.rpc('complete_job', {
      job_id_param: jobId,
      result_param: {
        pageSpec: parsedResponse.pageSpec,
        copySpec: parsedResponse.copySpec,
        themeTokens: parsedResponse.themeTokens
      },
      page_id_param: pageId
    })

  } catch (error) {
    console.error('Job processing error:', error)
    
    // Update with error
    await supabase.rpc('complete_job', {
      job_id_param: jobId,
      error_message_param: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// AI API call with longer timeout for async processing
async function callOpenRouterAsync(userPrompt: string) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout for async
  
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
        messages: [
          {
            role: 'system',
            content: 'You are an expert website conversion specialist. Generate high-converting landing pages that drive business results. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: createPrompt(userPrompt)
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 4000,
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
      throw new Error('AI request timed out - this usually means high demand. Please try again.')
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
