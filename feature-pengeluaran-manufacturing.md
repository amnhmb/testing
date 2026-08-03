# Feature Request: Pengeluaran Manufacturing & Untung Bersih

**Project:** ThirtyOne Lab — Invoice Manager
**Scope:** Dashboard metric cards (baru) + Page/Nav baru "Manufacturing"
**Platform:** Mobile & Desktop (responsive, guna design system sedia ada)

---

## 1. Ringkasan

Tambah keupayaan untuk rekod **kos pengeluaran (manufacturing cost)** bagi setiap invoice, dan papar **untung bersih** (kutipan − pengeluaran) di dashboard. Juga tambah satu page/nav baru untuk senarai pengeluaran ikut invoice.

---

## 2. Data Model

Setiap invoice perlukan field baru:

```
invoice.pengeluaran  → number (RM), kos manufacturing untuk invoice tu
```

Nilai ini digunakan untuk kira:
```
untung (per invoice) = invoice.total − invoice.pengeluaran
untung bersih (dashboard, bulanan) = kutipanBulanNi − jumlahPengeluaranBulanNi
```

> Field ni kena masuk dalam invoice form (New Invoice / Edit Invoice) — tak specify UI form dalam dokumen ni, tapi perlu diselaraskan dengan flow sedia ada di `InvoiceModal.jsx`.

---

## 3. Feature A — Dashboard: 2 Metric Card Baru

Dashboard sedia ada (`Dashboard.jsx`) ada 3 metric card: Kutipan Bulan Ni, Belum Bayar (Unpaid), Deposit Only. Tambah:

- **Card 4:** 🏭 Pengeluaran Manufacturing — jumlah pengeluaran bulan ni
- **Card 5:** 💚 Untung Bersih — Kutipan − Pengeluaran (card ini **highlighted**, guna warna hijau badge-paid sedia ada: `#E2F5EA` bg / `#15803D` text)

### Mobile (≤ 640px)
- 4 card pertama (Kutipan, Unpaid, Deposit, Pengeluaran) susun **2-column grid** (`grid-template-columns: 1fr 1fr`, gap 0.75rem).
- Card "Untung Bersih" jadi **wide card** (`grid-column: 1 / -1`), letak bawah grid tu, dengan visual lebih menonjol (border atau background hijau muda).
- Setiap card mobile: icon di atas, label kecil, angka besar, sub-label kecil bawah — vertical stack (bukan flex-row macam desktop sekarang), supaya muat dalam ruang sempit 2-column.

```
┌───────────────────────────────┐
│ Pusat Kawalan Utama            │
│ Overview Dashboard    [+ New]  │
│                                │
│ ┌────────────┬────────────┐   │
│ │💰 KUTIPAN   │⚠️ UNPAID    │   │
│ │BULAN NI     │            │   │
│ │RM 12,450    │RM 3,200    │   │
│ │8 Invoice    │4 Invoice   │   │
│ ├────────────┼────────────┤   │
│ │👛 DEPOSIT   │🏭 PENGELUARAN│  │
│ │ONLY         │            │   │
│ │RM 1,050     │RM 4,800    │   │
│ │3 Invoice    │            │   │
│ └────────────┴────────────┘   │
│ ┌───────────────────────────┐ │
│ │ 💚 UNTUNG BERSIH            │ │
│ │ RM 7,650.00                 │ │
│ │ Kutipan − Pengeluaran       │ │
│ └───────────────────────────┘ │
└───────────────────────────────┘
```

