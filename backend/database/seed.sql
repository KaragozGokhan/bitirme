INSERT INTO users (username, email, password_hash, subscription_type, subscription_end_date) VALUES
('ahmet123', 'ahmet@example.com', '$2a$10$randomhash1', 'premium', '2024-12-31'),
('ayse.yilmaz', 'ayse@example.com', '$2a$10$randomhash2', 'free', NULL),
('mehmet.demir', 'mehmet@example.com', '$2a$10$randomhash3', 'premium', '2024-06-30'),
('zeynep.kaya', 'zeynep@example.com', '$2a$10$randomhash4', 'free', NULL),
('ali.yildiz', 'ali@example.com', '$2a$10$randomhash5', 'premium', '2024-09-30'),
('fatma.arslan', 'fatma@example.com', '$2a$10$randomhash6', 'free', NULL),
('mustafa.celik', 'mustafa@example.com', '$2a$10$randomhash7', 'premium', '2024-12-31'),
('elif.sahin', 'elif@example.com', '$2a$10$randomhash8', 'free', NULL),
('can.ozturk', 'can@example.com', '$2a$10$randomhash9', 'premium', '2024-06-30'),
('seda.ak', 'seda@example.com', '$2a$10$randomhash10', 'free', NULL),
('burak.yilmaz', 'burak@example.com', '$2a$10$randomhash11', 'premium', '2024-09-30'),
('deniz.kaya', 'deniz@example.com', '$2a$10$randomhash12', 'free', NULL),
('emre.demir', 'emre@example.com', '$2a$10$randomhash13', 'premium', '2024-12-31'),
('gizem.arslan', 'gizem@example.com', '$2a$10$randomhash14', 'free', NULL),
('hakan.celik', 'hakan@example.com', '$2a$10$randomhash15', 'premium', '2024-06-30'),
('irem.sahin', 'irem@example.com', '$2a$10$randomhash16', 'free', NULL),
('jale.ozturk', 'jale@example.com', '$2a$10$randomhash17', 'premium', '2024-09-30'),
('kamil.ak', 'kamil@example.com', '$2a$10$randomhash18', 'free', NULL),
('leyla.yilmaz', 'leyla@example.com', '$2a$10$randomhash19', 'premium', '2024-12-31'),
('murat.kaya', 'murat@example.com', '$2a$10$randomhash20', 'free', NULL),
('naz.demir', 'naz@example.com', '$2a$10$randomhash21', 'premium', '2024-06-30'),
('omer.arslan', 'omer@example.com', '$2a$10$randomhash22', 'free', NULL),
('pinar.celik', 'pinar@example.com', '$2a$10$randomhash23', 'premium', '2024-09-30'),
('rıza.sahin', 'riza@example.com', '$2a$10$randomhash24', 'free', NULL),
('selin.ozturk', 'selin@example.com', '$2a$10$randomhash25', 'premium', '2024-12-31'),
('tamer.ak', 'tamer@example.com', '$2a$10$randomhash26', 'free', NULL),
('umut.yilmaz', 'umut@example.com', '$2a$10$randomhash27', 'premium', '2024-06-30'),
('vildan.kaya', 'vildan@example.com', '$2a$10$randomhash28', 'free', NULL),
('yusuf.demir', 'yusuf@example.com', '$2a$10$randomhash29', 'premium', '2024-09-30'),
('zara.arslan', 'zara@example.com', '$2a$10$randomhash30', 'free', NULL),
('arda.celik', 'arda@example.com', '$2a$10$randomhash31', 'premium', '2024-12-31'),
('buse.sahin', 'buse@example.com', '$2a$10$randomhash32', 'free', NULL),
('cagri.ozturk', 'cagri@example.com', '$2a$10$randomhash33', 'premium', '2024-06-30'),
('dilara.ak', 'dilara@example.com', '$2a$10$randomhash34', 'free', NULL),
('efe.yilmaz', 'efe@example.com', '$2a$10$randomhash35', 'premium', '2024-09-30'),
('feyza.kaya', 'feyza@example.com', '$2a$10$randomhash36', 'free', NULL),
('gokhan.demir', 'gokhan@example.com', '$2a$10$randomhash37', 'premium', '2024-12-31'),
('hazal.arslan', 'hazal@example.com', '$2a$10$randomhash38', 'free', NULL),
('ismail.celik', 'ismail@example.com', '$2a$10$randomhash39', 'premium', '2024-06-30'),
('jade.sahin', 'jade@example.com', '$2a$10$randomhash40', 'free', NULL),
('kaya.ozturk', 'kaya@example.com', '$2a$10$randomhash41', 'premium', '2024-09-30'),
('lale.ak', 'lale@example.com', '$2a$10$randomhash42', 'free', NULL),
('mert.yilmaz', 'mert@example.com', '$2a$10$randomhash43', 'premium', '2024-12-31'),
('nur.kaya', 'nur@example.com', '$2a$10$randomhash44', 'free', NULL),
('onur.demir', 'onur@example.com', '$2a$10$randomhash45', 'premium', '2024-06-30'),
('pamir.arslan', 'pamir@example.com', '$2a$10$randomhash46', 'free', NULL),
('rukiye.celik', 'rukiye@example.com', '$2a$10$randomhash47', 'premium', '2024-09-30'),
('sarp.sahin', 'sarp@example.com', '$2a$10$randomhash48', 'free', NULL),
('tugce.ozturk', 'tugce@example.com', '$2a$10$randomhash49', 'premium', '2024-12-31'),
('utku.ak', 'utku@example.com', '$2a$10$randomhash50', 'free', NULL);

