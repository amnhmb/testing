# Pelan Pelaksanaan Modul Kewangan (Version 2)

Sistem ini mengasingkan "Status Bayaran" daripada "Status Kerja". Ia juga memperkenalkan Buku Lejar dan Laporan Untung Rugi (P&L). Semua data direkod ke Local Storage untuk fasa ini sebelum dihubungkan ke Supabase kelak.

## User Review Required
> [!IMPORTANT]
> Sila semak struktur baharu ini. Sebarang format cetakan atau dokumen yang tidak mempunyai lakaran ASCII di dalam pelan ini akan dikekalkan mengikut reka bentuk asal Version 1.

## Proposed Changes

### 1. Struktur Papan Pemuka dan Invois
Papan pemuka memaparkan Untung Bersih Sebenar. Halaman Orders memfokuskan rekod pelanggan. Status bayaran hanya menggunakan `UNPAID`, `DEPOSIT`, dan `PAID`. 

#### Papan Pemuka (Desktop)
```text
+-----------------------------------------------------------------------------+
| 31LAB                                                                       |
| THIRTYONE LAB                 PUSAT KAWALAN UTAMA                           |
|                               OVERVIEW DASHBOARD                            |
+--------------------------+--------------------------------------------------+
| MENU UTAMA               |                                                  |
| > [ Overview        ]    |  +-----------------------------------------------+
|   [ Orders          ]    |  | UNTUNG BERSIH SEBENAR (NET PROFIT)            |
|   [ Manufacturing   ]    |  | RM 7,650.00                                   |
|   [ Clients         ]    |  | Kutipan Jualan - Kos Operasi (Lejar)          |
|                          |  +-----------------------------------------------+
| KEWANGAN                 |                                                  |
|   [ Ledger (Buku)   ]    |  +-----------------------+-----------------------+
|   [ P&L Reports     ]    |  | STATUS BAYARAN        | STATUS OPERASI        |
|                          |  |                       |                       |
| TETAPAN                  |  |  1 Unpaid             |  1 Pending            |
|   [ Settings        ]    |  |  3 Deposit            |  5 Processing         |
|                          |  |  8 Paid (Bulan ini)   |  2 Completed          |
| BAHASA / LANGUAGE        |  +-----------------------+-----------------------+
|  ( EN )   [ BM ]         |                                                  |
|                          |  +-----------------------+-----------------------+
| +----------------------+ |  | TOTAL KUTIPAN JUALAN  | TOTAL KOS (KELUAR)    |
| | [L] LOCAL MODE       | |  | RM 12,450.00          | RM 4,800.00           |
| |   Simpan Peranti     | |  |                       |                       |
| +----------------------+ |  | Bulan ini             | Kilang + Lejar Kedai  |
+--------------------------+--------------------------------------------------+
```

#### Papan Pemuka (Mobile - Menu Terapung)
```text
+-----------------------------+
| 31LAB              (EN) [L]| 
+-----------------------------+
| PUSAT KAWALAN UTAMA         |
|                             |
| +-------------------------+ |
| | UNTUNG BERSIH SEBENAR   | |
| | RM 7,650.00             | |
| +-------------------------+ |
|                             |
| +-------------------------+ |
+ | STATUS BAYARAN          | |
> |  1 Unpaid               | |
= |  3 Deposit              | | <-- Butang = (Menu) Terapung 
> |  8 Paid                 | |     di zon ibu jari. 
+ | +-------------------------+ |
|                             |
| +-------------------------+ |
| | STATUS OPERASI          | |
| |  1 Pending              | |
| |  5 Processing           | |
| |  2 Completed            | |
| +-------------------------+ |
+-----------------------------+
```

