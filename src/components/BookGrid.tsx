import { Book } from '@/types/book'
import BookCard from '@/components/BookCard'
import { BookX } from 'lucide-react'

interface BookGridProps {
  books: Book[]
  onUpdateBook: (bookId: string, updates: Partial<Book>) => void
}

export default function BookGrid({ books, onUpdateBook }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BookX className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No books found</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Try adjusting your search terms or filters, or add some books to your library.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onUpdateBook={onUpdateBook}
        />
      ))}
    </div>
  )
}