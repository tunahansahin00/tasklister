# 🔷 Task Lister

## 🎯 Proje Hedefi
PostgreSQL veritabanlı, Next.js ile full-stack, koyu temalı, günlük task planlama ve yönetim paneli.

## 🏗 Teknoloji Stack
- **Next.js 16** (App Router, TypeScript, Turbopack)
- **PostgreSQL 16** + **Prisma ORM** (Docker)
- **Tailwind CSS v4** + **shadcn/ui**
- **SWR** (data fetching & caching)
- **Recharts** (grafikler)
- **shadcn/ui** (UI bileşenleri)

---

## ✅ Yapılacaklar

### Aşama 1 - Proje Kurulumu ✓
- [x] Next.js projesi oluşturma
- [x] Tailwind CSS + shadcn/ui kurulumu
- [x] Prisma + PostgreSQL (Docker) kurulumu
- [x] Temel layout (Sidebar + Header)
- [x] Dark tema yapılandırması

### Aşama 2 - Veritabanı ✓
- [x] Prisma şeması (Task, Category, SubTask)
- [x] Seed verisi (10 ön tanımlı kategori)
- [x] Migration çalıştırma

### Aşama 3 - Task CRUD ✓
- [x] Task ekleme modalı
- [x] Task listeleme + filtreleme
- [x] Task düzenleme/silme
- [x] Arama (debounce ile)
- [x] Status/Priority/Kategori filtreleme

### Aşama 4 - Dashboard ✓
- [x] İstatistik kartları (toplam, tamamlanan, devam eden, % oran)
- [x] Bugünkü görevler listesi
- [x] Skeleton loading
- [x] SWR ile 500ms deduped caching

### Aşama 5 - Takvim Görünümü ✓
- [x] Özel takvim (aylık grid, memoized)
- [x] Günlere göre task gösterme (max 2 + "daha")
- [x] Takvim üzerinden ekleme/düzenleme
- [x] Önceki/sonraki ay navigasyonu
- [x] Skeleton loading

### Aşama 6 - Kanban Board ✓
- [x] 3 kolon (TODO, IN_PROGRESS, DONE)
- [x] Sürükle-bırak ile durum değiştirme
- [x] Kolon bazlı task sayısı
- [x] Drop highlight efekti

### Aşama 7 - İstatistik Sayfası ✓
- [x] Pie chart (kategori dağılımı)
- [x] Bar chart (haftalık görevler)
- [x] Genel istatistik özeti
- [x] Skeleton loading

### Aşama 8 - Kategori Yönetimi ✓
- [x] 10 ön tanımlı kategori (İş, Kişisel, Sağlık, vb.)
- [x] Yeni kategori ekleme (renk seçici + ikon seçici)
- [x] Kategori düzenleme/silme
- [x] Varsayılan kategoriler korumalı

### Aşama 9 - Tekrarlanan Görevler ✓
- [x] Günlük/haftalık/aylık tekrar seçeneği
- [x] Task formunda recurring alanı

### Aşama 10 - Bildirimler & Webhook ✓
- [x] Tarayıcı bildirimi (Notification API)
- [x] Webhook URL yapılandırması
- [x] Bildirim test butonu

### Aşama 11 - Performans İyileştirmeleri ✓
- [x] **SWR** ile akıllı caching ve deduping
- [x] **Debounce** ile arama (300ms)
- [x] **React.memo** ile gereksiz re-render önleme
- [x] **Skeleton loading** tüm sayfalarda
- [x] **useMemo** ile calendar ve filter hesaplamaları
- [x] **Oluştur/Güncelle** butonlarında loading spinner

### Aşama 12 - Alt Görev (SubTask) Desteği ✓
- [x] SubTask API routes (CRUD)
- [x] Task formunda "Detaylar" + "Alt Görevler" tabları
- [x] Alt görev ekleme checkbox ile
- [x] Alt görev toggle (done/undone)
- [x] Alt görev silme
- [x] Alt görev sıralama (drag handle)

---

## 📁 Proje Yapısı
```
tasklister/
├── prisma/
│   ├── schema.prisma          # Veritabanı şeması
│   ├── seed.ts                # Seed verisi
│   └── migrations/            # Migration dosyaları
├── src/
│   ├── app/
│   │   ├── page.tsx           # Dashboard
│   │   ├── layout.tsx         # Root layout (sidebar + header)
│   │   ├── tasks/page.tsx     # Tüm görevler
│   │   ├── calendar/page.tsx  # Takvim görünümü
│   │   ├── board/page.tsx     # Kanban board
│   │   ├── stats/page.tsx     # İstatistikler
│   │   ├── categories/page.tsx# Kategori yönetimi
│   │   ├── settings/page.tsx  # Ayarlar
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── layout/            # Sidebar, Header
│   │   ├── tasks/             # TaskCard, TaskForm, TaskList, SubTaskList
│   │   ├── dashboard/         # StatsCards (SWR), TodayTasks
│   │   ├── calendar/          # CalendarView (memoized, SWR)
│   │   ├── board/             # KanbanBoard (SWR, Drag & Drop)
│   │   ├── stats/             # Charts (SWR, skeleton)
│   │   ├── categories/        # CategoryManager
│   │   └── ui/                # shadcn bileşenleri + skeleton
│   ├── hooks/
│   │   └── useDebounce.ts     # Debounce hook
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── constants.ts       # Sabitler
│   │   └── fetchers.ts        # SWR fetcher'lar
│   ├── types/
│   │   └── index.ts           # TypeScript tipleri
│   └── generated/prisma/      # Prisma generated client
├── docker-compose.yml         # PostgreSQL container
└── TASK.md                    # Bu dosya
```

## 🚀 Çalıştırma
```bash
# PostgreSQL başlat
docker compose up -d

# Geliştirme sunucusu
npm run dev          # http://localhost:3000

# Build
npm run build

# Seed (ilk kurulumda)
npx prisma db seed
```

## 📊 Sayfalar
| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Dashboard | `/` | İstatistik özeti + bugünkü görevler |
| Görevler | `/tasks` | Tüm görevler + filtreleme + debounce arama |
| Takvim | `/calendar` | Aylık takvim (memoized) |
| Kart | `/board` | Kanban board (sürükle-bırak) |
| İstatistik | `/stats` | Pie + Bar grafikler |
| Kategoriler | `/categories` | Kategori CRUD (renk + ikon) |
| Ayarlar | `/settings` | Bildirim + webhook |

## ⚡ Performans Notları
- **SWR**: API istekleri cache'lenir, 500ms içinde aynı endpoint tekrar çağrılmaz
- **Debounce**: Arama 300ms gecikmeli, her tuş vuruşunda API çağrısı yapılmaz
- **React.memo**: TaskCard, KanbanCard, DayCell, StatusCard gibi bileşenler memo'landı
- **useMemo**: Calendar hesaplamaları, filtre parametreleri memo'landı
- **Skeleton**: Tüm sayfalarda loading state gösterilir
