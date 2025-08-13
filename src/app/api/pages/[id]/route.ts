import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: page, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', id)
      .eq('published', true)
      .single()

    if (error || !page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    return NextResponse.json({
      pageSpec: page.page_spec,
      copySpec: page.copy_spec,
      themeTokens: page.tokens,
    })

  } catch (error) {
    console.error('Get page error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
