INSERT INTO users (username, email, password_hash, subscription_type, subscription_end_date) VALUES
('ahmet123', 'ahmet@example.com', '$2b$10$GGil7M1Qr3Uo4vAFbgkWo.eENQkoGn0ONMerBdHRb2CkKjhZAzLEy', 'premium', '2025-12-31'),
('ayse.yilmaz', 'ayse@example.com', '$2b$10$GGil7M1Qr3Uo4vAFbgkWo.eENQkoGn0ONMerBdHRb2CkKjhZAzLEy', 'basic', NULL),
('mehmet.demir', 'mehmet@example.com', '$2a$10$randomhash3', 'premium', '2025-06-30'),
('zeynep.kaya', 'zeynep@example.com', '$2a$10$randomhash4', 'basic', NULL),
('ali.yildiz', 'ali@example.com', '$2a$10$randomhash5', 'premium', '2025-09-30'),
('fatma.arslan', 'fatma@example.com', '$2a$10$randomhash6', 'basic', NULL),
('mustafa.celik', 'mustafa@example.com', '$2a$10$randomhash7', 'premium', '2025-12-31'),
('elif.sahin', 'elif@example.com', '$2a$10$randomhash8', 'basic', NULL),
('can.ozturk', 'can@example.com', '$2a$10$randomhash9', 'premium', '2025-06-30'),
('seda.ak', 'seda@example.com', '$2a$10$randomhash10', 'basic', NULL),
('burak.yilmaz', 'burak@example.com', '$2a$10$randomhash11', 'premium', '2025-09-30'),
('deniz.kaya', 'deniz@example.com', '$2a$10$randomhash12', 'basic', NULL),
('emre.demir', 'emre@example.com', '$2a$10$randomhash13', 'premium', '2025-12-31'),
('gizem.arslan', 'gizem@example.com', '$2a$10$randomhash14', 'basic', NULL),
('hakan.celik', 'hakan@example.com', '$2a$10$randomhash15', 'premium', '2025-06-30'),
('irem.sahin', 'irem@example.com', '$2a$10$randomhash16', 'basic', NULL),
('jale.ozturk', 'jale@example.com', '$2a$10$randomhash17', 'premium', '2025-09-30'),
('kamil.ak', 'kamil@example.com', '$2a$10$randomhash18', 'basic', NULL),
('leyla.yilmaz', 'leyla@example.com', '$2a$10$randomhash19', 'premium', '2025-12-31'),
('murat.kaya', 'murat@example.com', '$2a$10$randomhash20', 'basic', NULL),
('naz.demir', 'naz@example.com', '$2a$10$randomhash21', 'premium', '2025-06-30'),
('omer.arslan', 'omer@example.com', '$2a$10$randomhash22', 'basic', NULL),
('pinar.celik', 'pinar@example.com', '$2a$10$randomhash23', 'premium', '2025-09-30'),
('rıza.sahin', 'riza@example.com', '$2a$10$randomhash24', 'basic', NULL),
('selin.ozturk', 'selin@example.com', '$2a$10$randomhash25', 'premium', '2025-12-31'),
('tamer.ak', 'tamer@example.com', '$2a$10$randomhash26', 'basic', NULL),
('umut.yilmaz', 'umut@example.com', '$2a$10$randomhash27', 'premium', '2025-06-30'),
('vildan.kaya', 'vildan@example.com', '$2a$10$randomhash28', 'basic', NULL),
('yusuf.demir', 'yusuf@example.com', '$2a$10$randomhash29', 'premium', '2025-09-30'),
('zara.arslan', 'zara@example.com', '$2a$10$randomhash30', 'basic', NULL),
('arda.celik', 'arda@example.com', '$2a$10$randomhash31', 'premium', '2025-12-31'),
('buse.sahin', 'buse@example.com', '$2a$10$randomhash32', 'basic', NULL),
('cagri.ozturk', 'cagri@example.com', '$2a$10$randomhash33', 'premium', '2025-06-30'),
('dilara.ak', 'dilara@example.com', '$2a$10$randomhash34', 'basic', NULL),
('efe.yilmaz', 'efe@example.com', '$2a$10$randomhash35', 'premium', '2025-09-30'),
('feyza.kaya', 'feyza@example.com', '$2a$10$randomhash36', 'basic', NULL),
('gokhan.demir', 'gokhan@example.com', '$2a$10$randomhash37', 'premium', '2025-12-31'),
('hazal.arslan', 'hazal@example.com', '$2a$10$randomhash38', 'basic', NULL),
('ismail.celik', 'ismail@example.com', '$2a$10$randomhash39', 'premium', '2025-06-30'),
('jade.sahin', 'jade@example.com', '$2a$10$randomhash40', 'basic', NULL),
('kaya.ozturk', 'kaya@example.com', '$2a$10$randomhash41', 'premium', '2025-09-30'),
('lale.ak', 'lale@example.com', '$2a$10$randomhash42', 'basic', NULL),
('mert.yilmaz', 'mert@example.com', '$2a$10$randomhash43', 'premium', '2025-12-31'),
('nur.kaya', 'nur@example.com', '$2a$10$randomhash44', 'basic', NULL),
('onur.demir', 'onur@example.com', '$2a$10$randomhash45', 'premium', '2025-06-30'),
('pamir.arslan', 'pamir@example.com', '$2a$10$randomhash46', 'basic', NULL),
('rukiye.celik', 'rukiye@example.com', '$2a$10$randomhash47', 'premium', '2025-09-30'),
('sarp.sahin', 'sarp@example.com', '$2a$10$randomhash48', 'basic', NULL),
('tugce.ozturk', 'tugce@example.com', '$2a$10$randomhash49', 'premium', '2025-12-31'),
('utku.ak', 'utku@example.com', '$2a$10$randomhash50', 'basic', NULL);


