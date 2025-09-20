import { Book, DatabaseBook } from '@/types/book'

export interface ReadingList {
  id: string
  name: string
  createdAt: Date
  books: Book[]
}

export interface DatabaseReadingList {
  id: string
  name: string
  created_at: string
}

export interface DatabaseReadingListBook {
  id: string
  list_id: string
  book_id: string
  created_at: string
  books?: DatabaseBook | null
}
