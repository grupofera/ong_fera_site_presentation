import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const adoptionReturnsRouter = router({
  // Register adoption return/devolution
  registerReturn: protectedProcedure
    .input(
      z.object({
        adoptionId: z.number(),
        animalId: z.number(),
        returnDate: z.string(),
        reason: z.string().min(1).max(500),
        condition: z.enum(["bom", "medio", "ruim"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Create return record
      const { data: returnData, error: returnError } = await supabase
        .from("devolucoes_adocao")
        .insert([
          {
            adocao_id: input.adoptionId,
            data_devolucao: input.returnDate,
            motivo: input.reason,
            condicao_animal: input.condition,
            observacoes: input.notes || null,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (returnError) throw new Error(returnError.message);

      // Update animal status back to available
      const { error: animalError } = await supabase
        .from("animais")
        .update({
          status: "disponivel",
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.animalId);

      if (animalError) throw new Error(animalError.message);

      // Update adoption status to returned
      const { error: adoptionError } = await supabase
        .from("adocoes")
        .update({
          status: "devolvido",
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.adoptionId);

      if (adoptionError) throw new Error(adoptionError.message);

      return returnData;
    }),

  // Get all returns
  getAll: protectedProcedure.query(async () => {
    const { data, error } = await supabase
      .from("devolucoes_adocao")
      .select("*, adocoes(*, animais(nome), adotantes(nome))")
      .order("data_devolucao", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }),

  // Get returns by adoption ID
  getByAdoptionId: protectedProcedure
    .input(z.object({ adoptionId: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from("devolucoes_adocao")
        .select("*")
        .eq("adocao_id", input.adoptionId);

      if (error) throw new Error(error.message);
      return data;
    }),

  // Get returns by animal ID
  getByAnimalId: protectedProcedure
    .input(z.object({ animalId: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from("devolucoes_adocao")
        .select("*, adocoes(adotantes(nome))")
        .eq("adocoes.animal_id", input.animalId);

      if (error) throw new Error(error.message);
      return data;
    }),

  // Get returns by reason
  getByReason: protectedProcedure
    .input(z.object({ reason: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from("devolucoes_adocao")
        .select("*")
        .ilike("motivo", `%${input.reason}%`)
        .order("data_devolucao", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    }),

  // Get return statistics
  getStatistics: protectedProcedure.query(async () => {
    const { data, error } = await supabase
      .from("devolucoes_adocao")
      .select("condicao_animal, motivo");

    if (error) throw new Error(error.message);

    const stats = {
      total: data.length,
      byCondition: {
        bom: 0,
        medio: 0,
        ruim: 0,
      },
      topReasons: {} as Record<string, number>,
    };

    data.forEach((item) => {
      if (item.condicao_animal === "bom") stats.byCondition.bom++;
      else if (item.condicao_animal === "medio") stats.byCondition.medio++;
      else if (item.condicao_animal === "ruim") stats.byCondition.ruim++;

      const reason = item.motivo || "Não especificado";
      stats.topReasons[reason] = (stats.topReasons[reason] || 0) + 1;
    });

    return stats;
  }),

  // Update return record
  update: protectedProcedure
    .input(
      z.object({
        returnId: z.number(),
        reason: z.string().optional(),
        condition: z.enum(["bom", "medio", "ruim"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (input.reason) updateData.motivo = input.reason;
      if (input.condition) updateData.condicao_animal = input.condition;
      if (input.notes !== undefined) updateData.observacoes = input.notes;

      const { data, error } = await supabase
        .from("devolucoes_adocao")
        .update(updateData)
        .eq("id", input.returnId)
        .select();

      if (error) throw new Error(error.message);
      return data;
    }),

  // Delete return record
  delete: protectedProcedure
    .input(z.object({ returnId: z.number() }))
    .mutation(async ({ input }) => {
      const { error } = await supabase
        .from("devolucoes_adocao")
        .delete()
        .eq("id", input.returnId);

      if (error) throw new Error(error.message);
      return { success: true };
    }),
});
