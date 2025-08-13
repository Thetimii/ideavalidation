'use client'

import { useState } from 'react'

interface CustomDomainManagerProps {
  pageId: string
}

export function CustomDomainManager({ pageId }: CustomDomainManagerProps) {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [verification, setVerification] = useState<any>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const setupDomain = async () => {
    if (!domain) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/custom-domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, domain })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to setup domain')
      }

      setVerification(result)
      setSuccess('Domain setup initiated! Please follow the DNS instructions below.')

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup domain')
    } finally {
      setLoading(false)
    }
  }

  const verifyDomain = async () => {
    if (!verification?.domain) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/custom-domains/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: verification.domain })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Verification failed')
      }

      setSuccess('Domain verified successfully! Your website is now accessible at your custom domain.')
      setVerification(null)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-4">Custom Domain Setup</h3>
      
      {!verification ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Domain
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter your domain (e.g., mywebsite.com or app.mycompany.com)
            </p>
          </div>

          <button
            onClick={setupDomain}
            disabled={loading || !domain}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Setting up...' : 'Setup Custom Domain'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-semibold text-blue-900 mb-2">DNS Configuration Required</h4>
            <p className="text-blue-800 text-sm mb-4">
              Add these DNS records to your domain registrar:
            </p>
            
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border">
                <div className="font-mono text-sm">
                  <div><strong>Type:</strong> TXT</div>
                  <div><strong>Name:</strong> _ai-website-builder-verify</div>
                  <div><strong>Value:</strong> {verification.verificationToken}</div>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <div className="font-mono text-sm">
                  <div><strong>Type:</strong> CNAME</div>
                  <div><strong>Name:</strong> {verification.instructions.cname.name}</div>
                  <div><strong>Value:</strong> {verification.instructions.cname.value}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-md">
            <h4 className="font-semibold text-yellow-900 mb-2">⏱️ DNS Propagation</h4>
            <p className="text-yellow-800 text-sm">
              DNS changes can take up to 24 hours to propagate. You can verify once the records are active.
            </p>
          </div>

          <button
            onClick={verifyDomain}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Domain Setup'}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}
    </div>
  )
}
