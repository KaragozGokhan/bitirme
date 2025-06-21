import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Book } from '../types';

interface MyBooksContextType {
  myBooks: Book[];
  addBooksToLibrary: (books: Book[]) => void;
  removeBookFromLibrary: (bookId: number) => void;
}

const MyBooksContext = createContext<MyBooksContextType | undefined>(undefined);

export const useMyBooks = () => {
  const context = useContext(MyBooksContext);
  if (!context) {
    throw new Error('useMyBooks must be used within a MyBooksProvider');
  }
  return context;
};

interface MyBooksProviderProps {
  children: ReactNode;
}

export const MyBooksProvider: React.FC<MyBooksProviderProps> = ({ children }) => {
  const [myBooks, setMyBooks] = useState<Book[]>(() => {
    try {
      const items = localStorage.getItem('myBooks');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Kitaplarım verisi okunurken hata oluştu:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('myBooks', JSON.stringify(myBooks));
    } catch (error) {
      console.error("Kitaplarım verisi kaydedilirken hata oluştu:", error);
    }
  }, [myBooks]);

  const addBooksToLibrary = (booksToAdd: Book[]) => {
    setMyBooks((prevBooks) => {
      const newBooks = booksToAdd.filter(
        (book) => !prevBooks.some((prevBook) => prevBook.id === book.id)
      );
      return [...prevBooks, ...newBooks];
    });
  };

  const removeBookFromLibrary = (bookId: number) => {
    setMyBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
  };

  return (
    <MyBooksContext.Provider value={{ myBooks, addBooksToLibrary, removeBookFromLibrary }}>
      {children}
    </MyBooksContext.Provider>
  );
}; 