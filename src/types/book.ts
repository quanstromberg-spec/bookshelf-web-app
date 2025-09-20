export type BookStatus = 'Reading' | 'Read' | 'Wish List'

export type DatabaseBookStatus = 'reading' | 'read' | 'wish-list'

export interface Book {
  id: string
  title: string
  author: string
  coverUrl: string
  notes: string
  rating: number // 1-5 stars
  status: BookStatus
  progress: number // 0-100%
  dateAdded: Date
  created_at?: string // Supabase timestamp
  updated_at?: string // Supabase timestamp
}

export interface DatabaseBook {
  id: string
  title: string
  author: string
  cover: string | null
  notes: string | null
  rating: number | null
  status: DatabaseBookStatus
  progress: number | null
  created_at: string
  updated_at?: string | null
}

export type BookFilter = 'All Books' | 'Read' | 'Wish List'

export interface BookFormData {
  title: string
  author: string
  coverUrl: string
  notes: string
  rating: number
  status: BookStatus
  progress: number
}
