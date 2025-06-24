import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { Book, User } from "../types";
import { userService } from "../services/api";

interface MyBooksContextType {
  myBooks: Book[];
  user: User | null;
  isPremiumUser: boolean;
  loading: boolean;
  addBooksToLibrary: (books: Book[]) => Promise<void>;
  removeBookFromLibrary: (bookId: number) => Promise<void>;
  updateUser: (userData: User) => void;
  refreshUserData: () => Promise<void>;
  refreshUserBooks: () => Promise<void>;
  resetUser: () => void;
  resetMyBooks: () => void;
  cancelPremiumSubscription: () => Promise<void>;
}

const MyBooksContext = createContext<MyBooksContextType | undefined>(undefined);

export const useMyBooks = () => {
  const context = useContext(MyBooksContext);
  if (!context) {
    throw new Error("useMyBooks must be used within a MyBooksProvider");
  }
  return context;
};

interface MyBooksProviderProps {
  children: ReactNode;
}

export const MyBooksProvider: React.FC<MyBooksProviderProps> = ({
  children,
}) => {
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const previousUserIdRef = useRef<number | null>(null);

  // isPremiumUser hesaplamasını useMemo ile optimize et
  const isPremiumUser = useMemo(() => {
    const result =
      user?.subscription_type === "premium" &&
      (!user.subscription_end_date ||
        new Date(user.subscription_end_date) > new Date());

    return result;
  }, [user?.subscription_type, user?.subscription_end_date]);

  const refreshUserData = async () => {
    try {
      const userData = await userService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error("Kullanıcı bilgileri güncellenirken hata:", error);
      setUser(null);
    }
  };

  const refreshUserBooks = useCallback(async () => {
    if (!user?.id) {
      console.log("❌ Kullanıcı ID yok, kitaplar yüklenemiyor");
      setMyBooks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(`📚 Kullanıcı ${user.id} için kitaplar yükleniyor...`);
      const books = await userService.getUserBooks(user.id);
      console.log(
        `✅ ${books.length} kitap yüklendi:`,
        books.map((b) => b.title)
      );
      setMyBooks(books);
    } catch (error) {
      console.error("Kullanıcı kitapları yüklenirken hata:", error);
      setMyBooks([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        // Token varsa kullanıcı bilgilerini yükle
        const token = localStorage.getItem("token");
        if (token) {
          console.log("🔑 Token bulundu, kullanıcı bilgileri yükleniyor...");
          await refreshUserData();
        } else {
          console.log("❌ Token bulunamadı, kullanıcı giriş yapmamış");
          setUser(null);
        }
      } finally {
        // Kullanıcı bilgileri yüklendikten sonra loading'i false yap
        // Kitaplar ayrı bir useEffect'te yüklenecek
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Kullanıcı değişikliğini algıla ve kitapları yönet
  useEffect(() => {
    const currentUserId = user?.id || null;
    const previousUserId = previousUserIdRef.current;

    console.log(
      `👤 Kullanıcı değişiklik kontrolü: ${previousUserId} -> ${currentUserId}`
    );

    // Kullanıcı değişikliği algılandı
    if (previousUserId !== currentUserId) {
      if (previousUserId !== null) {
        console.log(`🔄 Kullanıcı değişti! Eski state temizleniyor...`);
        setMyBooks([]);
        setLoading(true);
      }

      // Mevcut kullanıcı ID'sini sakla
      previousUserIdRef.current = currentUserId;
    }

    // Kullanıcı varsa kitapları yükle
    if (currentUserId) {
      console.log(`📚 Kullanıcı ${currentUserId} için kitaplar yükleniyor...`);
      refreshUserBooks();
    } else {
      // Kullanıcı yoksa kitapları temizle
      console.log(`❌ Kullanıcı yok, kitaplar temizleniyor...`);
      setMyBooks([]);
      setLoading(false);
    }
  }, [user?.id, refreshUserBooks]);

  // Subscription değişikliklerini ayrı olarak yönet
  useEffect(() => {
    if (user?.id && previousUserIdRef.current === user.id) {
      console.log(
        `🔄 Kullanıcı subscription bilgileri güncellendi, kitaplar yeniden yükleniyor...`
      );
      refreshUserBooks();
    }
  }, [user?.subscription_type, user?.subscription_end_date, refreshUserBooks]);

  // Premium süresi dolduğunda otomatik olarak premium kitapları kaldır
  useEffect(() => {
    if (!user?.id) return;

    const checkPremiumExpiration = () => {
      const isPremiumActive =
        user.subscription_type === "premium" &&
        (!user.subscription_end_date ||
          new Date(user.subscription_end_date) > new Date());

      // Eğer kullanıcı premium değilse ve kütüphanede premium kitaplar varsa
      if (!isPremiumActive) {
        const premiumBooks = myBooks.filter(
          (book) => book.acquisition_method === "premium"
        );
        if (premiumBooks.length > 0) {
          console.log(
            `⏰ Premium süresi doldu, ${premiumBooks.length} premium kitap kaldırılıyor...`
          );

          // Premium kitapları yerel state'ten kaldır
          setMyBooks((prevBooks) => {
            const filteredBooks = prevBooks.filter(
              (book) => book.acquisition_method !== "premium"
            );
            return filteredBooks;
          });

          // Backend'ten de premium kitapları kaldır (sunucu tarafında temizlik)
          premiumBooks.forEach(async (book) => {
            try {
              await userService.removeBookFromUser(user.id, book.id);
            } catch (error) {
              console.error(
                `Premium kitap ${book.title} kaldırılırken hata:`,
                error
              );
            }
          });
        }
      }
    };

    // Sayfa yüklendiğinde kontrol et
    checkPremiumExpiration();

    // Her dakika kontrol et (premium süresi dolmuş mu?)
    const interval = setInterval(checkPremiumExpiration, 60000);

    return () => clearInterval(interval);
  }, [user?.id, user?.subscription_type, user?.subscription_end_date, myBooks]);

  const addBooksToLibrary = async (booksToAdd: Book[]) => {
    if (!user?.id) {
      console.error("Kullanıcı girişi yapılmamış");
      return;
    }

    try {
      const bookIds = booksToAdd.map((book) => book.id);
      const acquisitionMethod = booksToAdd[0]?.acquisition_method || "purchase";

      await userService.addBooksToUser(user.id, bookIds, acquisitionMethod);

      // Kitapları yerel state'e de ekle (anında güncelleme için)
      setMyBooks((prevBooks) => {
        const newBooks = booksToAdd.filter(
          (book) => !prevBooks.some((prevBook) => prevBook.id === book.id)
        );
        return [...prevBooks, ...newBooks];
      });
    } catch (error) {
      console.error("Kitap ekleme hatası:", error);
      throw error;
    }
  };

  const removeBookFromLibrary = async (bookId: number) => {
    if (!user?.id) {
      console.error("Kullanıcı girişi yapılmamış");
      return;
    }

    try {
      await userService.removeBookFromUser(user.id, bookId);

      // Kitabı yerel state'ten de kaldır (anında güncelleme için)
      setMyBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Kitap silme hatası:", error);
      throw error;
    }
  };

  const updateUser = (userData: User) => {
    console.log(`👤 Kullanıcı güncelleniyor:`, userData);
    setUser(userData);
  };

  const resetUser = () => {
    console.log(`🔄 Kullanıcı state'i sıfırlanıyor...`);
    setUser(null);
    setMyBooks([]);
    previousUserIdRef.current = null;
    setLoading(false);
  };

  const resetMyBooks = () => {
    console.log(`📚 Kitap state'i sıfırlanıyor...`);
    setMyBooks([]);
    setLoading(false);
  };

  const cancelPremiumSubscription = async () => {
    if (!user?.id) {
      console.error("Kullanıcı girişi yapılmamış");
      return;
    }

    try {
      console.log(`🚫 Premium abonelik iptal ediliyor...`);
      const updatedUser = await userService.cancelPremiumSubscription(user.id);

      // Kullanıcı bilgilerini güncelle
      setUser(updatedUser);

      // Premium kitapları yerel state'ten kaldır
      setMyBooks((prevBooks) => {
        const filteredBooks = prevBooks.filter(
          (book) => book.acquisition_method !== "premium"
        );
        console.log(
          `📚 ${
            prevBooks.length - filteredBooks.length
          } premium kitap yerel state'ten kaldırıldı`
        );
        return filteredBooks;
      });

      console.log(
        `✅ Premium abonelik iptal edildi. ${
          updatedUser.removed_premium_books_count || 0
        } kitap kaldırıldı.`
      );
    } catch (error) {
      console.error("Premium iptal hatası:", error);
      throw error;
    }
  };

  const loadMyBooks = async (userId: number) => {
    if (!userId) {
      return;
    }

    try {
      const books = await userService.getMyBooks();
      setMyBooks(books);
    } catch (error) {
      console.error("Kitaplar yüklenemedi:", error);
      setMyBooks([]);
    }
  };

  return (
    <MyBooksContext.Provider
      value={{
        myBooks,
        user,
        isPremiumUser,
        loading,
        addBooksToLibrary,
        removeBookFromLibrary,
        updateUser,
        refreshUserData,
        refreshUserBooks,
        resetUser,
        resetMyBooks,
        cancelPremiumSubscription,
      }}
    >
      {children}
    </MyBooksContext.Provider>
  );
};
