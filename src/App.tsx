import { useState, useMemo, useEffect, useCallback } from 'react'
import { Book, BookFilter, BookFormData } from '@/types/book'
import { getAllBooks, addBook, updateBook, deleteBook } from '@/lib/bookService'
import {
  getReadingLists,
  createReadingList,
  deleteReadingList,
  addBookToReadingList,
  removeBookFromReadingList,
} from '@/lib/readingListService'
import '@/lib/testConnection'
import Navbar from '@/components/Navbar'
import CurrentlyReading from '@/components/CurrentlyReading'
import BookTabs from '@/components/BookTabs'
import BookGrid from '@/components/BookGrid'
import AddBookDialog from '@/components/AddBookDialog'
import ReadingListDialog from '@/components/ReadingListDialog'
import { ReadingList } from '@/types/readingList'
import { Library } from 'lucide-react'


function App() {
  const [books, setBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<BookFilter>('All Books')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isReadingListsDialogOpen, setIsReadingListsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readingLists, setReadingLists] = useState<ReadingList[]>([])
  const [readingListsLoading, setReadingListsLoading] = useState(true)
  const [readingListsError, setReadingListsError] = useState<string | null>(null)

  // Load books from database on component mount
  useEffect(() => {
    loadBooks()
    loadReadingLists()
  }, [])

  const loadBooks = async () => {
    try {
      setLoading(true)
      setError(null)
      const booksData = await getAllBooks()
      setBooks(booksData)
    } catch (err) {
      setError('Failed to load books')
      console.error('Error loading books:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadReadingLists = async () => {
    try {
      setReadingListsLoading(true)
      setReadingListsError(null)
      const listsData = await getReadingLists()
      setReadingLists(listsData)
    } catch (err) {
      setReadingListsError('Failed to load reading lists')
      console.error('Error loading reading lists:', err)
    } finally {
      setReadingListsLoading(false)
    }
  }

  const filteredBooks = useMemo(() => {
    let filtered = books

    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (activeFilter !== 'All Books') {
      filtered = filtered.filter(book => book.status === activeFilter)
    }

    return filtered
  }, [books, searchQuery, activeFilter])

  const currentlyReadingBooks = books.filter(book => book.status === 'Reading')

  const handleAddBook = async (formData: BookFormData, listIds: string[]) => {
    try {
      const newBook = await addBook(formData)
      setBooks(prev => [newBook, ...prev])
      setReadingLists(prev => prev.map(list => ({
        ...list,
        books: list.books.map(book => book.id === newBook.id ? newBook : book)
      })))

      if (listIds.length > 0) {
        await Promise.all(
          listIds.map(listId => addBookToReadingList(listId, newBook.id))
        )

        setReadingLists(prev => prev.map(list => {
          if (!listIds.includes(list.id)) return list
          if (list.books.some(book => book.id === newBook.id)) return list
          return {
            ...list,
            books: [...list.books, newBook]
          }
        }))
      }
    } catch (err) {
      setError('Failed to add book')
      console.error('Error adding book:', err)
      throw err
    }
  }

  const handleUpdateBook = async (bookId: string, updates: Partial<Book>) => {
    try {
      const updatedBook = await updateBook(bookId, updates)
      setBooks(prev => prev.map(book =>
        book.id === bookId ? updatedBook : book
      ))
      setReadingLists(prev => prev.map(list => ({
        ...list,
        books: list.books.map(book =>
          book.id === bookId ? updatedBook : book
        )
      })))
    } catch (err) {
      setError('Failed to update book')
      console.error('Error updating book:', err)
    }
  }

  const handleDeleteBook = async (bookId: string) => {
    try {
      await deleteBook(bookId)
      setBooks(prev => prev.filter(book => book.id !== bookId))
      setReadingLists(prev => prev.map(list => ({
        ...list,
        books: list.books.filter(book => book.id !== bookId)
      })))
    } catch (err) {
      setError('Failed to delete book')
      console.error('Error deleting book:', err)
    }
  }

  const handleCreateReadingList = async (name: string) => {
    const newList = await createReadingList(name)
    setReadingLists(prev => [newList, ...prev])
  }

  const handleDeleteReadingList = async (listId: string) => {
    await deleteReadingList(listId)
    setReadingLists(prev => prev.filter(list => list.id !== listId))
  }

  const handleAddBookToReadingList = async (listId: string, bookId: string) => {
    const bookToAdd = books.find(book => book.id === bookId)
    if (!bookToAdd) {
      throw new Error('Book not found')
    }

    await addBookToReadingList(listId, bookId)
    setReadingLists(prev => prev.map(list => {
      if (list.id !== listId) return list
      if (list.books.some(book => book.id === bookId)) return list

      return {
        ...list,
        books: [...list.books, bookToAdd]
      }
    }))
  }

  const handleRemoveBookFromReadingList = async (listId: string, bookId: string) => {
    await removeBookFromReadingList(listId, bookId)
    setReadingLists(prev => prev.map(list =>
      list.id === listId
        ? { ...list, books: list.books.filter(book => book.id !== bookId) }
        : list
    ))
  }

  const resetReadingListError = useCallback(() => setReadingListsError(null), [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your books...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadBooks}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddBook={() => setIsAddDialogOpen(true)}
        onManageReadingLists={() => setIsReadingListsDialogOpen(true)}
      />

      <main className="container mx-auto px-4 py-8 flex-1 w-full">
        {currentlyReadingBooks.length > 0 && (
          <CurrentlyReading
            books={currentlyReadingBooks}
            onUpdateBook={handleUpdateBook}
            onDeleteBook={handleDeleteBook}
            className="mb-10"
          />
        )}

        <section>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex items-center gap-2">
              <Library className="h-5 w-5" style={{ color: 'rgb(237, 80, 13)' }} />
              <h2 className="text-2xl font-semibold text-foreground">My Library</h2>
            </div>
            <div className="flex justify-start lg:justify-end w-full lg:w-auto">
              <BookTabs
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                totalCounts={{
                  'All Books': books.length,
                  'Read': books.filter(b => b.status === 'Read').length,
                  'Wish List': books.filter(b => b.status === 'Wish List').length
                }}
                className="mb-0 w-full lg:w-auto"
              />
            </div>
          </div>

          <BookGrid
            books={filteredBooks}
            onUpdateBook={handleUpdateBook}
            onDeleteBook={handleDeleteBook}
          />
        </section>
      </main>

      <AddBookDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddBook={handleAddBook}
        readingLists={readingLists}
      />

      <ReadingListDialog
        open={isReadingListsDialogOpen}
        onOpenChange={setIsReadingListsDialogOpen}
        books={books}
        readingLists={readingLists}
        isLoading={readingListsLoading}
        error={readingListsError}
        onCreateList={handleCreateReadingList}
        onDeleteList={handleDeleteReadingList}
        onAddBookToList={handleAddBookToReadingList}
        onRemoveBookFromList={handleRemoveBookFromReadingList}
        onClearError={resetReadingListError}
      />

      <footer className="border-t border-border bg-white/60 backdrop-blur">
        <div className="container mx-auto px-4 py-6 text-xs text-center space-y-1">
          <p className="text-muted-foreground/90">This is a pure vibe coding project.</p>
          <p className="text-muted-foreground">© {new Date().getFullYear()} My Bookshelf. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