#### Halaman Orders (Desktop)
```text
+-----------------------------------------------------------------------------+
| 31LAB                                                                       |
| THIRTYONE LAB                 SENARAI TEMPAHAN                              |
|                               ORDERS                                        |
+--------------------------+--------------------------------------------------+
| MENU UTAMA               |                                                  |
|   [ Overview        ]    |  [ Cari Nama/No Invois... ]        [+ NEW ORDER] |
| > [ Orders          ]    |                                                  |
|   [ Manufacturing   ]    |  +-----------------------------------------------+
|   [ Clients         ]    |  | NO.INV | NAMA PELANGGAN | JUMLAH  | STATUS    |
|                          |  +--------+----------------+---------+-----------+
| KEWANGAN                 |  | INV001 | Ahmad Zaki     | 540.00  | [ PAID  ] |
|   [ Ledger (Buku)   ]    |  |        |                |         |           |
|   [ P&L Reports     ]    |  +--------+----------------+---------+-----------+
|                          |  | INV002 | Siti Aminah    | 890.00  | [ DEPO  ] |
| TETAPAN                  |  |        |                | D:400.00|           |
|   [ Settings        ]    |  +--------+----------------+---------+-----------+
|                          |  | INV003 | Johan Arif     | 320.00  | [ UNPD  ] |
| BAHASA / LANGUAGE        |  |        |                |         |           |
|  ( EN )   [ BM ]         |  +--------+----------------+---------+-----------+
|                          |                                                  |
+--------------------------+--------------------------------------------------+
```

#### Halaman Orders (Mobile)
```text
+-----------------------------+
| 31LAB              (EN) [L]| 
+-----------------------------+
| SENARAI TEMPAHAN            |
| ORDERS                      |
|                             |
| [ Cari Nama/No... ]         |
|                             |
| +-------------------------+ |
| | INV001      RM 540.00   | |
| | Ahmad Zaki              | |
| |                         | |
| |  [ PAID ]               | |
| +-------------------------+ |
|                             |
| +-------------------------+ |
| | INV002      RM 890.00   | |
| | Siti Aminah             | |
| |                         | |
| |  Depo: RM 400.00        | |
| |  [ DEPOSIT ]            | |
| +-------------------------+ |
|                             |
|      [ + NEW ORDER ]        |
+-----------------------------+
```

#### Modal Edit/Print Invoice (Desktop)
```text
+---------------------------------------------------------------------------------------------------------+
| [X] EDIT ORDER / INVOICE #INV002                                                                        |
+---------------------------------------------------------------------------------------------------------+
| A. MAKLUMAT ASAS TEMPAHAN                                                                               |
| +-----------------------------------------------------+    +------------------------------------------+ |
| | Nama Pelanggan: [ Siti Aminah                     ] |    | Nama Kerja (Job Name): [ Event Sukan   ] | |
| | No. Telefon:    [ 0123456789                      ] |    | Tarikh Invois:         [ 15-08-2026    ] | |
| | Alamat Penuh:   [ Kajang, Selangor                ] |    |                                          | |
| +-----------------------------------------------------+    +------------------------------------------+ |
|                                                                                                         |
| B. MAKLUMAT BAYARAN & PELANGGAN                                                                         |
| +-----------------------------------------------------+    +------------------------------------------+ |
| | Status Bayaran: [ DEPOSIT v ]                       |    | [ ] Follow Invoice Lama?                 | |
| | RM Deposit:     [ 400.00       ]                    |    | Harga 1pcs Invoice Lama: [ RM 40.00 ]    | |
| +-----------------------------------------------------+    +------------------------------------------+ |
|                                                                                                         |
| C. BUTIRAN TEMPAHAN                                                                                     |
| [ TAB: BAJU SUBLIMATION ]  [ TAB: BANNER / BUNTING ]                                                    |
| +-----------------------------------------------------------------------------------------------------+ |
| | ITEM #1                                                                                             | |
| | +------------------------------------+ +----------------------------------------------------------+ | |
| | | [IMG] Upload Design Image          | | Nama Design: [ Baju Team A                           ] | | |
| | | (Gambar Baju)                      | | Kategori:    [ Sublimation v]  Jenis: [ Baju v]        | | |
| | +------------------------------------+ | Material:    [ Micro v]        Potongan: [ Normal v]   | | |
| |                                        | Neck:        [ V-Neck v]       Name Set: [ No v]       | | |
| |                                        +----------------------------------------------------------+ | |
| |                                                                                                     | |
| | +-------------------------------------------------------------------------------------------------+ | |
| | | [v] Pecahan Saiz & Kuantiti Lengan (Klik untuk lipat)                                           | | |
| | | +---------------------------------------------------------------------------------------------+ | | |
| | | | Dewasa:      [ 20 ] XS-5XL  (S/L)   |  [+] Buka Senarai Saiz Dewasa                         | | | |
| | | | Kanak-Kanak: [ 0  ] Sz2-14  (S/L)   |  [+] Buka Senarai Saiz Kanak-Kanak                    | | | |
| | | | Seluar Dwsa: [ 5  ] XS-5XL  (Pants) |  [+] Buka Senarai Seluar Dewasa                       | | | |
| | | | Seluar Knk2: [ 0  ] Sz2-14  (Pants) |  [+] Buka Senarai Seluar Kanak-Kanak                  | | | |
| | | +---------------------------------------------------------------------------------------------+ | | |
| | +-------------------------------------------------------------------------------------------------+ | |
| +-----------------------------------------------------------------------------------------------------+ |
| | ITEM #2 - Baju Team B                                [ 25 pcs | RM 1,112.50 ]     [ v BUKA ]      | |
| +-----------------------------------------------------------------------------------------------------+ |
| | [+] Tambah Item Baru                                                                                  | |
| +-----------------------------------------------------------------------------------------------------+ |
|                                                                                                         |
| +-----------------------------------------------------+    +------------------------------------------+ |
| | D. DISKAUN & NOTA                                   |    | E. RINGKASAN HARGA                       | |
| | Jenis Diskaun: [ Per Pcs v ]                        |    | Total Kuantiti: 25 helai                 | |
| | Nilai Diskaun: [ RM 0.00   ]                        |    | Harga Asas:     RM 44.50 / helai         | |
| | Nota Tambahan: [ Sila siapkan sebelum 25 Ogos...  ] |    | Total Harga:    RM 1,112.50              | |
| |                                                     |    | Tolak Diskaun: -RM 0.00                  | |
| +-----------------------------------------------------+    | TOTAL TERKINI:  RM 1,112.50              | |
|                                                            | BAKI BAYARAN:   RM 712.50                | |
|                                                            +------------------------------------------+ |
|                                                                                                         |
| +-----------------------------------------------------------------------------------------------------+ |
| |   [PRINT Invoice]    [PRINT Deposit]    [PRINT Official Receipt]        [SAVE CHANGES]              | |
| +-----------------------------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------------+
```

