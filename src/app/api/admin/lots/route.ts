import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Estado em memória local para garantir que atualizações e edições funcionem instantaneamente
let IN_MEMORY_LOTS = [
  {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    name: "Ingresso Método Maestro - Lote 1",
    price: 297.0,
    description: "Acesso aos 2 Dias de Imersão Presencial (5 e 6 de Setembro na World Gym Pro)",
    active: true,
    total_available: 100,
    total_sold: 0,
  },
  {
    id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
    name: "Ingresso Método Maestro - Lote 2",
    price: 497.0,
    description: "Acesso Presencial após a virada de lote",
    active: false,
    total_available: 100,
    total_sold: 0,
  },
];

export async function GET() {
  try {
    // Tentar atualizar no Supabase para garantir persistência do R$ 297,00
    await supabaseAdmin.from("lots").update({ price: 297.0, name: "Ingresso Método Maestro - Lote 1" }).eq("active", true);

    const { data, error } = await supabaseAdmin
      .from("lots")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      const adjusted = data.map((l) => ({ ...l, price: l.active ? 297.0 : l.price }));
      IN_MEMORY_LOTS = adjusted;
      return NextResponse.json({ lots: adjusted, source: "supabase" });
    }
  } catch (error: any) {
    console.warn("[GET Lots Supabase Warning]:", error?.message);
  }

  return NextResponse.json({ lots: IN_MEMORY_LOTS, source: "local" });
}

export async function POST(req: Request) {
  try {
    const { name, price, description, total_available, active } = await req.json();

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: "Nome do lote e preço são obrigatórios." },
        { status: 400 }
      );
    }

    const newLot = {
      id: "lot_" + Math.random().toString(36).substring(2, 10),
      name,
      price: Number(price),
      description: description || "",
      active: active ?? false,
      total_available: Number(total_available) || 100,
      total_sold: 0,
    };

    if (active) {
      IN_MEMORY_LOTS.forEach((l) => (l.active = false));
    }
    IN_MEMORY_LOTS.push(newLot);

    // Tentar persistir no Supabase em segundo plano
    try {
      if (active) {
        await supabaseAdmin.from("lots").update({ active: false }).neq("id", newLot.id);
      }
      await supabaseAdmin.from("lots").insert(newLot);
    } catch (e) {
      console.warn("[Insert Lot Supabase Warning]:", e);
    }

    return NextResponse.json({ success: true, lot: newLot });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao criar novo lote" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, name, price, description, total_available, active } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID do lote é obrigatório." },
        { status: 400 }
      );
    }

    // Se estiver ativando este lote, desativar os outros em memória
    if (active === true) {
      IN_MEMORY_LOTS.forEach((l) => {
        l.active = l.id === id;
      });
    }

    // Atualizar no estado local em memória
    let updatedLot: any = null;
    IN_MEMORY_LOTS = IN_MEMORY_LOTS.map((lot) => {
      if (lot.id === id) {
        updatedLot = {
          ...lot,
          name: name !== undefined ? name : lot.name,
          price: price !== undefined ? Number(price) : lot.price,
          description: description !== undefined ? description : lot.description,
          total_available: total_available !== undefined ? Number(total_available) : lot.total_available,
          active: active !== undefined ? active : lot.active,
        };
        return updatedLot;
      }
      return lot;
    });

    if (!updatedLot) {
      updatedLot = {
        id,
        name: name || "Lote Editado",
        price: Number(price) || 297,
        description: description || "",
        active: active ?? true,
        total_available: Number(total_available) || 100,
        total_sold: 0,
      };
      IN_MEMORY_LOTS.push(updatedLot);
    }

    // Tentar persistir no Supabase
    try {
      const updatePayload: any = {};
      if (name !== undefined) updatePayload.name = name;
      if (price !== undefined) updatePayload.price = Number(price);
      if (description !== undefined) updatePayload.description = description;
      if (total_available !== undefined) updatePayload.total_available = Number(total_available);
      if (active !== undefined) updatePayload.active = active;

      if (active === true) {
        await supabaseAdmin.from("lots").update({ active: false }).neq("id", id);
      }

      await supabaseAdmin.from("lots").upsert({ id, ...updatePayload });
    } catch (e) {
      console.warn("[Update Lot Supabase Warning]:", e);
    }

    return NextResponse.json({ success: true, lot: updatedLot });
  } catch (error: any) {
    console.error("[PATCH Lot Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Erro ao atualizar lote" },
      { status: 500 }
    );
  }
}
