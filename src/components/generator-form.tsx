'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useJobStarter } from '@/hooks/useJobTracking'

export function GeneratorForm() {
  const [prompt, setPrompt] = useState('')
  const router = useRouter()
  const { startGeneration, loading, error } = useJobStarter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    const jobId = await startGeneration(prompt.trim())
    
    if (jobId) {
      // Redirect to the generation tracking page
      router.push(`/generate/${jobId}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label 
          htmlFor="prompt" 
          className="block text-lg font-semibold text-gray-900 mb-4"
        >
          Describe your website idea
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Minimalist landing page for a vegan protein powder for busy professionals. Focus on taste and clean ingredients. Primary CTA: Join waitlist. Colors: green/black. Tone: confident, friendly."
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none h-32 text-lg placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200"
          required
        />
      </div>

      <Button 
        type="submit" 
        disabled={loading || !prompt.trim()}
        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            Starting generation...
          </>
        ) : (
          <>
            ✨ Generate Website
          </>
        )}
      </Button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <p className="text-sm text-gray-500 text-center leading-relaxed">
        Generated websites include copy, design, and stock photos automatically selected by AI
      </p>
    </form>
  )
}
