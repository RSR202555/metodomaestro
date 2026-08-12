"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

interface TicketLot {
  id: string;
  name: string;
  price: number;
  description: string;
  active: boolean;
  total_available: number;
  total_sold: number;
}

export default function AdminLotsPage() {
  const [lots, setLots] = useState<TicketLot[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para Modal de Edição / Criação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLot, setEditingLot] = useState<TicketLot | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [totalAvailable, setTotalAvailable] = useState("100");
  const [active, setActive] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchLots = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/lots");
      const data = await res.json();
      if (data.lots) {
        setLots(data.lots);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLots();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingLot(null);
    setName("");
    setPrice("");
    setDescription("");
    setTotalAvailable("100");
    setActive(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lot: TicketLot) => {
    setEditingLot(lot);
    setName(lot.name);
    setPrice(String(lot.price));
    setDescription(lot.description || "");
    setTotalAvailable(String(lot.total_available || 100));
    setActive(lot.active);
    setIsModalOpen(true);
  };

  const handleSaveLot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const parsedPrice = parseFloat(price) || 0;
    const parsedTotal = parseInt(totalAvailable, 10) || 100;

    // Atualização otimista instantânea na tela
    if (editingLot) {
      setLots((prev) =>
        prev.map((l) =>
          l.id === editingLot.id
            ? {
                ...l,
                name,
                price: parsedPrice,
                description,
                total_available: parsedTotal,
                active,
              }
            : active
            ? { ...l, active: false }
            : l
        )
      );
    } else {
      const newLotObj: TicketLot = {
        id: "lot_" + Date.now(),
        name,
        price: parsedPrice,
        description,
        active,
        total_available: parsedTotal,
        total_sold: 0,
      };
      setLots((prev) => (active ? [...prev.map((l) => ({ ...l, active: false })), newLotObj] : [...prev, newLotObj]));
    }

    setIsModalOpen(false);

    try {
      const method = editingLot ? "PATCH" : "POST";
      const payload = editingLot
        ? {
            id: editingLot.id,
            name,
            price: parsedPrice,
            description,
            total_available: parsedTotal,
            active,
          }
        : {
            name,
            price: parsedPrice,
            description,
            total_available: parsedTotal,
            active,
          };

      await fetch("/api/admin/lots", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      fetchLots();
    } catch (err: any) {
      console.warn("[Save Lot Async Sync Warning]:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (lot: TicketLot) => {
    try {
      const res = await fetch("/api/admin/lots", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: lot.id,
          active: !lot.active,
        }),
      });

      if (res.ok) {
        fetchLots();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-geist text-xl font-extrabold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">confirmation_number</span>
              Gerenciamento de Lotes e Ingressos
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Edite preços, altere descrições ou crie novos lotes para a landing page
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="bg-primary text-black font-bold text-xs uppercase px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Criar Novo Lote</span>
          </button>
        </div>

        {/* LISTA DE CARDS DOS LOTES */}
        {loading ? (
          <div className="py-16 text-center text-gray-400 flex flex-col items-center gap-2">
            <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            <span className="text-xs uppercase font-bold tracking-wider">Carregando Lotes...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lots.map((lot) => (
              <div
                key={lot.id}
                className={`bg-[#141414] border rounded-2xl p-6 transition-all ${
                  lot.active
                    ? "border-primary/50 gold-glow shadow-[0_0_30px_rgba(212,175,55,0.15)]"
                    : "border-white/10 opacity-75"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span
                      className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                        lot.active
                          ? "bg-primary/10 border border-primary/30 text-primary"
                          : "bg-gray-500/10 border border-gray-500/30 text-gray-400"
                      }`}
                    >
                      {lot.active ? "LOTE ATIVO ATUAL" : "INATIVO / PRÓXIMO LOTE"}
                    </span>
                    <h4 className="font-geist text-lg font-bold text-white mt-2">
                      {lot.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(lot)}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-all"
                      title="Editar Lote"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>

                    <button
                      onClick={() => handleToggleActive(lot)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                        lot.active
                          ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                          : "bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20"
                      }`}
                    >
                      {lot.active ? "Desativar" : "Ativar Lote"}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mb-6">{lot.description || "Sem descrição registrada."}</p>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Preço do Ingresso:</span>
                    <span className="font-extrabold text-primary font-geist text-xl">
                      {Number(lot.price).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Vagas Vendidas:</span>
                    <span className="text-white font-bold">
                      {lot.total_sold || 0} de {lot.total_available || 100}
                    </span>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          ((lot.total_sold || 0) / (lot.total_available || 100)) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL DE EDIÇÃO / CRIAÇÃO DE LOTE */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-[#141414] border border-primary/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h3 className="font-geist text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    {editingLot ? "edit_note" : "add_circle"}
                  </span>
                  <span>{editingLot ? "Editar Lote de Ingresso" : "Criar Novo Lote"}</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              <form onSubmit={handleSaveLot} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Nome do Lote *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Ingresso Método Maestro - Lote VIP"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#1a1a1a] border border-white/10 text-white text-sm rounded-xl p-3 outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Preço (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="297.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      className="w-full bg-[#1a1a1a] border border-white/10 text-white text-sm rounded-xl p-3 outline-none focus:border-primary transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Vagas Totais
                    </label>
                    <input
                      type="number"
                      placeholder="100"
                      value={totalAvailable}
                      onChange={(e) => setTotalAvailable(e.target.value)}
                      required
                      className="w-full bg-[#1a1a1a] border border-white/10 text-white text-sm rounded-xl p-3 outline-none focus:border-primary transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Descrição do Ingresso / Benefícios
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Acesso Presencial aos 2 dias + Material de Apoio Exclusivo..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/10 text-white text-sm rounded-xl p-3 outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                  <input
                    type="checkbox"
                    id="activeLot"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                  <label htmlFor="activeLot" className="text-xs text-white cursor-pointer select-none">
                    Definir este lote como <strong>Ativo Atualmente</strong> na página de vendas
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-xs font-bold uppercase transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-primary text-black font-bold text-xs uppercase px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
