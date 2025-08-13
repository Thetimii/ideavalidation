'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useJobTracking } from '@/hooks/useJobTracking'
import { GenerationProgress } from '@/components/generation-progress'

interface GeneratePageProps {
  params: Promise<{
    jobId: string
  }>
}

export default async function GeneratePage({ params }: GeneratePageProps) {
  const { jobId } = await params
  const router = useRouter()
  const { job, loading, error } = useJobTracking(jobId)

  // Redirect when completed
  useEffect(() => {
    if (job?.status === 'completed' && job.pageId) {
      // Small delay to show the success state
      setTimeout(() => {
        router.push(`/p/${job.pageId}`)
      }, 2000)
    }
  }, [job?.status, job?.pageId, router])

  if (loading && !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading generation status...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8 max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Generation Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8 max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The generation job could not be found.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Start New Generation
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-60 h-60 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 bg-clip-text text-transparent mb-4">
              Generating Your Website
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI is crafting a beautiful, professional website just for you. This usually takes 30-60 seconds.
            </p>
          </div>

          {/* Progress Component */}
          <GenerationProgress 
            progress={job.progress}
            status={job.status}
            updates={job.updates}
          />

          {/* Failed state */}
          {job.status === 'failed' && (
            <div className="mt-8 text-center">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Generation Failed</h3>
                <p className="text-red-700 text-sm mb-4">
                  {job.errorMessage || 'An unexpected error occurred during generation.'}
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Completed state */}
          {job.status === 'completed' && job.pageId && (
            <div className="mt-8 text-center">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Website Ready!</h3>
                <p className="text-green-700 text-sm mb-4">
                  Redirecting to your new website in a moment...
                </p>
                <button
                  onClick={() => router.push(`/p/${job.pageId}`)}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
                >
                  View Website Now
                </button>
              </div>
            </div>
          )}

          {/* Tips while waiting */}
          {(job.status === 'pending' || job.status === 'processing') && (
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="bg-white/40 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 While you wait...</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>Your website will include professional copy, modern design, and stock photos</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>Everything is automatically optimized for mobile devices</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>You can customize colors, text, and images after generation</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>Your website will be hosted globally with fast loading times</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
