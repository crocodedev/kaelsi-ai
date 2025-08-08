'use client';

import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
      </div>
    </div>
  )
} 