INSERT INTO books (title, author, description, cover_image_url, pdf_url, price) VALUES
('Suç ve Ceza', 'Fyodor Dostoyevski', 'Klasik Rus edebiyatının başyapıtlarından', 'https://example.com/covers/suc-ve-ceza.jpg', 'https://example.com/pdfs/suc-ve-ceza.pdf', 45.99),
('1984', 'George Orwell', 'Distopik bir gelecek romanı', 'https://example.com/covers/1984.jpg', 'https://example.com/pdfs/1984.pdf', 35.50),
('Simyacı', 'Paulo Coelho', 'Kişisel gelişim romanı', 'https://example.com/covers/simyaci.jpg', 'https://example.com/pdfs/simyaci.pdf', 29.99),
('Küçük Prens', 'Antoine de Saint-Exupéry', 'Çocuk klasikleri', 'https://example.com/covers/kucuk-prens.jpg', 'https://example.com/pdfs/kucuk-prens.pdf', 25.00),
('Dönüşüm', 'Franz Kafka', 'Modern klasik', 'https://example.com/covers/donusum.jpg', 'https://example.com/pdfs/donusum.pdf', 30.00),
('Sefiller', 'Victor Hugo', 'Fransız edebiyatı klasikleri', 'https://example.com/covers/sefiller.jpg', 'https://example.com/pdfs/sefiller.pdf', 40.00),
('İnce Memed', 'Yaşar Kemal', 'Türk edebiyatı klasikleri', 'https://example.com/covers/ince-memed.jpg', 'https://example.com/pdfs/ince-memed.pdf', 35.00),
('Saatleri Ayarlama Enstitüsü', 'Ahmet Hamdi Tanpınar', 'Modern Türk edebiyatı', 'https://example.com/covers/saatleri-ayarlama.jpg', 'https://example.com/pdfs/saatleri-ayarlama.pdf', 32.50),
('Tutunamayanlar', 'Oğuz Atay', 'Postmodern Türk edebiyatı', 'https://example.com/covers/tutunamayanlar.jpg', 'https://example.com/pdfs/tutunamayanlar.pdf', 38.00),
('Kürk Mantolu Madonna', 'Sabahattin Ali', 'Türk edebiyatı klasikleri', 'https://example.com/covers/kurk-mantolu-madonna.jpg', 'https://example.com/pdfs/kurk-mantolu-madonna.pdf', 27.50),
('Yabancı', 'Albert Camus', 'Varoluşçu edebiyat', 'https://example.com/covers/yabanci.jpg', 'https://example.com/pdfs/yabanci.pdf', 33.00),
('Fareler ve İnsanlar', 'John Steinbeck', 'Modern klasik', 'https://example.com/covers/fareler-ve-insanlar.jpg', 'https://example.com/pdfs/fareler-ve-insanlar.pdf', 28.50),
('Beyaz Diş', 'Jack London', 'Macera romanı', 'https://example.com/covers/beyaz-dis.jpg', 'https://example.com/pdfs/beyaz-dis.pdf', 31.00),
('Savaş ve Barış', 'Lev Tolstoy', 'Rus edebiyatı klasikleri', 'https://example.com/covers/savas-ve-baris.jpg', 'https://example.com/pdfs/savas-ve-baris.pdf', 42.00),
('Madame Bovary', 'Gustave Flaubert', 'Fransız edebiyatı klasikleri', 'https://example.com/covers/madame-bovary.jpg', 'https://example.com/pdfs/madame-bovary.pdf', 36.00),
('Anna Karenina', 'Lev Tolstoy', 'Rus edebiyatı klasikleri', 'https://example.com/covers/anna-karenina.jpg', 'https://example.com/pdfs/anna-karenina.pdf', 39.00),
('Don Kişot', 'Miguel de Cervantes', 'İspanyol edebiyatı klasikleri', 'https://example.com/covers/don-kisot.jpg', 'https://example.com/pdfs/don-kisot.pdf', 37.00),
('Ulysses', 'James Joyce', 'Modern klasik', 'https://example.com/covers/ulysses.jpg', 'https://example.com/pdfs/ulysses.pdf', 41.00),
('Beyaz Geceler', 'Fyodor Dostoyevski', 'Rus edebiyatı klasikleri', 'https://example.com/covers/beyaz-geceler.jpg', 'https://example.com/pdfs/beyaz-geceler.pdf', 29.00),
('Karamazov Kardeşler', 'Fyodor Dostoyevski', 'Rus edebiyatı klasikleri', 'https://example.com/covers/karamazov-kardesler.jpg', 'https://example.com/pdfs/karamazov-kardesler.pdf', 43.00),
('Yeraltından Notlar', 'Fyodor Dostoyevski', 'Psikolojik roman', 'https://example.com/covers/yeraltindan-notlar.jpg', 'https://example.com/pdfs/yeraltindan-notlar.pdf', 34.00),
('Vadideki Zambak', 'Honoré de Balzac', 'Fransız edebiyatı', 'https://example.com/covers/vadideki-zambak.jpg', 'https://example.com/pdfs/vadideki-zambak.pdf', 28.00),
('Körlük', 'José Saramago', 'Modern roman', 'https://example.com/covers/korluk.jpg', 'https://example.com/pdfs/korluk.pdf', 31.50),
('Aşk ve Gurur', 'Jane Austen', 'İngiliz edebiyatı', 'https://example.com/covers/ask-ve-gurur.jpg', 'https://example.com/pdfs/ask-ve-gurur.pdf', 29.00),
('Gazap Üzümleri', 'John Steinbeck', 'Amerikan edebiyatı', 'https://example.com/covers/gazap-uzumleri.jpg', 'https://example.com/pdfs/gazap-uzumleri.pdf', 33.00),
('Kırmızı ve Siyah', 'Stendhal', 'Fransız romanı', 'https://example.com/covers/kirmizi-ve-siyah.jpg', 'https://example.com/pdfs/kirmizi-ve-siyah.pdf', 32.00),
('Denemeler', 'Montaigne', 'Felsefi denemeler', 'https://example.com/covers/denemeler.jpg', 'https://example.com/pdfs/denemeler.pdf', 27.00),
('Siddhartha', 'Hermann Hesse', 'Doğu felsefesi', 'https://example.com/covers/siddhartha.jpg', 'https://example.com/pdfs/siddhartha.pdf', 26.00),
('Martı', 'Anton Çehov', 'Rus tiyatrosu', 'https://example.com/covers/marti.jpg', 'https://example.com/pdfs/marti.pdf', 24.00),
('Bülbülü Öldürmek', 'Harper Lee', 'Amerikan romanı', 'https://example.com/covers/bulbulu-oldurmek.jpg', 'https://example.com/pdfs/bulbulu-oldurmek.pdf', 30.00),
('Yüzyıllık Yalnızlık', 'Gabriel Garcia Marquez', 'Latin Amerika edebiyatı', 'https://example.com/covers/yuz-yillik-yalnizlik.jpg', 'https://example.com/pdfs/yuz-yillik-yalnizlik.pdf', 38.00),
('Karamela Sepeti', 'Ayşe Kulin', 'Türk romanı', 'https://example.com/covers/karamela-sepeti.jpg', 'https://example.com/pdfs/karamela-sepeti.pdf', 22.00),
('Kuyucaklı Yusuf', 'Sabahattin Ali', 'Türk edebiyatı', 'https://example.com/covers/kuyucakli-yusuf.jpg', 'https://example.com/pdfs/kuyucakli-yusuf.pdf', 27.00),
('Serenad', 'Zülfü Livaneli', 'Modern Türk romanı', 'https://example.com/covers/serenad.jpg', 'https://example.com/pdfs/serenad.pdf', 29.00),
('Kayıp Zamanın İzinde', 'Marcel Proust', 'Fransız romanı', 'https://example.com/covers/kayip-zamanin-izinde.jpg', 'https://example.com/pdfs/kayip-zamanin-izinde.pdf', 44.00),
('Dava', 'Franz Kafka', 'Modern klasik', 'https://example.com/covers/dava.jpg', 'https://example.com/pdfs/dava.pdf', 31.00),
('Hayvan Çiftliği', 'George Orwell', 'Siyasi hiciv', 'https://example.com/covers/hayvan-ciftligi.jpg', 'https://example.com/pdfs/hayvan-ciftligi.pdf', 28.00),
('Kumral Ada Mavi Tuna', 'Buket Uzuner', 'Türk romanı', 'https://example.com/covers/kumral-ada-mavi-tuna.jpg', 'https://example.com/pdfs/kumral-ada-mavi-tuna.pdf', 26.00),
('Sineklerin Tanrısı', 'William Golding', 'Modern roman', 'https://example.com/covers/sineklerin-tanrisi.jpg', 'https://example.com/pdfs/sineklerin-tanrisi.pdf', 29.00),
('Tutku', 'Elif Şafak', 'Türk edebiyatı', 'https://example.com/covers/tutku.jpg', 'https://example.com/pdfs/tutku.pdf', 25.00),
('Kırlangıç Çığlığı', 'Ahmet Ümit', 'Polisiye roman', 'https://example.com/covers/kirlangic-cigligi.jpg', 'https://example.com/pdfs/kirlangic-cigligi.pdf', 30.00),
('Aylak Adam', 'Yusuf Atılgan', 'Türk romanı', 'https://example.com/covers/aylak-adam.jpg', 'https://example.com/pdfs/aylak-adam.pdf', 23.00),
('Kör Baykuş', 'Sadegh Hedayat', 'İran edebiyatı', 'https://example.com/covers/kor-baykus.jpg', 'https://example.com/pdfs/kor-baykus.pdf', 28.00),
('Küçük Kadınlar', 'Louisa May Alcott', 'Amerikan romanı', 'https://example.com/covers/kucuk-kadinlar.jpg', 'https://example.com/pdfs/kucuk-kadinlar.pdf', 27.00),
('Çalıkuşu', 'Reşat Nuri Güntekin', 'Türk edebiyatı', 'https://example.com/covers/calikusu.jpg', 'https://example.com/pdfs/calikusu.pdf', 26.00),
('Kaptan Grant''ın Çocukları', 'Jules Verne', 'Macera romanı', 'https://example.com/covers/kaptan-grant.jpg', 'https://example.com/pdfs/kaptan-grant.pdf', 32.00),
('Vadideki Hayalet', 'Stephen King', 'Korku romanı', 'https://example.com/covers/vadideki-hayalet.jpg', 'https://example.com/pdfs/vadideki-hayalet.pdf', 35.00),
('Kayıp Sembol', 'Dan Brown', 'Gerilim romanı', 'https://example.com/covers/kayip-sembol.jpg', 'https://example.com/pdfs/kayip-sembol.pdf', 33.00),
('Kara Kitap', 'Orhan Pamuk', 'Türk romanı', 'https://example.com/covers/kara-kitap.jpg', 'https://example.com/pdfs/kara-kitap.pdf', 36.00),
('Yalnızız', 'Peyami Safa', 'Türk edebiyatı', 'https://example.com/covers/yalniziz.jpg', 'https://example.com/pdfs/yalniziz.pdf', 24.00),
('Kırmızı Pazartesi', 'Gabriel Garcia Marquez', 'Latin Amerika romanı', 'https://example.com/covers/kirmizi-pazartesi.jpg', 'https://example.com/pdfs/kirmizi-pazartesi.pdf', 29.00),
('Kuyruklu Yıldız Altında Bir İzdivaç', 'Hüseyin Rahmi Gürpınar', 'Türk romanı', 'https://example.com/covers/kuyruklu-yildiz.jpg', 'https://example.com/pdfs/kuyruklu-yildiz.pdf', 22.00),
('Kürk Mantolu Kadın', 'Sabahattin Ali', 'Türk edebiyatı', 'https://example.com/covers/kurk-mantolu-kadin.jpg', 'https://example.com/pdfs/kurk-mantolu-kadin.pdf', 27.00),
('Kayıp Aranıyor', 'Sait Faik Abasıyanık', 'Türk hikayesi', 'https://example.com/covers/kayip-araniyor.jpg', 'https://example.com/pdfs/kayip-araniyor.pdf', 23.00);

