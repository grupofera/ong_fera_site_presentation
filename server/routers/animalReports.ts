import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const animalReportsRouter = router({
  // Get animals by status
  getByStatus: protectedProcedure
    .input(z.object({ status: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from("animais")
        .select("*")
        .eq("status", input.status)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    }),

  // Get all animals with status summary
  getStatusSummary: protectedProcedure.query(async () => {
    const { data, error } = await supabase
      .from("animais")
      .select("status")
      .is("deleted_at", null);

    if (error) throw new Error(error.message);

    const summary = {
      total: data.length,
      disponivel: 0,
      adotado: 0,
      falecido: 0,
      em_tratamento: 0,
      quarentena: 0,
    };

    data.forEach((animal) => {
      if (animal.status === "disponivel") summary.disponivel++;
      else if (animal.status === "adotado") summary.adotado++;
      else if (animal.status === "falecido") summary.falecido++;
      else if (animal.status === "em_tratamento") summary.em_tratamento++;
      else if (animal.status === "quarentena") summary.quarentena++;
    });

    return summary;
  }),

  // Get animals by species and status
  getBySpeciesAndStatus: protectedProcedure
    .input(
      z.object({
        especie: z.string(),
        status: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      let query = supabase
        .from("animais")
        .select("*")
        .eq("especie", input.especie)
        .is("deleted_at", null);

      if (input.status) {
        query = query.eq("status", input.status);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw new Error(error.message);
      return data;
    }),

  // Get animals available for adoption
  getAvailableForAdoption: protectedProcedure.query(async () => {
    const { data, error } = await supabase
      .from("animais")
      .select("*")
      .eq("status", "disponivel")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }),

  // Get animals by date range
  getByDateRange: protectedProcedure
    .input(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from("animais")
        .select("*")
        .gte("created_at", input.startDate)
        .lte("created_at", input.endDate)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    }),

  // Get animals by species
  getBySpecies: protectedProcedure
    .input(z.object({ especie: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from("animais")
        .select("*")
        .eq("especie", input.especie)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    }),
});
