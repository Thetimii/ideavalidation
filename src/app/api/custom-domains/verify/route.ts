import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
)

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    // Get verification token for this domain
    const { data: verification, error: verificationError } = await supabase
      .from('domain_verification')
      .select('verification_token, page_id')
      .eq('domain', domain)
      .single()

    if (verificationError || !verification) {
      return NextResponse.json({ error: 'Domain verification record not found' }, { status: 404 })
    }

    // Verify DNS TXT record
    try {
      // In a real implementation, you would use DNS lookup APIs
      // For now, we'll simulate verification
      const dnsVerified = await verifyDNSRecord(domain, verification.verification_token)
      
      if (!dnsVerified) {
        return NextResponse.json({ 
          error: 'DNS verification failed',
          details: 'TXT record not found or incorrect value'
        }, { status: 400 })
      }

      // Update verification status
      const { error: updateError } = await supabase
        .from('domain_verification')
        .update({ verified_at: new Date().toISOString() })
        .eq('domain', domain)

      if (updateError) {
        console.error('Update verification error:', updateError)
        return NextResponse.json({ error: 'Failed to update verification' }, { status: 500 })
      }

      // Update custom domain status
      const { error: domainUpdateError } = await supabase
        .from('custom_domains')
        .update({ 
          verified: true,
          dns_configured: true 
        })
        .eq('domain', domain)

      if (domainUpdateError) {
        console.error('Update domain error:', domainUpdateError)
        return NextResponse.json({ error: 'Failed to update domain status' }, { status: 500 })
      }

      // Update page with custom domain
      const { error: pageUpdateError } = await supabase
        .from('pages')
        .update({ custom_domain: domain })
        .eq('id', verification.page_id)

      if (pageUpdateError) {
        console.error('Update page error:', pageUpdateError)
        return NextResponse.json({ error: 'Failed to update page domain' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        domain,
        verified: true,
        message: 'Domain successfully verified and configured'
      })

    } catch (dnsError) {
      console.error('DNS verification error:', dnsError)
      return NextResponse.json({ 
        error: 'DNS verification failed',
        details: 'Unable to verify DNS records'
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Domain verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Simulate DNS verification (in production, use real DNS lookup)
async function verifyDNSRecord(domain: string, expectedToken: string): Promise<boolean> {
  // In production, you would use dns.resolveTxt() or a service like:
  // - Google DNS API
  // - Cloudflare DNS API  
  // - DNS-over-HTTPS
  
  // For demo purposes, we'll return true
  // This should check for TXT record at _ai-website-builder-verify.domain.com
  console.log(`Verifying DNS for ${domain} with token ${expectedToken}`)
  
  // Simulate verification delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In real implementation:
  // const records = await dns.resolveTxt(`_ai-website-builder-verify.${domain}`)
  // return records.some(record => record.includes(expectedToken))
  
  return true // Simulate successful verification
}