INSERT INTO rentals (user_id, book_id, rental_date, return_date, status) VALUES
(1, 1, '2024-01-01', '2024-01-15', 'completed'),
(2, 2, '2024-01-02', NULL, 'active'),
(3, 3, '2024-01-03', '2024-01-18', 'completed'),
(4, 4, '2024-01-04', NULL, 'active'),
(5, 5, '2024-01-05', '2024-01-20', 'completed'),
(6, 6, '2024-01-06', NULL, 'active'),
(7, 7, '2024-01-07', '2024-01-22', 'completed'),
(8, 8, '2024-01-08', NULL, 'active'),
(9, 9, '2024-01-09', '2024-01-24', 'completed'),
(10, 10, '2024-01-10', NULL, 'active'),
(11, 11, '2024-01-11', '2024-01-26', 'completed'),
(12, 12, '2024-01-12', NULL, 'active'),
(13, 13, '2024-01-13', '2024-01-28', 'completed'),
(14, 14, '2024-01-14', NULL, 'active'),
(15, 15, '2024-01-15', '2024-01-30', 'completed'),
(16, 16, '2024-01-16', NULL, 'active'),
(17, 17, '2024-01-17', '2024-02-01', 'completed'),
(18, 18, '2024-01-18', NULL, 'active'),
(19, 19, '2024-01-19', '2024-02-03', 'completed'),
(20, 20, '2024-01-20', NULL, 'active'),
(21, 21, '2024-01-21', '2024-02-05', 'completed'),
(22, 22, '2024-01-22', NULL, 'active'),
(23, 23, '2024-01-23', '2024-02-07', 'completed'),
(24, 24, '2024-01-24', NULL, 'active'),
(25, 25, '2024-01-25', '2024-02-09', 'completed'),
(26, 26, '2024-01-26', NULL, 'active'),
(27, 27, '2024-01-27', '2024-02-11', 'completed'),
(28, 28, '2024-01-28', NULL, 'active'),
(29, 29, '2024-01-29', '2024-02-13', 'completed'),
(30, 30, '2024-01-30', NULL, 'active'),
(31, 31, '2024-01-31', '2024-02-15', 'completed'),
(32, 32, '2024-02-01', NULL, 'active'),
(33, 33, '2024-02-02', '2024-02-17', 'completed'),
(34, 34, '2024-02-03', NULL, 'active'),
(35, 35, '2024-02-04', '2024-02-19', 'completed'),
(36, 36, '2024-02-05', NULL, 'active'),
(37, 37, '2024-02-06', '2024-02-21', 'completed'),
(38, 38, '2024-02-07', NULL, 'active'),
(39, 39, '2024-02-08', '2024-02-23', 'completed'),
(40, 40, '2024-02-09', NULL, 'active'),
(41, 41, '2024-02-10', '2024-02-25', 'completed'),
(42, 42, '2024-02-11', NULL, 'active'),
(43, 43, '2024-02-12', '2024-02-27', 'completed'),
(44, 44, '2024-02-13', NULL, 'active'),
(45, 45, '2024-02-14', '2024-02-29', 'completed'),
(46, 46, '2024-02-15', NULL, 'active'),
(47, 47, '2024-02-16', '2024-03-02', 'completed'),
(48, 48, '2024-02-17', NULL, 'active'),
(49, 49, '2024-02-18', '2024-03-04', 'completed'),
(50, 50, '2024-02-19', NULL, 'active');

