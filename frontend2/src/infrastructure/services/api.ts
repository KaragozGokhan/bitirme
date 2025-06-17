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
    LoginResponse
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
    if (token) {
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