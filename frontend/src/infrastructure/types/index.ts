export interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    created_at: string;
    subscription_type: string;
    subscription_end_date?: string;
}

export interface Book {
    id: number;
    title: string;
    author: string;
    description?: string;
    cover_image_url?: string;
    pdf_url?: string;
    youtube_url?: string;
    price: number;
    created_at?: string;
    categories?: Category[];
}

export interface Category {
    id: number;
    name: string;
}

export interface Rental {
    id: number;
    user_id: number;
    book_id: number;
    rental_date: string;
    return_date?: string;
    status: string;
}

export interface ReadingHistory {
    id: number;
    user_id: number;
    book_id: number;
    last_page: number;
    last_read: string;
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
    username: string;
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

export interface BackendLoginResponse {
    message: string;
    user: User;
}

export interface ApiError {
    message: string;
    status: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
} 