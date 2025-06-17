import React from 'react';
import { Book } from '../infrastructure/types';
import { bookService } from '../infrastructure/services/api';

interface BookCardProps {
    book: Book;
    onRent?: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onRent }) => {
    const handleRent = async () => {
        try {
            await bookService.rent(book.id);
            onRent?.();
        } catch (error) {
            console.error('Kitap kiralama hatası:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
                src={book.cover_image_url}
                alt={book.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
                <p className="text-gray-600 mb-2">{book.author}</p>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {book.description}
                </p>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">
                        {book.price.toLocaleString('tr-TR', {
                            style: 'currency',
                            currency: 'TRY'
                        })}
                    </span>
                    <button
                        onClick={handleRent}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Kirala
                    </button>
                </div>
            </div>
        </div>
    );
}; 