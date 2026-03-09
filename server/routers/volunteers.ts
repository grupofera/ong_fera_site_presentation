import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || ""
);

export interface Volunteer {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  horas_mes: number;
  atividades: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVolunteerInput {
  nome: string;
  email: string;
  telefone: string;
  horas_mes: number;
  atividades: string;
}

// Get all volunteers (non-deleted)
export async function getVolunteers(limit = 50, offset = 0) {
  const { data, error, count } = await supabase
    .from("voluntarios")
    .select("*", { count: "exact" })
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("[DB] Error fetching volunteers:", error);
    return { volunteers: [], total: 0 };
  }

  return { volunteers: data || [], total: count || 0 };
}

// Create volunteer
export async function createVolunteer(input: CreateVolunteerInput) {
  const { data, error } = await supabase
    .from("voluntarios")
    .insert([
      {
        nome: input.nome,
        email: input.email,
        telefone: input.telefone,
        horas_mes: input.horas_mes,
        atividades: input.atividades,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
    .select();

  if (error) {
    console.error("[DB] Error creating volunteer:", error);
    throw error;
  }

  return data?.[0];
}

// Update volunteer
export async function updateVolunteer(id: string, input: Partial<CreateVolunteerInput>) {
  const { data, error } = await supabase
    .from("voluntarios")
    .update({
      ...input,
      updated_at: new Date(),
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("[DB] Error updating volunteer:", error);
    throw error;
  }

  return data?.[0];
}

// Delete volunteer (soft delete)
export async function deleteVolunteer(id: string) {
  const { error } = await supabase
    .from("voluntarios")
    .update({ deleted_at: new Date() })
    .eq("id", id);

  if (error) {
    console.error("[DB] Error deleting volunteer:", error);
    throw error;
  }

  return true;
}

export const volunteersRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        nome: z.string(),
        email: z.string().email(),
        telefone: z.string(),
        horas_mes: z.number().min(0),
        atividades: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const volunteer = await createVolunteer(input);
      return { success: true, volunteer };
    }),

  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return await getVolunteers(input.limit, input.offset);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        nome: z.string().optional(),
        email: z.string().email().optional(),
        telefone: z.string().optional(),
        horas_mes: z.number().optional(),
        atividades: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      const volunteer = await updateVolunteer(id, updateData);
      return { success: true, volunteer };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await deleteVolunteer(input.id);
      return { success: true };
    }),
});
