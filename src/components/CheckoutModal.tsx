"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { X, CheckCircle2, QrCode, CreditCard, ArrowRight, Lock, Copy, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Lote Ativo dinâmico retornado pela API
  const [activeLot, setActiveLot] = useState({
    title: "Ingresso Método Maestro - Lote 1",
    price: "R$ 297,00",
    numericPrice: 297.0,
    benefits: [
      "Acesso aos 2 Dias de Imersão Presencial (5 e 6 de Setembro na World Gym Pro)",
      "Material de Apoio e Planilhas de Precificação",
      "Certificado Oficial de Conclusão",
      "Acesso ao Grupo Exclusivo de Avisos",
    ],
  });

  // Formulário do Comprador
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");

  // Dados do Checkout Criado
  const [orderId, setOrderId] = useState("");
  const [qrCodePix, setQrCodePix] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // Buscar as informações do lote ativo em tempo real ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      fetch("/api/admin/lots")
        .then((res) => res.json())
        .then((data) => {
          if (data.lots && data.lots.length > 0) {
            const foundActive = data.lots.find((l: any) => l.active) || data.lots[0];
            if (foundActive) {
              const formattedPrice = Number(foundActive.price).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              });

              const benefitsList = foundActive.description
                ? foundActive.description.split("+").map((b: string) => b.trim())
                : [
                    "Acesso aos 2 Dias de Imersão Presencial (5 e 6 de Setembro)",
                    "Material de Apoio e Planilhas de Precificação",
                    "Certificado Oficial de Conclusão",
                    "Acesso ao Grupo Exclusivo de Avisos",
                  ];

              setActiveLot({
                title: foundActive.name,
                price: formattedPrice,
                numericPrice: Number(foundActive.price),
                benefits: benefitsList,
              });
            }
          }
        })
        .catch(console.error);
    } else {
      // Resetar estado ao fechar
      setIsSuccess(false);
      setLoading(false);
      setErrorMessage("");
      setQrCodePix("");
      setCheckoutUrl("");
      setOrderId("");
      setCopied(false);
    }
  }, [isOpen]);

  // Escutar alteração de status em tempo real via Supabase + Polling automático de backup
  useEffect(() => {
    if (!orderId) return;

    // 1. Polling automático a cada 3 segundos consultando a API do Mercado Pago
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/status?orderId=${orderId}`);
        const data = await res.json();
        if (data.isPaid || data.status === "paid") {
          setIsSuccess(true);
          setTimeout(() => {
            window.location.href = "/obrigado?status=approved";
          }, 800);
        }
      } catch (e) {
        console.warn("[Checkout Polling Warning]:", e);
      }
    }, 3000);

    // 2. Realtime listener no Supabase
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          if (payload.new && payload.new.status === "paid") {
            setIsSuccess(true);
            setTimeout(() => {
              window.location.href = "/obrigado?status=approved";
            }, 800);
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  if (!isOpen) return null;

  const handleConfirmPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !email.trim() || !cpf.trim()) {
      setErrorMessage("Por favor, preencha Nome, E-mail e CPF para continuar.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          cpf,
          phone,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Erro ao processar checkout.");
      }

      setOrderId(data.orderId);
      if (data.qrCodePix) {
        setQrCodePix(data.qrCodePix);
      }
      if (data.checkoutUrl || data.initPoint) {
        const targetUrl = data.checkoutUrl || data.initPoint;
        setCheckoutUrl(targetUrl);

        // Se for Cartão de Crédito ou se houver link direto do Mercado Pago, redirecionar automaticamente
        if (paymentMethod === "card") {
          window.location.href = targetUrl;
          return;
        }
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Erro inesperado ao gerar pagamento.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPix = () => {
    if (qrCodePix) {
      navigator.clipboard.writeText(qrCodePix);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-300 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-[#141414] border border-primary/30 rounded-3xl p-5 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.2)] my-auto cursor-default"
      >
        {/* Sticky Header with Close Button for Mobile & Desktop */}
        <div className="sticky top-0 z-30 flex items-center justify-between pb-3 mb-4 border-b border-white/10 bg-[#141414]/95 backdrop-blur-md pt-3 -mx-5 px-5 sm:-mx-8 sm:px-8 -mt-5 sm:-mt-8 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-bold text-white uppercase tracking-wider font-geist">
              Inscrição Método Maestro
            </span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-primary hover:text-black text-white text-xs font-bold transition-all cursor-pointer shadow-md"
            aria-label="Voltar para a página inicial"
          >
            <span>VOLTAR</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleConfirmPurchase}>
            <div className="text-center mb-6">
              <span className="bg-primary/10 border border-primary/30 text-primary text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                GARANTA SUA VAGA
              </span>
              <h2 className="font-geist text-2xl sm:text-3xl font-extrabold text-white mt-3">
                {activeLot.title}
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                Imersão Presencial na World Gym Pro (Salvador - BA)
              </p>
            </div>

            {/* Detalhes do Ingresso */}
            <div className="bg-[#1a1a1a] border border-primary/30 gold-glow rounded-2xl p-5 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-white text-base sm:text-lg font-geist">
                    {activeLot.title}
                  </h3>
                  <p className="text-primary font-bold text-2xl sm:text-3xl mt-1">
                    {activeLot.price}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    ou em até 12x no cartão de crédito
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>

              <div className="space-y-2 border-t border-white/10 pt-3">
                {activeLot.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-on-surface-variant">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulário de Dados do Participante */}
            <div className="space-y-4 mb-6">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Dados do Participante
              </label>

              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <input
                  type="text"
                  placeholder="Nome Completo *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#1a1a1a] border border-white/10 focus:border-primary text-white text-sm rounded-xl p-3.5 outline-none transition-all placeholder:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="email"
                  placeholder="E-mail *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#1a1a1a] border border-white/10 focus:border-primary text-white text-sm rounded-xl p-3.5 outline-none transition-all placeholder:text-gray-500"
                />
                <input
                  type="text"
                  placeholder="CPF *"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                  className="w-full bg-[#1a1a1a] border border-white/10 focus:border-primary text-white text-sm rounded-xl p-3.5 outline-none transition-all placeholder:text-gray-500"
                />
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="WhatsApp / Celular (com DDD)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/10 focus:border-primary text-white text-sm rounded-xl p-3.5 outline-none transition-all placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Seleção de Forma de Pagamento */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                Forma de Pagamento
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("pix")}
                  className={`flex items-center justify-center gap-2 py-3 border rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    paymentMethod === "pix"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-white/10 text-on-surface-variant hover:border-white/30"
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  PIX (Aprovação Imediata)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center justify-center gap-2 py-3 border rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-white/10 text-on-surface-variant hover:border-white/30"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Cartão de Crédito
                </button>
              </div>
            </div>

            {/* Botão de Ação */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary font-geist font-bold text-sm uppercase tracking-wider py-4 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_45px_rgba(212,175,55,0.6)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  <span>REDIRECIONANDO PARA O MERCADO PAGO...</span>
                </div>
              ) : (
                <>
                  <span>
                    {paymentMethod === "card"
                      ? "IR PARA O CHECKOUT MERCADO PAGO"
                      : "GERAR COBRANÇA DE INSCRIÇÃO"}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-on-surface-variant/70 mt-4 flex items-center justify-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              Ambiente seguro SSL 256-bit com garantia incondicional de 7 dias.
            </p>

            <div className="mt-4 pt-3 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-white/60 hover:text-primary transition-colors py-2 px-4 rounded-full border border-white/10 hover:border-primary/40 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Voltar para a Página Inicial</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-primary/20 border border-primary/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-geist text-2xl font-extrabold text-white mb-1">
              Inscrição Gerada com Sucesso!
            </h3>
            <p className="text-xs text-on-surface-variant mb-6">
              Escaneie o QR Code abaixo ou copie a chave PIX para finalizar o pagamento de <strong className="text-primary">{activeLot.price}</strong>.
            </p>

            {/* Botão Direto para o Checkout Oficial do Mercado Pago */}
            {checkoutUrl && (
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-xs uppercase py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg mb-4 hover:brightness-110 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>PAGAR NO CHECKOUT OFICIAL MERCADO PAGO</span>
              </a>
            )}

            {/* Campo PIX Copia e Cola */}
            {qrCodePix && (
              <div className="bg-[#1a1a1a] border border-primary/30 rounded-2xl p-4 mb-6">
                <p className="text-xs text-gray-400 mb-2 font-mono break-all line-clamp-3 bg-black/40 p-2.5 rounded-xl border border-white/5">
                  {qrCodePix}
                </p>
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="w-full bg-primary text-black font-bold text-xs uppercase py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "CÓDIGO PIX COPIADO!" : "COPIAR CÓDIGO PIX"}</span>
                </button>
              </div>
            )}

            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-xs mb-6 flex items-center justify-center gap-2 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Aguardando confirmação do pagamento em tempo real...</span>
            </div>

            <button
              onClick={onClose}
              className="border border-white/20 hover:border-white/40 text-white font-bold text-xs uppercase px-8 py-3 rounded-full transition-all"
            >
              FECHAR E VOLTAR À PÁGINA
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
