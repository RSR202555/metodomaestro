"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

interface Coupon {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_uses: number | null;
  used_count: number;
  active: boolean;
  expires_at?: string | null;
  created_at?: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("50");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.coupons) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenCreateModal = () => {
    setCode("");
    setDiscountType("percentage");
    setDiscountValue("50");
    setMaxUses("");
    setExpiresAt("");
    setActive(true);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const cleanCode = code.trim().toUpperCase();
    const parsedValue = parseFloat(discountValue) || 0;

    if (!cleanCode) {
      setFormError("Informe o código do cupom.");
      return;
    }

    if (discountType === "percentage" && (parsedValue <= 0 || parsedValue > 50)) {
      setFormError("O desconto percentual é permitido até no máximo 50%.");
      return;
    }

    if (discountType === "fixed" && parsedValue <= 0) {
      setFormError("Informe um valor de desconto válido.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: cleanCode,
          discount_type: discountType,
          discount_value: parsedValue,
          max_uses: maxUses ? parseInt(maxUses, 10) : null,
          expires_at: expiresAt || null,
          active,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Erro ao salvar cupom.");
      }

      setIsModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      setFormError(err.message || "Erro inesperado.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: coupon.id,
          active: !coupon.active,
        }),
      });

      if (res.ok) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === coupon.id ? { ...c, active: !c.active } : c))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Tem certeza de que deseja excluir este cupom de desconto?")) return;

    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = coupons.filter((c) => c.active).length;
  const totalUses = coupons.reduce((acc, c) => acc + (c.used_count || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* CABEÇALHO DA PÁGINA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-geist text-xl font-extrabold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">local_offer</span>
              Gestão de Cupons de Desconto
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Crie cupons com desconto de até 50% para incentivar as vendas no checkout
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="bg-primary text-black font-bold text-xs uppercase px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Criar Novo Cupom</span>
          </button>
        </div>

        {/* METRICAS DE CUPONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Total de Cupons
            </span>
            <p className="text-2xl font-extrabold text-white font-geist">{coupons.length}</p>
          </div>

          <div className="bg-[#141414] border border-primary/30 rounded-2xl p-5 gold-glow">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Cupons Ativos
            </span>
            <p className="text-2xl font-extrabold text-primary font-geist">{activeCount}</p>
          </div>

          <div className="bg-[#141414] border border-white/10 rounded-2xl p-5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Usos Realizados
            </span>
            <p className="text-2xl font-extrabold text-green-400 font-geist">{totalUses} vezes</p>
          </div>
        </div>

        {/* CAMPO DE BUSCA */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar cupom por código (ex: MAESTRO50)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 text-white text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-primary transition-all placeholder:text-gray-500 font-mono uppercase"
            />
          </div>
        </div>

        {/* TABELA DE CUPONS */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="py-16 text-center text-gray-400 flex flex-col items-center gap-2">
              <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              <span className="text-xs uppercase font-bold tracking-wider">Carregando Cupons...</span>
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div className="py-16 text-center text-gray-500 text-sm">
              Nenhum cupom cadastrado encontrado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Código do Cupom</th>
                    <th className="py-3.5 px-4">Desconto</th>
                    <th className="py-3.5 px-4">Usos / Limite</th>
                    <th className="py-3.5 px-4">Validade</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCoupons.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-base text-primary">
                        {c.code}
                      </td>
                      <td className="py-4 px-4 font-bold text-white">
                        {c.discount_type === "percentage"
                          ? `${c.discount_value}% OFF`
                          : `R$ ${Number(c.discount_value).toFixed(2)} OFF`}
                      </td>
                      <td className="py-4 px-4 text-gray-300 font-mono">
                        {c.used_count || 0} / {c.max_uses ? c.max_uses : "Ilimitado"}
                      </td>
                      <td className="py-4 px-4 text-gray-400 text-xs">
                        {c.expires_at
                          ? new Date(c.expires_at).toLocaleDateString("pt-BR")
                          : "Sem expiração"}
                      </td>
                      <td className="py-4 px-4">
                        {c.active ? (
                          <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                            ATIVO
                          </span>
                        ) : (
                          <span className="bg-gray-500/10 border border-gray-500/30 text-gray-400 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                            INATIVO
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleActive(c)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                              c.active
                                ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                                : "bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20"
                            }`}
                          >
                            {c.active ? "Desativar" : "Ativar"}
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(c.id)}
                            className="bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 p-2 rounded-xl border border-white/10 transition-all"
                            title="Excluir Cupom"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL DE CRIAÇÃO DE CUPOM */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-[#141414] border border-primary/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h3 className="font-geist text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">add_circle</span>
                  <span>Criar Novo Cupom de Desconto</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs mb-4">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSaveCoupon} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Código do Cupom *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: MAESTRO50"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                    className="w-full bg-[#1a1a1a] border border-white/10 text-white text-sm rounded-xl p-3 outline-none focus:border-primary transition-all font-mono uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Tipo de Desconto *
                    </label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as any)}
                      className="w-full bg-[#1a1a1a] border border-white/10 text-white text-sm rounded-xl p-3 outline-none focus:border-primary transition-all"
                    >
                      <option value="percentage">Porcentagem (%)</option>
                      <option value="fixed">Valor Fixo (R$)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Valor do Desconto *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder={discountType === "percentage" ? "50 (máx 50%)" : "50.00"}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      required
                      className="w-full bg-[#1a1a1a] border border-white/10 text-white text-sm rounded-xl p-3 outline-none focus:border-primary transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Limite de Usos (Opcional)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 50 (deixe em branco para ilimitado)"
                      value={maxUses}
                      onChange={(e) => setMaxUses(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-white/10 text-white text-sm rounded-xl p-3 outline-none focus:border-primary transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Data de Expiração (Opcional)
                    </label>
                    <input
                      type="date"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-white/10 text-white text-sm rounded-xl p-3 outline-none focus:border-primary transition-all text-gray-300"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                  <input
                    type="checkbox"
                    id="activeCoupon"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                  <label htmlFor="activeCoupon" className="text-xs text-white cursor-pointer select-none">
                    Ativar cupom imediatamente para uso no checkout
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
                    {saving ? "Criando..." : "Salvar Cupom"}
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
