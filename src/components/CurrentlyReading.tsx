import { Book } from '@/types/book'
import { BookOpen } from 'lucide-react'
import BookCard from '@/components/BookCard'
import { cn } from '@/lib/utils'

interface CurrentlyReadingProps {
  books: Book[]
  onUpdateBook: (bookId: string, updates: Partial<Book>) => void
  onDeleteBook?: (bookId: string) => void
  className?: string
}

export default function CurrentlyReading({ books, onUpdateBook, onDeleteBook, className }: CurrentlyReadingProps) {
  if (books.length === 0) return null

  return (
    <section className={cn('mb-8', className)}>
      <div className="flex items-center space-x-2 mb-4">
        <BookOpen className="h-5 w-5" style={{ color: 'rgb(237, 80, 13)' }} />
        <h2 className="text-2xl font-semibold">Currently Reading</h2>
        <span className="text-sm text-muted-foreground">({books.length})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onUpdateBook={onUpdateBook}
            onDeleteBook={onDeleteBook}
          />
        ))}
      </div>
    </section>
  )
}
