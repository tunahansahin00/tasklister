# TaskLister - Günlük Görev Planlama Paneli

Dark theme ile tasarlanmış, tam özellikli bir görev yönetim uygulaması. Türkçe ve İngilizce arayüz desteği ile günlük işlerinizi planlayın, takip edin ve tamamlayın.

## Özellikler

### Dil Desteği
- Türkçe (TR) — varsayılan arayüz dili
- İngilizce (EN) — tam çeviri desteği
- Tüm etiketler, placeholder'lar, hata mesajları ve bildirimler çift dilli
- Dil tercihi tarayıcı diline göre otomatik algılanır

### Dashboard
- Toplam görev, tamamlanan, devam eden ve tamamlanma oranı istatistik kartları
- Bugünkü görevlerinizi hızlıca görün ve yönetin
- SWR ile otomatik önbellek ve canlı güncelleme

### Görev Yönetimi
- Tam CRUD işlemleri (oluşturma, listeleme, düzenleme, silme)
- 300ms debounce ile canlı arama
- Durum (Yapılacak / Devam Ediyor / Tamamlandı), öncelik (Düşük / Orta / Yüksek / Kritik) ve kategori filtreleri
- Görev detayları: başlık, açıklama, tarih, başlangıç/bitiş saati, tahmini süre
- Alt görev desteği (checkbox ile tamamlama, sürükle-bırak sıralama)
- Tekrarlayan görev desteği (günlük / haftalık / aylık)

### Takvim Görünümü
- React.memo ve useMemo ile optimize edilmiş özel ay takvimi
- Her günde o güne ait görevlerin renk kodlu gösterimi
- Ay navigasyonu, bugün vurgusu

### Kanban Kart Görünümü
- 3 sütun: TODO, IN_PROGRESS, DONE (Türkçe etiketlerle)
- HTML5 Drag-and-Drop ile sürükle-bırak
- Durum değişiminde anlık güncelleme
- Her sütunda görev sayacı

### İstatistikler
- Recharts ile kategori dağılımı pasta grafiği
- Haftalık oluşturulan görevler çubuk grafiği
- Genel istatistik özet kartları

### Kategori Yönetimi
- CRUD işlemleri
- 12 hazır renk paleti ve 16 emoji ikonu
- Varsayılan kategoriler korumalı (silinemez)
- Her kategorinin görev sayacı

