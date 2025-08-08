'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-mystical-bg text-mystical-text flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-3xl font-cormorant font-semibold mb-4">Something went wrong!</h1>
        <p className="text-mystical-text-secondary mb-8">
          An error occurred while loading this page. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-mystical-accent text-mystical-bg rounded-lg hover:bg-mystical-gold transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 border border-mystical-accent text-mystical-text rounded-lg hover:bg-mystical-accent hover:text-mystical-bg transition-colors"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  )
} 