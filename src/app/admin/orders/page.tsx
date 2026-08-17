"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

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
  gateway_payment_id?: string;
  created_at: string;
  paid_at?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: newStatus as any,
                  paid_at: newStatus === "paid" ? new Date().toISOString() : o.paid_at,
                }
              : o
          )
        );
      }
    } catch (err) {
      console.error("Erro ao atualizar pedido:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_cpf.includes(search);

    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-geist text-xl font-extrabold text-white">
              Gerenciamento de Pedidos e Vendas
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Filtre por status, busque por cliente ou aprove pagamentos manualmente
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="self-start md:self-auto bg-white/5 border border-white/10 text-gray-300 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            <span>Atualizar Dados</span>
          </button>
        </div>

        {/* CONTROLES DE FILTRO E PESQUISA */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar por Nome, E-mail ou CPF..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 text-white text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-primary transition-all placeholder:text-gray-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {["all", "paid", "pending", "cancelled"].map((st) => (
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
                  : st === "paid"
                  ? "Pagos"
                  : st === "pending"
                  ? "Pendentes"
                  : "Cancelados"}
              </button>
            ))}
          </div>
        </div>

        {/* TABELA DE PEDIDOS */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="py-16 text-center text-gray-400 flex flex-col items-center gap-2">
              <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              <span className="text-xs uppercase font-bold tracking-wider">Carregando Pedidos...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-gray-500 text-sm">
              Nenhum pedido encontrado com os filtros aplicados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Comprador / CPF</th>
                    <th className="py-3.5 px-4">Contato</th>
                    <th className="py-3.5 px-4">Lote & Turma</th>
                    <th className="py-3.5 px-4">Valor</th>
                    <th className="py-3.5 px-4">Método</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-white">{order.customer_name}</div>
                        <div className="text-[11px] text-gray-500 font-mono">
                          CPF: {order.customer_cpf}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        <div>{order.customer_email}</div>
                        <div className="text-[11px] text-gray-500">
                          {order.customer_phone || "Não informado"}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-300 font-medium">
                        <div>{order.lot_name}</div>
                        <div className="mt-1">
                          {order.turma === "turma_2" ? (
                            <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-full">
                              Turma 2 (26 e 27/Set)
                            </span>
                          ) : (
                            <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded-full">
                              Turma 1 (12 e 13/Set)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-primary">
                        {Number(order.amount).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="py-4 px-4 uppercase text-[11px] font-bold text-gray-300">
                        {order.payment_method}
                      </td>
                      <td className="py-4 px-4">
                        {order.status === "paid" ? (
                          <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">check_circle</span>
                            Pago
                          </span>
                        ) : order.status === "pending" ? (
                          <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">schedule</span>
                            Pendente
                          </span>
                        ) : (
                          <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                            {order.status}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {order.status === "pending" ? (
                          <button
                            onClick={() => handleUpdateStatus(order.id, "paid")}
                            disabled={updatingId === order.id}
                            className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-green-300 font-bold text-[11px] uppercase px-3 py-1.5 rounded-lg transition-all"
                          >
                            {updatingId === order.id ? "Aprovando..." : "Marcar como Pago"}
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-500">Concluído</span>
                        )}
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