### Desktop (> 900px, guna layout sedia ada `.metrics-grid`)
- Kekalkan **row of 5 card sama besar** (extend `grid-template-columns` dari 3 → 5 kolum), atau jika terlalu sempit dengan sidebar, guna 2 baris: baris 1 = 3 card asal, baris 2 = Pengeluaran + Untung Bersih (Untung Bersih span 2 kolum extra-wide dengan visual accent).
- Card kekal flex-row (icon kiri, teks kanan) — style sedia ada tak berubah, hanya extend bilangan.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Pusat Kawalan Utama                                    [+ New Invoice] │
│  Overview Dashboard                                                     │
│                                                                           │
│  ┌───────────────┬───────────────┬───────────────┬───────────────┐     │
│  │ 💰 Kutipan     │ ⚠️ Belum Bayar │ 👛 Deposit     │ 🏭 Pengeluaran │     │
│  │ Bulan Ni       │                │ Only           │ Manufacturing  │     │
│  │ RM 12,450.00   │ RM 3,200.00    │ RM 1,050.00    │ RM 4,800.00    │     │
│  │ 8 Invoice      │ 4 Invoice      │ 3 Invoice      │                │     │
│  └───────────────┴───────────────┴───────────────┴───────────────┘     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 💚 UNTUNG BERSIH                              RM 7,650.00         │   │
│  │ Kutipan Bulan Ni − Pengeluaran Manufacturing                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Feature B — Nav/Page Baru: "Manufacturing" (Senarai Pengeluaran)

Satu page/route baru yang senarai pengeluaran **ikut invoice**, dengan 3 maklumat utama setiap row:

```
Nama (client)  |  Total Invoice − Pengeluaran (= Untung)  |  Status Semasa (badge bayaran invoice)
```

Status guna badge sama macam sedia ada: `badge-paid` (✅ hijau) / `badge-deposit` (🟡 kuning) / `badge-unpaid` (🔴 merah).

### Mobile
- Reuse pattern `.mobile-card` dari Dashboard/Invoices sedia ada: card per invoice, nama + badge status di top row, breakdown (Invoice / Pengeluaran / Untung) dalam card body.
- Search box di atas (reuse `.search-box` style).
- Tambah 1 icon baru (🏭) kat `.mobile-bottom-nav` — akan jadi 5 item, kena kecikkan font label supaya muat 1 baris.

```
┌───────────────────────────────┐
│ ← Manufacturing                │
│ Senarai Pengeluaran             │
│                                │
│ ┌───────────────────────────┐ │
│ │ 🔍 Cari nama/no. invoice.. │ │
│ └───────────────────────────┘ │
│                                │
│ ┌───────────────────────────┐ │
│ │ TOL-2026-015                │ │
│ │ Ahmad Zaki      🟡 Deposit │ │
│ │ Invoice: RM 540.00           │ │
│ │ Pengeluaran: RM 180.00       │ │
│ │ ─────────────────────────  │ │
│ │ Untung: RM 360.00     💚   │ │
│ └───────────────────────────┘ │
│ ┌───────────────────────────┐ │
│ │ TOL-2026-014                │ │
│ │ Siti Aminah    ✅ Selesai  │ │
│ │ Invoice: RM 890.00           │ │
│ │ Pengeluaran: RM 320.00       │ │
│ │ ─────────────────────────  │ │
│ │ Untung: RM 570.00     💚   │ │
│ └───────────────────────────┘ │
│                                │
├───────────────────────────────┤
│ 🏠  📄  🏭  👥  ⚙️            │
│Ovrvw Inv Manu Clnt Set        │
└───────────────────────────────┘
```

### Desktop
- Reuse pattern `.desktop-only` table (macam Invoices/Dashboard punya table view sedia ada): kolum **Nama | Total Invoice | Pengeluaran | Untung | Status**.
- Nav baru masuk dalam sidebar/top-nav desktop sedia ada (bukan bottom-nav — desktop tak guna bottom-nav), letak selepas "Invoices" atau "Clients" ikut struktur nav sedia ada dalam `App.jsx`.