#### Modal Edit/Print Invoice (Mobile)
```text
+---------------------------+
| [X] EDIT ORDER #INV002    |
+---------------------------+
| A. MAKLUMAT TEMPAHAN      |
| +-----------------------+ |
| | Nama: Siti Aminah     | |
| | Tel:  0123456789      | |
| | Job:  Event Sukan     | |
| | Tarikh: 15-08-2026    | |
| | Alamat: Kajang        | |
| +-----------------------+ |
|                           |
| B. BAYARAN & PELANGGAN    |
| +-----------------------+ |
| | Status Bayaran:       | |
| | [ DEPOSIT v ]         | |
| | RM Deposit: [ 400 ]   | |
| +-----------------------+ |
| +-----------------------+ |
| | [ ] Follow Inv Lama   | |
| | RM/pcs Lama: [ 40 ]   | |
| +-----------------------+ |
|                           |
| C. BUTIRAN TEMPAHAN       |
| [ BAJU ]    [ BANNER ]    |
|                           |
| ITEM #1                   |
| +-----------------------+ |
| | [IMG] Upload Image    | |
| | Nama Design: Team A   | |
| | Kategori: Subli v     | |
| | Jenis: Baju v         | |
| | Material: Micro v     | |
| | Cut: Normal v         | |
| | Neck: V-Neck v        | |
| | Name Set: No v        | |
| +-----------------------+ |
|                           |
| +-----------------------+ |
| | [v] Pecahan Saiz      | |
| | Dewasa: 20 pcs        | |
| | [+] Buka Saiz Dwsa    | |
| |                       | |
| | Kanak2: 0 pcs         | |
| | [+] Buka Saiz Knk2    | |
| |                       | |
| | Seluar Dwsa: 5 pcs    | |
| | [+] Buka Seluar Dwsa  | |
| |                       | |
| | Seluar Knk2: 0 pcs    | |
| | [+] Buka Seluar Knk2  | |
| +-----------------------+ |
|                           |
| ITEM #2 - Baju Team B     |
| [ 25 pcs | RM 1112 ] [v]  |
|                           |
| [+] Tambah Item Baru      |
|                           |
| D. DISKAUN & NOTA         |
| +-----------------------+ |
| | Jenis: Per Pcs v      | |
| | Diskaun (RM): 0.00    | |
| | Nota: Siapkan cepat   | |
| +-----------------------+ |
|                           |
| E. RINGKASAN HARGA        |
| +-----------------------+ |
| | Total Qty: 25 pcs     | |
| | Harga Asas: 44.50     | |
| | Total Harga: 1112.50  | |
| | Tolak: -0.00          | |
| | BAKI: RM 712.50       | |
| +-----------------------+ |
|                           |
| ==( STICKY BOTTOM BAR )== |
| +-----------------------+ |
| | [PRINT Inv] [PRINT Dep] |
| | [PRINT Rst] [SAVE]      |
| +-----------------------+ |
+---------------------------+
```

