import axios from 'axios';
import {
    Book,
    Rental,
    RegisterRequest,
    User,
    ReadingHistory,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UpdateSubscriptionRequest,
    LoginResponse,
    BackendLoginResponse,
    Comment,
    RecommendationResponse,
    Admin,
    AdminLoginResponse
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
    login: async (email: string, password: string): Promise<User> => {
        const response = await api.post<BackendLoginResponse>('/auth/login', { email, password });
        
        // Artık backend'den gelen gerçek token kaydedilecek
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        
        return response.data.user;
    },
    register: async (data: RegisterRequest): Promise<User> => {
        const response = await api.post<BackendLoginResponse>('/auth/register', data);
        
        // Artık backend'den gelen gerçek token kaydedilecek
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        
        return response.data.user;
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
    async getBooks(): Promise<Book[]> {
        const response = await api.get<Book[]>("/books");
        return response.data;
    },
    getBookById: async (id: number): Promise<Book> => {
        try {
            const response = await api.get<Book>(`/books/${id}`);
            return response.data;
        } catch (error) {
            console.error(`/books/${id} endpoint mevcut değil, tüm kitaplardan aranıyor...`);
            // Eğer /books/:id endpoint'i yoksa, tüm kitapları getir ve ID'ye göre filtrele
            const allBooks = await bookService.getBooks();
            const book = allBooks.find(b => b.id === id);
            if (!book) {
                throw new Error(`ID ${id} ile kitap bulunamadı`);
            }
            return book;
        }
    },
    rentBook: async (bookId: number): Promise<void> => {
        await api.post(`/books/${bookId}/rent`);
    },
    returnBook: async (bookId: number): Promise<void> => {
        await api.post(`/books/${bookId}/return`);
    },
    getRentedBooks: async (): Promise<Book[]> => {
        const response = await api.get<Book[]>('/books/rented');
        return response.data;
    },
    getMyBooks: async (): Promise<any[]> => {
        const response = await api.get<any[]>('/users/my-books');
        return response.data;
    },
    checkAudioAccess: async (bookId: number, userId: number): Promise<{has_access: boolean}> => {
        const response = await api.get<{has_access: boolean}>(`/books/${bookId}/audio-access?user_id=${userId}`);
        return response.data;
    },
    updateReadingProgress: async (bookId: number, page: number): Promise<void> => {
        await api.post(`/books/${bookId}/progress`, { page });
    },
    async getBooksByCategory(categoryId: number): Promise<Book[]> {
        const response = await api.get<Book[]>(`/books/categories/${categoryId}`);
        return response.data;
    },
};

// User services
export const userService = {
    getProfile: async (): Promise<User> => {
        const response = await api.get<User>('/users/profile');
        return response.data;
    },
    updateProfile: async (data: Partial<User>): Promise<User> => {
        const response = await api.put<User>('/users/profile', data);
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
    upgradeSubscription: async (userId: number): Promise<User> => {
        const response = await api.put<User>(`/users/${userId}/subscription`, {
            subscription_type: "premium",
            months: 1,
        });
        return response.data;
    },
    cancelPremiumSubscription: async (userId: number): Promise<User & {removed_premium_books_count?: number}> => {
        const response = await api.delete<User & {removed_premium_books_count?: number}>(`/users/${userId}/subscription/cancel`);
        return response.data;
    },
    // Kullanıcının kitaplarını getir
    getUserBooks: async (userId: number): Promise<Book[]> => {
        const response = await api.get<Book[]>(`/users/${userId}/books`);
        return response.data;
    },
    // Kullanıcının kütüphanesine kitap ekle
    addBooksToUser: async (userId: number, bookIds: number[], acquisitionMethod: string = 'purchase'): Promise<{message: string, books: Book[]}> => {
        const response = await api.post<{message: string, books: Book[]}>(`/users/${userId}/books`, {
            book_ids: bookIds,
            acquisition_method: acquisitionMethod
        });
        return response.data;
    },
    // Kullanıcının kütüphanesinden kitap sil
    removeBookFromUser: async (userId: number, bookId: number): Promise<{message: string}> => {
        const response = await api.delete<{message: string}>(`/users/${userId}/books/${bookId}`);
        return response.data;
    },
};

export const commentService = {
    // Belirli bir kitabın yorumlarını getir
    getCommentsByBook: async (bookId: number): Promise<Comment[]> => {
        const response = await api.get<Comment[]>(`/comments/book/${bookId}`);
        return response.data;
    },
    // Yorum ekle
    addComment: async (bookId: number, comment: string, rate: number): Promise<Comment> => {
        const response = await api.post<Comment>('/comments/', { book_id: bookId, comment, rate });
        return response.data;
    },
    // Yorum sil
    deleteComment: async (commentId: number): Promise<void> => {
        await api.delete(`/comments/${commentId}`);
    },
};

export const aiService = {
    train: async (): Promise<any> => {
        const response = await axios.post('http://localhost:8000/ai/train');
        return response.data;
    },
    getSimilarUsersRecommendations: async (userId: number, limit: number = 5): Promise<RecommendationResponse> => {
        const response = await axios.get<RecommendationResponse>(`http://localhost:8000/ai/similar-users-recommendations/${userId}?limit=${limit}`);
        return response.data;
    },
};

export const adminService = {
    login: async (email: string, password: string): Promise<AdminLoginResponse> => {
        const response = await api.post<AdminLoginResponse>('/admin/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('admin_token', response.data.token);
        }
        return response.data;
    },
    
    logout: () => {
        localStorage.removeItem('admin_token');
    },

    // Admin interceptor için ayrı axios instance
    getApiWithAdminAuth: () => {
        const adminApi = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        adminApi.interceptors.request.use((config) => {
            const token = localStorage.getItem('admin_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
        
        return adminApi;
    },

    // Kitap yönetimi
    getBooks: async (): Promise<Book[]> => {
        const adminApi = adminService.getApiWithAdminAuth();
        const response = await adminApi.get<Book[]>('/admin/books');
        return response.data;
    },

    addBook: async (bookData: Omit<Book, 'id' | 'created_at'>): Promise<Book> => {
        const adminApi = adminService.getApiWithAdminAuth();
        const response = await adminApi.post<{ message: string; book: Book }>('/admin/add-book', bookData);
        return response.data.book;
    },

    updateBook: async (id: number, bookData: Partial<Book>): Promise<Book> => {
        const adminApi = adminService.getApiWithAdminAuth();
        const response = await adminApi.put<Book>(`/admin/books/${id}`, bookData);
        return response.data;
    },

    deleteBook: async (id: number): Promise<void> => {
        const adminApi = adminService.getApiWithAdminAuth();
        await adminApi.delete(`/admin/books/${id}`);
    },

    // User yönetimi  
    getUsers: async (): Promise<User[]> => {
        const adminApi = adminService.getApiWithAdminAuth();
        const response = await adminApi.get<User[]>('/admin/users');
        return response.data;
    },

    updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
        const adminApi = adminService.getApiWithAdminAuth();
        const response = await adminApi.put<User>(`/admin/users/${id}`, userData);
        return response.data;
    },

    deleteUser: async (id: number): Promise<void> => {
        const adminApi = adminService.getApiWithAdminAuth();
        await adminApi.delete(`/admin/users/${id}`);
    },

    // Subscription yönetimi
    getUserSubscriptions: async (): Promise<any[]> => {
        const adminApi = adminService.getApiWithAdminAuth();
        const response = await adminApi.get<any[]>('/admin/subscriptions');
        return response.data;
    },

    updateUserSubscription: async (userId: number, subscriptionData: any): Promise<User> => {
        const adminApi = adminService.getApiWithAdminAuth();
        const response = await adminApi.put<User>(`/admin/users/${userId}/subscription`, subscriptionData);
        return response.data;
    },

    // Yorum yönetimi
    getComments: async (): Promise<Comment[]> => {
        const adminApi = adminService.getApiWithAdminAuth();
        const response = await adminApi.get<Comment[]>('/admin/comments');
        return response.data;
    },

    deleteComment: async (id: number): Promise<void> => {
        const adminApi = adminService.getApiWithAdminAuth();
        await adminApi.delete(`/admin/comments/${id}`);
    },

    // Dashboard istatistikleri
    getDashboardStats: async (): Promise<any> => {
        const adminApi = adminService.getApiWithAdminAuth();
        const response = await adminApi.get<any>('/admin/stats');
        return response.data;
    },
}; 