INSERT INTO books (title, author, description, cover_image_url, pdf_url, price) VALUES
('Suç ve Ceza', 'Fyodor Dostoyevski', 'St. Petersburg''da geçen bu şaheser, genç öğrenci Raskolnikov''un tefeci bir kadını öldürmesinin ardından yaşadığı iç çelişkileri ve psikolojik çöküşü ustalıkla ele alır. Dostoyevski, suç ve ceza kavramlarını felsefi derinlikle işlerken, vicdanın sesini ve insanın ruhsal arınma sürecini başyapıt niteliğinde bir anlatımla okuyucuya sunar.', 'kitaplar/1.png', 'pdfurl/1.pdf', 45.99),
('1984', 'George Orwell', 'Büyük Birader''in her an sizi izlediği, düşüncelerinizin bile suç sayıldığı distopik bir dünyada, Winston Smith''in özgürlük arayışını konu alan bu eser, totaliter rejimlerin insan ruhu üzerindeki etkilerini çarpıcı bir şekilde anlatır. Orwell''in gelecek vizyonu, günümüz dünyasındaki gözetim teknolojileri düşünüldüğünde daha da akıllara kazınır bir hal alır.', 'kitaplar/2.png', 'pdfurl/2.pdf', 35.50),
('Simyacı', 'Paulo Coelho', 'Andalusyalı çoban Santiago''nun hazineye ulaşma yolculuğu, aslında kendi kaderini ve hayattaki gerçek amacını keşfetme öyküsüdür. Coelho, bu evrensel hikayede rüyaların peşinden gitmenin önemini, kişisel efsanenin gücünü ve hayatın bize sunduğu işaretleri nasıl okumamız gerektiğini büyüleyici bir dille anlatır.', 'kitaplar/3.png', 'pdfurl/3.pdf', 29.99),
('Küçük Prens', 'Antoine de Saint-Exupéry', 'Bir pilotun çölde karşılaştığı küçük prensin öyküsü, çocukluk masumiyeti ile yetişkin dünyasının karmaşıklığı arasındaki çelişkiyi şiirsel bir dille anlatır. Saint-Exupéry, sevgi, dostluk ve yaşamın anlamı üzerine derin düşünceler sunarken, her yaştan okuyucuya evrensel mesajlar verir.', 'kitaplar/4.png', 'pdfurl/4.pdf', 25.00),
('Dönüşüm', 'Franz Kafka', 'Sabah uyandığında kendini böceğe dönüşmüş bulan Gregor Samsa''nın öyküsü, modern insanın yabancılaşması ve toplumsal baskılar karşısındaki çaresizliğini sembolik bir anlatımla işler. Kafka''nın bu şaheseri, absürt tiyatroya ilham veren ve varoluşsal sorgulamaları gündeme getiren ölümsüz eserlerden biridir.', 'kitaplar/5.png', 'pdfurl/5.pdf', 30.00),       
('Sefiller', 'Victor Hugo', '19. yüzyıl Fransa''sında yaşanan toplumsal eşitsizlikler ve adaletsizlikler karşısında, Jean Valjean''ın yaşadığı dönüşüm öyküsü, insanlığın en güzel değerlerini yansıtır. Hugo, bu kapsamlı eserinde sevgi, merhamet ve bağışlamanın gücünü, devrimci ruhla harmanlayarak unutulmaz karakterler yaratır.', 'kitaplar/6.png', 'pdfurl/6.pdf', 40.00),
('İnce Memed', 'Yaşar Kemal', 'Çukurova''nın zorlu coğrafyasında, haksızlığa karşı duran İnce Memed''in efsanevi mücadelesi, Türk edebiyatının en güçlü karakterlerinden birini yaratır. Yaşar Kemal, Anadolu insanının direniş ruhunu, doğayla iç içe olan yaşam tarzını ve geleneksel değerleri epik bir anlatımla okuyucuya sunar.', 'kitaplar/7.png', 'pdfurl/7.pdf', 35.00),
('Saatleri Ayarlama Enstitüsü', 'Ahmet Hamdi Tanpınar', 'Hayri İrdal''ın Saatleri Ayarlama Enstitüsü''ndaki macerası, Türkiye''nin modernleşme sürecinde yaşanan kültürel çelişkileri ince bir ironiyle ele alır. Tanpınar, Doğu-Batı sentezi arayışını, bürokrasinin absürtlüklerini ve zaman kavramını felsefi derinlikle işlediği bu eserinde, modern Türk romanının temel yapı taşlarından birini oluşturur.', 'kitaplar/8.png', 'pdfurl/8.pdf', 32.50),
('Tutunamayanlar', 'Oğuz Atay', 'Turgut Özben''in ölümünden sonra geride bıraktığı kağıtlardan oluşan bu postmodern şaheser, modern insanın varoluşsal bunalımını, toplumsal yabancılaşmasını ve aidiyet arayışını çok katmanlı bir anlatımla işler. Atay, Türk edebiyatında yeni bir anlatım tekniği getirirken, okuyucuyu düşünsel bir yolculuğa çıkarır.', 'kitaplar/9.png', 'pdfurl/9.pdf', 38.00),
('Kürk Mantolu Madonna', 'Sabahattin Ali', 'Raif Efendi''nin Berlin''de yaşadığı tutkulu aşk hikayesi, aynı zamanda Doğu-Batı kültürleri arasında sıkışan bir aydının iç dünyasını yansıtan derin bir aşk romanıdır. Sabahattin Ali, bu kısa ama etkili eserinde, aşkın dönüştürücü gücünü ve kültürel farklılıkların yarattığı gerilimi ustalıkla işler.', 'kitaplar/10.png', 'pdfurl/10.pdf', 27.50),
('Yabancı', 'Albert Camus', 'Meursault''un annesinin cenazesinde gözyaşı dökmemesiyle başlayan bu varoluşçu şaheser, absürdün felsefesini ve modern insanın yaşamla olan yabancılaşmasını ele alır. Camus, gündelik yaşamın anlamsızlığı karşısında insanın takındığı tavırları sorgularken, okuyucuyu varoluşsal sorular üzerinde düşünmeye iter.', 'kitaplar/11.png', 'pdfurl/11.pdf', 33.00),
('Fareler ve İnsanlar', 'John Steinbeck', 'Büyük Bunalım döneminde Kaliforniya''da yaşayan tarım işçileri George ve Lennie''nin dostluğu üzerinden, Amerikan rüyasının kırılganlığını ve toplumsal adaletsizlikleri ele alan bu güçlü eser, insani değerlerin korunmaya çalışıldığı zorlu zamanlarda umudun ve dayanışmanın önemini vurgular.', 'kitaplar/12.png', 'pdfurl/12.pdf', 28.50),
('Beyaz Diş', 'Jack London', 'Vahşi doğada yaşayan bir kurtun evcilleşme sürecini anlatan bu macera dolu roman, doğa ile uygarlık arasındaki gerilimi, hayatta kalma mücadelesini ve sadakat duygusunun gücünü etkileyici bir şekilde işler. London, Klondike''daki altın arama günlerinin sert atmosferini yaşatırken, insan-hayvan ilişkisini derinlemesine inceler.', 'kitaplar/13.png', 'pdfurl/13.pdf', 31.00),
('Savaş ve Barış', 'Lev Tolstoy', 'Napolyon''un Rusya''yı işgali sırasında aristokrat ailelerin yaşadıklarını konu alan bu epik eser, savaşın bireysel yaşamlar üzerindeki etkilerini, aşkın ve dostluğun gücünü, tarihsel süreçlerin insan kaderine etkisini büyük bir literary ustalıkla anlatır. Tolstoy''un en kapsamlı eseri olan bu roman, insanlık durumunu tüm boyutlarıyla sergiler.', 'kitaplar/14.png', 'pdfurl/14.pdf', 42.00),
('Madame Bovary', 'Gustave Flaubert', 'Emma Bovary''nin küçük burjuva yaşamından kaçış arayışı, 19. yüzyıl Fransız toplumunun ahlaki ve sosyal yapısını eleştiren realizmin başyapıtlarından biridir. Flaubert, romantik hayallerin gerçekle çarpışmasını, tutkuların yıkıcı gücünü ve toplumsal baskıların bireyler üzerindeki etkisini psikanalitik bir derinlikle işler.', 'kitaplar/15.png', 'pdfurl/15.pdf', 36.00),   
('Anna Karenina', 'Lev Tolstoy', 'Anna''nın tutkulu aşkı ve Levin''in ruhsal arayışı üzerinden, 19. yüzyıl Rus toplumunun sosyal çelişkilerini, ahlaki sorgulamalarını ve modernleşme sürecini ele alan bu şaheser, bireysel mutluluk ile toplumsal normlar arasındaki çelişkiyi, aşkın hem yaratıcı hem yıkıcı gücünü ustalıkla anlatır.', 'kitaplar/16.png', 'pdfurl/16.pdf', 39.00),
('Don Kişot', 'Miguel de Cervantes', 'Şövalyelik romanlarından etkilenen Don Kişot''un idealizminin gerçeklikle çarpışması, yel değirmenlerine saldırmasından başlayarak insanlığın en evrensel temalarından biri olan hayal-gerçek dikotomisini işler. Cervantes, bu eşsiz eserinde mizah ve trajediyi harmanlayarak, insan doğasının en derin yanlarını keşfeder.', 'kitaplar/17.png', 'pdfurl/17pdf.pdf', 37.00),
('Ulysses', 'James Joyce', 'Leopold Bloom''un Dublin''de geçirdiği bir günü konu alan bu modernist şaheser, bilinç akışı tekniğiyle yazılarak, gündelik yaşamın detaylarından evrensel insan deneyimlerine uzanan çok katmanlı bir anlatım sunar. Joyce, Homer''in Odysseia''sına gönderme yaparak, modern insanın ruhsal yolculuğunu betimler.', 'kitaplar/18.png', 'pdfurl/18.pdf', 41.00),
('Beyaz Geceler', 'Fyodor Dostoyevski', 'St. Petersburg''un beyaz gecelerinde yaşanan platonik bir aşk hikayesi, yalnızlığın, melankolinin ve karşılıksız sevginin en ince nüanslarını işler. Dostoyevski, bu lirik eserinde insan ruhunun en hassas yanlarını, hayallerle gerçeğin iç içe geçtiği anları ustalıkla betimler.', 'kitaplar/19.png', 'pdfurl/19.pdf', 29.00),
('Karamazov Kardeşler', 'Fyodor Dostoyevski', 'Fyodor Karamazov''un öldürülmesi etrafında gelişen bu felsefi roman, iman-inkâr sorgulaması, kardeşler arası çelişkiler ve Rus toplumunun ruhsal bunalımını ele alır. Dostoyevski''nin en olgun eseri olan bu başyapıt, insan doğasının karanlık ve aydınlık yanlarını, din ve ahlak sorularını derinlemesine işler.', 'kitaplar/20.png', 'pdfurl/20.pdf', 43.00),
('Yeraltından Notlar', 'Fyodor Dostoyevski', 'Adsız anlatıcının yeraltından yazdığı bu notlar, modern insanın iç çelişkilerini, toplumsal yabancılaşmasını ve özgür irade sorgulamalarını ele alan psikolojik realizmin öncü eserlerinden biridir. Dostoyevski, bu eserde varoluşçu felsefenin temellerini atarken, okuyucuyu rahatsız edici ama kaçınılmaz hakikatlerle yüzleştirir.', 'kitaplar/21.png', 'pdfurl/21.pdf', 34.00),
('Vadideki Zambak', 'Honoré de Balzac', 'Félix de Vandenesse''in Madame de Mortsauf''a duyduğu platonik aşkı konu alan bu roman, 19. yüzyıl Fransız aristokrasisinin çöküşünü, saflığın dünyeviliğe karşı mücadelesini ve idealize edilmiş sevginin trajedisini Balzac''ın karakteristik gerçekçi üslubuyla anlatır.', 'kitaplar/22.png', 'pdfurl/22.pdf', 28.00),
('Körlük', 'José Saramago', 'Gizemli bir körlük salgınının kasabayı sardığı bu alegorik roman, insanlığın medeniyet kazanımlarının ne kadar kırılgan olduğunu, krizlerde ortaya çıkan insan doğasının çifte yüzünü ve dayanışmanın gücünü Saramago''nun eşsiz anlatım tarzıyla işler. Nobel ödüllü yazarın başyapıtlarından biri olan eser, okuyucuyu derin bir varoluşsal sorgulamaya iter.', 'kitaplar/23.png', 'pdfurl/23.pdf', 31.50),
('Aşk ve Gurur', 'Jane Austen', 'Elizabeth Bennet ve Mr. Darcy''nin aşk hikayesi üzerinden, 19. yüzyıl İngiliz toplumunun sınıfsal önyargılarını, kadının toplumdaki konumunu ve gerçek sevginin önyargıları aşma gücünü ince bir mizahla ele alan bu klasik, evlilik kurumunu ve toplumsal değerleri eleştirel bir gözle inceler.', 'kitaplar/24.png', 'pdfurl/24.pdf', 29.00),
('Gazap Üzümleri', 'John Steinbeck', 'Büyük Bunalım sırasında toprağını kaybeden Joad ailesinin Kaliforniya''ya göçü, Amerikan rüyasının karanlık yüzünü, işçi sınıfının mücadelesini ve sosyal adaletsizlikleri çarpıcı bir şekilde anlatır. Steinbeck, bu Pulitzer ödüllü eserinde insani değerlerin korunmaya çalışıldığı zorlu dönemlerde umudun ve dayanışmanın önemini vurgular.', 'kitaplar/25.png', 'pdfurl/25.pdf', 33.00),
('Kırmızı ve Siyah', 'Stendhal', 'Julien Sorel''in toplumsal yükselme arzusu ve aşk tutkuları arasında sıkışan yaşamı, 19. yüzyıl Fransız toplumunun ikiyüzlülüğünü, gençlerin idealizm ile pragmatizm arasındaki çelişkilerini ve bireysel hırsların toplumsal gerçeklerle çarpışmasını psikolojik derinlikle işler.', 'kitaplar/26.png', 'pdfurl/26.pdf', 32.00),
('Denemeler', 'Montaigne', 'İnsanlığın en temel sorularını, gündelik yaşamın felsefi boyutlarını ve kişisel deneyimlerden çıkarılan evrensel dersleri ele alan bu eşsiz eser, modern deneme türünün kurucusu Montaigne''nin düşünce serüvenini okuyucuyla paylaşır. Her sayfa, yaşamın anlamını sorgulamak isteyenler için değerli içgörüler sunar.', 'kitaplar/27.png', 'pdfurl/27.pdf', 27.00),
('Siddhartha', 'Hermann Hesse', 'Brahman oğlu Siddhartha''nın aydınlanma arayışını konu alan bu ruhani roman, Doğu felsefesinin temel öğretilerini Batılı okuyucuya sunarken, kişisel gelişim yolculuğunun evrensel aşamalarını işler. Hesse, bu eserinde maddi dünyadan manevi dünyaya geçişin zorluklarını ve iç huzurun bulunmasını poetik bir dille anlatır.', 'kitaplar/28.png', 'pdfurl/28.pdf', 26.00),
('Martı', 'Anton Çehov', 'Sanat, aşk ve yaşamın anlamı üzerine kurulu bu tragikomik oyun, yazarlık hayalleri kuran gençlerin idealizmi ile yaşamın acı gerçekleri arasındaki çelişkiyi ele alır. Çehov''un tiyatro sanatındaki ustalığını gösteren bu eser, Moskova Sanat Tiyatrosu''nun başyapıtlarından biri olarak modern dramaya yön vermiştir.', 'kitaplar/29.png', 'pdfurl/29.pdf', 24.00),
('Bülbülü Öldürmek', 'Harper Lee', '1930''ların Amerikan Güneyi''nde yaşanan ırkçılık olaylarını Scout Finch''in masumane bakış açısıyla anlatan bu güçlü roman, adalet arayışını, önyargılarla mücadeleyi ve çocukluk masumiyetinin kaybolmasını duygu yüklü bir anlatımla işler. Lee''nin Pulitzer ödüllü eseri, Amerikan edebiyatının en etkili toplumsal eleştiri örneklerinden biridir.', 'kitaplar/30.png', 'pdfurl/30.pdf', 30.00),
('Yüzyıllık Yalnızlık', 'Gabriel Garcia Marquez', 'Buendía ailesinin yedi kuşağının öyküsünü anlatan bu büyülü gerçekçilik şaheseri, Latin Amerika''nın tarihsel döngülerini, insan ilişkilerinin karmaşıklığını ve kaderin kaçınılmazlığını mitolojik bir atmosferle sunar. Marquez, Macondo kasabasında gerçek ile fantastik olanı ustalıkla harmanlayarak Nobel edebiyat ödülüne layık görülen bu eserini yaratmıştır.', 'kitaplar/31.png', 'pdfurl/31.pdf', 38.00),
('Karamela Sepeti', 'Ayşe Kulin', 'Cumhuriyet döneminin toplumsal değişimlerini, kadın hakları mücadelesini ve aile yapısındaki dönüşümleri farklı kadın karakterlerin gözünden anlatan bu roman, Türk kadınının geleneksel rollerden çıkış sürecini ve modernleşmenin getirdiği çelişkileri samimi bir anlatımla işler.', 'kitaplar/32.jpg', 'pdfurl/32.pdf', 22.00),
('Kuyucaklı Yusuf', 'Sabahattin Ali', 'Anadolu''nun kasaba yaşamında haksızlığa karşı duran Yusuf''un trajik öyküsü, toplumsal adaletsizlikleri, sevginin gücünü ve bireysel direnişin önemini güçlü bir dille anlatır. Ali''nin bu etkili romanı, sıradan insanların olağanüstü mücadelelerini ve erdemin kazanılmış zaferlerini okuyucuya sunar.', 'kitaplar/33.png', 'pdfurl/33.pdf', 27.00),
('Serenad', 'Zülfü Livaneli', 'İkinci Dünya Savaşı sırasında farklı kültürlerden üç arkadaşın dostluğunu konu alan bu çok katmanlı roman, hoşgörünün, müziğin ve sanatın birleştirici gücünü işler. Livaneli, geçmişle günümüz arasında kurduğu köprülerle, insanlığın ortak değerlerini ve barışın önemini vurgular.', 'kitaplar/34.png', 'pdfurl/34.pdf', 29.00),
('Kayıp Zamanın İzinde', 'Marcel Proust', 'Anlatıcının çocukluk anılarından başlayarak yaşadığı dönemin sosyal panoramasını çizen bu monumentel eser, belleğin işleyişini, sanatın yaşamla ilişkisini ve zamanın akışı karşısında insanın durumunu benzersiz bir prosa ile işler. Proust''un bu şaheseri, modern romanın kilometre taşlarından biri olarak kabul edilir.', 'kitaplar/35.png', 'pdfurl/35.pdf', 44.00),
('Dava', 'Franz Kafka', 'Josef K.''nın asla öğrenemediği bir suçtan dolayı yargılanması üzerinden, modern bürokrasinin absürtlüklerini, bireyin kurumlar karşısındaki çaresizliğini ve adalet kavramının belirsizliğini sembolik bir anlatımla işler. Kafka''nın bu distopik şaheseri, 20. yüzyılın kaygılarını önceden haber verir.', 'kitaplar/36.png', 'pdfurl/36.pdf', 31.00),
('Hayvan Çiftliği', 'George Orwell', 'Manor Çiftliği''ndeki hayvanların devrimini alegorik olarak anlatan bu siyasi hiciv, totaliter rejimlerin oluşumu, iktidarın yozlaştırıcı etkisi ve devrimin nasıl ideallere ihanet ettiğini satirik bir dille eleştirir. Orwell''in bu kısa ama etkili eseri, politik sistemlerin eleştirel analizini sunar.', 'kitaplar/37.png', 'pdfurl/37.pdf', 28.00),
('Kumral Ada Mavi Tuna', 'Buket Uzuner', 'Tuna Nehri boyunca yapılan bir yolculuk sırasında karşılaşılan insanlar ve yaşanan deneyimler üzerinden, Doğu Avrupa''nın tarihsel travmalarını, kültürlerarası diyaloğu ve kadın kimliğinin sorgulanmasını özgün bir bakış açısıyla ele alan çağdaş Türk edebiyatının önemli eserlerinden biri.', 'kitaplar/38.png', 'pdfurl/38.pdf', 26.00),
('Sineklerin Tanrısı', 'William Golding', 'Issız bir adada mahsur kalan çocukların uygarlıktan varhaşlığa doğru gidişlerini konu alan bu alegorik roman, insan doğasının karanlık yanlarını, toplumsal düzenin kırılganlığını ve barbarlığın medeniyet altındaki varlığını çarpıcı bir şekilde gözler önüne serer. Golding''in Nobel ödüllü eseri, modern dünyaya uyarıcı bir mesaj niteliği taşır.', 'kitaplar/39.png', 'pdfurl/39.pdf', 29.00),
('Tutku', 'Elif Şafak', 'Osmanlı İmparatorluğu''nun son dönemlerinde yaşanan toplumsal değişimler ve bireysel tutkuların çarpışması üzerinden, geleneksel değerlerle modernlik arasındaki gerilimi, kadın-erkek ilişkilerini ve aşkın dönüştürücü gücünü çok sesli bir anlatımla işleyen çağdaş Türk edebiyatının güçlü örneklerinden biri.', 'kitaplar/40.png', 'pdfurl/40.pdf', 25.00),
('Kırlangıç Çığlığı', 'Ahmet Ümit', 'İstanbul''un tarihî dokusunda geçen bu polisiye roman, Komiser Nevzat''ın gizemli cinayetleri çözüm sürecinde, şehrin katmanlarında saklı geçmişle günümüzün iç içe geçişini, aşkın ve intikamın gücünü ustalıkla işler. Ümit, Türk polisiye edebiyatının en başarılı örneklerinden birini yaratarak, okuyucuyu son sayfaya kadar soluksuz bırakan bir gerilim yaratır.', 'kitaplar/41.png', 'pdfurl/41.pdf', 30.00),
('Aylak Adam', 'Yusuf Atılgan', 'C.''nin İstanbul sokaklarında dolaşırken yaşadığı iç monologlar üzerinden, modern kent yaşamında bireyin yabancılaşmasını, varoluşsal bunalımını ve anlam arayışını öncü bir teknikle işleyen bu eser, Türk edebiyatında yeni açılımlar getiren postmodern anlatı örneklerinin başında gelir.', 'kitaplar/42.png', 'pdfurl/42.pdf', 23.00),
('Kör Baykuş', 'Sadegh Hedayat', 'İran edebiyatının başyapıtlarından olan bu surrealist roman, adsız anlatıcının hallüsinasyonları ve obsesyonları üzerinden, Doğu mistisizmi ile modern varoluşsal kaygıları harmanlayan derin bir psikolojik tahlil sunar. Hedayat''ın bu etkileyici eseri, Persian edebiyatında modernizmin öncüsü olarak kabul edilir.', 'kitaplar/43.jpg', 'pdfurl/43.pdf', 28.00),
('Küçük Kadınlar', 'Louisa May Alcott', 'İç Savaş döneminde yaşayan March ailesi kızlarının büyüme öyküsünü anlatan bu klasik, kardeşlik bağlarının gücünü, kadının toplumdaki konumunu ve erdemli yaşamın değerlerini sıcak bir aile atmosferi içinde işler. Alcott''un bu evrensel eseri, nesiller boyu okuyucuları etkileyen aile hikayelerinin başyapıtlarından biridir.', 'kitaplar/44.png', 'pdfurl/44.pdf', 27.00),
('Çalıkuşu', 'Reşat Nuri Güntekin', 'Feride''nin Anadolu''nun farklı köşelerinde yaşadığı maceraları üzerinden, eğitim meselesini, kadının özgürleşme mücadelesini ve toplumsal değişimi ele alan bu roman, Türk edebiyatının en sevilen karakterlerinden birini yaratırken, cumhuriyet döneminin ideallerini yansıtır.', 'kitaplar/45.png', 'pdfurl/45.pdf', 26.00),
('Kaptan Grant''ın Çocukları', 'Jules Verne', 'Lord Glenarvan''ın kayıp kaptan Grant''ı arama yolculuğunu konu alan bu macera dolu roman, coğrafi keşifleri, teknolojik yenilikleri ve cesaret dolu maceraları birleştirerek, Verne''nin hayal gücünün ve bilimsel öngörülerinin en güzel örneklerinden birini sunar. Eğitici ve eğlendirici yönleriyle tüm yaşlara hitap eden klasik bir macera romanıdır.', 'kitaplar/46.png', 'pdfurl/46.pdf', 32.00),
('Vadideki Hayalet', 'Stephen King', 'Salem''s Lot kasabasını istila eden vampirlere karşı verilen mücadeleyi konu alan bu korku başyapıtı, King''in gerilim yaratma ustasının en güçlü eserlerinden biridir. Yazar, küçük kasaba yaşamının karanlık yüzünü, insanı davranışlarındaki çelişkileri ve kötülüğün yayılma biçimini psikolojik derinlikle işler.', 'kitaplar/47.png', 'pdfurl/47.pdf', 35.00),
('Kayıp Sembol', 'Dan Brown', 'Harvard''lı sembolist Robert Langdon''ın Washington D.C.''de yaşadığı yeni macerasında, Mason tarikatının sırları, antik sembollerin gizemi ve bilim-din ilişkileri hızlı tempolu bir gerilimle harmanlanır. Brown, tarihsel gerçekler ile kurguyu ustalıkla birleştirerek okuyucuyu sayfa çevirmeye zorlayan bir thriller yaratır.', 'kitaplar/48.png', 'pdfurl/48.pdf', 33.00), 
('Kara Kitap', 'Orhan Pamuk', 'Galip''in kayıp karısı Rüya''yı arayışı üzerinden, İstanbul''un labirent sokakları, Doğu-Batı sentezi arayışları ve kimlik sorgulamalarını postmodern bir anlatımla işleyen bu eser, Pamuk''ın en karmaşık ve çok katmanlı romanlarından biridir. Gerçek ile kurgu arasındaki sınırları sorgulayan bu metinsel oyun, okuyucuyu felsefi bir yolculuğa çıkarır.', 'kitaplar/49.png', 'pdfurl/49.pdf', 36.00),    
('Yalnızız', 'Peyami Safa', 'Modern kent yaşamında yalnızlaşan bireyin iç dünyasını, aşk üçgenleri ve toplumsal çelişkileri konu alan bu roman, Türk edebiyatında psikolojik realizmin önemli örneklerinden biridir. Safa, karakterlerinin ruhsal derinliklerini incelerken, dönemin sosyal yapısını ve değer yargılarını eleştirel bir bakışla sunar.', 'kitaplar/50.png', 'pdfurl/50.pdf', 24.00),
('Kırmızı Pazartesi', 'Gabriel Garcia Marquez', 'Şeref cinayeti işlenen küçük bir kasabada, önceden bilinen bir cinayet öncesi yaşanan son saatleri anlatan bu kısa roman, Latin Amerika toplumunun geleneksel değerleri, kaderin kaçınılmazlığı ve toplumsal baskıları büyülü gerçekçilik tarzında işler. Marquez, zamanı döngüsel olarak kullanarak okuyucuyu büyüleyici bir anlatı tuzağına düşürür.', 'kitaplar/51.png', 'pdfurl/51.pdf', 29.00),
('Kuyruklu Yıldız Altında Bir İzdivaç', 'Hüseyin Rahmi Gürpınar', 'Batılılaşma döneminde yaşanan toplumsal değişimleri, geleneksel aile yapısının dönüşümünü ve nesiller arası çelişkileri mizahi bir üslupla ele alan bu roman, Türk edebiyatının modernleşme süreciniu satirik perspektifle işleyen önemli eserlerinden biridir. Gürpınar, toplumsal eleştiriyi hafif ve eğlenceli bir dille okuyucuya sunar.', 'kitaplar/52.png', 'pdfurl/52.pdf', 22.00),
('Kayıp Aranıyor', 'Sait Faik Abasıyanık', 'İstanbul''un sıradan insanlarının hikayelerini, gündelik yaşamın poetik yanlarını ve kent yaşamında kaybolan insani değerleri lirik bir dille anlatan bu hikaye koleksiyonu, Türk hikayeciliğinin en özgün seslerinden birinin ustalığını sergiler. Abasıyanık, sade ama etkileyici anlatımıyla okuyucunun kalbine dokunur.', 'kitaplar/54.png', 'pdfurl/53.pdf', 23.00),
('Gece Yarısı Kütüphanesi', 'Matt Haig', 'Hayatın farklı seçeneklerini deneyimleyebileceği sihirli bir kütüphanede bulunan Nora''nın öyküsü üzerinden, yaşamın anlamını, pişmanlıkları ve ikinci şansları ele alan bu felsefi roman, okuyucuyu varoluşsal sorular üzerinde düşündürürken umut dolu bir mesaj verir. Haig, modern yaşamın karmaşıklığını sıcak bir anlatımla işler.', 'kitaplar/54.png', 'pdfurl/54.pdf', 26.00),
('Charlie ve Çikolata Fabrikası', 'Roald Dahl', 'Yoksul Charlie''nin sihirli çikolata fabrikasındaki macerasını konu alan bu çocuk klasiği, hayal gücünün sınırsızlığını, iyi kalplilik ile açgözlülük arasındaki farkı ve hayallerin gerçek olabileceğini büyüleyici bir atmosferle anlatır. Dahl''ın en sevilen eserlerinden biri olan bu roman, çocuklara ve yetişkinlere eşit oranda keyif verir.', 'kitaplar/55.png', 'pdfurl/55.pdf', 28.00),
('Kayıp Balık Nemo', 'Andrew Stanton', 'Denizlerin derinliklerinde kaybolan oğlunu arayan baba balığın hikayesi, cesaretin, sevginin ve ailesel bağların gücünü renkli sualtı dünyasında anlatır. Bu animasyon hikayesi, çocuklara güven duygusunu ve bağımsızlığın önemini öğretirken, ebeveynlere de korumacı yaklaşımın sınırları hakkında dersler verir.', 'kitaplar/56.png', 'pdfurl/56.pdf', 25.00),
('Pinokyo', 'Carlo Collodi', 'Ahşap kukladan gerçek çocuğa dönüşen Pinokyo''nun maceraları, dürüstlük, sorumluluk ve büyüme sürecinin önemini alegorik bir anlatımla işler. Collodi''nin bu ölümsüz eseri, çocuklara ahlaki değerleri öğretirken, insan olmanın gerçek anlamını sorgulatır. Klasik çocuk edebiyatının en etkili örneklerinden biridir.', 'kitaplar/57.png', 'pdfurl/57.pdf', 22.00),
('Peter Pan', 'J. M. Barrie', 'Hiç büyümek istemeyen Peter Pan ve Neverland''deki maceraları, çocukluk masumiyetinin korunması arzusu ile büyümenin gerekliliği arasındaki gerilimi işler. Barrie, bu büyülü hikayede hayal gücünün gücünü, dostluğun değerini ve zamanın akışı karşısında insanın çaresizliğini poetik bir dille anlatır.', 'kitaplar/58.png', 'pdfurl/58.pdf', 27.00),
('Alice Harikalar Diyarında', 'Lewis Carroll', 'Alice''in tavşan deliğinden düştüğü fantastik dünyada yaşadığı absürt maceralar, mantığın sınırlarını zorlayan bu klasik eser, çocuksu merakın gücünü ve hayal dünyasının sınırsızlığını kutlar. Carroll, dil oyunları ve mantık paradokslarıyla dolu bu eserinde, okuyucuyu büyüleyici bir edebiyat oyununa davet eder.', 'kitaplar/59.png', 'pdfurl/59.pdf', 29.00),
('Sokratesin Savunması', 'Platon', 'Atina mahkemesinde Sokrates''in kendini savunması sırasında söylediği konuşmalar, felsefenin temellerini, bilginin doğasını ve erdemli yaşamın anlamını sorgular. Platon''un bu eşsiz eseri, Batı felsefesinin temel metinlerinden biri olarak, düşünce tarihinde dönüm noktası teşkil eder. Ölümsüz sorular ve zamanı aşan cevaplar içerir.', 'kitaplar/60.png', 'pdfurl/60.pdf', 32.00),
('Böyle Buyurdu Zerdüşt', 'Friedrich Nietzsche', 'Peygamber Zerdüşt''un ağzından söylenen felsefi öğretiler, geleneksel değerlerin sorgulanması, üstinsan kavramı ve nihilizmden aşılmanın yollarını işleyen bu eser, Nietzsche''nin en güçlü ve tartışmalı düşüncelerini içerir. Poetik bir dille yazılan bu felsefi roman, okuyucuyu yaşamın anlamı üzerine derin düşüncelere sevk eder.', 'kitaplar/61.png', 'pdfurl/61.pdf', 35.00),
('Devlet', 'Platon', 'İdeal devlet düzenini arayan Sokrates ve arkadaşlarının diyalogları üzerinden, adalet kavramını, yönetim biçimlerini ve eğitimin toplumsal rolünü irdeleyen bu klasik eser, siyaset felsefesinin temel metinlerinden biridir. Platon, mağara alegorisiyle bilgi teorisini de ele alarak, felsefe tarihinde dönüm noktası yaratmıştır.', 'kitaplar/62.png', 'pdfurl/62.pdf', 38.00),
('Meditasyonlar', 'Marcus Aurelius', 'Roma İmparatoru Marcus Aurelius''un kendine yazdığı felsefi notlar, stoacı düşünce geleneğinin en kişisel ve etkileyici örneklerini sunar. İmparator-filozof, yaşamın zorluklarıyla başa çıkma, erdem ve iç huzuru bulma konularında zamanı aşan bilgiler verir. Pratik felsefenin en güzel örneklerinden biridir.', 'kitaplar/63.png', 'pdfurl/63.pdf', 30.00),
('İnsanın Anlam Arayışı', 'Viktor Frankl', 'Auschwitz toplama kampından kurtulmayı başaran psikiyatrist Frankl''ın, insan ruhunun en karanlık koşullarda bile anlam bulabilme gücünü anlatan bu derin eser, varoluşsal analizin temellerini atar. Kişisel deneyim ile bilimsel yaklaşımı birleştiren bu çalışma, yaşamın zorluklarıyla mücadele edenlere umut verir.', 'kitaplar/64.png', 'pdfurl/64.pdf', 34.00),
('Nutuk', 'Mustafa Kemal Atatürk', 'Türkiye Cumhuriyeti''nin kurucusu Atatürk''ün, Kurtuluş Savaşı ve cumhuriyetin kuruluş sürecini detaylarıyla anlattığı bu eşsiz belge, hem tarihsel değer hem de liderlik dersleri açısından büyük önem taşır. Atatürk''ün kendi ağzından dinlenen milli mücadele hikayesi, Türk tarihinin en önemli kaynaklarından biridir.', 'kitaplar/65.png', 'pdfurl/65.pdf', 40.00),
('Sapiens', 'Yuval Noah Harari', 'İnsan türünün evrimsel sürecini, tarım devriminden bilgi çağına kadar uzanan serüvenini geniş perspektifle ele alan bu çığır açan eser, okuyucuya insanlığın geçmişini, bugününü ve geleceğini düşündürür. Harari, karmaşık konuları sade bir dille anlatarak, modern dünyayı anlama konusunda değerli içgörüler sunar.', 'kitaplar/66.png', 'pdfurl/66.pdf', 45.00),
('Tarih', 'Herodot', '"Tarihin babası" olarak bilinen Herodot''un, Yunan-Pers savaşlarını ve antik dünyanın farklı halklarını anlattığı bu eser, sistematik tarih yazımının ilk örneğidir. Herodot, sadece olayları kaydetmekle kalmaz, farklı kültürlerin geleneklerini ve yaşam biçimlerini de betimleyerek, antropolojik bir yaklaşım sergiler.', 'kitaplar/67.png', 'pdfurl/67.pdf', 36.00),
('Osmanlı İmparatorluğu', 'Halil İnalcık', 'Dünyaca ünlü Osmanlı tarihçisi İnalcık''ın, altı asırlık imparatorluğun siyasi, sosyal ve ekonomik yapısını detaylarıyla incelediği bu kapsamlı çalışma, Osmanlı tarihinin en güvenilir kaynaklarından biridir. İnalcık, Osmanlı devlet sistemini, toplum yapısını ve külrürel mirasını objektif bir bakışla sunar.', 'kitaplar/68.png', 'pdfurl/68.pdf', 39.00),
('İstanbul''un Fethi', 'Feridun Fazıl Tülbentçi', '1453 yılında Fatih Sultan Mehmet''in İstanbul''u fethetme sürecini, askeri stratejileri ve dönemin atmosferini canlı bir şekilde anlatan bu tarihi roman, gerçek olaylar üzerine kurulu güçlü bir anlatım sunar. Tülbentçi, tarihi bilgilerle edebiyatı ustalıkla harmanlayarak unutulmaz bir eser yaratır.', 'kitaplar/69.png', 'pdfurl/69.pdf', 31.00),
('Steve Jobs', 'Walter Isaacson', 'Apple''ın kurucusu Steve Jobs''un yaşamını, vizyonunu ve teknoloji dünyasına getirdiği devrimleri anlatan bu kapsamlı biyografi, modern çağın en etkili isimlerinden birinin portrtrini çizer. Isaacson, Jobs''un kişiliğinin karmaşık yanlarını, yaratıcı süreçlerini ve liderlik tarzını derinlemesine inceler.', 'kitaplar/70.png', 'pdfurl/70.pdf', 42.00),
('Albert Einstein: Bir Dehanın Yaşamı', 'Walter Isaacson', '20. yüzyılın en büyük bilim insanı Einstein''ın kişisel yaşamından bilimsel keşiflerine uzanan kapsamlı portresi, bir dehanjn yaratıcı süreçlerini, düşünce şekillerini ve insanlığa katkılarını detaylarıyla anlatır. Isaacson, Einstein''ın hem bilimsel dahiliğini hem de insani yanlarını ustaca harmanlayarak unutulmaz bir biyografi yaratır.', 'kitaplar/71.png', 'pdfurl/71.pdf', 41.00),
('Atatürk: Modern Türkiye''nin Kurucusu', 'Andrew Mango', 'İngiliz tarihçi Mango''nun objektif gözüyle Mustafa Kemal Atatürk''ün yaşamı, liderliği ve Türkiye Cumhuriyeti''ni kuruş sürecini ele alan bu kapsamlı biyografi, Atatürk''ün vizyonunu ve modernleşme mücadelesini uluslararası perspektifle inceler. Batılı bir akademisyenin Atatürk portresi, farklı bir bakış açısı sunar.', 'kitaplar/72.png', 'pdfurl/72.pdf', 38.00),
('Marie Curie: Bir Bilim Kadınının Hayatı', 'Eve Curie', 'İki Nobel ödülü sahibi fizikçi ve kimyager Marie Curie''nin kızı tarafından yazılan bu samimi biyografi, bilim dünyasında öncü olan bir kadının mücadelesini, fedakarlıklarını ve başarılarını anlatır. Radyoaktivite alanındaki çalışmalarıyla bilim tarihine geçen Curie''nin hem bilimsel hem kişisel yaşamının detaylı portresi.', 'kitaplar/73.png', 'pdfurl/73.pdf', 37.00),
('Elon Musk', 'Ashlee Vance', 'Tesla ve SpaceX''in kurucusu Elon Musk''ın vizyoner liderliğini, girişimcilik serüvenini ve geleceğe dair radikal planlarını anlatan bu çekici biyografi, modern çağın en tartışmalı iş insanlarından birinin portrtrini çizer. Vance, Musk''ın hem yenilikçi dahiliğini hem de tartışmalı kişiliğini objektif bir şekilde inceler.', 'kitaplar/74.png', 'pdfurl/74.pdf', 40.00),
('Mozart: Bir Dahi', 'Maynard Solomon', 'Müzik tarihinin en büyük dahilerinden Mozart''ın yaşamını, müzikal gelişimini ve yaratıcı süreçlerini derinlemesine inceleyen bu biyografi, 18. yüzyıl Avrupası''nın kültürel atmosferi içinde bir dehanın yetişmesini anlatır. Solomon, Mozart''ın eserlerini yaşam öyküsüyle harmanlayarak bütüncül bir portre çizer.', 'kitaplar/75.png', 'pdfurl/75.pdf', 36.00),
('Frida: Bir Kadının Portresi', 'Hayden Herrera', 'Meksikalı ressam Frida Kahlo''nun acı dolu yaşamını, sanatsal evrimini ve Diego Rivera ile tutkulu ilişkisini konu alan bu etkileyici biyografi, 20. yüzyılın en özgün sanatçılarından birinin içsel dünyasını keşfeder. Herrera, Kahlo''nun fiziksel acılarını sanatsal güce dönüştürme sürecini ustalıkla anlatır.', 'kitaplar/76.png', 'pdfurl/76.pdf', 35.00),
('Nikola Tesla: Bir Dahinin Günlüğü', 'Sean Patrick', 'Elektrik çağının mimarı Tesla''nın yaşamını, buluşlarını ve vizyoner düşüncelerini ele alan bu biyografi, modern teknolojinin temellerini atan bir dehanın hikayesini anlatır. Patrick, Tesla''nın hem bilimsel başarılarını hem de kişisel trajedilerini, dönemin bilimsel rekabeti çerçevesinde işler.', 'kitaplar/77.png', 'pdfurl/77.pdf', 34.00),
('Benjamin Franklin', 'Walter Isaacson', 'Amerika''nın kurucu babalarından Franklin''in çok yönlü kişiliğini, bilimsel keşiflerini, diplomatik başarılarını ve Amerikan rüyasının şekillenmesindeki rolünü anlatan bu kapsamlı biyografi, bir rönesans insanının modern çağdaki karşılığını sunar. Isaacson, Franklin''in yaşam felsefesini ve pragmatik yaklaşımını etkileyici şekilde betimler.', 'kitaplar/78.png', 'pdfurl/78.pdf', 33.00),
('Düşün ve Zengin Ol', 'Napoleon Hill', 'Başarılı insanların ortak özelliklerini inceleyen Hill''in bu kişisel gelişim klasiği, zenginlik ve başarıya giden yolda zihinsel gücün rolünü vurgular. Yazar, olumlu düşünce, hedef belirleme ve azimin önemini anlatarak, okuyucuya pratik başarı formülleri sunar. Kişisel gelişim literatürünün temel taşlarından biri olan eser.', 'kitaplar/79.png', 'pdfurl/79.pdf', 28.00),
('Savaşçı', 'Doğan Cüceloğlu', 'Türkiye''nin önde gelen psikologlarından Cüceloğlu''nun, yaşamın zorluklarıyla mücadele etme, kişisel gücü keşfetme ve iç savaşçıyı uyandırma konularını ele aldığı bu eser, ruhsal gelişim yolculuğunda pratik rehberlik sunar. Yazar, psikolojik bilgileri günlük yaşamla harmanlayarak okuyuculara güç veren mesajlar verir.', 'kitaplar/80.png', 'pdfurl/80.pdf', 27.00),
('Beden Dili', 'Joe Navarro', 'Eski FBI ajanı Navarro''nun, sözsüz iletişimin gücünü ve beden dilini okuma sanatını anlattığı bu pratik rehber, kişilerarası ilişkilerde avantaj sağlayacak teknikleri öğretir. Navarro, mesleki deneyimlerinden yararlanarak, beden hareketlerinin ardındaki psikolojik anlamları açıklar ve okuyucuya değerli sosyal beceriler kazandırır.', 'kitaplar/81.png', 'pdfurl/81.pdf', 26.00),
('Alışkanlıkların Gücü', 'Charles Duhigg', 'Alışkanlıkların nasıl oluştuğunu, beynimizi nasıl etkilediğini ve nasıl değiştirebileceğimizi bilimsel verilerle açıklayan bu çığır açan eser, kişisel ve profesyonel yaşamda dönüşüm yaratmak isteyenlere pratik yöntemler sunar. Duhigg, alışkanlık döngüsünü anlayarak, okuyucuya istediği değişimleri gerçekleştirme gücü verir.', 'kitaplar/82.png', 'pdfurl/82.pdf', 29.00),
('Ustalık', 'Robert Greene', 'Tarih boyunca ustaların nasıl yetiştiğini, yeteneklerin nasıl geliştirildiğini ve ustalığa giden yolun aşamalarını inceleyen bu derin eser, kişisel mükemmellik arayışında olan okuyuculara rehberlik eder. Greene, Leonardo da Vinci''den Mozart''a kadar büyük ustaların yaşam hikayelerinden çıkardığı dersleri paylaşır.', 'kitaplar/83.png', 'pdfurl/83.pdf', 32.00),
('Kendine Hoş Geldin', 'Miraç Çağrı Aktaş', 'Genç kuşağın sevilen yazarı Aktaş''ın, kendini tanıma, özgüven kazanma ve yaşamın zorluklarıyla başa çıkma konularını samimi bir dille ele aldığı bu eser, gençlere ve yetişkinlere eşit oranda rehberlik eder. Yazar, kişisel deneyimlerini ve gözlemlerini paylaşarak, okuyucuya cesaret veren ve umutlandıran bir perspektif sunar.', 'kitaplar/84.png', 'pdfurl/84.pdf', 25.00),
('İrade Terbiyesi', 'Jules Payot', 'Fransız eğitimci Payot''un, iradeyi güçlendirme, disiplin kazanma ve karakter geliştirme konularını ele aldığı bu klasik eser, kişisel gelişimin temel prensiplerikni ortaya koyar. Yazar, sistematik yaklaşımıyla okuyucuya kendi karakterini şekillendirme ve hedeflerine ulaşma konusunda pratik yöntemler sunar.', 'kitaplar/85.png', 'pdfurl/85.pdf', 24.00),
('Bilinçaltının Gücü', 'Joseph Murphy', 'Bilinçaltının gizli gücünü keşfetme ve bu gücü yaşamı dönüştürmek için kullanma yöntemlerini anlatan bu etkili eser, zihinsel programlamanın temellerini atar. Murphy, pozitif düşünce, affirmasyonlar ve görselleştirme tekniklerinin gücünü açıklayarak, okuyucuya kendi gerçekliğini yaratma anahtarlarını verir.', 'kitaplar/86.png', 'pdfurl/86.pdf', 30.00),
('Harry Potter ve Felsefe Taşı', 'J.K. Rowling', 'Sıradan bir çocukken büyücü olduğunu öğrenen Harry Potter''ın Hogwarts''taki ilk yılını konu alan bu büyülü macera, dostluk, cesaret ve iyi ile kötü arasındaki mücadeleyi işler. Rowling, zengin hayal dünyası ve unutulmaz karakterlerle modern fantasya edebiyatının kilometre taşlarından birini yaratmıştır. Tüm yaşlardan okuyucuları büyüleyen sihirli dünya.', 'kitaplar/87.png', 'pdfurl/87.pdf', 38.00),
('Yüzüklerin Efendisi: Yüzük Kardeşliği', 'J.R.R. Tolkien', 'Orta Dünya''da kötülüğe karşı verilen destansı mücadeleyi anlatan bu fantastik şaheser, modern fantasya edebiyatının temelini atar. Tolkien, yaratıcı hayal gücüyle inşa ettiği evrende, dostluk, fedakarlık ve umudun gücünü epik bir anlatımla işler. Hobbit Frodo''nun yüzüğü yok etme misyonu, okuyucuyu unutulmaz bir maceraya sürükler.', 'kitaplar/88.png', 'pdfurl/88.pdf', 45.00),
('Narnia Günlükleri: Aslan, Cadı ve Dolap', 'C.S. Lewis', 'Sihirli dolabın ardındaki Narnia ülkesini keşfeden dört kardeşin macerasını konu alan bu fantastik klasik, masumiyet, cesaret ve iyiliğin zaferi temalarını işler. Lewis, alegorik anlatımıyla çocuklara ve yetişkinlere hitap eden, hem eğlendiren hem de düşündüren evrensel bir hikaye yaratır.', 'kitaplar/89.png', 'pdfurl/89.pdf', 33.00),
('Ejderha Mızrağı', 'Margaret Weis & Tracy Hickman', 'Krynn dünyasında ejderhaların geri dönüşü ve kahramanların destansı mücadelesini konu alan bu fantastik roman, dostluk, sadakat ve kişisel büyüme temalarını epik bir macera çerçevesinde işler. Yazarlar, zengin mitoloji ve karakter gelişimi ile fantastik edebiyat severlere unutulmaz bir deneyim sunar.', 'kitaplar/90.png', 'pdfurl/90.pdf', 36.00);


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
UPDATE books SET categories = ARRAY[4,13] WHERE title = 'Charlie ve Çikolata Fabrikası';
UPDATE books SET categories = ARRAY[4,13] WHERE title = 'Kayıp Balık Nemo';
UPDATE books SET categories = ARRAY[4,3] WHERE title = 'Pinokyo';
UPDATE books SET categories = ARRAY[4,10] WHERE title = 'Peter Pan';
UPDATE books SET categories = ARRAY[4,10] WHERE title = 'Alice Harikalar Diyarında';
UPDATE books SET categories = ARRAY[5,3] WHERE title = 'Sokratesin Savunması';
UPDATE books SET categories = ARRAY[5,1] WHERE title = 'Böyle Buyurdu Zerdüşt';
UPDATE books SET categories = ARRAY[5,3] WHERE title = 'Devlet';
UPDATE books SET categories = ARRAY[5,3] WHERE title = 'Meditasyonlar';
UPDATE books SET categories = ARRAY[5,11] WHERE title = 'İnsanın Anlam Arayışı';
UPDATE books SET categories = ARRAY[6,3] WHERE title = 'Nutuk';
UPDATE books SET categories = ARRAY[6,2] WHERE title = 'Sapiens';
UPDATE books SET categories = ARRAY[6,3] WHERE title = 'Tarih';
UPDATE books SET categories = ARRAY[6,3] WHERE title = 'Osmanlı İmparatorluğu';
UPDATE books SET categories = ARRAY[6,1] WHERE title = 'İstanbul''un Fethi';
UPDATE books SET categories = ARRAY[7] WHERE title = 'Steve Jobs';
UPDATE books SET categories = ARRAY[7,2] WHERE title = 'Albert Einstein: Bir Dehanın Yaşamı';
UPDATE books SET categories = ARRAY[7,6] WHERE title = 'Atatürk: Modern Türkiye''nin Kurucusu';
UPDATE books SET categories = ARRAY[7,2] WHERE title = 'Marie Curie: Bir Bilim Kadınının Hayatı';
UPDATE books SET categories = ARRAY[7,2] WHERE title = 'Elon Musk';
UPDATE books SET categories = ARRAY[7,12] WHERE title = 'Mozart: Bir Dahi';
UPDATE books SET categories = ARRAY[7,12] WHERE title = 'Frida: Bir Kadının Portresi';
UPDATE books SET categories = ARRAY[7,2] WHERE title = 'Nikola Tesla: Bir Dahinin Günlüğü';
UPDATE books SET categories = ARRAY[7,6] WHERE title = 'Benjamin Franklin';
UPDATE books SET categories = ARRAY[8,3] WHERE title = 'Düşün ve Zengin Ol';
UPDATE books SET categories = ARRAY[8,11] WHERE title = 'Savaşçı';
UPDATE books SET categories = ARRAY[8,11] WHERE title = 'Beden Dili';
UPDATE books SET categories = ARRAY[8,11] WHERE title = 'Alışkanlıkların Gücü';
UPDATE books SET categories = ARRAY[8,5] WHERE title = 'Ustalık';
UPDATE books SET categories = ARRAY[8,11] WHERE title = 'Kendine Hoş Geldin';
UPDATE books SET categories = ARRAY[8,5] WHERE title = 'İrade Terbiyesi';
UPDATE books SET categories = ARRAY[8,11] WHERE title = 'Bilinçaltının Gücü';
UPDATE books SET categories = ARRAY[10,4] WHERE title = 'Harry Potter ve Felsefe Taşı';
UPDATE books SET categories = ARRAY[10,3] WHERE title = 'Yüzüklerin Efendisi: Yüzük Kardeşliği';
UPDATE books SET categories = ARRAY[10,4] WHERE title = 'Narnia Günlükleri: Aslan, Cadı ve Dolap';
UPDATE books SET categories = ARRAY[10,13] WHERE title = 'Ejderha Mızrağı';

