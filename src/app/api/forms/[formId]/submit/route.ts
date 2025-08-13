import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    const { formId } = params
    const { email, pageId, utm } = await request.json()

    if (!email || !pageId) {
      return NextResponse.json({ error: 'Email and pageId are required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Save lead to database
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        page_id: pageId,
        email,
        utm: utm || null,
      })
      .select()
      .single()

    if (leadError) {
      console.error('Database error:', leadError)
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
    }

    // Send confirmation email
    try {
      await resend.emails.send({
        from: 'AI Website Builder <no-reply@yourdomain.com>',
        to: [email],
        subject: 'Welcome to our waitlist!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; text-align: center;">Thank you for joining our waitlist!</h1>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              We've received your interest and will keep you updated on our progress.
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              You'll be among the first to know when we launch!
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 14px;">
                AI Website Builder Team
              </p>
            </div>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the request if email fails
    }

    // Record analytics event
    await supabase
      .from('analytics_events')
      .insert({
        page_id: pageId,
        type: 'lead',
        meta: { formId, email },
      })

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
