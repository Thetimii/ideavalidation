import { GeneratorForm } from '@/components/generator-form'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-60 h-60 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-4000"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full border border-indigo-200/20 backdrop-blur-sm mb-6">
              <span className="text-sm font-medium text-indigo-700">✨ AI-Powered Website Generation</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 bg-clip-text text-transparent mb-6 leading-tight">
            AI Website Builder
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Describe your idea and get a beautiful landing page in seconds with AI-generated copy, design, and images
          </p>
        </div>
        
        
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8">
            <GeneratorForm />
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Generate professional websites in three simple steps
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative group">
              <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg p-8 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Describe</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tell us about your business, product, or service in plain English. Be as detailed as you want.
                </p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg p-8 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Generate</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI creates a custom landing page with professional copy, design, and perfectly matched images.
                </p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg p-8 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Customize</h3>
                <p className="text-gray-600 leading-relaxed">
                  Edit content, swap images, adjust colors, and publish your professional website instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features section */}
        <div className="mt-24 text-center">
          <div className="bg-white/40 backdrop-blur-lg rounded-3xl border border-white/30 shadow-xl p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Generated websites include</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">✨</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">AI-Generated Copy</h4>
                <p className="text-sm text-gray-600">Professional, conversion-focused content tailored to your business</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🎨</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Beautiful Design</h4>
                <p className="text-sm text-gray-600">Modern, responsive layouts with custom color schemes and typography</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">📸</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Stock Photos</h4>
                <p className="text-sm text-gray-600">High-quality images automatically selected to match your content</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
