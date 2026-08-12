"use client";

import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";

interface Ticket {
  id: string;
  order_id: string;
  ticket_code: string;
  qr_token: string;
  ticket_type: string;
  status: "ACTIVE" | "USED" | "CANCELLED" | "REFUNDED";
  checked_in: boolean;
  checked_in_at?: string | null;
  issued_at: string;
  email_sent: boolean;
  email_sent_at?: string | null;
  pdf_url?: string | null;
  customer_name?: string;
  customer_email?: string;
  customer_cpf?: string;
  lot_name?: string;
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Scanner Manual & Câmera State
  const [scanToken, setScanToken] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const html5QrCodeRef = useRef<any>(null);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/admin/tickets");
      const data = await res.json();
      if (data.tickets) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error("Erro ao carregar ingressos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 4000);
    return () => {
      clearInterval(interval);
      stopCamera();
    };
  }, []);

  const extractTokenFromText = (text: string): string => {
    let cleaned = text.trim();
    if (cleaned.includes("/ingresso/")) {
      const parts = cleaned.split("/ingresso/");
      cleaned = parts[parts.length - 1].split("?")[0].split("#")[0];
    }
    return cleaned;
  };

  const processCheckin = async (tokenInput: string) => {
    const cleanedToken = extractTokenFromText(tokenInput);
    if (!cleanedToken) return;

    setScanning(true);
    setScanResult(null);

    try {
      const res = await fetch("/api/tickets/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: cleanedToken, action: "confirm" }),
      });

      const data = await res.json();
      setScanResult(data);
      if (data.valid || data.success) {
        fetchTickets();
      }
    } catch (err) {
      setScanResult({
        valid: false,
        error: "ERRO DE CONEXÃO",
        message: "Falha ao conectar com o endpoint de check-in.",
      });
    } finally {
      setScanning(false);
    }
  };

  const handleManualCheckinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanToken.trim()) return;
    await processCheckin(scanToken);
  };

  const startCamera = async () => {
    setIsCameraActive(true);
    setCameraError(null);
    setScanResult(null);

    setTimeout(async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const html5QrCode = new Html5Qrcode("qr-reader");
        html5QrCodeRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText) => {
            console.log("[Camera Scanned QR Code]:", decodedText);
            const token = extractTokenFromText(decodedText);
            setScanToken(token);
            await processCheckin(token);
          },
          () => {}
        );
      } catch (err: any) {
        console.error("Camera start error:", err);
        setCameraError(
          "Não foi possível acessar a câmera. Verifique se deu permissão de câmera ao navegador."
        );
      }
    }, 300);
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
      } catch (e) {
        console.warn("Camera stop error:", e);
      }
    }
    setIsCameraActive(false);
  };

  const handleAction = async (ticketId: string, action: string) => {
    setActionLoading(`${ticketId}_${action}`);
    setActionMessage(null);

    try {
      const res = await fetch("/api/admin/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, action }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setActionMessage({
          type: "success",
          text: data.message || "Ação executada com sucesso!",
        });
        fetchTickets();
      } else {
        setActionMessage({
          type: "error",
          text: data.error || "Falha ao executar ação no ingresso.",
        });
      }
    } catch (err: any) {
      setActionMessage({
        type: "error",
        text: "Erro de conexão ao processar requisição.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      (t.customer_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.customer_email || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.ticket_code || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.customer_cpf || "").includes(search);

    const matchesStatus =
      filterStatus === "all" || t.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalTickets = tickets.length;
  const totalCheckedIn = tickets.filter((t) => t.checked_in || t.status === "USED").length;
  const totalEmailsSent = tickets.filter((t) => t.email_sent).length;

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        
        {/* MENSAGEM DE FEEDBACK */}
        {actionMessage && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between ${
              actionMessage.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <span>{actionMessage.text}</span>
            <button
              onClick={() => setActionMessage(null)}
              className="text-gray-400 hover:text-white ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#141414] border border-primary/30 rounded-2xl p-5 gold-glow">
            <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">
              Total Ingressos Emitidos
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-primary font-geist mt-1">
              {totalTickets} <span className="text-xs font-normal text-gray-400">vagas</span>
            </p>
          </div>

          <div className="bg-[#141414] border border-white/10 rounded-2xl p-5">
            <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">
              Credenciados (Check-in)
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-geist mt-1">
              {totalCheckedIn} <span className="text-xs font-normal text-gray-400">no evento</span>
            </p>
          </div>

          <div className="bg-[#141414] border border-white/10 rounded-2xl p-5">
            <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">
              E-mails Enviados (Resend)
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-green-400 font-geist mt-1">
              {totalEmailsSent} <span className="text-xs font-normal text-gray-400">entregues</span>
            </p>
          </div>
        </div>

        {/* TERMINAL DE CHECK-IN COM CÂMERA E MANUAL */}
        <div className="bg-[#141414] border border-primary/40 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">qr_code_scanner</span>
              <div>
                <h3 className="font-geist text-base font-extrabold text-white">
                  Terminal de Validação / Check-in de Ingressos
                </h3>
                <p className="text-xs text-gray-400">
                  Escaneie com a Câmera do celular/tablet ou digite o código do ingresso
                </p>
              </div>
            </div>

            {/* BOTÃO PARA ATIVAR / DESATIVAR CÂMERA */}
            {!isCameraActive ? (
              <button
                type="button"
                onClick={startCamera}
                className="bg-primary hover:bg-yellow-400 text-black font-extrabold text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-lg">photo_camera</span>
                <span>Escanear com a Câmera</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopCamera}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-extrabold text-xs uppercase px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-lg">videocam_off</span>
                <span>Fechar Câmera</span>
              </button>
            )}
          </div>

          {/* VIEWPORT DA CÂMERA AO VIVO */}
          {isCameraActive && (
            <div className="bg-[#0a0a0a] border-2 border-primary/50 rounded-2xl p-4 text-center space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between text-xs text-primary font-bold uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5 animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  Câmera Ativa - Posicione o QR Code no Quadrado
                </span>
                <button
                  onClick={stopCamera}
                  className="text-gray-400 hover:text-white underline text-[11px]"
                >
                  Cancelar
                </button>
              </div>

              {cameraError ? (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold">
                  {cameraError}
                </div>
              ) : (
                <div
                  id="qr-reader"
                  className="w-full max-w-sm mx-auto overflow-hidden rounded-xl border border-white/20 shadow-2xl bg-black"
                ></div>
              )}
            </div>
          )}

          {/* FORMULÁRIO DE ENTRADA MANUAL */}
          <form onSubmit={handleManualCheckinSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Digite ou cole o código (ex: MM-7F4A-92KD-81PX ou token do QR Code)..."
              value={scanToken}
              onChange={(e) => setScanToken(e.target.value)}
              className="flex-1 bg-[#1a1a1a] border border-white/10 text-white text-xs sm:text-sm rounded-xl px-4 py-3 outline-none focus:border-primary font-mono placeholder:text-gray-500"
            />
            <button
              type="submit"
              disabled={scanning || !scanToken.trim()}
              className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-extrabold text-xs uppercase px-6 py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {scanning ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Validando...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>Confirmar Check-in Manual</span>
                </>
              )}
            </button>
          </form>

          {/* RESULTADO DO SCANNER / CHECK-IN */}
          {scanResult && (
            <div
              className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold animate-in fade-in duration-300 ${
                scanResult.valid || scanResult.success
                  ? "bg-green-500/15 border-green-500/50 text-green-300 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                  : scanResult.alreadyUsed
                  ? "bg-blue-500/15 border-blue-500/50 text-blue-300"
                  : "bg-red-500/15 border-red-500/50 text-red-300"
              }`}
            >
              <div className="flex items-center gap-2 font-extrabold uppercase text-sm mb-1">
                <span className="material-symbols-outlined text-lg">
                  {scanResult.valid || scanResult.success
                    ? "check_circle"
                    : scanResult.alreadyUsed
                    ? "info"
                    : "error"}
                </span>
                <span>{scanResult.message || scanResult.error}</span>
              </div>
              {scanResult.ticket?.customer_name && (
                <div className="text-xs text-gray-200 font-normal mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>
                    Aluno: <strong>{scanResult.ticket.customer_name}</strong>
                  </span>
                  <span>
                    Código: <strong className="font-mono text-primary">{scanResult.ticket.ticket_code}</strong>
                  </span>
                  {scanResult.ticket.lot_name && (
                    <span>Lote: <strong>{scanResult.ticket.lot_name}</strong></span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* TABELA DE INGRESSOS EMITIDOS */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-geist text-xl font-extrabold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">confirmation_number</span>
                Gestão de Ingressos Emitidos
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Reenvie e-mails pelo Resend, abra PDFs ou cancele credenciais
              </p>
            </div>

            <button
              onClick={fetchTickets}
              className="bg-white/5 border border-white/10 text-gray-300 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              <span>Atualizar Tabela</span>
            </button>
          </div>

          {/* FILTROS E PESQUISA */}
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-xl">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar por Nome, E-mail, Código (MM-...) ou CPF..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 text-white text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-primary transition-all placeholder:text-gray-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {["all", "ACTIVE", "USED", "CANCELLED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
                    filterStatus === st
                      ? "bg-primary text-black"
                      : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  {st === "all"
                    ? "Todos"
                    : st === "ACTIVE"
                    ? "Válidos"
                    : st === "USED"
                    ? "Credenciados"
                    : "Cancelados"}
                </button>
              ))}
            </div>
          </div>

          {/* TABELA PRINCIPAL */}
          <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="py-16 text-center text-gray-400 flex flex-col items-center gap-2">
                <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                <span className="text-xs uppercase font-bold tracking-wider">Carregando Ingressos...</span>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="py-16 text-center text-gray-500 text-sm">
                Nenhum ingresso encontrado para os filtros selecionados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-semibold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Participante</th>
                      <th className="py-3.5 px-4">Código / Token</th>
                      <th className="py-3.5 px-4">Lote</th>
                      <th className="py-3.5 px-4">Status Ingresso</th>
                      <th className="py-3.5 px-4">E-mail (Resend)</th>
                      <th className="py-3.5 px-4">Check-in</th>
                      <th className="py-3.5 px-4 text-right">Ações Administrador</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredTickets.map((t) => (
                      <tr key={t.id} className="hover:bg-white/5 transition-colors">
                        
                        {/* Participante */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-white">{t.customer_name || "Participante"}</div>
                          <div className="text-[11px] text-gray-400">{t.customer_email || "-"}</div>
                        </td>

                        {/* Código */}
                        <td className="py-4 px-4 font-mono">
                          <div className="font-bold text-primary text-xs">{t.ticket_code}</div>
                          <div className="text-[10px] text-gray-500 truncate max-w-[120px]">
                            {t.qr_token}
                          </div>
                        </td>

                        {/* Lote */}
                        <td className="py-4 px-4 text-gray-300 text-xs">
                          {t.lot_name || "Lote VIP"}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          {t.status === "ACTIVE" ? (
                            <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">check_circle</span>
                              VÁLIDO
                            </span>
                          ) : t.status === "USED" || t.checked_in ? (
                            <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">badge</span>
                              CREDENCIADO
                            </span>
                          ) : (
                            <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">cancel</span>
                              {t.status}
                            </span>
                          )}
                        </td>

                        {/* Status E-mail */}
                        <td className="py-4 px-4 text-xs">
                          {t.email_sent ? (
                            <span className="text-green-400 font-medium flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">mark_email_read</span>
                              Enviado
                            </span>
                          ) : (
                            <span className="text-yellow-400 font-medium flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">mail</span>
                              Pendente
                            </span>
                          )}
                        </td>

                        {/* Status Check-in */}
                        <td className="py-4 px-4 text-xs">
                          {t.checked_in ? (
                            <span className="text-blue-400 font-medium flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">how_to_reg</span>
                              {t.checked_in_at
                                ? new Date(t.checked_in_at).toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Sim"}
                            </span>
                          ) : (
                            <span className="text-gray-500 font-medium">Não</span>
                          )}
                        </td>

                        {/* Ações */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            
                            {/* Abrir Ingresso Online */}
                            <Link
                              href={`/ingresso/${t.qr_token}`}
                              target="_blank"
                              className="p-2 bg-white/5 hover:bg-white/15 border border-white/10 text-primary rounded-xl transition-all"
                              title="Abrir Ingresso Online"
                            >
                              <span className="material-symbols-outlined text-base">visibility</span>
                            </Link>

                            {/* Reenviar E-mail via Resend */}
                            <button
                              onClick={() => handleAction(t.id, "resend_email")}
                              disabled={actionLoading === `${t.id}_resend_email`}
                              className="p-2 bg-white/5 hover:bg-white/15 border border-white/10 text-green-400 rounded-xl transition-all disabled:opacity-50"
                              title="Reenviar E-mail via Resend"
                            >
                              {actionLoading === `${t.id}_resend_email` ? (
                                <span className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></span>
                              ) : (
                                <span className="material-symbols-outlined text-base">forward_to_inbox</span>
                              )}
                            </button>

                            {/* Check-in Manual */}
                            {!t.checked_in && t.status === "ACTIVE" && (
                              <button
                                onClick={() => handleAction(t.id, "do_checkin")}
                                disabled={actionLoading === `${t.id}_do_checkin`}
                                className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 rounded-xl transition-all text-xs font-bold flex items-center gap-1"
                                title="Realizar Check-in Manual"
                              >
                                {actionLoading === `${t.id}_do_checkin` ? (
                                  <span className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                  <>
                                    <span className="material-symbols-outlined text-base">check</span>
                                    <span className="hidden sm:inline">Check-in</span>
                                  </>
                                )}
                              </button>
                            )}

                            {/* Cancelar Ingresso */}
                            {t.status !== "CANCELLED" && (
                              <button
                                onClick={() => {
                                  if (confirm(`Tem certeza que deseja CANCELAR o ingresso ${t.ticket_code}?`)) {
                                    handleAction(t.id, "cancel_ticket");
                                  }
                                }}
                                disabled={actionLoading === `${t.id}_cancel_ticket`}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl transition-all"
                                title="Cancelar Ingresso"
                              >
                                <span className="material-symbols-outlined text-base">block</span>
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
