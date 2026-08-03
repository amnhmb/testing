-- 1. Create SETTINGS Table
CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    company_name TEXT NOT NULL,
    company_address TEXT,
    company_phone TEXT,
    company_logo TEXT, -- base64 representation
    invoice_prefix TEXT DEFAULT 'NO.',
    bank_name TEXT,
    bank_account TEXT,
    qr_code TEXT,      -- base64 representation
    terms TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert default row
INSERT INTO settings (id, company_name, company_address, company_phone, invoice_prefix, bank_name, bank_account, terms)
VALUES (
    'global', 
    'THIRTYONE LAB', 
    'No 1, Jalan Sublimation, 43000 Kajang, Selangor', 
    '012-3456789', 
    'NO.', 
    'Maybank', 
    '112233445566 (THIRTYONE LAB)', 
    '1. Deposit 50% diperlukan sebelum cetakan bermula.\n2. Baki bayaran perlu dijelaskan semasa pick-up.\n3. Tiada pemulangan wang selepas design dicetak.'
) ON CONFLICT (id) DO NOTHING;

-- 2. Create CLIENTS Table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    orders_count INT DEFAULT 0,
    total_spent NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Add unique index or constraint on phone number to prevent duplicates
ALTER TABLE clients ADD CONSTRAINT unique_client_phone UNIQUE (phone);

-- 3. Create INVOICES Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_no TEXT NOT NULL UNIQUE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    job_name TEXT,
    date TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount_per_pcs NUMERIC(12, 2) DEFAULT 0.00,
    grand_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    deposit NUMERIC(12, 2) DEFAULT 0.00,
    balance NUMERIC(12, 2) DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'Unpaid', -- 'Paid', 'Deposit', 'Unpaid'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Enable Row Level Security (RLS) on all tables
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies (Allowing Anonymous Read & Write)
-- Note: Since this is an internal, client-side tool with no user authentication, 
-- we authorize any client with the anon key to read, insert, update and delete.

-- Settings Policies
CREATE POLICY "Allow anon read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow anon insert settings" ON settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update settings" ON settings FOR UPDATE USING (true);

-- Clients Policies
CREATE POLICY "Allow anon read clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow anon insert clients" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update clients" ON clients FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete clients" ON clients FOR DELETE USING (true);

-- Invoices Policies
CREATE POLICY "Allow anon read invoices" ON invoices FOR SELECT USING (true);
CREATE POLICY "Allow anon insert invoices" ON invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update invoices" ON invoices FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete invoices" ON invoices FOR DELETE USING (true);