INSERT INTO reading_history (user_id, book_id, last_page, last_read) VALUES
(1, 1, 45, '2024-01-15 14:30:00'),
(2, 2, 78, '2024-01-16 15:45:00'),
(3, 3, 120, '2024-01-17 16:20:00'),
(4, 4, 89, '2024-01-18 17:10:00'),
(5, 5, 156, '2024-01-19 18:30:00'),
(6, 6, 67, '2024-01-20 19:45:00'),
(7, 7, 134, '2024-01-21 20:15:00'),
(8, 8, 92, '2024-01-22 21:30:00'),
(9, 9, 178, '2024-01-23 22:45:00'),
(10, 10, 45, '2024-01-24 23:20:00'),
(11, 11, 167, '2024-01-25 00:30:00'),
(12, 12, 78, '2024-01-26 01:45:00'),
(13, 13, 145, '2024-01-27 02:20:00'),
(14, 14, 89, '2024-01-28 03:30:00'),
(15, 15, 189, '2024-01-29 04:45:00'),
(16, 16, 56, '2024-01-30 05:20:00'),
(17, 17, 167, '2024-01-31 06:30:00'),
(18, 18, 78, '2024-02-01 07:45:00'),
(19, 19, 145, '2024-02-02 08:20:00'),
(20, 20, 89, '2024-02-03 09:30:00'),
(21, 21, 178, '2024-02-04 10:45:00'),
(22, 22, 67, '2024-02-05 11:20:00'),
(23, 23, 156, '2024-02-06 12:30:00'),
(24, 24, 78, '2024-02-07 13:45:00'),
(25, 25, 134, '2024-02-08 14:20:00'),
(26, 26, 92, '2024-02-09 15:30:00'),
(27, 27, 167, '2024-02-10 16:45:00'),
(28, 28, 45, '2024-02-11 17:20:00'),
(29, 29, 189, '2024-02-12 18:30:00'),
(30, 30, 78, '2024-02-13 19:45:00'),
(31, 31, 145, '2024-02-14 20:20:00'),
(32, 32, 89, '2024-02-15 21:30:00'),
(33, 33, 178, '2024-02-16 22:45:00'),
(34, 34, 67, '2024-02-17 23:20:00'),
(35, 35, 156, '2024-02-18 00:30:00'),
(36, 36, 78, '2024-02-19 01:45:00'),
(37, 37, 134, '2024-02-20 02:20:00'),
(38, 38, 92, '2024-02-21 03:30:00'),
(39, 39, 167, '2024-02-22 04:45:00'),
(40, 40, 45, '2024-02-23 05:20:00'),
(41, 41, 189, '2024-02-24 06:30:00'),
(42, 42, 78, '2024-02-25 07:45:00'),
(43, 43, 145, '2024-02-26 08:20:00'),
(44, 44, 89, '2024-02-27 09:30:00'),
(45, 45, 178, '2024-02-28 10:45:00'),
(46, 46, 67, '2024-02-29 11:20:00'),
(47, 47, 156, '2024-03-01 12:30:00'),
(48, 48, 78, '2024-03-02 13:45:00'),
(49, 49, 134, '2024-03-03 14:20:00'),
(50, 50, 92, '2024-03-04 15:30:00');