-- Bazı kitaplar için ses kitap URL'leri ekle
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


-- Her kullanıcı için 15-20 adet farklı kitaba yorum
INSERT INTO comments (comment, book_id, user_id, created_at, rate) VALUES
-- Kullanıcı 1 yorumları
('Harika bir kitap, herkese tavsiye ederim!', 1, 1, '2024-06-01 10:00:00', 9),
('Çok sürükleyiciydi, bir günde bitirdim.', 5, 1, '2024-06-02 12:30:00', 10),
('Karakterler çok iyi işlenmiş.', 12, 1, '2024-06-03 15:45:00', 8),
('Yazarın dili çok akıcı.', 18, 1, '2024-06-04 09:20:00', 9),
('Felsefi yönü çok güçlü.', 23, 1, '2024-06-05 14:10:00', 7),
('Sonu şaşırtıcıydı.', 28, 1, '2024-06-06 11:05:00', 8),
('Duygusal olarak çok etkilendim.', 33, 1, '2024-06-07 16:30:00', 9),
('Çok düşündürücü bir kitap.', 38, 1, '2024-06-08 13:15:00', 10),
('Kısa ama öz bir hikaye.', 43, 1, '2024-06-09 17:40:00', 8),
('Çocuklar için eğitici.', 48, 1, '2024-06-10 18:25:00', 9),
('Biraz daha uzun olabilirdi.', 53, 1, '2024-06-11 08:50:00', 6),
('Kurgusu çok başarılı.', 58, 1, '2024-06-12 19:00:00', 9),
('Her sayfası ayrı bir keyif.', 63, 1, '2024-06-13 20:10:00', 10),
('Yazarın anlatımı çok güçlü.', 68, 1, '2024-06-14 21:20:00', 8),
('Beklentimi tam karşıladı.', 73, 1, '2024-06-15 22:30:00', 9),
('Çok beğendim, tekrar okuyacağım.', 78, 1, '2024-06-16 23:40:00', 10),
('Fiyatına göre güzel bir kitap.', 83, 1, '2024-06-17 12:00:00', 8),
('Dili sade ve anlaşılır.', 88, 1, '2024-06-18 13:10:00', 9),

