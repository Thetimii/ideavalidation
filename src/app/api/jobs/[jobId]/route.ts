import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    // Get job status
    const { data: job, error: jobError } = await supabase
      .from('generation_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Get recent updates for this job
    const { data: updates, error: updatesError } = await supabase
      .from('job_updates')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (updatesError) {
      console.error('Updates fetch error:', updatesError)
    }

    return NextResponse.json({
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      result: job.result,
      pageId: job.page_id,
      errorMessage: job.error_message,
      createdAt: job.created_at,
      updatedAt: job.updated_at,
      completedAt: job.completed_at,
      updates: updates || []
    })

  } catch (error) {
    console.error('Job status error:', error)
    return NextResponse.json({
      error: 'Failed to get job status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
