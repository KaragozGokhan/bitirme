-- Migration: Kitaplar tablosuna audio_url alanı ekleme
-- Tarih: 2024

-- Audio URL alanını ekle
ALTER TABLE books ADD COLUMN IF NOT EXISTS audio_url VARCHAR(255);

-- Bazı kitaplar için örnek ses kitap URL'leri ekle
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' WHERE title = 'Suç ve Ceza' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=kJQP7kiw5Fk' WHERE title = '1984' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=9bZkp7q19f0' WHERE title = 'Simyacı' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=PSRildGCw64' WHERE title = 'Küçük Prens' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=UYhP3bLveQM' WHERE title = 'Dönüşüm' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=HEXWRTEbj1I' WHERE title = 'İnce Memed' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=oTJRivZTMLs' WHERE title = 'Kürk Mantolu Madonna' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=ZZ5LpwO-An4' WHERE title = 'Yabancı' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=HGYFEI6uLy0' WHERE title = 'Savaş ve Barış' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=L_jWHffIx5E' WHERE title = 'Anna Karenina' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=Tt7bzxurJ1I' WHERE title = 'Kara Kitap' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=vTIIMJ9tUc8' WHERE title = 'Kürk Mantolu Kadın' AND audio_url IS NULL;

-- comments tablosuna rate sütunu ekle
ALTER TABLE comments ADD COLUMN rate INTEGER CHECK (rate >= 1 AND rate <= 10); 