export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    created_at: string;
    subscription_type?: string;
    subscription_end_date?: string;
}

export interface Book {
    id: number;
    title: string;
    author: string;
    description?: string;
    coverImage?: string;
    isAvailable: boolean;
    created_at: string;
}

export interface Rental {
    id: number;
    book: Book;
    user: User;
    rentalDate: string;
    returnDate: string;
    status: string;
}

export interface ReadingHistory {
    id: number;
    book: Book;
    user: User;
    readDate: string;
    readingTime: number;
    lastPage: number;
}

export interface UserRental {
    rental_id: number;
    rental_date: string;
    return_date: string | null;
    status: string;
    book_id: number;
    title: string;
    author: string;
    cover_image_url: string;
}

export interface UserReadingHistory {
    history_id: number;
    last_page: number;
    last_read: string;
    book_id: number;
    title: string;
    author: string;
    cover_image_url: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    new_password: string;
}

export interface UpdateSubscriptionRequest {
    subscription_type: string;
    months: number;
}

export interface UpdateReadingProgressRequest {
    user_id: number;
    page: number;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface ApiError {
    message: string;
    status: number;
} 