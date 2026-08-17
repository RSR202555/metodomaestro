"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Calendar,
  MapPin,
  Clock,
  Download,
  Printer,
  ShieldCheck,
  QrCode,
  Share2,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

interface TicketData {
  ticket_code: string;
  qr_token: string;
  status: "ACTIVE" | "USED" | "CANCELLED" | "REFUNDED";
  checked_in: boolean;
  checked_in_at?: string | null;
  issued_at: string;
  pdf_url?: string | null;
  customer_name: string;
  lot_name: string;
  turma?: string;
  event_date: string;
  event_location: string;
  qrCodeBase64: string;
}

export default function PublicTicketPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchTicket() {
      try {
        setLoading(true);
        const res = await fetch(`/api/tickets/public?token=${token}`);
        const data = await res.json();

        if (!res.ok || data.error) {
          setError(data.error || "Ingresso não encontrado ou token inválido.");
        } else {
          setTicket(data.ticket);
        }
      } catch (err: any) {
        setError("Erro ao conectar com o servidor para buscar o ingresso.");
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchTicket();
    }
  }, [token]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Meu Ingresso Método Maestro",
        text: `Ingresso Oficial de ${ticket?.customer_name} para a Imersão Método Maestro!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase font-extrabold tracking-widest text-primary animate-pulse">
            Carregando Credencial Oficial...
          </p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#141414] border border-red-500/30 rounded-3xl p-8 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold font-geist text-white">Ingresso Não Localizado</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            {error || "Não encontramos nenhum ingresso válido associado a esta URL."}
          </p>
          <Link
            href="/"
            className="inline-block bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl transition-all"
          >
            Voltar à Página Inicial
          </Link>
        </div>
      </div>
    );
  }

  const isUsed = ticket.status === "USED" || ticket.checked_in;
  const isCancelled = ticket.status === "CANCELLED" || ticket.status === "REFUNDED";
  const isActive = ticket.status === "ACTIVE" && !isUsed;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden print:bg-white print:text-black print:p-0">
      {/* Background Decorativo */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none print:hidden"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none print:hidden"></div>

      <div className="relative z-10 w-full max-w-lg mx-auto space-y-6 py-6 animate-in fade-in duration-500">
        
        {/* TOPO: LOGO & STATUS */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[11px] uppercase font-extrabold tracking-widest text-primary">
              MÉTODO MAESTRO • FILIPE AQUINO
            </span>
          </div>

          <h1 className="font-geist text-2xl sm:text-3xl font-black uppercase tracking-tight text-white print:text-black">
            Credencial Oficial de Acesso
          </h1>
        </div>

        {/* CARTÃO PRINCIPAL DO INGRESSO */}
        <div className="bg-[#141414] border-2 border-primary/40 gold-glow rounded-3xl overflow-hidden shadow-2xl relative print:border-black print:bg-white print:shadow-none">
          
          {/* Header do Cartão */}
          <div className="bg-gradient-to-r from-[#1c1a14] via-[#241f12] to-[#1c1a14] border-b border-primary/30 p-6 text-center relative print:bg-gray-100 print:border-black">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-yellow-400 to-yellow-600 mx-auto flex items-center justify-center text-black font-black text-2xl shadow-[0_0_20px_rgba(212,175,55,0.4)] mb-2">
              M
            </div>
            <h2 className="font-geist text-lg font-extrabold text-white tracking-wider print:text-black">
              IMERSÃO PRESENCIAL MÉTODO MAESTRO
            </h2>
            <p className="text-xs text-primary font-bold tracking-widest uppercase mt-0.5">
              VIP ACCESS PASS
            </p>
          </div>

          {/* STATUS BADGE DINÂMICO */}
          <div className="p-4 border-b border-white/10 text-center print:border-black">
            {isActive && (
              <div className="bg-green-500/10 border border-green-500/40 text-green-400 px-4 py-2.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider animate-pulse">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>✓ INGRESSO VÁLIDO</span>
              </div>
            )}

            {isUsed && (
              <div className="bg-blue-500/10 border border-blue-500/40 text-blue-400 px-4 py-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 font-bold text-xs uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  <span>✓ CHECK-IN REALIZADO</span>
                </div>
                {ticket.checked_in_at && (
                  <span className="text-[10px] text-gray-400 font-normal">
                    Credenciado em: {new Date(ticket.checked_in_at).toLocaleString("pt-BR")}
                  </span>
                )}
              </div>
            )}

            {isCancelled && (
              <div className="bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-2.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider">
                <XCircle className="w-5 h-5 text-red-400" />
                <span>INGRESSO CANCELADO</span>
              </div>
            )}
          </div>

          {/* DADOS DO PARTICIPANTE E INGRESSO */}
          <div className="p-6 space-y-6">
            
            {/* Nome e Código */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-white/10 pb-5 print:border-black">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  Participante
                </span>
                <strong className="text-base sm:text-lg font-bold text-white block mt-0.5 print:text-black">
                  {ticket.customer_name}
                </strong>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  Código do Ingresso
                </span>
                <strong className="text-sm sm:text-base font-mono font-bold text-primary block mt-0.5">
                  {ticket.ticket_code}
                </strong>
              </div>
            </div>

            {/* Evento & Lote */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-white/10 pb-5 print:border-black">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  Lote Adquirido
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white block mt-0.5 print:text-black">
                  {ticket.lot_name}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  Data & Horário
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white block mt-0.5 print:text-black">
                  {ticket.event_date}
                </span>
              </div>
            </div>

            {/* Local */}
            <div className="bg-[#1c1c1c] border border-white/10 rounded-2xl p-4 flex items-start gap-3 print:bg-gray-100 print:border-black">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Localização</span>
                <strong className="text-xs sm:text-sm text-white block mt-0.5 print:text-black">
                  {ticket.event_location}
                </strong>
              </div>
            </div>

            {/* QR CODE DISPLAY */}
            <div className="text-center pt-2">
              <div className="bg-white p-4 rounded-2xl inline-block border-2 border-primary/50 shadow-lg">
                {ticket.qrCodeBase64 ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={ticket.qrCodeBase64}
                    alt="QR Code do Ingresso"
                    className="w-48 h-48 mx-auto"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-black font-bold text-xs">
                    QR Code não gerado
                  </div>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-3 font-medium">
                Apresente este QR Code na entrada do evento para realizar o credenciamento.
              </p>
            </div>

          </div>

          {/* Rodapé Interno */}
          <div className="bg-[#0f0f0f] p-4 text-center border-t border-white/10 print:hidden">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Credencial Autêntica Método Maestro
            </span>
          </div>

        </div>

        {/* BOTOES DE AÇÃO */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 print:hidden">
          {ticket.pdf_url ? (
            <a
              href={ticket.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-yellow-400 text-black font-extrabold text-xs uppercase py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              <Download className="w-4 h-4" />
              <span>Baixar PDF</span>
            </a>
          ) : (
            <button
              onClick={handlePrint}
              className="bg-primary hover:bg-yellow-400 text-black font-extrabold text-xs uppercase py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              <Download className="w-4 h-4" />
              <span>Baixar / Salvar</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="bg-[#1c1c1c] hover:bg-[#252525] border border-white/10 text-white font-bold text-xs uppercase py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4 text-gray-400" />
            <span>Imprimir</span>
          </button>

          <button
            onClick={handleShare}
            className="bg-[#1c1c1c] hover:bg-[#252525] border border-white/10 text-white font-bold text-xs uppercase py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4 text-primary" />
            <span>{copied ? "Copiado!" : "Compartilhar"}</span>
          </button>
        </div>

        {/* LINK PARA INÍCIO */}
        <div className="text-center pt-2 print:hidden">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-white transition-colors underline font-medium"
          >
            Voltar para a página principal
          </Link>
        </div>

      </div>
    </div>
  );
}