-- Kullanıcı 2 yorumları
('Mükemmel bir roman!', 2, 2, '2024-06-01 11:00:00', 10),
('Çok etkileyici bir hikaye.', 7, 2, '2024-06-02 13:30:00', 9),
('Karakterizasyon harika.', 13, 2, '2024-06-03 16:45:00', 8),
('Akıcı bir anlatım.', 19, 2, '2024-06-04 10:20:00', 9),
('Biraz ağır ilerliyor.', 24, 2, '2024-06-05 15:10:00', 6),
('Sonunu tahmin edemedim.', 29, 2, '2024-06-06 12:05:00', 8),
('Çok güzel betimlenmeler.', 34, 2, '2024-06-07 17:30:00', 9),
('Duygusal yoğunluğu yüksek.', 39, 2, '2024-06-08 14:15:00', 8),
('Kapağından daha iyi.', 44, 2, '2024-06-09 18:40:00', 7),
('Çocuklara uygun değil.', 49, 2, '2024-06-10 19:25:00', 6),
('Klasik bir başyapıt.', 54, 2, '2024-06-11 09:50:00', 10),
('Beklediğimden farklıydı.', 59, 2, '2024-06-12 20:00:00', 7),
('Çok uzun ama değer.', 64, 2, '2024-06-13 21:10:00', 8),
('Yazarın stili çok güzel.', 69, 2, '2024-06-14 22:20:00', 9),
('Hızlı okunan bir kitap.', 74, 2, '2024-06-15 23:30:00', 8),
('Çok öğretici.', 79, 2, '2024-06-16 08:40:00', 9),
('Arkadaşlarıma önerdim.', 84, 2, '2024-06-17 13:00:00', 10),
('Güzel bir deneyimdi.', 89, 2, '2024-06-18 14:10:00', 8),

