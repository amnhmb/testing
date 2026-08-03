import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  EN: {
    // Sidebar
    overview: 'Overview',
    orders: 'Orders',
    manufacturing: 'Manufacturing',
    clients: 'Clients',
    ledger: 'Ledger (Buku)',
    reports: 'P&L Reports',
    settings: 'Settings',
    finance: 'FINANCE',
    settingsSection: 'SETTINGS',
    localMode: 'LOCAL MODE',
    localDesc: 'Save on device',
    cloudSync: 'CLOUD SYNC',
    cloudDesc: 'Cloud Active',
    language: 'BAHASA / LANGUAGE',
    // Dashboard
    dashboardTag: 'PUSAT KAWALAN UTAMA',
    dashboardTitle: 'OVERVIEW DASHBOARD',
    netProfit: 'UNTUNG BERSIH SEBENAR (NET PROFIT)',
    netProfitDesc: 'Kutipan Jualan - Kos Operasi (Lejar)',
    statusBayaran: 'STATUS BAYARAN',
    statusOperasi: 'STATUS OPERASI',
    unpaid: 'Unpaid',
    deposit: 'Deposit',
    paidMonth: 'Paid (Bulan ini)',
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    totalKutipan: 'TOTAL KUTIPAN JUALAN',
    totalKos: 'TOTAL KOS (KELUAR)',
    thisMonth: 'Bulan ini',
    kilangLejar: 'Kilang + Lejar Kedai',
    newOrder: 'New Order',
    recentInvoices: 'Recent Invoices',
    viewAll: 'View All',
    refresh: 'Refresh Data',
    searchPlaceholder: 'Cari nama pelanggan atau nombor invois...',
    allStatus: 'Semua Status',
    status: 'Status',
    month: 'Bulan',
    allMonths: 'Semua Bulan',
    // Orders
    ordersTag: 'SENARAI TEMPAHAN',
    ordersTitle: 'ORDERS',
    // Manufacturing
    mfgTag: 'MANUFACTURING & OPERASI KILANG',
    mfgTitle: 'MANUFACTURING',
    mfgSubtitle: 'Pantau Status Tempahan dan Rekod Kos Pengeluaran',
    pendingOrders: 'PENDING (Belum)',
    processingOrders: 'PROCESSING (Jalan)',
    // Clients
    clientsTag: 'SENARAI PELANGGAN',
    clientsTitle: 'CLIENTS & CRM',
    clientsSubtitle: 'Urus maklumat perhubungan dan rekod tempahan pelanggan.',
    // Ledger
    ledgerTag: 'BUKU LEJAR',
    ledgerTitle: 'CASHBOOK / BUKU TUNAI',
    ledgerSubtitle: 'Rekod perbelanjaan kedai dan aliran tunai',
    // Reports
    reportsTag: 'P&L REPORTS',
    reportsTitle: 'PENYATA UNTUNG RUGI',
    reportsSubtitle: 'Laporan kewangan yang dikumpulkan mengikut kategori untuk pengiraan rasmi.',
    // Table headers
    invNo: 'NO. INV',
    clientName: 'NAMA PELANGGAN',
    amount: 'JUMLAH (RM)',
    status: 'STATUS',
    actions: 'TINDAKAN',
    date: 'TARIKH',
    balance: 'BAKI (RM)',
    phone: 'NO. TELEFON',
    totalOrder: 'TOTAL ORDER',
    totalSpent: 'TOTAL SPENT',
    items: 'ITEM (Baju/Banner)',
    kosKilang: 'KOS KILANG',
    category: 'KATEGORI',
    description: 'KETERANGAN',
    type: 'JENIS',
    loadingInvoice: 'Memuatkan semua invois...',
    noInvoice: 'Tiada invois ditemui.',
    loadingData: 'Memuatkan data...',
    noData: 'Tiada rekod ditemui.',
    loadingClient: 'Memuatkan data pelanggan...',
    noClient: 'Tiada pelanggan ditemui.',
    view: 'View',
    edit: 'Edit',
    delete: 'Padam',
    save: 'SAVE',
    print: 'PRINT',
  },
  BM: {
    // Sidebar
    overview: 'Utama',
    orders: 'Tempahan',
    manufacturing: 'Kilang',
    clients: 'Pelanggan',
    ledger: 'Lejar (Buku)',
    reports: 'Laporan P&L',
    settings: 'Tetapan',
    finance: 'KEWANGAN',
    settingsSection: 'TETAPAN',
    localMode: 'MODE LOKAL',
    localDesc: 'Simpan peranti',
    cloudSync: 'SINKRON AWAN',
    cloudDesc: 'Awan aktif',
    language: 'BAHASA / LANGUAGE',
    // Dashboard
    dashboardTag: 'PUSAT KAWALAN UTAMA',
    dashboardTitle: 'PAPAN KAWALAN',
    netProfit: 'UNTUNG BERSIH SEBENAR',
    netProfitDesc: 'Kutipan Jualan - Kos Operasi (Lejar)',
    statusBayaran: 'STATUS BAYARAN',
    statusOperasi: 'STATUS OPERASI',
    unpaid: 'Belum Bayar',
    deposit: 'Deposit',
    paidMonth: 'Lunas (Bulan ini)',
    pending: 'Belum Mula',
    processing: 'Sedang Jalan',
    completed: 'Siap',
    totalKutipan: 'TOTAL KUTIPAN JUALAN',
    totalKos: 'TOTAL KOS (KELUAR)',
    thisMonth: 'Bulan ini',
    kilangLejar: 'Kilang + Lejar Kedai',
    newOrder: 'Tempahan Baru',
    recentInvoices: 'Tempahan Terkini',
    viewAll: 'Lihat Semua',
    refresh: 'Muat Semula',
    searchPlaceholder: 'Cari nama pelanggan atau no. invois...',
    allStatus: 'Semua Status',
    status: 'Status',
    month: 'Bulan',
    allMonths: 'Semua Bulan',
    // Orders
    ordersTag: 'SENARAI TEMPAHAN',
    ordersTitle: 'TAMPAHAN',
    // Manufacturing
    mfgTag: 'MANUFACTURING & OPERASI KILANG',
    mfgTitle: 'KILANG',
    mfgSubtitle: 'Pantau Status Tempahan dan Rekod Kos Pengeluaran',
    pendingOrders: 'PENDING (Belum)',
    processingOrders: 'PROCESSING (Jalan)',
    // Clients
    clientsTag: 'SENARAI PELANGGAN',
    clientsTitle: 'PELANGGAN & CRM',
    clientsSubtitle: 'Urus maklumat hubungan dan rekod tempahan pelanggan.',
    // Ledger
    ledgerTag: 'BUKU LEJAR',
    ledgerTitle: 'TUNAI / BUKU TUNAI',
    ledgerSubtitle: 'Rekod perbelanjaan kedai dan aliran tunai',
    // Reports
    reportsTag: 'LAPORAN P&L',
    reportsTitle: 'PENYATA UNTUNG RUGI',
    reportsSubtitle: 'Laporan kewangan yang dikumpul ikut kategori untuk pengiraan rasmi.',
    // Table headers
    invNo: 'NO. INV',
    clientName: 'NAMA PELANGGAN',
    amount: 'JUMLAH (RM)',
    status: 'STATUS',
    actions: 'TINDAKAN',
    date: 'TARIKH',
    balance: 'BAKI (RM)',
    phone: 'NO. TELEFON',
    totalOrder: 'JUMLAH TEMPAHAN',
    totalSpent: 'JUMLAH BELANJA',
    items: 'ITEM (Baju/Banner)',
    kosKilang: 'KOS KILANG',
    category: 'KATEGORI',
    description: 'KETERANGAN',
    type: 'JENIS',
    loadingInvoice: 'Memuatkan semua invois...',
    noInvoice: 'Tiada invois ditemui.',
    loadingData: 'Memuatkan data...',
    noData: 'Tiada rekod ditemui.',
    loadingClient: 'Memuatkan data pelanggan...',
    noClient: 'Tiada pelanggan ditemui.',
    view: 'Lihat',
    edit: 'Edit',
    delete: 'Padam',
    save: 'SIMPAN',
    print: 'CETAK',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('EN');

  const tr = (key) => {
    const table = translations[language] || translations.EN;
    return table[key] !== undefined ? table[key] : (translations.EN[key] !== undefined ? translations.EN[key] : key);
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'EN' ? 'BM' : 'EN'));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, tr }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
