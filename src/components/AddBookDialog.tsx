import { useState, useEffect } from 'react'
import { BookFormData, BookStatus } from '@/types/book'
import { ReadingList } from '@/types/readingList'
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

interface AddBookDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddBook: (book: BookFormData, listIds: string[]) => Promise<void>
  readingLists: ReadingList[]
}

const initialFormData: BookFormData = {
  title: '',
  author: '',
  coverUrl: '',
  notes: '',
  rating: 0,
  status: 'Wish List',
  progress: 0
}

export default function AddBookDialog({ open, onOpenChange, onAddBook, readingLists }: AddBookDialogProps) {
  const [formData, setFormData] = useState<BookFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedListIds, setSelectedListIds] = useState<string[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (formData.status === 'Read') {
      setFormData(prev => ({ ...prev, progress: 100 }))
    } else if (formData.status === 'Wish List') {
      setFormData(prev => ({ ...prev, progress: 0 }))
    }
  }, [formData.status])

  useEffect(() => {
    if (!open) {
      setFormData(initialFormData)
      setSelectedListIds([])
      setIsSubmitting(false)
      setSubmitError(null)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.author.trim()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await onAddBook(formData, selectedListIds)
      setFormData(initialFormData)
      setSelectedListIds([])
      onOpenChange(false)
    } catch (err: any) {
      console.error('Error adding book from dialog:', err)
      setSubmitError(err?.message || 'Failed to add book')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFormData(initialFormData)
    setSelectedListIds([])
    setSubmitError(null)
    onOpenChange(false)
  }

  const updateFormData = (field: keyof BookFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleListSelection = (listId: string) => {
    setSelectedListIds(prev =>
      prev.includes(listId)
        ? prev.filter(id => id !== listId)
        : [...prev, listId]
    )
  }

  const isFormValid = formData.title.trim() && formData.author.trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>
            Add a new book to your personal library. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        {submitError && (
          <div className="rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-600">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter book title"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                placeholder="Enter author name"
                value={formData.author}
                onChange={(e) => updateFormData('author', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverUrl">Cover Image URL</Label>
            <Input
              id="coverUrl"
              type="url"
              placeholder="https://example.com/book-cover.jpg"
              value={formData.coverUrl}
              onChange={(e) => updateFormData('coverUrl', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
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
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={formData.progress}
                  onChange={(e) => updateFormData('progress', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <StarRating
              rating={formData.rating}
              onRatingChange={(rating) => updateFormData('rating', rating)}
              interactive
              size="lg"
            />
          </div>

          <div className="space-y-2">
            <Label>Select reading lists (optional)</Label>
            {readingLists.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No reading lists yet. Use "My Reading List" to create one.
              </p>
            ) : (
              <div className="grid gap-2">
                {readingLists.map((list) => {
                  const isChecked = selectedListIds.includes(list.id)
                  return (
                    <label
                      key={list.id}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border border-input accent-primary"
                        checked={isChecked}
                        onChange={() => toggleListSelection(list.id)}
                      />
                      <span className="truncate">{list.name}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add your thoughts, quotes, or notes about this book..."
              value={formData.notes}
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
              {isSubmitting ? 'Adding...' : 'Add Book'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