### 2. Modul Manufacturing (Operasi Kilang)
Di sini anda mengawal perjalanan tugas kilang dan merekod kos.

#### Halaman Operasi Kilang (Desktop)
```text
+---------------------------------------------------------------------------------------------------------+
| 31LAB                                                                                                   |
| THIRTYONE LAB                 MANUFACTURING & OPERASI KILANG                                            |
|                               Pantau Status Tempahan dan Rekod Kos Pengeluaran                          |
+--------------------------+------------------------------------------------------------------------------+
| MENU UTAMA               | RINGKASAN STATUS KERJA                                                       |
|   [ Overview        ]    | +-------------------------+ +-------------------------+ +------------------+ |
|   [ Orders          ]    | | PENDING (Belum)         | | PROCESSING (Jalan)      | | COMPLETED        | |
| > [ Manufacturing   ]    | | 2 Orders                | | 5 Orders                | | 12 Orders        | |
|   [ Clients         ]    | +-------------------------+ +-------------------------+ +------------------+ |
|                          |                                                                              |
| KEWANGAN                 | SENARAI TEMPAHAN                                                             |
|   [ Ledger (Buku)   ]    | +--------------------------------------------------------------------------+ |
|   [ P&L Reports     ]    | | NO. INV & NAMA   | ITEM (Baju/Banner)| KOS KILANG  | STATUS   | TINDAKAN | |
|                          | +--------------------------------------------------------------------------+ |
| TETAPAN                  | | #INV002          | Baju Team A (20p) | [ RM 450 ]  | [ PROC v]| [SAVE]   | |
|   [ Settings        ]    | | Siti Aminah      | Baju Team B (5p)  |             |          | [PRINT]  | |
|                          | +--------------------------------------------------------------------------+ |
| BAHASA / LANGUAGE        | | #INV003          | Baju Rewang (50p) | [ RM 1200]  | [ PEND v]| [SAVE]   | |
|  ( EN )   [ BM ]         | | Ahmad Albab      | Banner (2 unit)   |             |          | [PRINT]  | |
|                          | +--------------------------------------------------------------------------+ |
| +----------------------+ | | #INV004          | Jersey (10 pcs)   | [ RM 250 ]  | [ COMP v]| [SAVE]   | |
| | [L] LOCAL MODE       | | | Kelab Esport     |                   |             |          | [PRINT]  | |
| |   Simpan Peranti     | | +--------------------------------------------------------------------------+ |
| +----------------------+ |                                                                              |
+--------------------------+------------------------------------------------------------------------------+
```

#### Halaman Operasi Kilang (Mobile)
```text
+-----------------------------+
| 31LAB              (EN) [L]|
+-----------------------------+
| MANUFACTURING & KILANG      |
|                             |
| +-------------------------+ |
| | STATUS KERJA KILANG     | |
| | PENDING:    2           | |
| | PROCESSING: 5           | |
| | COMPLETED:  12          | |
| +-------------------------+ |
|                             |
| SENARAI PENGELUARAN         |
| +-------------------------+ |
= | #INV002 - Siti Aminah   | |
| | Item: Baju Team A (20)  | |
| |       Baju Team B (5)   | |
| |                         | |
| | Kos Kilang: [ RM 450 ]  | |
| | Status: [ PROC v ]      | |
| |                         | |
| | [SAVE] [PRINT VOUCHER]  | |
| +-------------------------+ |
|                             |
| +-------------------------+ |
| | #INV003 - Ahmad Albab   | |
| | Item: Baju Rewang (50)  | |
| |       Banner (2 unit)   | |
| |                         | |
| | Kos Kilang: [ RM 1200]  | |
| | Status: [ PEND v ]      | |
| |                         | |
| | [SAVE] [PRINT VOUCHER]  | |
| +-------------------------+ |
+-----------------------------+
```

