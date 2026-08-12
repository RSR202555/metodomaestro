-- ========================================================
-- MIGRATION: CRIAÇÃO DA TABELA DE INGRESSOS (TICKETS)
-- MÉTODO MAESTRO - FILIPE AQUINO
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- ÍNDICES PARA ALTA PERFORMANCE E BUSCA RÁPIDA
CREATE INDEX IF NOT EXISTS idx_tickets_order_id ON public.tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_tickets_code ON public.tickets(ticket_code);
CREATE INDEX IF NOT EXISTS idx_tickets_qr_token ON public.tickets(qr_token);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_email_sent ON public.tickets(email_sent);

-- HABILITAR RLS NA TABELA DE INGRESSOS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS RLS PARA TICKETS
CREATE POLICY "Permitir leitura pública de ingresso por token" ON public.tickets
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserção e atualização por admin/service role" ON public.tickets
  FOR ALL USING (true);

-- PUBLICAÇÃO REALTIME SE SUPABASE REALTIME ESTIVER ATIVO
ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
