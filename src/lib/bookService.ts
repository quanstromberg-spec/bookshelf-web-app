import { supabase } from './supabase'
import { Book, BookFormData, DatabaseBook, DatabaseBookStatus, BookStatus } from '@/types/book'

const statusFromDb: Record<DatabaseBookStatus, BookStatus> = {
  read: 'Read',
  reading: 'Reading',
  'wish-list': 'Wish List',
}

const statusToDb: Record<BookStatus, DatabaseBookStatus> = {
  Read: 'read',
  Reading: 'reading',
  'Wish List': 'wish-list',
}

function mapStatusFromDb(status: DatabaseBookStatus | null): BookStatus {
  if (!status) return 'Wish List'
  return statusFromDb[status] ?? 'Wish List'
}

function mapStatusToDb(status: BookStatus | undefined): DatabaseBookStatus {
  if (!status) return 'wish-list'
  return statusToDb[status] ?? 'wish-list'
}

// Convert database book to app book format
export function databaseBookToBook(dbBook: DatabaseBook): Book {
  return {
    id: dbBook.id,
    title: dbBook.title,
    author: dbBook.author,
    coverUrl: dbBook.cover ?? '',
    notes: dbBook.notes ?? '',
    rating: dbBook.rating ?? 0,
    status: mapStatusFromDb(dbBook.status),
    progress: dbBook.progress ?? 0,
    dateAdded: new Date(dbBook.created_at),
    created_at: dbBook.created_at,
    updated_at: dbBook.updated_at ?? undefined,
  }
}

// Convert app book to database format
export function bookToDatabaseBook(book: Book): Partial<DatabaseBook> {
  const coverValue = book.coverUrl.trim()
  const notesValue = book.notes.trim()

  return {
    id: book.id,
    title: book.title,
    author: book.author,
    cover: coverValue ? coverValue : null,
    notes: notesValue ? book.notes : null,
    rating: book.rating,
    status: mapStatusToDb(book.status),
    progress: book.progress,
  }
}

// Get all books
export async function getAllBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching books:', error)
    throw error
  }

  return (data as DatabaseBook[]).map(databaseBookToBook)
}

// Add a new book
export async function addBook(bookData: BookFormData): Promise<Book> {
  const coverValue = bookData.coverUrl.trim()
  const notesValue = bookData.notes.trim()

  const newBook: Partial<DatabaseBook> = {
    title: bookData.title,
    author: bookData.author,
    cover: coverValue ? coverValue : null,
    notes: notesValue ? bookData.notes : null,
    rating: bookData.rating,
    status: mapStatusToDb(bookData.status),
    progress: bookData.progress,
  }

  const { data, error } = await supabase
    .from('books')
    .insert([newBook])
    .select()
    .single()

  if (error) {
    console.error('Error adding book:', error)
    throw error
  }

  return databaseBookToBook(data as DatabaseBook)
}

// Update a book
export async function updateBook(bookId: string, updates: Partial<Book>): Promise<Book> {
  const dbUpdates: Partial<DatabaseBook> = {}

  if (updates.title !== undefined) dbUpdates.title = updates.title
  if (updates.author !== undefined) dbUpdates.author = updates.author
  if (updates.coverUrl !== undefined) {
    const coverValue = updates.coverUrl.trim()
    dbUpdates.cover = coverValue ? coverValue : null
  }
  if (updates.notes !== undefined) {
    const notesValue = updates.notes.trim()
    dbUpdates.notes = notesValue ? updates.notes : null
  }
  if (updates.rating !== undefined) dbUpdates.rating = updates.rating
  if (updates.status !== undefined) dbUpdates.status = mapStatusToDb(updates.status)
  if (updates.progress !== undefined) dbUpdates.progress = updates.progress

  const { data, error } = await supabase
    .from('books')
    .update(dbUpdates)
    .eq('id', bookId)
    .select()
    .single()

  if (error) {
    console.error('Error updating book:', error)
    throw error
  }

  return databaseBookToBook(data as DatabaseBook)
}

// Delete a book
export async function deleteBook(bookId: string): Promise<void> {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', bookId)

  if (error) {
    console.error('Error deleting book:', error)
    throw error
  }
}