#### Payment Voucher Kilang
```text
+-------------------------------------------------------------------------+
| [LOGO]   31LAB                                                          |
|          THIRTYONE LAB                                                  |
|          No 12, Jalan Niaga 1, 43000 Kajang, Selangor                   |
|          Tel: 012-3456789                                               |
|                                                                         |
| PAYMENT VOUCHER                                                         |
| Voucher No: PV-2026-08-01-K                                             |
| Date:       05/08/2026                                                  |
|                                                                         |
|-------------------------------------------------------------------------|
| DIBAYAR KEPADA (PAY TO) : [ Kilang Cetak Baju / Tukang Jahit ]          |
|-------------------------------------------------------------------------|
|                                                                         |
| BUTIRAN PEMBAYARAN (DETAILS):                                           |
| +---------------------------------------------------------------------+ |
| | NO | RUJUKAN TEMPAHAN                | KETERANGAN        | JUMLAH   | |
| +---------------------------------------------------------------------+ |
| | 1. | Inv: #INV002                    | Kos Kilang bagi   | RM 450.00| |
| |    | Pelanggan: Siti Aminah          | tempahan Baju     |          | |
| |    | Item: Baju Team A, Baju Team B  | Sublimation       |          | |
| +---------------------------------------------------------------------+ |
|                                                                         |
|                                      JUMLAH (AMOUNT):        RM 450.00  |
|                                                                         |
|-------------------------------------------------------------------------|
| NOTES:                                                                  |
| Cetakan baucar rasmi untuk rekod kewangan dan perbelanjaan syarikat.    |
|                                                                         |
| THIRTYONE LAB DESIGN - INTERNAL FINANCIAL STATEMENT                     |
| Wear With Pride.                                                        |
+-------------------------------------------------------------------------+
```

### 3. Pangkalan Data Pelanggan (Clients)
Mengurus maklumat perhubungan dan rekod nilai tempahan setiap pelanggan.

#### Senarai Pelanggan (Desktop)
```text
+---------------------------------------------------------------------------------------------------------+
| 31LAB                                                                                                   |
| THIRTYONE LAB                 SENARAI PELANGGAN (CLIENTS DATABASE)                                      |
|                               Urus maklumat perhubungan dan rekod tempahan pelanggan                    |
+--------------------------+------------------------------------------------------------------------------+
| MENU UTAMA               |                                                                              |
|   [ Overview        ]    | [ Cari Nama Pelanggan... ]                            [ + TAMBAH PELANGGAN ] |
|   [ Orders          ]    |                                                                              |
|   [ Manufacturing   ]    | +--------------------------------------------------------------------------+ |
| > [ Clients         ]    | | NAMA PELANGGAN | NO. TELEFON   | TOTAL ORDER | TOTAL SPENT | TINDAKAN | |
|                          | +--------------------------------------------------------------------------+ |
| KEWANGAN                 | | Siti Aminah    | 012-3456789   | 3 Orders    | RM 4,500.00 | [EDT][DEL] | |
|   [ Ledger (Buku)   ]    | +--------------------------------------------------------------------------+ |
|   [ P&L Reports     ]    | | Ahmad Albab    | 019-8765432   | 1 Order     | RM   120.00 | [EDT][DEL] | |
|                          | +--------------------------------------------------------------------------+ |
| TETAPAN                  | | Kelab Esport   | 011-2233445   | 5 Orders    | RM 2,300.00 | [EDT][DEL] | |
|   [ Settings        ]    | +--------------------------------------------------------------------------+ |
+--------------------------+------------------------------------------------------------------------------+
```

#### Senarai Pelanggan (Mobile)
```text
+-----------------------------+
| 31LAB              (EN) [L]|
+-----------------------------+
| SENARAI PELANGGAN           |
|                             |
| [ Cari Nama...           ]  |
| [ + TAMBAH PELANGGAN BARU]  |
|                             |
| +-------------------------+ |
| | Siti Aminah             | |
| | Tel: 012-3456789        | |
| | Total Orders: 3         | |
| | Total Spent: RM 4500.00 | |
| |                         | |
| | [EDIT]   [DELETE]       | |
| +-------------------------+ |
+-----------------------------+
```

