import { useState, useMemo } from 'react'
import { Book, BookFilter, BookFormData } from '@/types/book'
import { generateId } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import CurrentlyReading from '@/components/CurrentlyReading'
import BookTabs from '@/components/BookTabs'
import BookGrid from '@/components/BookGrid'
import AddBookDialog from '@/components/AddBookDialog'

const SAMPLE_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The React Handbook',
    author: 'Flavio Copes',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop',
    notes: 'Great introduction to React concepts and modern development practices.',
    rating: 5,
    status: 'Reading',
    progress: 65,
    dateAdded: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    coverUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop',
    notes: 'Essential reading for any developer. Teaches best practices for writing maintainable code.',
    rating: 5,
    status: 'Read',
    progress: 100,
    dateAdded: new Date('2023-12-10')
  },
  {
    id: '3',
    title: 'Design Patterns',
    author: 'Gang of Four',
    coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
    notes: 'Want to read this classic on software design patterns.',
    rating: 0,
    status: 'Wish List',
    progress: 0,
    dateAdded: new Date('2024-01-20')
  },
  {
    id: '4',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=400&fit=crop',
    notes: 'A fascinating exploration of life\'s infinite possibilities. Really enjoying the philosophical themes.',
    rating: 4,
    status: 'Reading',
    progress: 42,
    dateAdded: new Date('2024-01-25')
  }
]

function App() {
  const [books, setBooks] = useState<Book[]>(SAMPLE_BOOKS)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<BookFilter>('All Books')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

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

  const handleAddBook = (formData: BookFormData) => {
    const newBook: Book = {
      id: generateId(),
      ...formData,
      progress: formData.status === 'Read' ? 100 : formData.progress,
      dateAdded: new Date()
    }
    setBooks(prev => [...prev, newBook])
  }

  const handleUpdateBook = (bookId: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(book => {
      if (book.id === bookId) {
        const updatedBook = { ...book, ...updates }
        if (updatedBook.status === 'Read') {
          updatedBook.progress = 100
        }
        return updatedBook
      }
      return book
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddBook={() => setIsAddDialogOpen(true)}
      />

      <main className="container mx-auto px-4 py-8">
        {currentlyReadingBooks.length > 0 && (
          <CurrentlyReading
            books={currentlyReadingBooks}
            onUpdateBook={handleUpdateBook}
          />
        )}

        <BookTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          totalCounts={{
            'All Books': books.length,
            'Read': books.filter(b => b.status === 'Read').length,
            'Wish List': books.filter(b => b.status === 'Wish List').length
          }}
        />

        <BookGrid
          books={filteredBooks}
          onUpdateBook={handleUpdateBook}
        />
      </main>

      <AddBookDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddBook={handleAddBook}
      />
    </div>
  )
}

export default App