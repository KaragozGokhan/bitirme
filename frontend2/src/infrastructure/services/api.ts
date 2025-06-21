import axios from 'axios';
import {
    AuthResponse,
    Book,
    LoginRequest,
    Rental,
    RegisterRequest,
    User,
    ReadingHistory,
    UserRental,
    UserReadingHistory,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UpdateSubscriptionRequest,
    UpdateReadingProgressRequest,
    LoginResponse,
    AdminUser,
    AdminBook,
    AdminRental,
    AdminStats,
    CreateBookRequest,
    UpdateBookRequest,
    CreateUserRequest,
    UpdateUserRequest,
    AdminDashboardData
} from '../types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth services
export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login', { email, password });
        return response.data;
    },
    register: async (data: RegisterRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/register', data);
        return response.data;
    },
    forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
        await api.post('/auth/forgot-password', data);
    },
    resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
        await api.post('/auth/reset-password', data);
    },
    logout: () => {
        localStorage.removeItem('token');
    },
};

// Book services
export const bookService = {
    getAllBooks: async (): Promise<Book[]> => {
        const response = await api.get<Book[]>('/books');
        return response.data;
    },
    getBookById: async (id: number): Promise<Book> => {
        const response = await api.get<Book>(`/books/${id}`);
        return response.data;
    },
    rentBook: async (bookId: number): Promise<void> => {
        await api.post(`/books/${bookId}/rent`);
    },
    returnBook: async (bookId: number): Promise<void> => {
        await api.post(`/books/${bookId}/return`);
    },
    updateReadingProgress: async (bookId: number, page: number): Promise<void> => {
        await api.post(`/books/${bookId}/progress`, { page });
    },
};

// User services
export const userService = {
    getProfile: async (): Promise<User> => {
        const response = await api.get<User>('/users/profile');
        return response.data;
    },
    getRentals: async (): Promise<Rental[]> => {
        const response = await api.get<Rental[]>('/users/rentals');
        return response.data;
    },
    getReadingHistory: async (): Promise<ReadingHistory[]> => {
        const response = await api.get<ReadingHistory[]>('/users/reading-history');
        return response.data;
    },
    updateSubscription: async (userId: number, data: UpdateSubscriptionRequest): Promise<User> => {
        const response = await api.put<User>(`/users/${userId}/subscription`, data);
        return response.data;
    },
};

// Admin services
export const adminService = {
    // Dashboard
    getDashboardData: async (): Promise<AdminDashboardData> => {
        const response = await api.get<AdminDashboardData>('/admin/dashboard');
        return response.data;
    },
    getStats: async (): Promise<AdminStats> => {
        const response = await api.get<AdminStats>('/admin/stats');
        return response.data;
    },

    // User Management
    getAllUsers: async (): Promise<AdminUser[]> => {
        const response = await api.get<AdminUser[]>('/admin/users');
        return response.data;
    },
    getUserById: async (id: number): Promise<AdminUser> => {
        const response = await api.get<AdminUser>(`/admin/users/${id}`);
        return response.data;
    },
    createUser: async (data: CreateUserRequest): Promise<AdminUser> => {
        const response = await api.post<AdminUser>('/admin/users', data);
        return response.data;
    },
    updateUser: async (data: UpdateUserRequest): Promise<AdminUser> => {
        const response = await api.put<AdminUser>(`/admin/users/${data.id}`, data);
        return response.data;
    },
    deleteUser: async (id: number): Promise<void> => {
        await api.delete(`/admin/users/${id}`);
    },
    toggleUserStatus: async (id: number): Promise<AdminUser> => {
        const response = await api.patch<AdminUser>(`/admin/users/${id}/toggle-status`);
        return response.data;
    },

    // Book Management
    getAllBooks: async (): Promise<AdminBook[]> => {
        const response = await api.get<AdminBook[]>('/admin/books');
        return response.data;
    },
    getBookById: async (id: number): Promise<AdminBook> => {
        const response = await api.get<AdminBook>(`/admin/books/${id}`);
        return response.data;
    },
    createBook: async (data: CreateBookRequest): Promise<AdminBook> => {
        const response = await api.post<AdminBook>('/admin/books', data);
        return response.data;
    },
    updateBook: async (data: UpdateBookRequest): Promise<AdminBook> => {
        const response = await api.put<AdminBook>(`/admin/books/${data.id}`, data);
        return response.data;
    },
    deleteBook: async (id: number): Promise<void> => {
        await api.delete(`/admin/books/${id}`);
    },
    toggleBookAvailability: async (id: number): Promise<AdminBook> => {
        const response = await api.patch<AdminBook>(`/admin/books/${id}/toggle-availability`);
        return response.data;
    },

    // Rental Management
    getAllRentals: async (): Promise<AdminRental[]> => {
        const response = await api.get<AdminRental[]>('/admin/rentals');
        return response.data;
    },
    getAvailableBooks: async (): Promise<AdminBook[]> => {
        const response = await api.get<AdminBook[]>('/admin/rentals/available-books');
        return response.data;
    },
    getRentalById: async (id: number): Promise<AdminRental> => {
        const response = await api.get<AdminRental>(`/admin/rentals/${id}`);
        return response.data;
    },
    updateRentalStatus: async (id: number, status: string): Promise<AdminRental> => {
        const response = await api.patch<AdminRental>(`/admin/rentals/${id}/status`, { status });
        return response.data;
    },
    extendRental: async (id: number, days: number): Promise<AdminRental> => {
        const response = await api.patch<AdminRental>(`/admin/rentals/${id}/extend`, { days });
        return response.data;
    },

    // Reports
    getOverdueRentals: async (): Promise<AdminRental[]> => {
        const response = await api.get<AdminRental[]>('/admin/reports/overdue');
        return response.data;
    },
    getPopularBooks: async (): Promise<AdminBook[]> => {
        const response = await api.get<AdminBook[]>('/admin/reports/popular-books');
        return response.data;
    },
    getActiveUsers: async (): Promise<AdminUser[]> => {
        const response = await api.get<AdminUser[]>('/admin/reports/active-users');
        return response.data;
    },
}; 