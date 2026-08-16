"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  MessageCircle,
  Download,
  ArrowRight,
  ShieldCheck,
  Mail,
  QrCode,
  Loader2,
  ExternalLink,
} from "lucide-react";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "approved";
  const orderId = searchParams.get("orderId");
  const gatewayId = searchParams.get("gatewayId");

  const [orderState, setOrderState] = useState<{
    isPaid: boolean;
    customerEmail?: string;
    customerName?: string;
    ticket?: {
      ticket_code: string;
      qr_token: string;
      pdf_url?: string | null;
    } | null;
  }>({
    isPaid: initialStatus === "approved",
  });

  const [checking, setChecking] = useState(true);

  // Polling automático e seguro para validar status do pedido no backend
  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function checkOrderStatus() {
      try {
        const queryParam = orderId
          ? `orderId=${orderId}`
          : gatewayId
          ? `gatewayId=${gatewayId}`
          : `latest=true`;
        const res = await fetch(`/api/orders/status?${queryParam}`);
        const data = await res.json();

        if (res.ok && data) {
          setOrderState({
            isPaid: data.isPaid,
            customerEmail: data.customerEmail,
            customerName: data.customerName,
            ticket: data.ticket,
          });

          // Se o pagamento for confirmado, podemos interromper o polling
          if (data.isPaid) {
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.warn("[ThankYou Polling Warning]:", err);
      } finally {
        setChecking(false);
      }
    }

    checkOrderStatus();
    interval = setInterval(checkOrderStatus, 3000);

    return () => clearInterval(interval);
  }, [orderId, gatewayId]);



  const isConfirmed = orderState.isPaid;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Luzes ambiente de fundo */}
      <div className="absolute inset-0 opacity-30 bg-gradient-to-b from-primary/10 via-black to-black pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-2xl mx-auto text-center space-y-8 py-8 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Ícone de Status Animado */}
        <div className="relative w-24 h-24 mx-auto">
          {isConfirmed ? (
            <>
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-50"></div>
              <div className="relative w-24 h-24 bg-gradient-to-tr from-primary/30 via-primary/10 to-primary/40 border-2 border-primary rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.4)]">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
            </>
          ) : (
            <div className="relative w-24 h-24 bg-yellow-500/10 border-2 border-yellow-500/40 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.2)]">
              <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Título Principal Dinâmico */}
        <div>
          {isConfirmed ? (
            <>
              <span className="bg-primary/15 border border-primary/40 text-primary text-xs uppercase font-extrabold tracking-widest px-4 py-1.5 rounded-full inline-block mb-3">
                🎉 SUA VAGA ESTÁ GARANTIDA!
              </span>
              <h1 className="font-geist text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Parabéns! Você está na <span className="text-primary">Elite do Personal Trainer</span>.
              </h1>
              <p className="text-gray-300 text-sm sm:text-base mt-3 max-w-lg mx-auto leading-relaxed">
                Seu pagamento foi confirmado com sucesso. Seu ingresso oficial para a Imersão Presencial do **Método Maestro** já foi gerado e enviado para{" "}
                <strong className="text-white font-bold">{orderState.customerEmail || "seu e-mail cadastrado"}</strong>.
              </p>
            </>
          ) : (
            <>
              <span className="bg-yellow-500/15 border border-yellow-500/40 text-yellow-400 text-xs uppercase font-extrabold tracking-widest px-4 py-1.5 rounded-full inline-block mb-3 animate-pulse">
                ⏳ AGUARDANDO CONFIRMAÇÃO DE PAGAMENTO
              </span>
              <h1 className="font-geist text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Estamos processando o seu pagamento...
              </h1>
              <p className="text-gray-400 text-sm mt-3 max-w-lg mx-auto leading-relaxed">
                Assim que a instituição financeira confirmar o pagamento (PIX ou Cartão), seu ingresso será liberado automaticamente aqui na tela e enviado por e-mail.
              </p>
            </>
          )}
        </div>

        {/* BOTÕES DE DESTAQUE DO INGRESSO (QUANDO PAGO) */}
        {isConfirmed && orderState.ticket && (
          <div className="bg-[#141414] border-2 border-primary/40 gold-glow rounded-3xl p-6 text-center space-y-4 animate-in fade-in duration-300">
            <h3 className="font-geist text-sm uppercase font-extrabold text-primary tracking-wider flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-primary" />
              <span>SEU INGRESSO JÁ ESTÁ DISPONÍVEL</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <Link
                href={`/ingresso/${orderState.ticket.qr_token}`}
                className="w-full sm:w-auto bg-primary hover:bg-yellow-400 text-black font-extrabold text-xs uppercase py-3.5 px-6 rounded-2xl shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>ACESSAR MEU INGRESSO</span>
              </Link>

              {orderState.ticket.pdf_url ? (
                <a
                  href={orderState.ticket.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-[#222] hover:bg-[#333] border border-white/10 text-white font-bold text-xs uppercase py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-primary" />
                  <span>BAIXAR INGRESSO (PDF)</span>
                </a>
              ) : (
                <Link
                  href={`/ingresso/${orderState.ticket.qr_token}`}
                  className="w-full sm:w-auto bg-[#222] hover:bg-[#333] border border-white/10 text-white font-bold text-xs uppercase py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-primary" />
                  <span>VER / BAIXAR INGRESSO</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Card de Detalhes do Evento */}
        <div className="bg-[#141414] border border-primary/30 gold-glow rounded-3xl p-6 sm:p-8 text-left space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="font-geist text-lg sm:text-xl font-bold text-white">
                Imersão Presencial Método Maestro
              </h2>
              <p className="text-xs text-primary font-semibold mt-0.5">
                World Gym Pro (Salvador - BA)
              </p>
            </div>
            <ShieldCheck className="w-8 h-8 text-primary flex-shrink-0" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-4 flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-gray-400 block text-[11px] uppercase font-bold">Data</span>
                <strong className="text-white">12, 13, 26 e 27 de Setembro</strong>
              </div>
            </div>

            <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-4 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-gray-400 block text-[11px] uppercase font-bold">Local</span>
                <strong className="text-white">World Gym Pro (Salvador)</strong>
              </div>
            </div>

            <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-gray-400 block text-[11px] uppercase font-bold">Horários</span>
                <strong className="text-white">Sáb 16h30 | Dom 15h30</strong>
              </div>
            </div>
          </div>
        </div>



        <div className="pt-4">
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

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white text-sm font-bold">
          Carregando confirmação...
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
