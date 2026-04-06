# 📦 Kurumsal Varlık ve Zimmet Yönetim Sistemi

> **Asset Management** — Şirket bünyesindeki fiziksel ve dijital varlıkların yaşam döngüsünü takip eden, Clean Architecture prensiplerine dayalı tam yığın (full-stack) web uygulaması.

---

## 📋 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Özellikler](#-özellikler)
- [Teknoloji Yığını](#-teknoloji-yığını)
- [Mimari](#-mimari)
- [Veritabanı Modeli](#-veritabanı-modeli)
- [API Endpoint'leri](#-api-endpointleri)
- [Kurulum](#-kurulum)
- [Geliştirme Yol Haritası](#-geliştirme-yol-haritası)

---

## 🎯 Proje Hakkında

Bu sistem şu temel soruları anlık olarak yanıtlamak için tasarlanmıştır:

- **"Hangi ürün kimde?"** — Zimmet takibi ile her varlığın kimin üzerinde olduğunu görün.
- **"Depoda kaç laptop var?"** — Stok durumunu gerçek zamanlı izleyin.
- **"Garanti süresi dolan ürünler hangileri?"** — Varlık detaylarından garanti bilgilerini takip edin.

### Kullanıcı Rolleri

| Rol | Yetkiler |
|-----|----------|
| **Sistem Yöneticisi (Admin)** | Tüm sisteme tam erişim. Kullanıcı, departman ve konfigürasyon yönetimi. |
| **Depo/Varlık Sorumlusu** | Demirbaş girişi, zimmetleme, iade alma ve raporlama. |

---

## ✨ Özellikler

### Varlık Yönetimi

- Marka, model, seri numarası, kategori, alım tarihi ve garanti bitiş tarihi ile ürün ekleme
- Arama, filtreleme ve sayfalama ile listeleme
- Varlık bilgilerini güncelleme
- **Soft Delete** — Veri silinmez, `IsDeleted = true` ile arşivlenir
- Otomatik durum takibi: `Stokta → Zimmetli → İade`

### Personel Yönetimi

- Ad, soyad, e-posta, telefon ve departman bilgileriyle personel kaydı
- Personelin üzerindeki aktif zimmetlerin görüntülenmesi
- Zimmet geçmişi (hangi ürün, ne zaman, kime verildi)

### Zimmet İşlemleri *(Kritik Modül)*

- **Zimmetleme** — Yalnızca `Available` statüsündeki varlıklar zimmetlenebilir; atama sonrası statü `Assigned` olur
- **İade Alma** — İade tarihi ve isteğe bağlı hasar notu girilir; ürün `Available`, `Broken` veya `Retired` durumuna geçer
- **Geçmiş Kaydı** — Her varlığın el değiştirme geçmişi (log) tutulur

### Dashboard (Raporlama)

- Toplam varlık sayısı
- Zimmetli varlık sayısı
- Stokta bekleyen varlık sayısı
- Kategorilere göre varlık dağılımı (grafik verisi)

---

## 🛠 Teknoloji Yığını

### Backend

| Bileşen | Teknoloji |
|---------|-----------|
| Framework | ASP.NET Core 10 (Web API) |
| Veritabanı | Microsoft SQL Server (SQLEXPRESS) |
| ORM | Entity Framework Core (Code-First) |
| API Dokümantasyonu | Swagger / OpenAPI |
| Mimari Desen | Clean Architecture (Onion) + Repository Pattern |

### Frontend

| Bileşen | Teknoloji |
|---------|-----------|
| Framework | Next.js 16 (App Router) |
| Dil | TypeScript |
| Stil | Tailwind CSS v4 |
| Runtime | React 19 |

---

## 🏗 Mimari

Proje, **Clean Architecture (Soğan Mimarisi)** prensiplerine göre 4 katmana ayrılmıştır:

```
AssetManagement.sln
├── AssetManagement.Domain          # Çekirdek: Entity'ler ve Enum'lar
├── AssetManagement.Application     # İş Mantığı: Servisler, Interface'ler, DTO'lar
├── AssetManagement.Infrastructure  # Altyapı: EF Core, Repository, Migration
├── AssetManagement.API             # Sunum: Controller'lar, Program.cs
└── frontend/                       # Next.js Uygulaması
```

### Katman Detayları

#### 🔵 Domain (Çekirdek Katman)

Dışa bağımlılığı olmayan, saf iş nesnelerini barındırır:

- `BaseEntity` — Ortak alanlar: `Id (Guid)`, `CreatedAt`, `IsDeleted`
- `Asset`, `Employee`, `Department`, `AssetCategory`, `AssetAssignment`
- `AssetStatus` enum: `Available (1)`, `Assigned (2)`, `Broken (3)`, `Retired (4)`

#### 🟢 Application (Uygulama Katmanı)

İş kurallarını ve sözleşmeleri tanımlar:

- **Interfaces/** — `IAssetService`, `IEmployeeService`, `IAssetAssignmentService`, `IDepartmentService`, `IAssetCategoryService`, `IDashboardService` ve repository karşılıkları
- **Services/** — Tüm iş mantığını uygulayan somut servis sınıfları
- **DTOs/** — Her modül için `Create`, `Update` ve `Response` DTO'ları

#### 🟡 Infrastructure (Altyapı Katmanı)

Dış sistemlerle iletişimi sağlar:

- `AssetDbContext` — EF Core DbContext, MSSQL bağlantısı
- **Repositories/** — Her interface için somut repository uygulaması
- **Migrations/** — Code-First migration dosyaları
- `ServiceRegistration` — Tüm servis ve repository bağımlılıklarının DI kaydı

#### 🔴 API (Sunum Katmanı)

HTTP isteklerini karşılar:

- 6 adet Controller
- CORS yapılandırması (`http://localhost:3000` için)
- Swagger UI (Development ortamında)

---

## 🗄 Veritabanı Modeli

```
Departments
├── Id (Guid, PK)
├── Name
└── Employees (1:N) ─────────────────────┐
                                          │
Employees                                 │
├── Id (Guid, PK)                         │
├── FirstName, LastName                   │
├── Email, Phone                          │
├── DepartmentId (FK) ─── Departments ◄──┘
└── AssetAssignments (1:N) ──────────────┐
                                          │
AssetCategories                           │
├── Id (Guid, PK)                         │
├── Name                                  │
└── Assets (1:N) ────────────────────┐   │
                                      │   │
Assets                                │   │
├── Id (Guid, PK)                     │   │
├── Name, SerialNumber                │   │
├── Status (Available/Assigned/...)   │   │
├── CategoryId (FK) ─ AssetCategories◄┘   │
└── AssetAssignments (1:N) ──────────┐   │
                                      │   │
AssetAssignments (Zimmet Kaydı)       │   │
├── Id (Guid, PK)                     │   │
├── AssetId (FK) ───────────────────◄─┘   │
├── EmployeeId (FK) ──────────────────────┘
├── AssignedDate
├── ReturnDate (nullable)
└── Notes (nullable)
```

> Tüm tablolar `IsDeleted` (soft delete) alanını `BaseEntity` üzerinden miras alır.

---

## 🌐 API Endpoint'leri

Tüm endpoint'ler `http://localhost:{port}/api` altında çalışır. Swagger UI: `http://localhost:{port}/swagger`

### Varlıklar `/api/Assets`

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/api/Assets` | Tüm varlıkları listele (query: `search`, `status`, `categoryId`) |
| `GET` | `/api/Assets/{id}` | Belirli varlığı getir |
| `POST` | `/api/Assets` | Yeni varlık oluştur |
| `PUT` | `/api/Assets/{id}` | Varlığı güncelle |
| `DELETE` | `/api/Assets/{id}` | Varlığı arşivle (soft delete) |
| `GET` | `/api/Assets/{id}/history` | Varlığın zimmet geçmişini getir |

### Zimmet İşlemleri `/api/Assignments`

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/api/Assignments` | Tüm aktif zimmetleri listele |
| `POST` | `/api/Assignments/assign` | Varlık zimmetle |
| `POST` | `/api/Assignments/return` | Varlık iade al |
| `GET` | `/api/Assignments/employee/{employeeId}` | Personelin zimmet geçmişi |

### Personeller `/api/Employees`

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/api/Employees` | Tüm personeli listele |
| `GET` | `/api/Employees/{id}` | Belirli personeli getir |
| `POST` | `/api/Employees` | Yeni personel ekle |
| `PUT` | `/api/Employees/{id}` | Personel güncelle |
| `DELETE` | `/api/Employees/{id}` | Personel sil |

### Departmanlar `/api/Departments`

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/api/Departments` | Tüm departmanları listele |
| `GET` | `/api/Departments/{id}` | Belirli departmanı getir |
| `POST` | `/api/Departments` | Yeni departman ekle |
| `PUT` | `/api/Departments/{id}` | Departman güncelle |
| `DELETE` | `/api/Departments/{id}` | Departman sil |

### Kategoriler `/api/AssetCategories`

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/api/AssetCategories` | Tüm kategorileri listele |
| `POST` | `/api/AssetCategories` | Yeni kategori ekle |
| `PUT` | `/api/AssetCategories/{id}` | Kategori güncelle |
| `DELETE` | `/api/AssetCategories/{id}` | Kategori sil |

### Dashboard `/api/Dashboard`

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/api/Dashboard` | Dashboard istatistiklerini getir |

---

## 🚀 Kurulum

### Gereksinimler

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/tr-tr/sql-server/sql-server-downloads) veya SQL Server Express
- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) veya [pnpm](https://pnpm.io/)

### 1. Repoyu Klonlayın

```bash
git clone <repo-url>
cd asset-management
```

### 2. Veritabanı Bağlantısını Yapılandırın

`AssetManagement.API/appsettings.json` dosyasındaki connection string'i kendi SQL Server örneğinize göre güncelleyin:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=AssetManagementDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### 3. Veritabanını Oluşturun (Migration)

```bash
# AssetManagement.API klasöründe ya da solution kökünde çalıştırın
dotnet ef database update --project AssetManagement.Infrastructure --startup-project AssetManagement.API
```

### 4. Backend'i Başlatın

```bash
cd AssetManagement.API
dotnet run
```

Backend varsayılan olarak `https://localhost:7XXX` ve `http://localhost:5XXX` adreslerinde çalışır.  
Swagger UI: `https://localhost:7XXX/swagger`

### 5. Frontend'i Başlatın

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:3000` adresinde çalışır ve backend ile CORS yapılandırması sayesinde iletişim kurar.

---

## 🗺 Geliştirme Yol Haritası

```
✅ Faz 1: Altyapı ve Veritabanı
   ├── Proje iskeleti (Clean Architecture)
   ├── Domain Entity'leri
   └── EF Core Migration ve veritabanı oluşturma

🔄 Faz 2: Backend Mantığı  ← Şu An
   ├── Repository Pattern
   ├── Service Layer (iş kuralları)
   ├── API Controller'ları
   └── Swagger ile test

🔜 Faz 3: Frontend
   ├── Next.js proje kurulumu
   ├── API servis fonksiyonları
   └── Sayfa tasarımları (Dashboard, Listeler, Zimmet)

🔜 Faz 4: Entegrasyon ve Test
   ├── Backend–Frontend entegrasyonu
   └── Uçtan uca test (Zimmetle → İade döngüsü)
```

---

## 📁 Proje Yapısı (Özet)

```
asset-management/
├── AssetManagement.sln
├── AssetManagement.API/
│   ├── Controllers/
│   │   ├── AssetsController.cs
│   │   ├── AssignmentsController.cs
│   │   ├── EmployeesController.cs
│   │   ├── DepartmentsController.cs
│   │   ├── AssetCategoriesController.cs
│   │   └── DashboardController.cs
│   └── Program.cs
├── AssetManagement.Application/
│   ├── DTOs/               (Asset, AssetAssignment, Employee, Department, AssetCategory, Dashboard)
│   ├── Interfaces/
│   │   ├── Repositories/   (IAssetRepository, IEmployeeRepository, ...)
│   │   └── Services/       (IAssetService, IEmployeeService, ...)
│   └── Services/           (AssetService, AssetAssignmentService, ...)
├── AssetManagement.Domain/
│   ├── Entities/           (Asset, Employee, Department, AssetCategory, AssetAssignment, BaseEntity)
│   └── Enums/              (AssetStatus)
├── AssetManagement.Infrastructure/
│   ├── Context/            (AssetDbContext)
│   ├── Repositories/       (Concrete repository implementations)
│   ├── Migrations/
│   └── ServiceRegistration.cs
├── frontend/               (Next.js 16 + TypeScript + Tailwind CSS)
└── prd.md
```

---


