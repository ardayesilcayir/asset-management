📁 PROJE: Kurumsal Varlık ve Zimmet Yönetim Sistemi(Asset Management)

1. Proje Özeti ve Amaç
Şirket bünyesindeki fiziksel (bilgisayar, telefon, araç, mobilya) ve dijital (lisanslar) varlıkların yaşam döngüsünü takip eden web tabanlı bir uygulamadır.
Temel Amaç: "Hangi ürün kimde?", "Depoda kaç laptop var?", "Garanti süresi dolan ürünler hangileri?" sorularına anlık cevap verebilmek.
2. Hedef Kitle ve Roller
Projede şimdilik 2 temel rol olacaktır (MVP - Minimum Viable Product kapsamında):
Sistem Yöneticisi (Admin):
Tüm sisteme tam yetkilidir.
Kullanıcı (Personel) ve Departman tanımlarını yapar.
Konfigürasyon ayarlarını yönetir.
Depo/Varlık Sorumlusu:
Yeni demirbaş girişi yapar.
Zimmetleme (Atama) ve İade alma işlemlerini yürütür.
Raporları görüntüler.
3. Teknik Mimari (Tech Stack)
Backend: ASP.NET Core 10 (Web API)
Frontend: Next.js (App Router, TypeScript)
Veritabanı: MSSQL Server 2022
ORM: Entity Framework Core (Code-First)
Mimari: Clean Architecture (Onion) + Repository Pattern
API İletişimi: RESTful API (JSON)
4. Fonksiyonel Gereksinimler (Özellikler)
4.1. Varlık Yönetimi (Asset Management)
Ekleme: Marka, model, seri no, kategori, alım tarihi ve garanti bitiş tarihi ile ürün ekleme.
Listeleme: Tüm varlıkları tablo halinde gösterme (Sayfalama, Arama, Filtreleme).
Güncelleme: Varlık bilgilerini düzenleme.
Silme (Soft Delete): Veriyi veritabanından tamamen silmek yerine IsDeleted = true yaparak arşivleme.
Durum Takibi: Varlığın durumu (Stokta, Zimmetli, Arızalı, Hurda) otomatik güncellenmeli.
4.2. Personel Yönetimi (Employee Management)
Ad, Soyad, Email, Telefon ve Departman bilgileriyle personel kaydı.
Personelin üzerindeki zimmetlerin görüntülenmesi.
4.3. Zimmet İşlemleri (Assignment Logic) - KRİTİK MODÜL
Zimmetleme: Stoktaki (Available) bir ürünü, bir personele atama.
Kural: Sadece Available statüsündeki ürünler zimmetlenebilir.
Sonuç: Ürün statüsü Assigned olur.
İade Alma: Personeldeki ürünü depoya geri alma.
Kural: İade tarihi ve (varsa) hasar notu girilmelidir.
Sonuç: Ürün statüsü tekrar Available, Broken veya Retired olarak güncellenir.
Tarihçe: Bir ürünün kimlerden kimlere geçtiğinin (Log) tutulması.
4.4. Raporlama (Dashboard)
Toplam Varlık Sayısı
Zimmetli Varlık Sayısı
Stoktaki Varlık Sayısı
Kategorilere Göre Dağılım (Pasta Grafik verisi)
5. Veritabanı Modeli (Özet)
Kodladığımız yapı şu şekildedir:
Tablo Açıklama
Departments Şirket birimleri (IT, İK vb.)
Employees Çalışanlar (Department ile ilişkili)
AssetCategories Ürün tipleri (Laptop, Monitör vb.)
Assets Tekil ürünler (Serial No, Status vb.)
AssetAssignments Zimmet kayıtları (Many-to-Many ilişki tablosu)
6. Arayüz (UI/UX) Kriterleri
Temiz Tasarım: Kurumsal, göz yormayan renkler (Mavi/Gri tonları).
Hız: Sayfa geçişleri hızlı olmalı (Next.js avantajı).
Responsive: Tablet ve masaüstünde düzgün görünmeli.
Geri Bildirim: İşlem başarılı olduğunda (Toast Notification) veya hata aldığında kullanıcıya bilgi verilmeli.
7. Geliştirme Yol Haritası (Roadmap)
Şu an Faz 1'in sonundayız. Yolculuğumuz şöyle devam edecek:
✅ Faz 1: Altyapı ve Veritabanı
Proje iskeletinin kurulması.
Entity'lerin yazılması.
Veritabanının oluşturulması (Migration).
🔄 Faz 2: Backend Mantığı (Şu An Buradayız)
Repository Pattern kurulumu (Veriye erişim).
Service Layer (İş kuralları: "Stokta olmayan ürün zimmetlenemez" vb.).
API Controller'ların yazılması (Endpoint'lerin açılması).
Swagger ile test.
🔜 Faz 3: Frontend Kurulumu
Next.js projesinin oluşturulması.
API servis fonksiyonlarının yazılması (Axios/Fetch).
Sayfa tasarımları (Login, Dashboard, Listeler).
🔜 Faz 4: Entegrasyon ve Test
Backend ve Frontend'in bağlanması.
Uçtan uca test (Zimmetle -> İade Et döngüsü).