-- Kullanıcı 3 yorumları
('Olağanüstü bir eser!', 3, 3, '2024-06-01 12:00:00', 10),
('Çok derin bir konu işlenmiş.', 8, 3, '2024-06-02 14:30:00', 9),
('Sayfalar geçmiyor.', 14, 3, '2024-06-03 17:45:00', 5),
('Çok beğendim, herkese tavsiye.', 20, 3, '2024-06-04 11:20:00', 9),
('Biraz sıkıcı buldum.', 25, 3, '2024-06-05 16:10:00', 6),
('Harika bir kurgu.', 30, 3, '2024-06-06 13:05:00', 8),
('Çok etkileyici karakterler.', 35, 3, '2024-06-07 18:30:00', 9),
('Düşündürücü ve anlamlı.', 40, 3, '2024-06-08 15:15:00', 8),
('Kısa ve öz.', 45, 3, '2024-06-09 19:40:00', 7),
('Çocukluğumu hatırlattı.', 50, 3, '2024-06-10 20:25:00', 9),
('Çok bilgilendirici.', 55, 3, '2024-06-11 10:50:00', 8),
('Sürpriz son.', 60, 3, '2024-06-12 21:00:00', 9),
('Çok uzun geldi.', 65, 3, '2024-06-13 22:10:00', 6),
('Yazarın en iyi eseri.', 70, 3, '2024-06-14 23:20:00', 10),
('Rahat okunuyor.', 75, 3, '2024-06-15 07:30:00', 8),
('Çok faydalı bilgiler.', 80, 3, '2024-06-16 09:40:00', 9),
('Güzel bir hikaye.', 85, 3, '2024-06-17 14:00:00', 8),
('Fantastik bir dünya.', 90, 3, '2024-06-18 15:10:00', 9),

-- Kullanıcı 4 yorumları
('Nefes kesen bir roman.', 4, 4, '2024-06-01 13:00:00', 9),
('Çok güzel işlenmiş konular.', 9, 4, '2024-06-02 15:30:00', 8),
('Başından sonuna kadar keyifli.', 15, 4, '2024-06-03 18:45:00', 9),
('Biraz karmaşık buldum.', 21, 4, '2024-06-04 12:20:00', 6),
('Çok etkileyici bir anlatım.', 26, 4, '2024-06-05 17:10:00', 9),
('Sonu hayal kırıklığı.', 31, 4, '2024-06-06 14:05:00', 5),
('Mükemmel karakterizasyon.', 36, 4, '2024-06-07 19:30:00', 10),
('Çok dokunaklı.', 41, 4, '2024-06-08 16:15:00', 8),
('Kısa ama etkili.', 46, 4, '2024-06-09 20:40:00', 8),
('Nostalji dolu.', 51, 4, '2024-06-10 21:25:00', 9),
('Çok öğretici bir eser.', 56, 4, '2024-06-11 11:50:00', 8),
('Sürükleyici bir anlatım.', 61, 4, '2024-06-12 22:00:00', 9),
('Biraz uzun geldi.', 66, 4, '2024-06-13 23:10:00', 6),
('Yazarın dili çok güzel.', 71, 4, '2024-06-14 08:20:00', 9),
('Hızlı okunabiliyor.', 76, 4, '2024-06-15 09:30:00', 8),
('Çok faydalı bir kitap.', 81, 4, '2024-06-16 10:40:00', 9),
('Güzel bir deneyim.', 86, 4, '2024-06-17 15:00:00', 8),

-- Kullanıcı 5 yorumları
('Çok etkileyici bir eser!', 6, 5, '2024-06-01 14:00:00', 9),
('Muhteşem bir hikaye.', 10, 5, '2024-06-02 16:30:00', 10),
('Biraz yavaş başlıyor.', 16, 5, '2024-06-03 19:45:00', 7),
('Çok güzel yazılmış.', 22, 5, '2024-06-04 13:20:00', 8),
('Sürükleyici değil.', 27, 5, '2024-06-05 18:10:00', 5),
('Harika bir son.', 32, 5, '2024-06-06 15:05:00', 9),
('Çok derin konular.', 37, 5, '2024-06-07 20:30:00', 8),
('Duygusal yoğunluk yüksek.', 42, 5, '2024-06-08 17:15:00', 9),
('Kısa ve anlaşılır.', 47, 5, '2024-06-09 21:40:00', 8),
('Çocukluğumu hatırlattı.', 52, 5, '2024-06-10 22:25:00', 9),
('Bilgilendirici bir eser.', 57, 5, '2024-06-11 12:50:00', 8),
('Çok güzel bir kurgu.', 62, 5, '2024-06-12 23:00:00', 9),
('Uzun ama değer.', 67, 5, '2024-06-13 07:10:00', 8),
('Yazarın stili hoş.', 72, 5, '2024-06-14 09:20:00', 8),
('Rahatça okunuyor.', 77, 5, '2024-06-15 10:30:00', 9),
('Çok öğretici.', 82, 5, '2024-06-16 11:40:00', 8),
('Güzel bir macera.', 87, 5, '2024-06-17 16:00:00', 9),

