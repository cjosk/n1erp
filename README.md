# Neon1 ERP

Neon1 ERP, Neonbir üretim ve operasyon ekipleri için geliştirilmiş, Next.js (App Router) ve Firebase altyapısı kullanan modern bir kurumsal kaynak planlama (ERP) panelidir. Uygulama React + Tailwind CSS ile tasarlanmış olup Vercel üzerinde kolayca yayımlanabilir.

## Özellikler

- 🔐 Firebase Authentication ile admin ve ekip girişi
- 📊 Dashboard üzerinde sipariş istatistikleri ve durum dağılımı
- 📦 Firestore tabanlı sipariş yönetimi, durum filtreleme ve detay sayfası
- 🖼️ Firebase Storage entegrasyonu ile görsel yükleme
- 💹 Finansal raporlar ve tarih aralığı filtreleri
- 👥 Admin paneli, çalışan yönetimi ve aktivite logları
- 🗂️ Ürün katalog sayfaları ve kategori filtreleri
- 🧊 Tailwind CSS ile glassmorphism tasarım, Neonbir turuncusu (#ff7a00) teması

## Başlangıç

### Gereksinimler

- Node.js 18+
- pnpm / npm / yarn (örnek komutlar npm ile verilmiştir)
- Firebase projesi (Firestore + Storage + Authentication etkin)

### Kurulum

```bash
npm install
```

Geliştirme sunucusunu başlatmak için:

```bash
npm run dev
```

Uygulama varsayılan olarak [http://localhost:3000](http://localhost:3000) adresinde çalışır.

### Ortam Değişkenleri

`.env.example` dosyasını kopyalayarak `.env.local` oluşturun ve Firebase projenize ait değerlerle güncelleyin.

```bash
cp .env.example .env.local
```

| Değişken | Açıklama |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API anahtarı |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Authentication domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Proje ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket adı |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID |

## Firebase Yapılandırması

### Firestore Koleksiyonları

- `orders`: Sipariş kayıtları
- `users`: Admin ve ekip üyeleri
- `products`: Ürün kataloğu
- `logs`: Kullanıcı aktiviteleri

Her koleksiyon belgelerinde ISO tarih (`createdAt`, `updatedAt`) alanlarını kullanarak sıralama ve raporlama yapılabilir.

### Storage Klasörleri

- `/product_images`: Sipariş ve ürün görselleri
- `/design_files`: Tasarım dokümanları ve üretim dosyaları

### Örnek Güvenlik Kuralları

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /users/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'Admin';
    }
    match /logs/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.token.role == 'Admin';
    }
    match /products/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role in ['Admin'];
    }
  }
}

service firebase.storage {
  match /b/{bucket}/o {
    match /product_images/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    match /design_files/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

> **Not:** Rolleri Authentication tarafında `custom claims` olarak set etmeniz gerekir.

## Dağıtım (Vercel)

1. Depoyu GitHub'a gönderin ve Vercel hesabınızı bağlayın.
2. Yeni bir proje oluşturun, bu depoyu seçin.
3. Build ayarlarını (Next.js) otomatik olarak algılayacaktır.
4. Vercel ortam değişkenlerine `.env.local` içindeki Firebase değerlerini ekleyin.
5. Deploy işlemini başlatın.

## Proje Yapısı

```
app/
  (auth)/login          → Giriş sayfası
  (dashboard)/          → Dashboard, siparişler, raporlar, admin
components/             → Tekrar kullanılabilir UI bileşenleri
hooks/                  → Firestore veri çekme hook'ları
lib/                    → Firebase ve yardımcı fonksiyonlar
public/                 → Statik varlıklar
```

## Geliştirme Notları

- App Router ile tüm sayfalar client bileşenleri olarak oluşturulmuştur.
- Tailwind CSS ile glassmorphism stilleri uygulanmıştır.
- Recharts ile donut, bar ve line chart görselleştirmeleri sağlanmıştır.
- Form validasyonları `react-hook-form` ile gerçekleştirilmiştir.
- Kod stili TypeScript ve Next.js 14 standartlarına uygundur.

## Yol Haritası / Opsiyonel Geliştirmeler

- ⏰ Geciken siparişler için Firebase Cloud Functions ile bildirim tetikleyicileri
- 📤 Finansal raporların CSV/XLSX dışa aktarımı
- 🔒 Rol bazlı görünürlük (Üretim personeli için finans sayfalarını gizleme)
- 🌓 Dark mode desteği

## Lisans

Bu proje Neonbir için özelleştirilmiş bir çözümdür. Kullanım hakları şirket politikasına göre belirlenmelidir.
