"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_cpf: string;
  customer_phone?: string;
  lot_name: string;
  turma?: string;
  amount: number;
  payment_method: string;
  status: "pending" | "paid" | "approved" | "cancelled" | "refunded";
  created_at: string;
  paid_at?: string;
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Atualização automática em tempo real a cada 3 segundos
    const interval = setInterval(() => {
      fetchOrders();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalRevenue = orders
    .filter((o) => o.status === "paid")
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const paidCount = orders.filter((o) => o.status === "paid" || o.status === "approved").length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const totalOrdersCount = orders.length;

  const t1PaidCount = orders.filter((o) => (o.status === "paid" || o.status === "approved") && (o.turma === "turma_1" || !o.turma)).length;
  const t2PaidCount = orders.filter((o) => (o.status === "paid" || o.status === "approved") && o.turma === "turma_2").length;

  const conversionRate = totalOrdersCount > 0 ? ((paidCount / totalOrdersCount) * 100).toFixed(1) : "0";

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* CARDS DE MÉTRICAS PRINCIPAIS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Faturamento Total */}
          <div className="bg-[#141414] border border-primary/30 gold-glow rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                Faturamento Total
              </span>
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">payments</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold font-geist text-primary">
              {totalRevenue.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
            <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-green-400 text-xs">trending_up</span>
              <span>Confirmados em vendas presenciais/PIX</span>
            </p>
          </div>

          {/* Card 2: Ingressos Confirmados */}
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                Ingressos Confirmados
              </span>
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                <span className="material-symbols-outlined text-xl">confirmation_number</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold font-geist text-white">
              {paidCount} <span className="text-xs font-normal text-gray-400">alunos</span>
            </p>
            <p className="text-[11px] text-gray-400 mt-2">
              Lote 1 (World Gym Pro - Salvador)
            </p>
          </div>

          {/* Card 3: Pedidos Pendentes */}
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                Cobranças Pendentes
              </span>
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                <span className="material-symbols-outlined text-xl">pending_actions</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold font-geist text-white">
              {pendingCount} <span className="text-xs font-normal text-gray-400">pedidos</span>
            </p>
            <p className="text-[11px] text-yellow-400 mt-2">
              Aguardando pagamento PIX
            </p>
          </div>

          {/* Card 4: Taxa de Conversão */}
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                Taxa de Conversão
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <span className="material-symbols-outlined text-xl">pie_chart</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold font-geist text-white">
              {conversionRate}%
            </p>
            <p className="text-[11px] text-gray-400 mt-2">
              Inscrições concluídas / iniciadas
            </p>
          </div>
        </div>

        {/* CARD DE OCUPAÇÃO DAS TURMAS */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-geist text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">groups</span>
                Ocupação de Vagas por Turma (Limite: 30 Vagas/Turma)
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Controle em tempo real de inscritos confirmados em cada uma das turmas
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Turma 1 */}
            <div className="bg-[#1a1a1a] border border-primary/30 rounded-2xl p-5 gold-glow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase bg-primary/10 border border-primary/30 text-primary px-2.5 py-0.5 rounded-full">
                    TURMA 1
                  </span>
                  <h4 className="font-geist text-base font-bold text-white mt-1">
                    12 e 13 de Setembro
                  </h4>
                </div>
                <span className="font-extrabold font-mono text-lg text-primary">
                  {t1PaidCount} / 30
                </span>
              </div>

              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/10 mt-3">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min(100, (t1PaidCount / 30) * 100)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-gray-400 mt-2 text-right">
                {30 - t1PaidCount > 0 ? `${30 - t1PaidCount} vagas restantes` : "ESGOTADA"}
              </p>
            </div>

            {/* Turma 2 */}
            <div className="bg-[#1a1a1a] border border-purple-500/30 rounded-2xl p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase bg-purple-500/10 border border-purple-500/30 text-purple-400 px-2.5 py-0.5 rounded-full">
                    TURMA 2
                  </span>
                  <h4 className="font-geist text-base font-bold text-white mt-1">
                    26 e 27 de Setembro
                  </h4>
                </div>
                <span className="font-extrabold font-mono text-lg text-purple-400">
                  {t2PaidCount} / 30
                </span>
              </div>

              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/10 mt-3">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (t2PaidCount / 30) * 100)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-gray-400 mt-2 text-right">
                {30 - t2PaidCount > 0 ? `${30 - t2PaidCount} vagas restantes` : "ESGOTADA"}
              </p>
            </div>
          </div>
        </div>

        {/* ÚLTIMAS TRANSAÇÕES / PEDIDOS RECENTES */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-geist text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">history</span>
                  Vendas Recentes
                </h3>
                <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  Monitoramento ao Vivo
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Todas as compras são sincronizadas instantaneamente
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
            >
              <span>Ver todos os pedidos</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400 flex flex-col items-center gap-2">
              <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              <span className="text-xs uppercase tracking-wider font-bold">Carregando Vendas...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-sm">
              Nenhuma venda registrada até o momento.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                    <tr className="border-b border-white/10 text-gray-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3 px-3">Comprador</th>
                    <th className="pb-3 px-3">E-mail / Telefone</th>
                    <th className="pb-3 px-3">Turma</th>
                    <th className="pb-3 px-3">Valor</th>
                    <th className="pb-3 px-3">Método</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-3 font-semibold text-white">
                        {order.customer_name}
                      </td>
                      <td className="py-4 px-3 text-gray-300">
                        <div>{order.customer_email}</div>
                        <div className="text-[11px] text-gray-500">{order.customer_phone || "-"}</div>
                      </td>
                      <td className="py-4 px-3">
                        {order.turma === "turma_2" ? (
                          <span className="bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block">
                            Turma 2 (26-27/Set)
                          </span>
                        ) : (
                          <span className="bg-primary/10 border border-primary/30 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block">
                            Turma 1 (12-13/Set)
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-3 font-bold text-primary">
                        {Number(order.amount).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="py-4 px-3 uppercase text-[11px] font-bold text-gray-300">
                        {order.payment_method}
                      </td>
                      <td className="py-4 px-3">
                        {order.status === "paid" ? (
                          <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full flex items-center w-fit gap-1">
                            <span className="material-symbols-outlined text-xs">check_circle</span>
                            Pago
                          </span>
                        ) : order.status === "pending" ? (
                          <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full flex items-center w-fit gap-1">
                            <span className="material-symbols-outlined text-xs">schedule</span>
                            Pendente
                          </span>
                        ) : (
                          <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                            {order.status}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-3 text-gray-400 text-xs">
                        {new Date(order.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
