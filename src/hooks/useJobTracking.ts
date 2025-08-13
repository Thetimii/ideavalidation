'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

interface JobProgress {
  step: string
  message: string
  progress_percent?: number
}

interface GenerationJob {
  jobId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: JobProgress
  result?: any
  pageId?: string
  errorMessage?: string
  updates: Array<{
    step: string
    message: string
    progress_percent: number
    created_at: string
  }>
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function useJobTracking(jobId: string | null) {
  const [job, setJob] = useState<GenerationJob | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchJobStatus = useCallback(async () => {
    if (!jobId) return

    try {
      const response = await fetch(`/api/jobs/${jobId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch job status')
      }

      setJob(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch job status')
    }
  }, [jobId])

  // Set up real-time subscription
  useEffect(() => {
    if (!jobId) return

    // Initial fetch
    fetchJobStatus()

    // Subscribe to job updates
    const jobUpdatesSubscription = supabase
      .channel('job_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'job_updates',
          filter: `job_id=eq.${jobId}`
        },
        (payload) => {
          console.log('Real-time job update:', payload.new)
          // Refresh job status when new update comes in
          fetchJobStatus()
        }
      )
      .subscribe()

    // Subscribe to job status changes
    const jobStatusSubscription = supabase
      .channel('generation_jobs')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'generation_jobs',
          filter: `id=eq.${jobId}`
        },
        (payload) => {
          console.log('Real-time job status update:', payload.new)
          fetchJobStatus()
        }
      )
      .subscribe()

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(jobUpdatesSubscription)
      supabase.removeChannel(jobStatusSubscription)
    }
  }, [jobId, fetchJobStatus])

  // Polling fallback (in case real-time doesn't work)
  useEffect(() => {
    if (!jobId || !job || job.status === 'completed' || job.status === 'failed') return

    const interval = setInterval(fetchJobStatus, 2000) // Poll every 2 seconds
    return () => clearInterval(interval)
  }, [jobId, job?.status, fetchJobStatus])

  const startGeneration = async (prompt: string) => {
    setLoading(true)
    setError(null)
    setJob(null)

    try {
      const response = await fetch('/api/generate-async', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start generation')
      }

      // The jobId will be picked up by the useEffect above
      return data.jobId

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start generation')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    job,
    loading,
    error,
    startGeneration,
    refreshStatus: fetchJobStatus
  }
}

// Helper hook for just starting jobs without tracking
export function useJobStarter() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startGeneration = async (prompt: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-async', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start generation')
      }

      return data.jobId

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start generation')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { startGeneration, loading, error }
}
