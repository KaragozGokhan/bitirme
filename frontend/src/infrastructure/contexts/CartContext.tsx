import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Book } from '../types';

interface CartItem extends Book {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
  clearCartOnLogout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const items = localStorage.getItem('cartItems');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Sepet verisi okunurken hata oluştu:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Sepet verisi kaydedilirken hata oluştu:", error);
    }
  }, [cartItems]);

  const addToCart = (book: Book) => {
    setCartItems((prevItems) => {
      const isItemInCart = prevItems.find((item) => item.id === book.id);
      if (isItemInCart) {
        alert("Bu kitap zaten sepetinizde.");
        return prevItems;
      }
      return [...prevItems, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== bookId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const clearCartOnLogout = () => {
    console.log("🛒 Çıkış yapılıyor, sepet temizleniyor...");
    setCartItems([]);
    try {
      localStorage.removeItem('cartItems');
    } catch (error) {
      console.error("Sepet localStorage temizlenirken hata oluştu:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, clearCartOnLogout }}>
      {children}
    </CartContext.Provider>
  );
}; 