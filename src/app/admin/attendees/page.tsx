"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

interface Attendee {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_cpf: string;
  customer_phone?: string;
  lot_name: string;
  paid_at?: string;
  created_at: string;
}

export default function AdminAttendeesPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAttendees = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.orders) {
        // Filtrar apenas participantes com pagamento confirmado
        const paidOrders = data.orders.filter(
          (o: any) => o.status === "paid"
        );
        setAttendees(paidOrders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
    const interval = setInterval(() => {
      fetchAttendees();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredAttendees = attendees.filter(
    (att) =>
      att.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      att.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      att.customer_cpf.includes(search)
  );

  const handleExportCSV = () => {
    if (filteredAttendees.length === 0) return;

    const headers = ["ID", "Nome Completo", "E-mail", "CPF", "Telefone", "Lote", "Data Pagamento"];
    const rows = filteredAttendees.map((att) => [
      att.id,
      `"${att.customer_name}"`,
      `"${att.customer_email}"`,
      `"${att.customer_cpf}"`,
      `"${att.customer_phone || ""}"`,
      `"${att.lot_name}"`,
      att.paid_at ? new Date(att.paid_at).toLocaleString("pt-BR") : "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `participantes-metodo-maestro-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-geist text-xl font-extrabold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">badge</span>
              Lista de Participantes Confirmados
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Alunos credenciados para a Imersão Presencial na World Gym Pro (Salvador - BA)
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={filteredAttendees.length === 0}
            className="bg-primary text-black font-bold text-xs uppercase px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Exportar Lista CSV</span>
          </button>
        </div>

        {/* CAMPO DE BUSCA */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar participante por Nome, E-mail ou CPF..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 text-white text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-primary transition-all placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* TABELA DE PARTICIPANTES */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="py-16 text-center text-gray-400 flex flex-col items-center gap-2">
              <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              <span className="text-xs uppercase font-bold tracking-wider">Carregando Credenciados...</span>
            </div>
          ) : filteredAttendees.length === 0 ? (
            <div className="py-16 text-center text-gray-500 text-sm">
              Nenhum participante confirmado encontrado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Aluno</th>
                    <th className="py-3.5 px-4">E-mail</th>
                    <th className="py-3.5 px-4">CPF</th>
                    <th className="py-3.5 px-4">WhatsApp / Telefone</th>
                    <th className="py-3.5 px-4">Credencial</th>
                    <th className="py-3.5 px-4">Data Pagamento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAttendees.map((att) => (
                    <tr key={att.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-bold text-white">
                        {att.customer_name}
                      </td>
                      <td className="py-4 px-4 text-gray-300">{att.customer_email}</td>
                      <td className="py-4 px-4 font-mono text-xs text-gray-400">
                        {att.customer_cpf}
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        {att.customer_phone || "Não informado"}
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-primary/10 border border-primary/30 text-primary text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                          GARANTIDO (LOTE 1)
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-400 text-xs">
                        {att.paid_at
                          ? new Date(att.paid_at).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
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
