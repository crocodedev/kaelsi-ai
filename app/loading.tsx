export default function Loading() {
  return (
    <div className="min-h-screen bg-mystical-gradient text-mystical-text flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
        <p className="text-mystical-text-secondary font-faunce">Loading...</p>
      </div>
    </div>
  )
} 