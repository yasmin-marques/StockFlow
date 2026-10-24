import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'
import './feedback.css'

interface SkeletonProps {
  variant?: 'text' | 'block' | 'circle'
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  className?: string
}

/** Placeholder de carregamento; decorativo — o contêiner deve expor aria-busy. */
export function Skeleton({ variant = 'block', width, height, className }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('sf-skeleton', variant === 'text' && 'sf-skeleton--text', variant === 'circle' && 'sf-skeleton--circle', className)}
      style={{ width, height }}
    />
  )
}
