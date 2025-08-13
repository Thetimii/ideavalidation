import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
)

export async function POST(request: NextRequest) {
  try {
    const { pageId, domain } = await request.json()

    if (!pageId || !domain) {
      return NextResponse.json({ error: 'Page ID and domain are required' }, { status: 400 })
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
    if (!domainRegex.test(domain)) {
      return NextResponse.json({ error: 'Invalid domain format' }, { status: 400 })
    }

    // Check if domain is already taken
    const { data: existingDomain } = await supabase
      .from('custom_domains')
      .select('id')
      .eq('domain', domain)
      .single()

    if (existingDomain) {
      return NextResponse.json({ error: 'Domain already in use' }, { status: 409 })
    }

    // Generate verification token
    const verificationToken = `ai-website-builder-verify-${Math.random().toString(36).substring(2, 15)}`

    // Insert domain verification record
    const { error: verificationError } = await supabase
      .from('domain_verification')
      .insert({
        domain,
        verification_token: verificationToken,
        page_id: pageId
      })

    if (verificationError) {
      console.error('Verification insert error:', verificationError)
      return NextResponse.json({ error: 'Failed to create domain verification' }, { status: 500 })
    }

    // Insert custom domain record
    const { error: domainError } = await supabase
      .from('custom_domains')
      .insert({
        page_id: pageId,
        domain,
        verified: false
      })

    if (domainError) {
      console.error('Domain insert error:', domainError)
      return NextResponse.json({ error: 'Failed to create custom domain' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      domain,
      verificationToken,
      instructions: {
        step1: `Add a TXT record to your domain's DNS:`,
        record: {
          type: 'TXT',
          name: '_ai-website-builder-verify',
          value: verificationToken
        },
        step2: `Add a CNAME record pointing to your app:`,
        cname: {
          type: 'CNAME', 
          name: domain.split('.')[0], // subdomain
          value: `${process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '').replace('http://', '')}`
        },
        step3: `Call the verification endpoint to confirm setup`
      }
    })

  } catch (error) {
    console.error('Custom domain setup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const pageId = url.searchParams.get('pageId')

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    const { data: domains, error } = await supabase
      .from('custom_domains')
      .select('*')
      .eq('page_id', pageId)

    if (error) {
      console.error('Fetch domains error:', error)
      return NextResponse.json({ error: 'Failed to fetch domains' }, { status: 500 })
    }

    return NextResponse.json({ domains })

  } catch (error) {
    console.error('Get domains error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