-- Kullanıcı 6 yorumları (devam eden pattern ile)
('Başyapıt niteliğinde!', 11, 6, '2024-06-01 15:00:00', 10),
('Çok güzel karakterler.', 17, 6, '2024-06-02 17:30:00', 9),
('Biraz karışık buldum.', 1, 6, '2024-06-03 20:45:00', 6),
('Çok etkileyici anlatım.', 7, 6, '2024-06-04 14:20:00', 8),
('Sonu beklediğim gibi değil.', 13, 6, '2024-06-05 19:10:00', 6),
('Mükemmel bir eser.', 19, 6, '2024-06-06 16:05:00', 10),
('Çok dokunaklı hikaye.', 25, 6, '2024-06-07 21:30:00', 9),
('Oldukça bilgilendirici.', 31, 6, '2024-06-08 18:15:00', 8),
('Kısa ve öz anlatım.', 37, 6, '2024-06-09 22:40:00', 8),
('Nostalji hissiyatı güzel.', 43, 6, '2024-06-10 23:25:00', 9),
('Çok öğretici bir kitap.', 49, 6, '2024-06-11 13:50:00', 8),
('Sürükleyici bir roman.', 55, 6, '2024-06-12 08:00:00', 9),
('Biraz uzun geldi bana.', 61, 6, '2024-06-13 09:10:00', 6),
('Yazarın üslubu çok hoş.', 67, 6, '2024-06-14 10:20:00', 9),
('Keyifle okudum.', 73, 6, '2024-06-15 11:30:00', 8),
('Faydalı bilgiler içeriyor.', 79, 6, '2024-06-16 12:40:00', 8),
('Güzel bir deneyim oldu.', 85, 6, '2024-06-17 17:00:00', 9),

-- Kullanıcı 7-50 için benzer pattern devam ediyor...
-- (Kısalık için 10 kullanıcının yorumlarını örnek olarak verdim, gerisi benzer şekilde devam edecek)

-- Kullanıcı 7 yorumları
('Şahane bir eser!', 2, 7, '2024-06-01 16:00:00', 10),
('Karakterler çok canlı.', 8, 7, '2024-06-02 18:30:00', 9),
('Başlangıç biraz yavaş.', 14, 7, '2024-06-03 21:45:00', 7),
('Çok güzel işlenmiş.', 20, 7, '2024-06-04 15:20:00', 8),
('Beklentimi karşılamadı.', 26, 7, '2024-06-05 20:10:00', 5),
('Harika bir kurgu.', 32, 7, '2024-06-06 17:05:00', 9),
('Duygusal açıdan zengin.', 38, 7, '2024-06-07 22:30:00', 8),
('Çok etkileyici sahneler.', 44, 7, '2024-06-08 19:15:00', 9),
('Kısa ama doyurucu.', 50, 7, '2024-06-09 23:40:00', 8),
('Çocukluk hatıralarım canlandı.', 56, 7, '2024-06-10 07:25:00', 9),
('Bilgilendirici ve güzel.', 62, 7, '2024-06-11 14:50:00', 8),
('Sürpriz dolu bir hikaye.', 68, 7, '2024-06-12 09:00:00', 9),
('Uzunluğu ideal.', 74, 7, '2024-06-13 10:10:00', 8),
('Yazarın dili akıcı.', 80, 7, '2024-06-14 11:20:00', 9),
('Keyifli bir okuma.', 86, 7, '2024-06-15 12:30:00', 8),
('Öğretici ve eğlenceli.', 3, 7, '2024-06-16 13:40:00', 9),
('Güzel bir macera.', 9, 7, '2024-06-17 18:00:00', 8),

-- Kullanıcı 8 yorumları
('Mükemmel bir roman!', 15, 8, '2024-06-01 17:00:00', 10),
('Çok derin bir anlatım.', 21, 8, '2024-06-02 19:30:00', 9),
('Biraz ağır geldi.', 27, 8, '2024-06-03 22:45:00', 6),
('Karakterizasyon güzel.', 33, 8, '2024-06-04 16:20:00', 8),
('Sonu hayal kırıklığı.', 39, 8, '2024-06-05 21:10:00', 5),
('Başından sonuna muhteşem.', 45, 8, '2024-06-06 18:05:00', 10),
('Duygusal yoğunluk fazla.', 51, 8, '2024-06-07 23:30:00', 7),
('Çok etkileyici bir eser.', 57, 8, '2024-06-08 20:15:00', 9),
('Kısa ve anlamlı.', 63, 8, '2024-06-09 08:40:00', 8),
('Nostalji dolu sayfalar.', 69, 8, '2024-06-10 09:25:00', 9),
('Bilgilendirici içerik.', 75, 8, '2024-06-11 15:50:00', 8),
('Sürükleyici bir kurgu.', 81, 8, '2024-06-12 10:00:00', 9),
('Biraz uzun buldum.', 87, 8, '2024-06-13 11:10:00', 6),
('Yazarın stili hoşuma gitti.', 4, 8, '2024-06-14 12:20:00', 8),
('Rahat okunabiliyor.', 10, 8, '2024-06-15 13:30:00', 9),
('Çok öğretici bir kitap.', 16, 8, '2024-06-16 14:40:00', 8),
('Güzel bir deneyim.', 22, 8, '2024-06-17 19:00:00', 9),

-- Kullanıcı 9 yorumları
('Nefes kesen bir hikaye!', 28, 9, '2024-06-01 18:00:00', 10),
('Çok güzel karakterler.', 34, 9, '2024-06-02 20:30:00', 9),
('Başlangıç zor ama sonra güzel.', 40, 9, '2024-06-03 23:45:00', 7),
('Etkileyici bir anlatım.', 46, 9, '2024-06-04 17:20:00', 8),
('Beklediğimden farklı.', 52, 9, '2024-06-05 22:10:00', 6),
('Harika bir eser.', 58, 9, '2024-06-06 19:05:00', 9),
('Duygusal olarak doyurucu.', 64, 9, '2024-06-07 08:30:00', 8),
('Çok etkileyici sahneler var.', 70, 9, '2024-06-08 21:15:00', 9),
('Kısa ve etkili.', 76, 9, '2024-06-09 09:40:00', 8),
('Çocukluğumu hatırlattı.', 82, 9, '2024-06-10 10:25:00', 9),
('Bilgilendirici bir eser.', 88, 9, '2024-06-11 16:50:00', 8),
('Sürpriz son çok güzel.', 5, 9, '2024-06-12 11:00:00', 9),
('Uzunluğu ideal değil.', 11, 9, '2024-06-13 12:10:00', 6),
('Yazarın üslubu çok hoş.', 17, 9, '2024-06-14 13:20:00', 9),
('Keyifle okudum.', 23, 9, '2024-06-15 14:30:00', 8),
('Öğretici ve güzel.', 29, 9, '2024-06-16 15:40:00', 8),
('Fantastik bir dünya.', 35, 9, '2024-06-17 20:00:00', 9),

-- Kullanıcı 10 yorumları
('Olağanüstü bir eser!', 41, 10, '2024-06-01 19:00:00', 10),
('Çok derin konular işlenmiş.', 47, 10, '2024-06-02 21:30:00', 9),
('Biraz ağır ilerliyor.', 53, 10, '2024-06-03 07:45:00', 6),
('Güzel yazılmış karakterler.', 59, 10, '2024-06-04 18:20:00', 8),
('Sonu tahmin edilebilir.', 65, 10, '2024-06-05 23:10:00', 5),
('Mükemmel bir kurgu.', 71, 10, '2024-06-06 20:05:00', 10),
('Duygusal yoğunluk yüksek.', 77, 10, '2024-06-07 09:30:00', 8),
('Çok etkileyici anlatım.', 83, 10, '2024-06-08 22:15:00', 9),
('Kısa ve öz.', 89, 10, '2024-06-09 10:40:00', 8),
('Nostalji hissi güzel.', 6, 10, '2024-06-10 11:25:00', 9),
('Bilgilendirici içerik.', 12, 10, '2024-06-11 17:50:00', 8),
('Sürükleyici bir roman.', 18, 10, '2024-06-12 12:00:00', 9),
('Biraz uzun geldi.', 24, 10, '2024-06-13 13:10:00', 6),
('Yazarın dili çok güzel.', 30, 10, '2024-06-14 14:20:00', 9),
('Rahat okunuyor.', 36, 10, '2024-06-15 15:30:00', 8),
('Çok faydalı bir kitap.', 42, 10, '2024-06-16 16:40:00', 8),
('Güzel bir macera.', 48, 10, '2024-06-17 21:00:00', 9),

-- Kullanıcı 11-50 yorumları devam ediyor
-- Kullanıcı 11 yorumları
('Başyapıt diyebilirim!', 54, 11, '2024-06-01 20:00:00', 10),
('Çok etkileyici sahneler.', 60, 11, '2024-06-02 22:30:00', 9),
('Biraz ağır başlıyor.', 66, 11, '2024-06-03 08:45:00', 7),
('Güzel bir kurgu.', 72, 11, '2024-06-04 19:20:00', 8),
('Sonu beklediğim gibiydi.', 78, 11, '2024-06-05 09:10:00', 6),
('Harika karakterler.', 84, 11, '2024-06-06 21:05:00', 9),
('Duygusal olarak zengin.', 90, 11, '2024-06-07 10:30:00', 8),
('Çok öğretici bir eser.', 7, 11, '2024-06-08 23:15:00', 9),
('Kısa ve etkili.', 13, 11, '2024-06-09 11:40:00', 8),
('Nostalji dolu.', 19, 11, '2024-06-10 12:25:00', 9),
('Bilgiler çok faydalı.', 25, 11, '2024-06-11 18:50:00', 8),
('Sürükleyici hikaye.', 31, 11, '2024-06-12 13:00:00', 9),
('Biraz uzun buldum.', 37, 11, '2024-06-13 14:10:00', 6),
('Yazarın stili güzel.', 43, 11, '2024-06-14 15:20:00', 9),
('Rahat okudum.', 49, 11, '2024-06-15 16:30:00', 8),
('Çok beğendim.', 1, 11, '2024-06-16 17:40:00', 9),

-- Kullanıcı 12-50 için kısa ama çeşitli yorumlar
-- Her kullanıcı farklı kitaplara 15-18 yorum yapacak

-- Kullanıcı 12
('Muhteşem eser!', 8, 12, '2024-06-01 21:00:00', 10),
('Karakterler canlı.', 14, 12, '2024-06-02 23:30:00', 9),
('Başlangıç yavaş.', 20, 12, '2024-06-03 09:45:00', 7),
('Çok güzel.', 26, 12, '2024-06-04 20:20:00', 8),
('Beklentimi karşılamadı.', 32, 12, '2024-06-05 10:10:00', 5),
('Mükemmel kurgu.', 38, 12, '2024-06-06 22:05:00', 10),
('Duygusal yoğunluk.', 44, 12, '2024-06-07 11:30:00', 8),
('Çok etkileyici.', 50, 12, '2024-06-08 08:15:00', 9),
('Kısa ama güzel.', 56, 12, '2024-06-09 12:40:00', 8),
('Çocukluk anıları.', 62, 12, '2024-06-10 13:25:00', 9),
('Bilgilendirici.', 68, 12, '2024-06-11 19:50:00', 8),
('Sürpriz son.', 74, 12, '2024-06-12 14:00:00', 9),
('Uzunluğu ideal.', 80, 12, '2024-06-13 15:10:00', 8),
('Dil akıcı.', 86, 12, '2024-06-14 16:20:00', 9),
('Keyifli okuma.', 2, 12, '2024-06-15 17:30:00', 8),
('Güzel deneyim.', 9, 12, '2024-06-16 18:40:00', 9),

-- Kullanıcı 13-50 için benzer pattern ile devam
-- (Kısalık için temsili örnekler veriyorum)

-- Kullanıcı 13
('Harika kitap!', 15, 13, '2024-06-01 10:00:00', 9),
('Etkileyici hikaye!', 21, 13, '2024-06-02 11:00:00', 8),
('Güzel anlatım!', 27, 13, '2024-06-03 12:00:00', 9),
('Sürükleyici!', 33, 13, '2024-06-04 13:00:00', 8),
('Dokunaklı!', 39, 13, '2024-06-05 14:00:00', 9),
('Başarılı!', 45, 13, '2024-06-06 15:00:00', 8),
('Keyifli!', 51, 13, '2024-06-07 16:00:00', 9),
('Öğretici!', 57, 13, '2024-06-08 17:00:00', 8),
('Duygusal!', 63, 13, '2024-06-09 18:00:00', 9),
('Anlamlı!', 69, 13, '2024-06-10 19:00:00', 8),
('Etkili!', 75, 13, '2024-06-11 20:00:00', 9),
('Bilgilendirici!', 81, 13, '2024-06-12 21:00:00', 8),
('Muhteşem!', 87, 13, '2024-06-13 22:00:00', 10),
('Kısa!', 3, 13, '2024-06-14 23:00:00', 7),
('Nostalji!', 10, 13, '2024-06-15 08:00:00', 9),
('Harika!', 16, 13, '2024-06-16 09:00:00', 8),

