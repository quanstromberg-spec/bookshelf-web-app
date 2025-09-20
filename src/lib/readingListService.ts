import { supabase } from './supabase'
import { databaseBookToBook } from './bookService'
import { ReadingList, DatabaseReadingList, DatabaseReadingListBook } from '@/types/readingList'
import { Book } from '@/types/book'

function mapReadingList(
  dbList: DatabaseReadingList & { reading_list_books?: DatabaseReadingListBook[] }
): ReadingList {
  const books: Book[] = (dbList.reading_list_books || [])
    .filter((item) => item.books)
    .map((item) => databaseBookToBook(item.books!))

  return {
    id: dbList.id,
    name: dbList.name,
    createdAt: new Date(dbList.created_at),
    books,
  }
}

export async function getReadingLists(): Promise<ReadingList[]> {
  const { data, error } = await supabase
    .from('reading_lists')
    .select(
      `id, name, created_at, reading_list_books ( id, list_id, book_id, created_at, books ( * ) )`
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reading lists:', error)
    throw error
  }

  return (
    (data as unknown) as (DatabaseReadingList & {
      reading_list_books?: DatabaseReadingListBook[]
    })[]
  ).map(mapReadingList)
}

export async function createReadingList(name: string): Promise<ReadingList> {
  const { data, error } = await supabase
    .from('reading_lists')
    .insert([{ name }])
    .select(`id, name, created_at`)
    .single()

  if (error) {
    console.error('Error creating reading list:', error)
    throw error
  }

  return mapReadingList({ ...data, reading_list_books: [] })
}

export async function deleteReadingList(listId: string): Promise<void> {
  const { error } = await supabase
    .from('reading_lists')
    .delete()
    .eq('id', listId)

  if (error) {
    console.error('Error deleting reading list:', error)
    throw error
  }
}

export async function addBookToReadingList(listId: string, bookId: string): Promise<void> {
  const { error } = await supabase
    .from('reading_list_books')
    .insert([{ list_id: listId, book_id: bookId }])

  if (error) {
    console.error('Error adding book to reading list:', error)
    throw error
  }
}

export async function removeBookFromReadingList(listId: string, bookId: string): Promise<void> {
  const { error } = await supabase
    .from('reading_list_books')
    .delete()
    .eq('list_id', listId)
    .eq('book_id', bookId)

  if (error) {
    console.error('Error removing book from reading list:', error)
    throw error
  }
}
