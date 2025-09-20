import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  interactive?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function StarRating({
  rating,
  onRatingChange,
  interactive = false,
  size = 'md',
  className
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRatingChange?.(star)}
          disabled={!interactive}
          className={cn(
            sizeClasses[size],
            interactive && 'cursor-pointer hover:scale-110 transition-transform',
            !interactive && 'cursor-default'
          )}
        >
          <Star
            className={cn(
              'w-full h-full transition-colors',
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-transparent text-muted-foreground'
            )}
          />
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-sm text-muted-foreground">
          {rating}/5
        </span>
      )}
    </div>
  )
}