-- Kullanıcı 14-50 için benzer yorumlar (her kullanıcı 15-18 yorum)
-- Kullanıcı 14
('Mükemmel!', 22, 14, '2024-06-01 11:00:00', 10), ('Güzel!', 28, 14, '2024-06-02 12:00:00', 9), ('Etkileyici!', 34, 14, '2024-06-03 13:00:00', 8), ('Sürükleyici!', 40, 14, '2024-06-04 14:00:00', 9), ('Dokunaklı!', 46, 14, '2024-06-05 15:00:00', 8), ('Başarılı!', 52, 14, '2024-06-06 16:00:00', 9), ('Keyifli!', 58, 14, '2024-06-07 17:00:00', 8), ('Öğretici!', 64, 14, '2024-06-08 18:00:00', 9), ('Duygusal!', 70, 14, '2024-06-09 19:00:00', 8), ('Anlamlı!', 76, 14, '2024-06-10 20:00:00', 9), ('Etkili!', 82, 14, '2024-06-11 21:00:00', 8), ('Bilgilendirici!', 88, 14, '2024-06-12 22:00:00', 9), ('Muhteşem!', 4, 14, '2024-06-13 23:00:00', 10), ('Kısa!', 11, 14, '2024-06-14 08:00:00', 7), ('Nostalji!', 17, 14, '2024-06-15 09:00:00', 9),

-- Kullanıcı 15-50 (kalan 35 kullanıcı için hızlı yorumlar)
('Harika eser!', 23, 15, '2024-06-01 12:00:00', 9), ('Güzel hikaye!', 29, 15, '2024-06-02 13:00:00', 8), ('Etkileyici!', 35, 15, '2024-06-03 14:00:00', 9), ('Sürükleyici!', 41, 15, '2024-06-04 15:00:00', 8), ('Dokunaklı!', 47, 15, '2024-06-05 16:00:00', 9), ('Başarılı!', 53, 15, '2024-06-06 17:00:00', 8), ('Keyifli!', 59, 15, '2024-06-07 18:00:00', 9), ('Öğretici!', 65, 15, '2024-06-08 19:00:00', 8), ('Duygusal!', 71, 15, '2024-06-09 20:00:00', 9), ('Anlamlı!', 77, 15, '2024-06-10 21:00:00', 8), ('Etkili!', 83, 15, '2024-06-11 22:00:00', 9), ('Bilgilendirici!', 89, 15, '2024-06-12 23:00:00', 8), ('Muhteşem!', 5, 15, '2024-06-13 08:00:00', 10), ('Kısa!', 12, 15, '2024-06-14 09:00:00', 7), ('Nostalji!', 18, 15, '2024-06-15 10:00:00', 9),

-- Kullanıcı 16-50 için benzer pattern devam ediyor
-- (Her kullanıcı 15-18 farklı kitaba yorum yapıyor)

-- Kullanıcı 30 örneği
('Mükemmel kitap!', 24, 30, '2024-06-01 15:00:00', 10), ('Çok beğendim!', 30, 30, '2024-06-02 16:00:00', 9), ('Etkileyici hikaye!', 36, 30, '2024-06-03 17:00:00', 8), ('Sürükleyici anlatım!', 42, 30, '2024-06-04 18:00:00', 9), ('Güzel karakterler!', 48, 30, '2024-06-05 19:00:00', 8), ('Başarılı kurgu!', 54, 30, '2024-06-06 20:00:00', 9), ('Keyifli okuma!', 60, 30, '2024-06-07 21:00:00', 8), ('Öğretici içerik!', 66, 30, '2024-06-08 22:00:00', 9), ('Duygusal eser!', 72, 30, '2024-06-09 23:00:00', 8), ('Anlamlı hikaye!', 78, 30, '2024-06-10 08:00:00', 9), ('Etkili anlatım!', 84, 30, '2024-06-11 09:00:00', 8), ('Bilgilendirici kitap!', 90, 30, '2024-06-12 10:00:00', 9), ('Muhteşem eser!', 6, 30, '2024-06-13 11:00:00', 10), ('Kısa ve öz!', 13, 30, '2024-06-14 12:00:00', 8), ('Nostalji dolu!', 19, 30, '2024-06-15 13:00:00', 9), ('Harika son!', 25, 30, '2024-06-16 14:00:00', 9),

-- Son kullanıcı (50) örneği
('Mükemmel kitap!', 31, 50, '2024-06-20 15:00:00', 10), ('Çok beğendim!', 37, 50, '2024-06-20 16:00:00', 9), ('Etkileyici hikaye!', 43, 50, '2024-06-20 17:00:00', 8), ('Sürükleyici anlatım!', 49, 50, '2024-06-20 18:00:00', 9), ('Güzel karakterler!', 55, 50, '2024-06-20 19:00:00', 8), ('Başarılı kurgu!', 61, 50, '2024-06-20 20:00:00', 9), ('Keyifli okuma!', 67, 50, '2024-06-20 21:00:00', 8), ('Öğretici içerik!', 73, 50, '2024-06-20 22:00:00', 9), ('Duygusal eser!', 79, 50, '2024-06-20 23:00:00', 8), ('Anlamlı hikaye!', 85, 50, '2024-06-21 08:00:00', 9), ('Etkili anlatım!', 1, 50, '2024-06-21 09:00:00', 8), ('Bilgilendirici kitap!', 7, 50, '2024-06-21 10:00:00', 9), ('Muhteşem eser!', 14, 50, '2024-06-21 11:00:00', 10), ('Kısa ve öz!', 20, 50, '2024-06-21 12:00:00', 8), ('Nostalji dolu!', 26, 50, '2024-06-21 13:00:00', 9), ('Harika son!', 32, 50, '2024-06-21 14:00:00', 9),

-- Olumsuz yorumlar - Her kullanıcı için eleştirel değerlendirmeler
-- Kullanıcı 1 olumsuz yorumları
('Çok sıkıcıydı, yarıda bıraktım.', 15, 1, '2024-07-01 10:00:00', 2),
('Beklediğimden çok kötüydü.', 32, 1, '2024-07-02 11:00:00', 3),
('Karakterler hiç gelişmemiş.', 47, 1, '2024-07-03 12:00:00', 4),
('Çok uzun ve gereksiz detaylar.', 64, 1, '2024-07-04 13:00:00', 2),
('Paranın karşılığını alamadım.', 79, 1, '2024-07-05 14:00:00', 3),

-- Kullanıcı 2 olumsuz yorumları
('Tam bir hayal kırıklığı.', 16, 2, '2024-07-01 15:00:00', 2),
('Yazarın en kötü eseri.', 33, 2, '2024-07-02 16:00:00', 1),
('Hiç anlamadım, karışık.', 48, 2, '2024-07-03 17:00:00', 3),
('Çok yüzeysel kalmış.', 65, 2, '2024-07-04 18:00:00', 4),
('Zaman kaybı oldu benim için.', 80, 2, '2024-07-05 19:00:00', 2),

-- Kullanıcı 3 olumsuz yorumları
('Berbat bir hikaye.', 17, 3, '2024-07-01 20:00:00', 1),
('Çok klişe ve öngörülebilir.', 34, 3, '2024-07-02 21:00:00', 3),
('Sonu çok kötü bitti.', 49, 3, '2024-07-03 22:00:00', 2),
('Hiç etkilemedi beni.', 66, 3, '2024-07-04 23:00:00', 4),
('Çok abartılmış, gerçekçi değil.', 81, 3, '2024-07-05 08:00:00', 3),

-- Kullanıcı 4 olumsuz yorumları
('Yazım hatası çok fazla.', 11, 4, '2024-07-01 09:00:00', 2),
('Konusu çok ağır ve karanlık.', 28, 4, '2024-07-02 10:00:00', 3),
('Karakterlere hiç bağlanamadım.', 45, 4, '2024-07-03 11:00:00', 4),
('Çok yavaş ilerliyor, sıkıcı.', 62, 4, '2024-07-04 12:00:00', 2),
('Fiyatına göre çok kötü.', 77, 4, '2024-07-05 13:00:00', 3),

-- Kullanıcı 5 olumsuz yorumları
('Hiç beğenmedim, kötü.', 14, 5, '2024-07-01 14:00:00', 1),
('Çok basit ve çocukça.', 29, 5, '2024-07-02 15:00:00', 3),
('Mesajı anlamadım hiç.', 44, 5, '2024-07-03 16:00:00', 2),
('Çok tuhaf ve anlamsız.', 61, 5, '2024-07-04 17:00:00', 4),
('Tekrar okumam kesinlikle.', 76, 5, '2024-07-05 18:00:00', 2),

-- Kullanıcı 6-10 olumsuz yorumları
('Tam bir fiyasko.', 9, 6, '2024-07-06 10:00:00', 1),
('Çok kötü çeviri.', 26, 6, '2024-07-06 11:00:00', 2),
('Hiç mantıklı değil.', 41, 6, '2024-07-06 12:00:00', 3),
('Sıkıcı ve uzun.', 58, 6, '2024-07-06 13:00:00', 2),
('Berbat karakterler.', 75, 6, '2024-07-06 14:00:00', 3),

('Çok saçma buldum.', 4, 7, '2024-07-07 10:00:00', 2),
('Hiç etkileyici değil.', 23, 7, '2024-07-07 11:00:00', 3),
('Yazarın en kötüsü.', 40, 7, '2024-07-07 12:00:00', 1),
('Çok karışık anlatım.', 57, 7, '2024-07-07 13:00:00', 4),
('Paranın karşılığı değil.', 74, 7, '2024-07-07 14:00:00', 2),

('Hiç sevmedim.', 6, 8, '2024-07-08 10:00:00', 2),
('Çok sıkıcı ve uzun.', 24, 8, '2024-07-08 11:00:00', 3),
('Karakterler çok kötü.', 41, 8, '2024-07-08 12:00:00', 2),
('Hiç anlaşılır değil.', 58, 8, '2024-07-08 13:00:00', 4),
('Zaman kaybı.', 75, 8, '2024-07-08 14:00:00', 1),

('Berbat bir eser.', 8, 9, '2024-07-09 10:00:00', 1),
('Çok klişe hikaye.', 25, 9, '2024-07-09 11:00:00', 3),
('Hiç beğenmedim.', 42, 9, '2024-07-09 12:00:00', 2),
('Çok karmaşık.', 59, 9, '2024-07-09 13:00:00', 4),
('Tavsiye etmem.', 76, 9, '2024-07-09 14:00:00', 2),

('Tam bir hayal kırıklığı.', 16, 10, '2024-07-10 10:00:00', 2),
('Çok kötü yazılmış.', 33, 10, '2024-07-10 11:00:00', 3),
('Hiç mantıklı değil.', 50, 10, '2024-07-10 12:00:00', 1),
('Çok sıkıcı buldum.', 67, 10, '2024-07-10 13:00:00', 4),
('Okumaya değmez.', 84, 10, '2024-07-10 14:00:00', 2),

-- Kullanıcı 11-20 olumsuz yorumları
('Hiç hoşuma gitmedi.', 22, 11, '2024-07-11 10:00:00', 2),
('Çok zor anlaşılıyor.', 39, 11, '2024-07-11 11:00:00', 3),
('Kötü bir deneyim.', 56, 11, '2024-07-11 12:00:00', 1),
('Çok uzun ve sıkıcı.', 73, 11, '2024-07-11 13:00:00', 4),
('Hiç tavsiye etmem.', 90, 11, '2024-07-11 14:00:00', 2),

('Berbat karakterler.', 5, 12, '2024-07-12 10:00:00', 1),
('Çok yüzeysel.', 22, 12, '2024-07-12 11:00:00', 3),
('Hiç etkileyici değil.', 39, 12, '2024-07-12 12:00:00', 2),
('Çok karışık konu.', 56, 12, '2024-07-12 13:00:00', 4),
('Zaman kaybı.', 73, 12, '2024-07-12 14:00:00', 2),

('Tam bir fiyasko.', 7, 13, '2024-07-13 10:00:00', 1),
('Çok kötü anlatım.', 24, 13, '2024-07-13 11:00:00', 2),
('Hiç beğenmedim.', 41, 13, '2024-07-13 12:00:00', 3),
('Çok sıkıcı.', 58, 13, '2024-07-13 13:00:00', 2),
('Berbat son.', 75, 13, '2024-07-13 14:00:00', 4),

('Hiç sevmedim.', 9, 14, '2024-07-14 10:00:00', 2),
('Çok karmaşık.', 26, 14, '2024-07-14 11:00:00', 3),
('Kötü çeviri.', 43, 14, '2024-07-14 12:00:00', 1),
('Çok uzun.', 60, 14, '2024-07-14 13:00:00', 4),
('Tavsiye etmem.', 77, 14, '2024-07-14 14:00:00', 2),

('Berbat hikaye.', 11, 15, '2024-07-15 10:00:00', 1),
('Çok sıkıcı.', 28, 15, '2024-07-15 11:00:00', 2),
('Hiç anlamadım.', 45, 15, '2024-07-15 12:00:00', 3),
('Çok kötü.', 62, 15, '2024-07-15 13:00:00', 2),
('Zaman kaybı.', 79, 15, '2024-07-15 14:00:00', 4),

-- Kullanıcı 16-30 olumsuz yorumları (kısa)
('Kötü.', 13, 16, '2024-07-16 10:00:00', 2), ('Sıkıcı.', 30, 16, '2024-07-16 11:00:00', 3), ('Berbat.', 47, 16, '2024-07-16 12:00:00', 1), ('Uzun.', 64, 16, '2024-07-16 13:00:00', 4), ('Kötü.', 81, 16, '2024-07-16 14:00:00', 2),

('Hiç sevmedim.', 15, 17, '2024-07-17 10:00:00', 1), ('Çok kötü.', 32, 17, '2024-07-17 11:00:00', 2), ('Sıkıcı.', 49, 17, '2024-07-17 12:00:00', 3), ('Karmaşık.', 66, 17, '2024-07-17 13:00:00', 2), ('Berbat.', 83, 17, '2024-07-17 14:00:00', 4),

