'use client'

interface JobProgress {
  step: string
  message: string
  progress_percent?: number
}

interface GenerationProgressProps {
  progress: JobProgress
  status: 'pending' | 'processing' | 'completed' | 'failed'
  updates?: Array<{
    step: string
    message: string
    progress_percent: number
    created_at: string
  }>
}

const progressSteps = [
  { key: 'initializing', label: 'Initializing', icon: '🚀' },
  { key: 'analyzing', label: 'Analyzing', icon: '🧠' },
  { key: 'generating', label: 'Generating Content', icon: '✨' },
  { key: 'processing', label: 'Processing', icon: '⚙️' },
  { key: 'validating', label: 'Validating', icon: '✅' },
  { key: 'saving', label: 'Saving Website', icon: '💾' },
  { key: 'completed', label: 'Complete', icon: '🎉' }
]

export function GenerationProgress({ progress, status, updates = [] }: GenerationProgressProps) {
  const currentStepIndex = progressSteps.findIndex(step => step.key === progress.step)
  const progressPercent = progress.progress_percent || 0

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4 animate-bounce">
          {status === 'failed' ? '❌' : 
           status === 'completed' ? '🎉' : 
           progressSteps[currentStepIndex]?.icon || '⏳'}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {status === 'failed' ? 'Generation Failed' :
           status === 'completed' ? 'Website Ready!' :
           'Generating Your Website'}
        </h2>
        
        <p className="text-gray-600 text-lg">
          {progress.message}
        </p>
      </div>

      {status !== 'failed' && (
        <>
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Step indicators */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {progressSteps.map((step, index) => {
                const isCompleted = index < currentStepIndex || status === 'completed'
                const isCurrent = index === currentStepIndex && status !== 'completed'
                const isUpcoming = index > currentStepIndex && status !== 'completed'

                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                      ${isCompleted ? 'bg-green-500 text-white' :
                        isCurrent ? 'bg-blue-500 text-white animate-pulse' :
                        'bg-gray-200 text-gray-400'}
                    `}>
                      {isCompleted ? '✓' : step.icon}
                    </div>
                    <span className={`
                      text-xs mt-2 font-medium transition-colors duration-300
                      ${isCompleted ? 'text-green-600' :
                        isCurrent ? 'text-blue-600' :
                        'text-gray-400'}
                    `}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Live updates feed */}
      {updates.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Live Updates</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {updates.slice(0, 5).map((update, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0" />
                <span className="flex-1">{update.message}</span>
                <span className="text-xs text-gray-400 ml-2">
                  {new Date(update.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fun messages during generation */}
      {status === 'processing' && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <p className="text-blue-800 text-sm font-medium">
              {getRandomFunMessage(progress.step)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function getRandomFunMessage(step: string): string {
  const messages = {
    analyzing: [
      "🕵️ Analyzing your business like Sherlock Holmes...",
      "🎯 Understanding your target audience...",
      "📊 Studying market trends for your industry..."
    ],
    generating: [
      "🎨 Our AI is painting your digital masterpiece...",
      "✍️ Writing compelling copy that converts...",
      "🚀 Crafting a website that'll make your competitors jealous..."
    ],
    processing: [
      "⚡ Adding that special sauce...",
      "🔧 Fine-tuning every pixel...",
      "🎭 Making sure everything looks professional..."
    ],
    validating: [
      "🔍 Quality checking every detail...",
      "✨ Ensuring pixel-perfect design...",
      "🛡️ Running security and performance checks..."
    ],
    saving: [
      "💾 Saving your beautiful creation...",
      "🌐 Preparing for the world to see...",
      "🚀 Almost ready for launch!"
    ]
  }

  const stepMessages = messages[step as keyof typeof messages] || ["🔄 Working hard behind the scenes..."]
  return stepMessages[Math.floor(Math.random() * stepMessages.length)]
}