```
┌──────────┬────────────────────────────────────────────────────────────┐
│ 🏠 Overvi│  Senarai Pengeluaran                    [🔍 Cari...........]│
│ 📄 Invoic│                                                              │
│ 🏭 Manufa│  ┌──────────────┬──────────────┬────────────┬────────────┐ │
│ 👥 Client│  │ Nama         │ Total Invoice│ Pengeluaran│ Status     │ │
│ ⚙️ Setti │  ├──────────────┼──────────────┼────────────┼────────────┤ │
│          │  │ Ahmad Zaki   │ RM 540.00    │ RM 180.00  │ 🟡 Deposit │ │
│          │  │ Untung: RM 360.00                                     │ │
│          │  ├──────────────┼──────────────┼────────────┼────────────┤ │
│          │  │ Siti Aminah  │ RM 890.00    │ RM 320.00  │ ✅ Selesai │ │
│          │  │ Untung: RM 570.00                                     │ │
│          │  └──────────────┴──────────────┴────────────┴────────────┘ │
└──────────┴────────────────────────────────────────────────────────────┘
```

---

## 5. Design System — Reference untuk AI/Dev Follow-Up

**Guna value ni SAJA — jangan invent warna/font baru.** Semua diambil dari `src/index.css` sedia ada.

### Warna
| Token | Value | Guna untuk |
|---|---|---|
| `--primary-red` | `#C51B27` | brand, CTA button, accent (trademark — kekalkan exact) |
| `--primary-red-hover` | `#A1141E` | hover state |
| `--primary-red-light` | `#FDF2F3` | light bg untuk highlight/active state |
| `--off-white-bg` | `#FAF9F6` | page background (trademark — kekalkan exact) |
| `--off-white-card` | `#FFFFFF` | card background |
| `--text-dark` | `#111111` | teks utama |
| `--text-muted` | `#666666` | sub-label |
| `--text-light` | `#8E8B82` | teks paling light |
| `--border-color` | `#E6E2DC` | border card/input |

### Status Badge (guna terus untuk kolum "Status Semasa")
| Status | Background | Text |
|---|---|---|
| Paid (✅ Selesai) | `#E2F5EA` | `#15803D` |
| Deposit (🟡) | `#FEF3C7` | `#B45309` |
| Unpaid (🔴) | `#FEE2E2` | `#B91C1C` |

### Untuk card "Untung Bersih" — guna warna badge-paid (`#E2F5EA` / `#15803D`) sebagai theme card tu, supaya konsisten dengan makna "positif/hijau" dalam sistem sedia ada.

### Typography
- Heading/brand: `Montserrat` (`--font-primary`)
- Body/teks: `Inter` (`--font-secondary`)

### Shadow & Transition
- `--shadow-sm`, `--shadow-md`, `--shadow-lg` — guna ikut hierarchy (card = `shadow-sm` atau `shadow-md`, modal = `shadow-lg`)
- `--transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1)` — guna untuk semua hover/transition supaya konsisten dengan animasi sedia ada.

### Layout Pattern Sedia Ada (WAJIB reuse, jangan buat pattern baru)
- Mobile: `.mobile-top-bar`, `.mobile-bottom-nav`, `.mobile-card`, `.search-box`
- Desktop: `.metrics-grid`, `.metric-card`, `.desktop-only` table
- Badge: class `.badge-paid` / `.badge-deposit` / `.badge-unpaid` (jangan buat class badge baru)

---

## 6. Checklist Implementation

- [ ] Tambah field `pengeluaran` ke invoice data model & form (Invoice Modal)
- [ ] Dashboard: tambah 2 metric card (Pengeluaran, Untung Bersih) — mobile 2-col grid + desktop extended row
- [ ] Update CSS `.metrics-grid` untuk handle 5 card (mobile & desktop breakpoint)
- [ ] Buat page/route baru `Manufacturing.jsx` (senarai pengeluaran per invoice)
- [ ] Tambah nav item baru: bottom-nav (mobile) & sidebar/top-nav (desktop)
- [ ] Reuse `.badge-paid/deposit/unpaid` untuk status semasa dalam page baru
- [ ] Test responsive breakpoint (mobile ≤640px, tablet, desktop >900px) pastikan tak pecah layout sedia ada
