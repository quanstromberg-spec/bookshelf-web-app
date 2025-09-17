export type BookStatus = 'Reading' | 'Read' | 'Wish List';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  notes: string;
  rating: number; // 1-5 stars
  status: BookStatus;
  progress: number; // 0-100%
  dateAdded: Date;
}

export type BookFilter = 'All Books' | 'Read' | 'Wish List';

export interface BookFormData {
  title: string;
  author: string;
  coverUrl: string;
  notes: string;
  rating: number;
  status: BookStatus;
  progress: number;
}