INSERT INTO categories (name) VALUES
('Roman'),
('Bilim Kurgu'),
('Klasik'),
('Çocuk'),
('Felsefe'),
('Tarih'),
('Biyografi'),
('Kişisel Gelişim'),
('Polisiye'),
('Fantastik'),
('Psikoloji'),
('Edebiyat'),
('Macera'),
('Dram'),
('Şiir');

-- Kitaplara kategori ekleme
UPDATE books SET categories = ARRAY[3,1] WHERE title = 'Suç ve Ceza';
UPDATE books SET categories = ARRAY[2,1] WHERE title = '1984';
UPDATE books SET categories = ARRAY[8,1] WHERE title = 'Simyacı';
UPDATE books SET categories = ARRAY[4,3] WHERE title = 'Küçük Prens';
UPDATE books SET categories = ARRAY[3,14] WHERE title = 'Dönüşüm';
UPDATE books SET categories = ARRAY[3,1] WHERE title = 'Sefiller';
UPDATE books SET categories = ARRAY[3,1] WHERE title = 'İnce Memed';
UPDATE books SET categories = ARRAY[3,12] WHERE title = 'Saatleri Ayarlama Enstitüsü';
UPDATE books SET categories = ARRAY[3,14] WHERE title = 'Tutunamayanlar';
UPDATE books SET categories = ARRAY[3,1] WHERE title = 'Kürk Mantolu Madonna';
UPDATE books SET categories = ARRAY[3,15] WHERE title = 'Yabancı';
UPDATE books SET categories = ARRAY[3,14] WHERE title = 'Fareler ve İnsanlar';
UPDATE books SET categories = ARRAY[13,3] WHERE title = 'Beyaz Diş';
UPDATE books SET categories = ARRAY[3,1] WHERE title = 'Savaş ve Barış';
UPDATE books SET categories = ARRAY[3,1] WHERE title = 'Madame Bovary';
UPDATE books SET categories = ARRAY[3,1] WHERE title = 'Anna Karenina';
UPDATE books SET categories = ARRAY[3,13] WHERE title = 'Don Kişot';
UPDATE books SET categories = ARRAY[3,12] WHERE title = 'Ulysses';
UPDATE books SET categories = ARRAY[3,1] WHERE title = 'Beyaz Geceler';
UPDATE books SET categories = ARRAY[3,1] WHERE title = 'Karamazov Kardeşler';
UPDATE books SET categories = ARRAY[15,3] WHERE title = 'Yeraltından Notlar';
UPDATE books SET categories = ARRAY[3,1] WHERE title = 'Vadideki Zambak';
UPDATE books SET categories = ARRAY[3,11] WHERE title = 'Körlük';
UPDATE books SET categories = ARRAY[1,13] WHERE title = 'Aşk ve Gurur';
UPDATE books SET categories = ARRAY[3,1] WHERE title = 'Gazap Üzümleri';
UPDATE books SET categories = ARRAY[1,3] WHERE title = 'Kırmızı ve Siyah';
UPDATE books SET categories = ARRAY[5,3] WHERE title = 'Denemeler';
UPDATE books SET categories = ARRAY[5,3] WHERE title = 'Siddhartha';
UPDATE books SET categories = ARRAY[14,3] WHERE title = 'Martı';
UPDATE books SET categories = ARRAY[1,3] WHERE title = 'Bülbülü Öldürmek';
UPDATE books SET categories = ARRAY[1,10] WHERE title = 'Yüzyıllık Yalnızlık';
UPDATE books SET categories = ARRAY[1,3] WHERE title = 'Karamela Sepeti';
UPDATE books SET categories = ARRAY[1,3] WHERE title = 'Kuyucaklı Yusuf';
UPDATE books SET categories = ARRAY[1,3] WHERE title = 'Serenad';
UPDATE books SET categories = ARRAY[1,3] WHERE title = 'Kayıp Zamanın İzinde';
UPDATE books SET categories = ARRAY[3,14] WHERE title = 'Dava';
UPDATE books SET categories = ARRAY[2,1] WHERE title = 'Hayvan Çiftliği';
UPDATE books SET categories = ARRAY[1,3] WHERE title = 'Kumral Ada Mavi Tuna';
UPDATE books SET categories = ARRAY[1,3] WHERE title = 'Sineklerin Tanrısı';
UPDATE books SET categories = ARRAY[1,3] WHERE title = 'Tutku';
UPDATE books SET categories = ARRAY[9,1] WHERE title = 'Kırlangıç Çığlığı';
UPDATE books SET categories = ARRAY[1,3] WHERE title = 'Aylak Adam';
UPDATE books SET categories = ARRAY[1,3] WHERE title = 'Kör Baykuş';
UPDATE books SET categories = ARRAY[1,3] WHERE title = 'Küçük Kadınlar';
UPDATE books SET categories = ARRAY[1,3] WHERE title = 'Çalıkuşu';
UPDATE books SET categories = ARRAY[13,3] WHERE title = 'Kaptan Grant''ın Çocukları';
UPDATE books SET categories = ARRAY[10,1] WHERE title = 'Vadideki Hayalet';
UPDATE books SET categories = ARRAY[9,1] WHERE title = 'Kayıp Sembol';
UPDATE books SET categories = ARRAY[1,3] WHERE title = 'Kara Kitap';
UPDATE books SET categories = ARRAY[1,3] WHERE title = 'Yalnızız';
UPDATE books SET categories = ARRAY[1,3] WHERE title = 'Kırmızı Pazartesi';
UPDATE books SET categories = ARRAY[1,3] WHERE title = 'Kuyruklu Yıldız Altında Bir İzdivaç';
UPDATE books SET categories = ARRAY[1,3] WHERE title = 'Kürk Mantolu Kadın';
UPDATE books SET categories = ARRAY[1,3] WHERE title = 'Kayıp Aranıyor';

-- Bazı kitaplar için ses kitap URL'leri ekle
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' WHERE title = 'Suç ve Ceza';
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=kJQP7kiw5Fk' WHERE title = '1984';
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=9bZkp7q19f0' WHERE title = 'Simyacı';
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=PSRildGCw64' WHERE title = 'Küçük Prens';
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=UYhP3bLveQM' WHERE title = 'Dönüşüm';
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=HEXWRTEbj1I' WHERE title = 'İnce Memed';
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=oTJRivZTMLs' WHERE title = 'Kürk Mantolu Madonna';
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=ZZ5LpwO-An4' WHERE title = 'Yabancı';
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=HGYFEI6uLy0' WHERE title = 'Savaş ve Barış';
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=L_jWHffIx5E' WHERE title = 'Anna Karenina';
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=Tt7bzxurJ1I' WHERE title = 'Kara Kitap';
UPDATE books SET audio_url = 'https://www.youtube.com/watch?v=vTIIMJ9tUc8' WHERE title = 'Kürk Mantolu Kadın'; 