#### Profil Pelanggan & Sejarah Tempahan
```text
+-------------------------------------------------+
| PROFIL PELANGGAN & SEJARAH (HISTORY)        [X] |
+-------------------------------------------------+
| NAMA: Siti Aminah       TOTAL BELANJA: RM 4500  |
| TEL:  0123456789        TOTAL ORDER:   3 kali   |
+-------------------------------------------------+
| SEJARAH INVOICE / TEMPAHAN                      |
|                                                 |
| [v] #INV002 | 15-Aug-2026 | Baju Team | RM 1112 |
|   +-----------------------------------------+   |
|   | HISTORY SPEC PEMBELIAN                  |   |
|   | Item 1: Baju Sublimation                |   |
|   | Material: Microfiber                    |   |
|   | Cutting: Normal                         |   |
|   | Neck: V-Neck                            |   |
|   +-----------------------------------------+   |
|                                                 |
| [>] #INV001 | 01-Jan-2026 | Baju Rewg | RM 3388 |
+-------------------------------------------------+
```

### 4. Buku Lejar (Ledger)
Anda menambah bil harian (seperti sewa dan gaji) secara manual. Pendapatan (duit dari pelanggan) masuk secara automatik.

#### Buku Lejar (Desktop)
```text
+---------------------------------------------------------------------------------------------------------+
| 31LAB                                                                                                   |
| THIRTYONE LAB                 BUKU LEJAR (CASHBOOK / BUKU TUNAI)                                        |
|                               Rekod perbelanjaan kedai dan aliran tunai                                 |
+--------------------------+------------------------------------------------------------------------------+
| MENU UTAMA               | RINGKASAN TUNAI (BULAN INI)                                                  |
|   [ Overview        ]    | +-------------------------+ +-------------------------+ +------------------+ |
|   [ Orders          ]    | | IN: RM 12,450.00        | | OUT: RM 4,800.00        | | BAKI: RM 7,650.00| |
|   [ Manufacturing   ]    | +-------------------------+ +-------------------------+ +------------------+ |
|   [ Clients         ]    |                                                                              |
|                          | [ + TAMBAH PERBELANJAAN (Contoh: Sewa, Gaji, Bil) ]                          |
| KEWANGAN                 |                                                                              |
| > [ Ledger (Buku)   ]    | BUKU REKOD TRANSAKSI                                                         |
|   [ P&L Reports     ]    | +--------------------------------------------------------------------------+ |
|                          | | TARIKH      | KATEGORI       | KETERANGAN          | JENIS   | JUMLAH  | |
| TETAPAN                  | +--------------------------------------------------------------------------+ |
|   [ Settings        ]    | | 01-Aug-2026 | Jualan (Inv)   | Deposit #INV002     | [+ IN ] | RM 400  | |
|                          | | 02-Aug-2026 | Bil & Utiliti  | Bil Elektrik TNB    | [- OUT] | RM 150  | |
| BAHASA / LANGUAGE        | | 03-Aug-2026 | Gaji Pekerja   | Pendahuluan (Ali)   | [- OUT] | RM 500  | |
|  ( EN )   [ BM ]         | | 05-Aug-2026 | Sewa Kedai     | Sewa Ogos 2026      | [- OUT] | RM 1200 | |
|                          | | 15-Aug-2026 | Kos Kilang     | Bayaran ke Kilang A | [- OUT] | RM 450  | |
| +----------------------+ | +--------------------------------------------------------------------------+ |
| | [L] LOCAL MODE       | | *Nota: Untuk [- OUT], klik baris tersebut untuk cetak [PRINT VOUCHER]      |
| |   Simpan Peranti     | |                                                                              |
| +----------------------+ |                                                                              |
+--------------------------+------------------------------------------------------------------------------+
```

#### Buku Lejar (Mobile)
```text
+-----------------------------+
| 31LAB              (EN) [L]|
+-----------------------------+
| BUKU LEJAR (TUNAI)          |
|                             |
| +-------------------------+ |
| | IN:    RM 12,450.00     | |
| | OUT:   RM 4,800.00      | |
| | BAKI:  RM 7,650.00      | |
| +-------------------------+ |
|                             |
| [ + TAMBAH PERBELANJAAN ]   |
|                             |
| +-------------------------+ |
| | 05-Aug-2026             | |
| | Kategori: Sewa Kedai    | |
| | Sewa Ogos 2026          | |
| | [- OUT]       RM 1200.00| |
| +-------------------------+ |
+-----------------------------+
```

