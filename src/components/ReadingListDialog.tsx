import { useEffect, useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ReadingList } from '@/types/readingList'
import { Book } from '@/types/book'

interface ReadingListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  books: Book[]
  readingLists: ReadingList[]
  isLoading: boolean
  error: string | null
  onCreateList: (name: string) => Promise<void>
  onDeleteList: (listId: string) => Promise<void>
  onAddBookToList: (listId: string, bookId: string) => Promise<void>
  onRemoveBookFromList: (listId: string, bookId: string) => Promise<void>
  onClearError: () => void
}

type ListAction =
  | { type: 'add'; listId: string }
  | { type: 'delete'; listId: string }
  | { type: 'remove'; listId: string; bookId: string }
  | null

export default function ReadingListDialog({
  open,
  onOpenChange,
  books,
  readingLists,
  isLoading,
  error,
  onCreateList,
  onDeleteList,
  onAddBookToList,
  onRemoveBookFromList,
  onClearError,
}: ReadingListDialogProps) {
  const [newListName, setNewListName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [listSelections, setListSelections] = useState<Record<string, string>>({})
  const [listAction, setListAction] = useState<ListAction>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const displayError = localError || error

  useEffect(() => {
    if (!open) {
      setNewListName('')
      setIsCreating(false)
      setListSelections({})
      setListAction(null)
      setLocalError(null)
      onClearError()
    }
  }, [open, onClearError])

  const handleCreateList = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!newListName.trim()) return

    setIsCreating(true)
    setLocalError(null)
    try {
      await onCreateList(newListName.trim())
      setNewListName('')
    } catch (err: any) {
      setLocalError(err?.message || 'Failed to create list')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteList = async (listId: string) => {
    setListAction({ type: 'delete', listId })
    setLocalError(null)
    try {
      await onDeleteList(listId)
    } catch (err: any) {
      setLocalError(err?.message || 'Failed to delete list')
    } finally {
      setListAction(null)
    }
  }

  const handleAddBook = async (listId: string) => {
    const bookId = listSelections[listId]
    if (!bookId) return

    setListAction({ type: 'add', listId })
    setLocalError(null)
    try {
      await onAddBookToList(listId, bookId)
      setListSelections((prev) => {
        const copy = { ...prev }
        delete copy[listId]
        return copy
      })
    } catch (err: any) {
      setLocalError(err?.message || 'Failed to add book to list')
    } finally {
      setListAction(null)
    }
  }

  const handleRemoveBook = async (listId: string, bookId: string) => {
    setListAction({ type: 'remove', listId, bookId })
    setLocalError(null)
    try {
      await onRemoveBookFromList(listId, bookId)
    } catch (err: any) {
      setLocalError(err?.message || 'Failed to remove book from list')
    } finally {
      setListAction(null)
    }
  }

  const isAddLoading = (listId: string) => listAction?.type === 'add' && listAction.listId === listId
  const isDeleteLoading = (listId: string) =>
    listAction?.type === 'delete' && listAction.listId === listId
  const isRemoveLoading = (listId: string, bookId: string) =>
    listAction?.type === 'remove' && listAction.listId === listId && listAction.bookId === bookId

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Reading Lists</DialogTitle>
          <DialogDescription>
            Create lists to organize your books and curate focused reading plans.
          </DialogDescription>
        </DialogHeader>

        {displayError && (
          <div className="rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-600">
            {displayError}
          </div>
        )}

        <div className="space-y-6 mt-4">
          <form onSubmit={handleCreateList} className="space-y-3">
            <div>
              <Label htmlFor="new-list-name">Create a new list</Label>
              <div className="mt-2 flex flex-col sm:flex-row gap-2">
                <Input
                  id="new-list-name"
                  placeholder="e.g. 2025 Non-fiction"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  disabled={isCreating}
                />
                <Button type="submit" disabled={isCreating || !newListName.trim()}>
                  {isCreating ? 'Creating...' : 'Create list'}
                </Button>
              </div>
            </div>
          </form>

          <div className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading reading lists...</p>
            ) : readingLists.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No reading lists yet. Create one to get started.
              </p>
            ) : (
              readingLists.map((list) => {
                const availableBooks = books.filter(
                  (book) => !list.books.some((listBook) => listBook.id === book.id)
                )

                const selectionValue = listSelections[list.id]

                return (
                  <div
                    key={list.id}
                    className="border border-border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{list.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {list.books.length} {list.books.length === 1 ? 'book' : 'books'}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDeleteList(list.id)}
                        disabled={isDeleteLoading(list.id)}
                      >
                        {isDeleteLoading(list.id) ? 'Deleting...' : 'Delete list'}
                      </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                      <div className="flex-1">
                        <Label className="text-sm">Add a book</Label>
                        <Select
                          value={selectionValue ?? undefined}
                          onValueChange={(value) =>
                            setListSelections((prev) => ({ ...prev, [list.id]: value }))
                          }
                          disabled={availableBooks.length === 0 || isAddLoading(list.id)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                availableBooks.length === 0
                                  ? 'All books already in this list'
                                  : 'Select a book'
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {availableBooks.map((book) => (
                              <SelectItem key={book.id} value={book.id}>
                                {book.title} — {book.author}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        onClick={() => handleAddBook(list.id)}
                        disabled={
                          isAddLoading(list.id) || !selectionValue || availableBooks.length === 0
                        }
                      >
                        {isAddLoading(list.id) ? 'Adding...' : 'Add book'}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {list.books.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          This list is empty. Add a book to get started.
                        </p>
                      ) : (
                        list.books.map((book) => (
                          <div
                            key={book.id}
                            className="flex items-center gap-2 justify-between border border-border rounded-md px-3 py-2"
                          >
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate" title={book.title}>
                                {book.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate" title={book.author}>
                                {book.author}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveBook(list.id, book.id)}
                              disabled={isRemoveLoading(list.id, book.id)}
                            >
                              {isRemoveLoading(list.id, book.id) ? 'Removing...' : 'Remove'}
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
