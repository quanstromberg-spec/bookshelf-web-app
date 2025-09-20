import { useState } from 'react'
import { Book } from '@/types/book'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import StarRating from '@/components/StarRating'
import ProgressBar from '@/components/ProgressBar'
import { Badge } from '@/components/ui/badge'
import EditBookDialog from '@/components/EditBookDialog'
import { Edit, Trash2 } from 'lucide-react'

interface BookCardProps {
  book: Book
  onUpdateBook?: (bookId: string, updates: Partial<Book>) => void
  onDeleteBook?: (bookId: string) => void
  compact?: boolean
}

export default function BookCard({ book, onUpdateBook, onDeleteBook, compact = false }: BookCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"? This action cannot be undone.`)) {
      onDeleteBook?.(book.id)
    }
  }

  const statusColors = {
    'Reading': 'bg-blue-100 text-blue-800 border-blue-200',
    'Read': 'bg-green-100 text-green-800 border-green-200',
    'Wish List': 'bg-purple-100 text-purple-800 border-purple-200'
  }

  const handleRatingChange = (newRating: number) => {
    onUpdateBook?.(book.id, { rating: newRating })
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className={compact ? 'flex' : 'block'}>
        <div className={compact ? 'w-20 h-28 flex-shrink-0' : 'w-full h-48'}>
          <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop'
            }}
          />
        </div>

        <div className={compact ? 'flex-1 min-w-0' : 'w-full'}>
          <CardHeader className={compact ? 'pb-2' : 'pb-4'}>
            <div className="space-y-2 min-w-0">
              <h3 className="font-semibold text-lg leading-tight truncate" title={book.title}>
                {book.title}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground truncate" title={book.author}>
                  by {book.author}
                </p>
                {(onUpdateBook || onDeleteBook) && (
                  <div className="flex items-center gap-1 ml-auto">
                    {onUpdateBook && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setIsEditDialogOpen(true)}
                        title="Edit book"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDeleteBook && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        onClick={handleDeleteClick}
                        title="Delete book"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className={compact ? 'pt-0' : 'pt-0'}>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={statusColors[book.status]} variant="outline">
                  {book.status}
                </Badge>
                <StarRating
                  rating={book.rating}
                  onRatingChange={handleRatingChange}
                  interactive={!!onUpdateBook}
                  size={compact ? 'sm' : 'md'}
                  className="justify-end"
                />
              </div>

              {book.status === 'Reading' && (
                <ProgressBar progress={book.progress} />
              )}

              {book.notes && !compact && (
                <div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {book.notes}
                  </p>
                </div>
              )}

              {compact && book.notes && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {book.notes}
                </p>
              )}
            </div>
          </CardContent>
        </div>
      </div>

      <EditBookDialog
        book={book}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdateBook={onUpdateBook || (() => {})}
      />
    </Card>
  )
}
