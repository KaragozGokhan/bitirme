-- Migration: Add audio_url column to books table

-- Add audio_url column to books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS audio_url VARCHAR(255);

-- Bazı kitaplar için örnek ses kitap URL'leri ekle
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=safBpRdRLY8&t=2s' WHERE title = 'Suç ve Ceza' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=Bok26gZkABk' WHERE title = '1984' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=AeO-jtvAUZ8' WHERE title = 'Simyacı' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=-azfwc5TN5I' WHERE title = 'Küçük Prens' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=9flYRqTcNZY' WHERE title = 'Dönüşüm' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=sz41xxF1mQo' WHERE title = 'Kürk Mantolu Madonna' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=uLAxbDyijco' WHERE title = 'Anna Karenina' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=kVAwL1UFclY' WHERE title = 'Beyaz Diş' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=Ik34eIXb8jA' WHERE title = 'Sefiller' AND audio_url IS NULL;
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=Ob7AEp7QXzs' WHERE title = 'Yabancı' AND audio_url IS NULL;

-- Add rate column to comments table
ALTER TABLE comments ADD COLUMN rate INTEGER CHECK (rate >= 1 AND rate <= 10); 