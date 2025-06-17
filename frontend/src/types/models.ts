export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string; // ISO tarih stringi
  subscription_type: 'free' | 'premium' | string;
  subscription_end_date?: string | null; // ISO tarih stringi veya null
}

export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  cover_image_url?: string;
  pdf_url?: string;
  price: number;
  created_at: string; // ISO tarih stringi
}

export interface Rental {
  id: number;
  user_id: number;
  book_id: number;
  rental_date: string; // ISO tarih stringi
  return_date?: string | null; // ISO tarih stringi veya null
  status: 'active' | 'returned' | string;
}

export interface ReadingHistory {
  id: number;
  user_id: number;
  book_id: number;
  last_page: number;
  last_read: string; // ISO tarih stringi
} 