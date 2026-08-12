-- ========================================================
-- SCHEMA DE BANCO DE DADOS - MÉTODO MAESTRO (SUPABASE)
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE PERFIS DE USUÁRIOS E ADMINS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. TABELA DE LOTES E INGRESSOS
CREATE TABLE IF NOT EXISTS public.lots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true NOT NULL,
  total_available INT DEFAULT 100 NOT NULL,
  total_sold INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TABELA DE PEDIDOS E TRANSAÇÕES
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_cpf TEXT NOT NULL,
  customer_phone TEXT,
  lot_id UUID REFERENCES public.lots(id) ON DELETE SET NULL,
  lot_name TEXT NOT NULL DEFAULT 'Lote 1 - Imersão Método Maestro',
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'card')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
  gateway_payment_id TEXT,
  qr_code_pix TEXT,
  qr_code_url TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- INSERIR LOTE PADRÃO (LOTE 1)
INSERT INTO public.lots (id, name, price, description, active, total_available, total_sold)
VALUES (
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'Ingresso Método Maestro - Lote 1',
  297.00,
  'Acesso aos 2 Dias de Imersão Presencial (5 e 6 de Setembro na World Gym Pro)',
  true,
  100,
  0
) ON CONFLICT (id) DO NOTHING;

-- HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE ACESSO (RLS)

-- Profiles: leitura própria e admin pode ler tudo
CREATE POLICY "Permitir leitura de profiles proprios ou admin" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Lots: todos podem ler lotes ativos
CREATE POLICY "Permitir leitura pública de lotes" ON public.lots
  FOR SELECT USING (true);

-- Orders: qualquer cliente pode criar pedido, ler se for dono ou admin
CREATE POLICY "Permitir criacao de pedidos" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura de pedidos" ON public.orders
  FOR SELECT USING (true);

CREATE POLICY "Permitir atualizacao de pedidos" ON public.orders
  FOR UPDATE USING (true);

-- INDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_gateway_id ON public.orders(gateway_payment_id);

-- 4. TABELA DE INGRESSOS (TICKETS)
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ticket_code TEXT UNIQUE NOT NULL,
  qr_token TEXT UNIQUE NOT NULL,
  ticket_type TEXT NOT NULL DEFAULT 'VIP',
  lot_id UUID REFERENCES public.lots(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'USED', 'CANCELLED', 'REFUNDED')),
  checked_in BOOLEAN NOT NULL DEFAULT false,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  email_sent BOOLEAN NOT NULL DEFAULT false,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública de ingressos por token" ON public.tickets
  FOR SELECT USING (true);

CREATE POLICY "Permitir alteração de ingressos" ON public.tickets
  FOR ALL USING (true);

CREATE INDEX IF NOT EXISTS idx_tickets_order_id ON public.tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_tickets_code ON public.tickets(ticket_code);
CREATE INDEX IF NOT EXISTS idx_tickets_qr_token ON public.tickets(qr_token);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_email_sent ON public.tickets(email_sent);

-- HABILITAR SUPABASE REALTIME NAS TABELAS
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;


