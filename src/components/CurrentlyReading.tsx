import { Book } from '@/types/book'
import { BookOpen } from 'lucide-react'
import BookCard from '@/components/BookCard'

interface CurrentlyReadingProps {
  books: Book[]
  onUpdateBook: (bookId: string, updates: Partial<Book>) => void
}

export default function CurrentlyReading({ books, onUpdateBook }: CurrentlyReadingProps) {
  if (books.length === 0) return null

  return (
    <section className="mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <BookOpen className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Currently Reading</h2>
        <span className="text-sm text-muted-foreground">({books.length})</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onUpdateBook={onUpdateBook}
          />
        ))}
      </div>
    </section>
  )
}