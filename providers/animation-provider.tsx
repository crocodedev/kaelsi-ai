"use client"

import PreloadingContext from '@/contexts/animation'
import { PropsWithChildren } from 'react'


export function AnimationProvider({ children }: PropsWithChildren) {
  return (
    <PreloadingContext>
      {children}
    </PreloadingContext>
  )
} 