export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    created_at: string;
    subscription_type?: string;
    subscription_end_date?: string;
    role?: string;
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
    first_name: string;
    last_name: string;
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

// Admin Panel Types
export interface AdminUser extends User {
    role?: string;
    isActive?: boolean;
    lastLogin?: string;
    totalRentals?: number;
    totalBooksRead?: number;
}

export interface AdminBook extends Book {
    totalRentals?: number;
    averageRating?: number;
    totalPages?: number;
    category?: string;
    isbn?: string;
    publishDate?: string;
    language?: string;
    price?: number;
}

export interface AdminRental {
    id: number;
    book: AdminBook;
    user: AdminUser;
    rentalDate: string;
    returnDate: string;
    status: 'active' | 'returned' | 'overdue' | 'cancelled';
    overdueDays?: number;
}

export interface AdminStats {
    totalUsers: number;
    totalBooks: number;
    totalRentals: number;
    activeRentals: number;
    overdueRentals: number;
    totalRevenue: number;
    monthlyStats: {
        newUsers: number;
        newBooks: number;
        newRentals: number;
        revenue: number;
    };
}

export interface CreateBookRequest {
    title: string;
    author: string;
    description: string;
    coverImage?: string;
    pdfUrl?: string;
    price: number;
    category?: string;
    isbn?: string;
    publishDate?: string;
    language?: string;
    totalPages?: number;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {
    id: number;
}

export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
}

export interface UpdateUserRequest {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
    subscriptionType?: string;
    subscriptionEndDate?: string;
}

export interface AdminDashboardData {
    stats: AdminStats;
    recentRentals: AdminRental[];
    topBooks: AdminBook[];
    topUsers: AdminUser[];
} 