### Ayarlar & Bildirimler
- Browser Notification API ile tarayıcı bildirimleri
- Webhook URL yapılandırması (localStorage'da saklanır)
- Görev güncellemelerinde otomatik webhook tetikleme

### Performans
- Skeleton loading state'leri (görev kartı, istatistik, takvim, kanban)
- SWR ile 500ms deduplication, revalidateOnFocus kapalı
- React.memo ile TaskCard, KanbanCard, DayCell optimizasyonu
- useMemo ve useCallback ile gereksiz render önleme
- Debounced arama (300ms)

## Teknoloji Yığını

| Katman | Teknoloji | Versiyon |
|--------|-----------|----------|
| Framework | Next.js (App Router) | 16 |
| Dil | TypeScript | ^5 |
| Veritabanı | PostgreSQL 16 (Docker) | 16-alpine |
| ORM | Prisma | ^6 |
| CSS | Tailwind CSS v4 | ^4 |
| UI Bileşenleri | shadcn/ui (base-nova) | ^4 |
| İkonlar | Lucide React | ^1 |
| Veri Çekme | SWR | ^2 |
| Grafikler | Recharts | ^3 |
| Validasyon | Zod | ^4 |
| Test | Vitest + Testing Library | ^4 |

## Mimariler

```
src/
├── app/                    # Next.js App Router sayfaları & API
│   ├── layout.tsx          # Root layout (Sidebar + Header + ErrorBoundary)
│   ├── page.tsx            # Dashboard
│   ├── tasks/page.tsx      # Görev listesi
│   ├── calendar/page.tsx   # Takvim görünümü
│   ├── board/page.tsx      # Kanban board
│   ├── stats/page.tsx      # İstatistikler
│   ├── categories/page.tsx # Kategori yönetimi
│   ├── settings/page.tsx   # Ayarlar
│   └── api/                # REST API route'ları
│       ├── tasks/          # Görev CRUD
│       ├── categories/     # Kategori CRUD
│       ├── subtasks/       # Alt görev CRUD
│       ├── stats/          # İstatistikler
│       └── cron/recurring/ # Tekrarlayan görev cron endpoint
├── components/
│   ├── layout/             # Sidebar, Header
│   ├── tasks/              # TaskList, TaskCard, TaskForm, SubTaskList
│   ├── dashboard/          # StatsCards, TodayTasks
│   ├── calendar/           # CalendarView
│   ├── board/              # KanbanBoard
│   ├── stats/              # Charts
│   ├── categories/         # CategoryManager
│   ├── ui/                 # shadcn/ui bileşenleri
│   └── ErrorBoundary.tsx   # React Error Boundary
├── services/               # İş mantığı servis katmanı
│   ├── taskService.ts      # Görev, kategori, alt görev, istatistik
│   ├── recurringService.ts # Tekrarlayan görev işlemcisi
│   └── webhookService.ts   # Webhook gönderme yardımcısı
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   ├── fetchers.ts         # SWR hooks (useTasks, useCategories, mutasyonlar)
│   ├── validations.ts      # Zod şemaları
│   ├── rate-limit.ts       # In-memory rate limiter
│   ├── constants.ts        # Sabitler (etiketler, renkler)
│   └── utils.ts            # cn() yardımcısı
├── hooks/
│   └── useDebounce.ts      # Debounce hook
├── types/
│   └── index.ts            # TypeScript tipleri
└── test/
    └── *.test.ts           # Birim testler
```

## Veritabanı Şeması

### Category
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | String (cuid) | Primary key |
| name | String | Benzersiz kategori adı |
| color | String | HEX renk kodu |
| icon | String | Emoji ikonu |
| isDefault | Boolean | Varsayılan kategori koruması |
| createdAt | DateTime | Oluşturma zamanı |

### Task
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | String (cuid) | Primary key |
| title | String | Görev başlığı |
| description | String? | Açıklama |
| date | DateTime? | Görev tarihi |
| startTime | String? | Başlangıç saati |
| endTime | String? | Bitiş saati |
| priority | Enum | LOW, MEDIUM, HIGH, CRITICAL |
| status | Enum | TODO, IN_PROGRESS, DONE |
| estimatedMin | Int? | Tahmini süre (dk) |
| isRecurring | Boolean | Tekrarlayan görev |
| recurringRule | String? | daily, weekly, monthly |
| categoryId | String? | FK -> Category (ON DELETE SET NULL) |
| subtasks | SubTask[] | Alt görevler (CASCADE) |

### SubTask
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | String (cuid) | Primary key |
| title | String | Alt görev başlığı |
| isDone | Boolean | Tamamlandı durumu |
| taskId | String | FK -> Task (CASCADE) |
| order | Int | Sıralama |

## API Endpoint'leri

Tüm endpoint'ler JSON döner. `POST` ve `PATCH` istekleri Zod ile validate edilir.  
**Rate limit:** Her IP için 60 saniyede 100 istek.

| Metod | Endpoint | Açıklama |
|-------|----------|----------|
| GET | `/api/tasks` | Görev listesi (filtre parametreleri: status, priority, categoryId, date, search) |
| POST | `/api/tasks` | Yeni görev oluştur |
| GET | `/api/tasks/[id]` | Tekil görev |
| PATCH | `/api/tasks/[id]` | Görev güncelle |
| DELETE | `/api/tasks/[id]` | Görev sil |
| GET | `/api/categories` | Kategori listesi (görev sayılarıyla) |
| POST | `/api/categories` | Kategori oluştur |
| PATCH | `/api/categories/[id]` | Kategori güncelle |
| DELETE | `/api/categories/[id]` | Kategori sil |
| POST | `/api/subtasks` | Alt görev oluştur |
| PATCH | `/api/subtasks/[id]` | Alt görev güncelle |
| DELETE | `/api/subtasks/[id]` | Alt görev sil |
| GET | `/api/stats` | Dashboard istatistikleri |
| GET | `/api/cron/recurring` | Tekrarlayan görevleri işle |

## Başlangıç

### Gereksinimler
- Node.js >= 20
- Docker (PostgreSQL için)

### Kurulum

```bash
# Repoyu klonlayın
git clone https://github.com/tunahan/tasklister.git
cd tasklister

# Bağımlılıkları yükleyin
npm install

# Ortam değişkenlerini ayarlayın
cp .env.example .env
# .env dosyasındaki DATABASE_URL'i düzenleyin

# PostgreSQL'i başlatın
docker-compose up -d

# Veritabanı migration'larını çalıştırın
npx prisma migrate dev

# Örnek verileri yükleyin (10 varsayılan kategori)
npm run seed

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

### Tekrarlayan Görev Cron

Tekrarlayan görevlerin günlük olarak işlenmesi için:

```bash
# Manuel tetikleme
npm run cron

# crontab ile otomatik (her gün 00:00)
0 0 * * * curl http://localhost:3000/api/cron/recurring
```

## Script'ler

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Production sunucusu |
| `npm run lint` | ESLint ile kod kontrolü |
| `npm run format` | Prettier ile kod formatlama |
| `npm run format:check` | Format kontrolü |
| `npm test` | Testleri çalıştır |
| `npm run test:watch` | Testleri watch modunda çalıştır |
| `npm run test:coverage` | Test koşum + kapsam raporu |
| `npm run seed` | Örnek veri yükleme |
| `npm run cron` | Tekrarlayan görevleri tetikleme |

## Geliştirme Notları

### Güvenlik
- `.env` dosyası `.gitignore`'a eklenmiştir. Asla commit etmeyin.
- `.env.example` şablon olarak referans amaçlıdır.
- API endpoint'leri rate limit (IP başına 100 req/dk) ile korunmaktadır.
- Tüm input'lar Zod ile validate edilmektedir.

### Kod Kalitesi
- ESLint 9 (flat config) + Next.js core-web-vitals ve TypeScript kuralları
- Prettier ile tutarlı formatlama
- Servis katmanı ile API route'larından ayrılmış iş mantığı
- Tüm API route'larında try-catch hata yönetimi

### Testler
- Vitest + Testing Library ile birim testler
- Zod validasyon testleri
- Rate limiter testleri
- useDebounce hook testleri
- Sabitler testleri

## Lisans

MIT
