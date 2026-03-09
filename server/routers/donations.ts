import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const donationsRouter = router({
  // List donations (alias for getAll)
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from("doacoes")
        .select("*, doadores(nome, email)")
        .order("data_doacao", { ascending: false })
        .range(input.offset, input.offset + input.limit - 1);

      if (error) throw new Error(error.message);
      return { donations: data || [], total: data?.length || 0 };
    }),

  // Create donation
  create: protectedProcedure
    .input(
      z.object({
        tipo_doacao: z.enum(["pix", "banco", "items"]),
        valor: z.number().min(0).optional(),
        descricao_items: z.string().optional(),
        doador_id: z.number().optional(),
        data_doacao: z.string(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from("doacoes")
        .insert([
          {
            tipo_doacao: input.tipo_doacao,
            valor: input.valor || null,
            descricao_items: input.descricao_items || null,
            doador_id: input.doador_id || null,
            data_doacao: input.data_doacao,
            observacoes: input.observacoes || null,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw new Error(error.message);
      return data;
    }),

  // Get all donations
  getAll: protectedProcedure.query(async () => {
    const { data, error } = await supabase
      .from("doacoes")
      .select("*, doadores(nome, email)")
      .order("data_doacao", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }),

  // Get donations by type
  getByType: protectedProcedure
    .input(z.object({ tipo: z.enum(["pix", "banco", "items"]) }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from("doacoes")
        .select("*, doadores(nome)")
        .eq("tipo_doacao", input.tipo)
        .order("data_doacao", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    }),

  // Get donations by donor
  getByDonor: protectedProcedure
    .input(z.object({ doadorId: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from("doacoes")
        .select("*")
        .eq("doador_id", input.doadorId)
        .order("data_doacao", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    }),

  // Get donation statistics
  getStatistics: protectedProcedure.query(async () => {
    const { data, error } = await supabase
      .from("doacoes")
      .select("tipo_doacao, valor");

    if (error) throw new Error(error.message);

    const stats = {
      total: data.length,
      byType: {
        pix: 0,
        banco: 0,
        items: 0,
      },
      totalValue: 0,
    };

    data.forEach((donation) => {
      if (donation.tipo_doacao === "pix") stats.byType.pix++;
      else if (donation.tipo_doacao === "banco") stats.byType.banco++;
      else if (donation.tipo_doacao === "items") stats.byType.items++;

      if (donation.valor) stats.totalValue += donation.valor;
    });

    return stats;
  }),

  // Update donation
  update: protectedProcedure
    .input(
      z.object({
        donationId: z.number(),
        valor: z.number().optional(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (input.valor !== undefined) updateData.valor = input.valor;
      if (input.observacoes) updateData.observacoes = input.observacoes;

      const { data, error } = await supabase
        .from("doacoes")
        .update(updateData)
        .eq("id", input.donationId)
        .select();

      if (error) throw new Error(error.message);
      return data;
    }),

  // Delete donation
  delete: protectedProcedure
    .input(z.object({ donationId: z.number() }))
    .mutation(async ({ input }) => {
      const { error } = await supabase
        .from("doacoes")
        .delete()
        .eq("id", input.donationId);

      if (error) throw new Error(error.message);
      return { success: true };
    }),
});
