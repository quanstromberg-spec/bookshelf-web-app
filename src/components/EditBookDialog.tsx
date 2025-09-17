import { useState, useEffect } from 'react'
import { Book, BookStatus } from '@/types/book'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import StarRating from '@/components/StarRating'

interface EditBookDialogProps {
  book: Book | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateBook: (bookId: string, updates: Partial<Book>) => void
}

export default function EditBookDialog({ book, open, onOpenChange, onUpdateBook }: EditBookDialogProps) {
  const [formData, setFormData] = useState<Partial<Book>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        notes: book.notes,
        rating: book.rating,
        status: book.status,
        progress: book.progress
      })
    }
  }, [book])

  useEffect(() => {
    if (formData.status === 'Read') {
      setFormData(prev => ({ ...prev, progress: 100 }))
    } else if (formData.status === 'Wish List') {
      setFormData(prev => ({ ...prev, progress: 0 }))
    }
  }, [formData.status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!book || !formData.title?.trim() || !formData.author?.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      onUpdateBook(book.id, formData)
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        notes: book.notes,
        rating: book.rating,
        status: book.status,
        progress: book.progress
      })
    }
    onOpenChange(false)
  }

  const updateFormData = (field: keyof Book, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isFormValid = formData.title?.trim() && formData.author?.trim()

  if (!book) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>
            Update the details for "{book.title}".
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                placeholder="Enter book title"
                value={formData.title || ''}
                onChange={(e) => updateFormData('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-author">Author *</Label>
              <Input
                id="edit-author"
                placeholder="Enter author name"
                value={formData.author || ''}
                onChange={(e) => updateFormData('author', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-coverUrl">Cover Image URL</Label>
            <Input
              id="edit-coverUrl"
              type="url"
              placeholder="https://example.com/book-cover.jpg"
              value={formData.coverUrl || ''}
              onChange={(e) => updateFormData('coverUrl', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: BookStatus) => updateFormData('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wish List">Wish List</SelectItem>
                  <SelectItem value="Reading">Reading</SelectItem>
                  <SelectItem value="Read">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.status === 'Reading' && (
              <div className="space-y-2">
                <Label htmlFor="edit-progress">Progress (%)</Label>
                <Input
                  id="edit-progress"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={formData.progress || 0}
                  onChange={(e) => updateFormData('progress', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <StarRating
              rating={formData.rating || 0}
              onRatingChange={(rating) => updateFormData('rating', rating)}
              interactive
              size="lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              placeholder="Add your thoughts, quotes, or notes about this book..."
              value={formData.notes || ''}
              onChange={(e) => updateFormData('notes', e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Book'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}