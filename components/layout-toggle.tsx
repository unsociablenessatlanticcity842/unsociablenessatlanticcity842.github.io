'use client'

import { LayoutGrid, LayoutList } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LayoutToggleProps {
  layout: 'grid' | 'horizontal'
  onLayoutChange: (layout: 'grid' | 'horizontal') => void
}

export function LayoutToggle({ layout, onLayoutChange }: LayoutToggleProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant={layout === 'horizontal' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onLayoutChange('horizontal')}
        className="h-8 w-8"
        title="가로형 레이아웃"
      >
        <LayoutList className="h-4 w-4" />
        <span className="sr-only">가로형 레이아웃</span>
      </Button>

      <Button
        variant={layout === 'grid' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onLayoutChange('grid')}
        className="h-8 w-8"
        title="그리드 레이아웃"
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="sr-only">그리드 레이아웃</span>
      </Button>
    </div>
  )
}