#### Payment Voucher Lejar
```text
+-------------------------------------------------------------------------+
| [LOGO]   31LAB                                                          |
|          THIRTYONE LAB                                                  |
|          No 12, Jalan Niaga 1, 43000 Kajang, Selangor                   |
|          Tel: 012-3456789                                               |
|                                                                         |
| PAYMENT VOUCHER                                                         |
| Voucher No: PV-2026-08-01                                               |
| Date:       05/08/2026                                                  |
|                                                                         |
|-------------------------------------------------------------------------|
| DIBAYAR KEPADA (PAY TO) : TNB (Tenaga Nasional Berhad) / Pekerja        |
|-------------------------------------------------------------------------|
|                                                                         |
| BUTIRAN PEMBAYARAN (DETAILS):                                           |
| +---------------------------------------------------------------------+ |
| | NO | KATEGORI        | KETERANGAN (DESCRIPTION)          | JUMLAH   | |
| +---------------------------------------------------------------------+ |
| | 1. | Bil & Utiliti   | Bil Elektrik Kedai Ogos 2026      | RM 150.00| |
| +---------------------------------------------------------------------+ |
|                                                                         |
|                                      JUMLAH (AMOUNT):        RM 150.00  |
|                                                                         |
|-------------------------------------------------------------------------|
| NOTES:                                                                  |
| Cetakan baucar rasmi untuk rekod kewangan dan perbelanjaan syarikat.    |
|                                                                         |
| THIRTYONE LAB DESIGN - INTERNAL FINANCIAL STATEMENT                     |
| Wear With Pride.                                                        |
+-------------------------------------------------------------------------+
```

### 5. Penyata Untung Rugi (P&L Reports)
Laporan ini mengumpulkan semua transaksi mengikut kategori untuk pengiraan rasmi.

#### Penyata Untung Rugi (A4 Format)
```text
+-------------------------------------------------------------------------+
| [LOGO]   31LAB                                                          |
|          THIRTYONE LAB                                                  |
|          No 12, Jalan Niaga 1, 43000 Kajang, Selangor                   |
|          Tel: 012-3456789                                               |
|                                                                         |
| PENYATA UNTUNG RUGI (PROFIT & LOSS)                                     |
| Bulan Cetakan: OGOS 2026                                                |
| Tarikh:        05/09/2026                                               |
|                                                                         |
|-------------------------------------------------------------------------|
| 1. PENDAPATAN (REVENUE)                                                 |
|-------------------------------------------------------------------------|
|    Jualan / Invois Pelanggan                            RM 12,450.00    |
|    Pendapatan Lain-lain                                 RM      0.00    |
|                                                                         |
|    JUMLAH PENDAPATAN (A)                                RM 12,450.00    |
|                                                                         |
|-------------------------------------------------------------------------|
| 2. KOS JUALAN (COST OF GOODS SOLD)                                      |
|-------------------------------------------------------------------------|
|    Kos Pengeluaran / Bayaran Kilang                    (RM  3,450.00)   |
|                                                                         |
|-------------------------------------------------------------------------|
| UNTUNG KASAR / GROSS PROFIT (A - B)                     RM  9,000.00    |
|-------------------------------------------------------------------------|
|                                                                         |
|-------------------------------------------------------------------------|
| 3. PERBELANJAAN OPERASI (OPERATING EXPENSES)                            |
|-------------------------------------------------------------------------|
|    Sewa Kedai                                           RM  1,200.00    |
|    Gaji Pekerja                                         RM    500.00    |
|    Bil & Utiliti                                        RM    150.00    |
|                                                                         |
|    JUMLAH PERBELANJAAN (C)                             (RM  1,850.00)   |
|                                                                         |
|=========================================================================|
| UNTUNG BERSIH / NET PROFIT (Untung Kasar - C)           RM  7,150.00    |
|=========================================================================|
|                                                                         |
| NOTES:                                                                  |
| Penyata kewangan ini dijana secara automatik oleh sistem pengurusan     |
| dalaman syarikat mengikut piawaian asas perakaunan.                     |
|                                                                         |
| THIRTYONE LAB DESIGN - INTERNAL FINANCIAL STATEMENT                     |
| Wear With Pride.                                                        |
+-------------------------------------------------------------------------+
```

## Verification Plan
Sistem perakaunan Local Storage diuji dengan memasukkan sekurang-kurangnya dua invois jualan dan satu transaksi lejar. Laporan Untung Rugi dijana untuk mengesahkan jumlah akhirnya menyamai Untung Bersih sebenar.
