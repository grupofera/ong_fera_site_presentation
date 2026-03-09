import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const volunteerHoursRouter = router({
  // Register volunteer hours
  registerHours: protectedProcedure
    .input(
      z.object({
        volunteerId: z.number(),
        date: z.string(),
        hours: z.number().min(0.5).max(24),
        activity: z.string().min(1).max(255),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from("atividades_voluntarios")
        .insert([
          {
            voluntario_id: input.volunteerId,
            data_atividade: input.date,
            horas: input.hours,
            descricao_atividade: input.activity,
            observacoes: input.notes || null,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw new Error(error.message);
      return data;
    }),

  // Get volunteer hours by volunteer ID
  getHoursByVolunteer: protectedProcedure
    .input(z.object({ volunteerId: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from("atividades_voluntarios")
        .select("*")
        .eq("voluntario_id", input.volunteerId)
        .order("data_atividade", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    }),

  // Get total hours for a volunteer
  getTotalHours: protectedProcedure
    .input(z.object({ volunteerId: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from("atividades_voluntarios")
        .select("horas")
        .eq("voluntario_id", input.volunteerId);

      if (error) throw new Error(error.message);

      const totalHours = data.reduce((sum, row) => sum + (row.horas || 0), 0);
      return { totalHours, count: data.length };
    }),

  // Get all volunteer hours (for reports)
  getAllHours: protectedProcedure.query(async () => {
    const { data, error } = await supabase
      .from("atividades_voluntarios")
      .select("*, voluntarios(nome)")
      .order("data_atividade", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }),

  // Update volunteer hours
  updateHours: protectedProcedure
    .input(
      z.object({
        activityId: z.number(),
        hours: z.number().min(0.5).max(24),
        activity: z.string().min(1).max(255),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from("atividades_voluntarios")
        .update({
          horas: input.hours,
          descricao_atividade: input.activity,
          observacoes: input.notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.activityId)
        .select();

      if (error) throw new Error(error.message);
      return data;
    }),

  // Delete volunteer hours
  deleteHours: protectedProcedure
    .input(z.object({ activityId: z.number() }))
    .mutation(async ({ input }) => {
      const { error } = await supabase
        .from("atividades_voluntarios")
        .delete()
        .eq("id", input.activityId);

      if (error) throw new Error(error.message);
      return { success: true };
    }),
});