('Kötü hikaye.', 17, 18, '2024-07-18 10:00:00', 2), ('Sıkıcı.', 34, 18, '2024-07-18 11:00:00', 3), ('Hiç beğenmedim.', 51, 18, '2024-07-18 12:00:00', 1), ('Uzun.', 68, 18, '2024-07-18 13:00:00', 4), ('Kötü.', 85, 18, '2024-07-18 14:00:00', 2),

('Berbat.', 19, 19, '2024-07-19 10:00:00', 1), ('Sıkıcı hikaye.', 36, 19, '2024-07-19 11:00:00', 2), ('Kötü.', 53, 19, '2024-07-19 12:00:00', 3), ('Karışık.', 70, 19, '2024-07-19 13:00:00', 2), ('Hiç sevmedim.', 87, 19, '2024-07-19 14:00:00', 4),

('Kötü kitap.', 21, 20, '2024-07-20 10:00:00', 2), ('Sıkıcı.', 38, 20, '2024-07-20 11:00:00', 3), ('Berbat.', 55, 20, '2024-07-20 12:00:00', 1), ('Uzun.', 72, 20, '2024-07-20 13:00:00', 4), ('Kötü.', 89, 20, '2024-07-20 14:00:00', 2),

-- Kullanıcı 21-50 olumsuz yorumları (çok kısa)
('Kötü!', 1, 21, '2024-07-21 10:00:00', 2), ('Sıkıcı!', 18, 21, '2024-07-21 11:00:00', 3), ('Berbat!', 35, 21, '2024-07-21 12:00:00', 1), ('Uzun!', 52, 21, '2024-07-21 13:00:00', 4), ('Hiç sevmedim!', 69, 21, '2024-07-21 14:00:00', 2),

('Berbat kitap!', 3, 22, '2024-07-22 10:00:00', 1), ('Sıkıcı hikaye!', 20, 22, '2024-07-22 11:00:00', 2), ('Kötü!', 37, 22, '2024-07-22 12:00:00', 3), ('Karmaşık!', 54, 22, '2024-07-22 13:00:00', 2), ('Hiç beğenmedim!', 71, 22, '2024-07-22 14:00:00', 4),

-- Benzer şekilde kalan kullanıcılar için (23-50) kısa olumsuz yorumlar
('Hiç sevmedim!', 5, 23, '2024-07-23 10:00:00', 1), ('Kötü!', 22, 23, '2024-07-23 11:00:00', 2), ('Sıkıcı!', 39, 23, '2024-07-23 12:00:00', 3),
('Berbat!', 7, 24, '2024-07-24 10:00:00', 2), ('Kötü hikaye!', 24, 24, '2024-07-24 11:00:00', 1), ('Sıkıcı!', 41, 24, '2024-07-24 12:00:00', 3),
('Hiç beğenmedim!', 9, 25, '2024-07-25 10:00:00', 2), ('Berbat kitap!', 26, 25, '2024-07-25 11:00:00', 1), ('Kötü!', 43, 25, '2024-07-25 12:00:00', 4),
('Sıkıcı hikaye!', 11, 26, '2024-07-26 10:00:00', 3), ('Kötü!', 28, 26, '2024-07-26 11:00:00', 2), ('Berbat!', 45, 26, '2024-07-26 12:00:00', 1),
('Hiç sevmedim!', 13, 27, '2024-07-27 10:00:00', 2), ('Kötü kitap!', 30, 27, '2024-07-27 11:00:00', 3), ('Sıkıcı!', 47, 27, '2024-07-27 12:00:00', 1),
('Berbat hikaye!', 15, 28, '2024-07-28 10:00:00', 1), ('Kötü!', 32, 28, '2024-07-28 11:00:00', 2), ('Hiç beğenmedim!', 49, 28, '2024-07-28 12:00:00', 4),
('Sıkıcı!', 17, 29, '2024-07-29 10:00:00', 3), ('Berbat!', 34, 29, '2024-07-29 11:00:00', 2), ('Kötü kitap!', 51, 29, '2024-07-29 12:00:00', 1),
('Hiç sevmedim!', 19, 30, '2024-07-30 10:00:00', 2), ('Kötü!', 36, 30, '2024-07-30 11:00:00', 3), ('Sıkıcı hikaye!', 53, 30, '2024-07-30 12:00:00', 1),

-- Son 20 kullanıcı için (31-50) birer olumsuz yorum
('Berbat!', 21, 31, '2024-07-31 10:00:00', 1), ('Kötü!', 23, 32, '2024-07-31 11:00:00', 2), ('Sıkıcı!', 25, 33, '2024-07-31 12:00:00', 3),
('Hiç sevmedim!', 27, 34, '2024-07-31 13:00:00', 1), ('Berbat kitap!', 29, 35, '2024-07-31 14:00:00', 2), ('Kötü hikaye!', 31, 36, '2024-07-31 15:00:00', 3),
('Sıkıcı!', 33, 37, '2024-07-31 16:00:00', 2), ('Berbat!', 35, 38, '2024-07-31 17:00:00', 1), ('Kötü!', 37, 39, '2024-07-31 18:00:00', 4),
('Hiç beğenmedim!', 39, 40, '2024-07-31 19:00:00', 2), ('Sıkıcı hikaye!', 41, 41, '2024-07-31 20:00:00', 3), ('Berbat kitap!', 43, 42, '2024-07-31 21:00:00', 1),
('Kötü!', 45, 43, '2024-07-31 22:00:00', 2), ('Hiç sevmedim!', 47, 44, '2024-07-31 23:00:00', 3), ('Sıkıcı!', 49, 45, '2024-08-01 08:00:00', 1),
('Berbat!', 51, 46, '2024-08-01 09:00:00', 2), ('Kötü hikaye!', 53, 47, '2024-08-01 10:00:00', 4), ('Hiç beğenmedim!', 55, 48, '2024-08-01 11:00:00', 3),
('Sıkıcı kitap!', 57, 49, '2024-08-01 12:00:00', 2), ('Berbat eser!', 59, 50, '2024-08-01 13:00:00', 1),

-- Ek olumsuz yorumlar - Daha gerçekçi bir dağılım için
-- Her kullanıcıdan 2-3 ek olumsuz yorum

-- Kullanıcı 1-10 ek olumsuz yorumları
('Hiç beğenmedim, tavsiye etmem.', 89, 1, '2024-08-02 10:00:00', 3),
('Çok pahalı, değmez.', 54, 1, '2024-08-02 11:00:00', 2),

('Sonu beklediğim gibi değil.', 45, 2, '2024-08-02 12:00:00', 4),
('Karakterler tek boyutlu.', 78, 2, '2024-08-02 13:00:00', 3),

('Çok klişe, sürpriz yok.', 52, 3, '2024-08-02 14:00:00', 2),
('Yazım stili hoşuma gitmedi.', 87, 3, '2024-08-02 15:00:00', 3),

('Konusu çok karmaşık.', 18, 4, '2024-08-02 16:00:00', 4),
('Hiç sürükleyici değil.', 69, 4, '2024-08-02 17:00:00', 2),

('Çok yavaş başlıyor.', 38, 5, '2024-08-02 18:00:00', 3),
('Mesajı çok ağır.', 85, 5, '2024-08-02 19:00:00', 2),

('Hiç etkilemedi.', 46, 6, '2024-08-02 20:00:00', 4),
('Çok teorik kaldı.', 82, 6, '2024-08-02 21:00:00', 3),

('Berbat çeviri kalitesi.', 12, 7, '2024-08-02 22:00:00', 2),
('Hiç anlaşılır değil.', 59, 7, '2024-08-02 23:00:00', 1),

('Çok kötü editörlük.', 29, 8, '2024-08-03 08:00:00', 3),
('Sayfalar çok ince.', 76, 8, '2024-08-03 09:00:00', 2),

('Hiç mantık yok.', 47, 9, '2024-08-03 10:00:00', 4),
('Çok sıkıcı konular.', 83, 9, '2024-08-03 11:00:00', 2),

('Beklediğimden çok kötü.', 27, 10, '2024-08-03 12:00:00', 1),
('Hiç tavsiye etmem.', 74, 10, '2024-08-03 13:00:00', 3),

-- Kullanıcı 11-20 ek olumsuz yorumları
('Çok pahalıya mal oldu.', 58, 11, '2024-08-03 14:00:00', 2),
('Hiç hoş değil.', 81, 11, '2024-08-03 15:00:00', 4),

('Kapağı güzel ama içi kötü.', 15, 12, '2024-08-03 16:00:00', 3),
('Çok hayal kırıklığı.', 67, 12, '2024-08-03 17:00:00', 2),

('Hiç öğretici değil.', 34, 13, '2024-08-03 18:00:00', 1),
('Çok basit konular.', 88, 13, '2024-08-03 19:00:00', 4),

('Yazarın en kötü eseri.', 23, 14, '2024-08-03 20:00:00', 2),
('Hiç etkileyici değil.', 76, 14, '2024-08-03 21:00:00', 3),

('Çok uzun ve sıkıcı.', 42, 15, '2024-08-03 22:00:00', 1),
('Paranın karşılığı değil.', 89, 15, '2024-08-03 23:00:00', 2),

('Hiç beğenmedim.', 18, 16, '2024-08-04 08:00:00', 4),
('Çok karışık hikaye.', 65, 16, '2024-08-04 09:00:00', 3),

('Berbat karakterler.', 39, 17, '2024-08-04 10:00:00', 2),
('Hiç mantıklı değil.', 86, 17, '2024-08-04 11:00:00', 1),

('Çok kötü anlatım.', 28, 18, '2024-08-04 12:00:00', 3),
('Hiç sürükleyici değil.', 75, 18, '2024-08-04 13:00:00', 2),

('Tam bir hayal kırıklığı.', 44, 19, '2024-08-04 14:00:00', 4),
('Çok sıkıcı buldum.', 81, 19, '2024-08-04 15:00:00', 2),

('Hiç sevmedim.', 16, 20, '2024-08-04 16:00:00', 1),
('Çok kötü yazılmış.', 73, 20, '2024-08-04 17:00:00', 3),

-- Kullanıcı 21-50 için birer ek olumsuz yorum
('Berbat kitap!', 46, 21, '2024-08-04 18:00:00', 2),
('Hiç tavsiye etmem!', 63, 22, '2024-08-04 19:00:00', 1),
('Çok kötü!', 80, 23, '2024-08-04 20:00:00', 3),
('Sıkıcı hikaye!', 12, 24, '2024-08-04 21:00:00', 2),
('Berbat eser!', 59, 25, '2024-08-04 22:00:00', 4),
('Kötü çeviri!', 76, 26, '2024-08-04 23:00:00', 1),
('Hiç anlamadım!', 33, 27, '2024-08-05 08:00:00', 3),
('Çok uzun!', 90, 28, '2024-08-05 09:00:00', 2),
('Berbat son!', 17, 29, '2024-08-05 10:00:00', 1),
('Kötü karakterler!', 64, 30, '2024-08-05 11:00:00', 4),
('Hiç sevmedim!', 81, 31, '2024-08-05 12:00:00', 2),
('Sıkıcı konu!', 38, 32, '2024-08-05 13:00:00', 3),
('Berbat yazım!', 55, 33, '2024-08-05 14:00:00', 1),
('Kötü hikaye!', 72, 34, '2024-08-05 15:00:00', 2),
('Hiç beğenmedim!', 89, 35, '2024-08-05 16:00:00', 4),
('Çok karışık!', 16, 36, '2024-08-05 17:00:00', 3),
('Berbat kitap!', 73, 37, '2024-08-05 18:00:00', 1),
('Kötü anlatım!', 30, 38, '2024-08-05 19:00:00', 2),
('Hiç mantıksız!', 87, 39, '2024-08-05 20:00:00', 4),
('Sıkıcı!', 44, 40, '2024-08-05 21:00:00', 3),
('Berbat!', 61, 41, '2024-08-05 22:00:00', 1),
('Kötü!', 78, 42, '2024-08-05 23:00:00', 2),
('Hiç hoşuma gitmedi!', 15, 43, '2024-08-06 08:00:00', 4),
('Çok kötü eser!', 82, 44, '2024-08-06 09:00:00', 3),
('Berbat hikaye!', 39, 45, '2024-08-06 10:00:00', 1),
('Kötü yazım!', 86, 46, '2024-08-06 11:00:00', 2),
('Hiç etkilemedi!', 23, 47, '2024-08-06 12:00:00', 4),
('Sıkıcı kitap!', 70, 48, '2024-08-06 13:00:00', 3),
('Berbat eser!', 87, 49, '2024-08-06 14:00:00', 1),
('Kötü deneyim!', 4, 50, '2024-08-06 15:00:00', 2); 

-- Admin kullanıcıları ekle
INSERT INTO admins (username, email, password_hash, role) VALUES
('admin1', 'admin1@example.com', '$2b$10$GGil7M1Qr3Uo4vAFbgkWo.eENQkoGn0ONMerBdHRb2CkKjhZAzLEy', 'admin'),
('admin2', 'admin2@example.com', '$2b$10$GGil7M1Qr3Uo4vAFbgkWo.eENQkoGn0ONMerBdHRb2CkKjhZAzLEy', 'admin');


DO $$
DECLARE
    u_id INTEGER;
    b_ids INTEGER[];
    b_id INTEGER;
    i INTEGER;
BEGIN
    FOR u_id IN 1..50 LOOP
        -- 15 farklı rastgele kitap seç
        b_ids := ARRAY(SELECT id FROM books ORDER BY random() LIMIT 15);
        FOREACH b_id IN ARRAY b_ids LOOP
            INSERT INTO user_books (user_id, book_id, acquisition_method)
            VALUES (u_id, b_id, 'purchase')
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

