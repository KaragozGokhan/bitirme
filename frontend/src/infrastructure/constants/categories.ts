export interface Category {
  id: number;
  name: string;
}

export const categories: Category[] = [
  { id: 1, name: "Roman" },
  { id: 2, name: "Bilim Kurgu" },
  { id: 3, name: "Klasik" },
  { id: 4, name: "Çocuk" },
  { id: 5, name: "Felsefe" },
  { id: 6, name: "Tarih" },
  { id: 7, name: "Biyografi" },
  { id: 8, name: "Kişisel Gelişim" },
  { id: 9, name: "Polisiye" },
  { id: 10, name: "Fantastik" },
  { id: 11, name: "Psikoloji" },
  { id: 12, name: "Edebiyat" },
  { id: 13, name: "Macera" },
  { id: 14, name: "Dram" },
  { id: 15, name: "Şiir" },
];

export const getCategoryById = (id: number): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getCategoryName = (id: number): string => {
  const category = getCategoryById(id);
  return category ? category.name : 'Bilinmeyen Kategori';
}; 