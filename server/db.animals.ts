import { createClient } from "@supabase/supabase-js";
import { ENV } from "./_core/env";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || ""
);

export interface Animal {
  id: string;
  nome: string;
  especie: string;
  raca: string;
  sexo: string;
  data_nascimento: string | null;
  castrado: boolean;
  status: string;
  descricao: string | null;
  foto_url: string | null;
  projeto: string | null; // null = ONG FERA, "Animais Iluminados" = projeto especial
  created_at: string;
  updated_at: string;
}

export interface CreateAnimalInput {
  nome: string;
  especie: string;
  raca: string;
  sexo: string;
  data_nascimento?: string;
  castrado?: boolean;
  status?: string;
  descricao?: string;
  foto_url?: string;
  projeto?: string | null; // null = ONG FERA, "Animais Iluminados" = projeto especial
}

export interface UpdateAnimalInput extends Partial<CreateAnimalInput> {
  id: string;
}

// Get all animals (non-deleted)
export async function getAnimals(limit = 50, offset = 0) {
  const { data, error, count } = await supabase
    .from("animais")
    .select("*", { count: "exact" })
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("[DB] Error fetching animals:", error);
    throw new Error(`Failed to fetch animals: ${error.message}`);
  }

  return { animals: data as Animal[], total: count || 0 };
}

// Get single animal by ID
export async function getAnimalById(id: string) {
  const { data, error } = await supabase
    .from("animais")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("[DB] Error fetching animal:", error);
    throw new Error(`Failed to fetch animal: ${error.message}`);
  }

  return data as Animal;
}

// Create new animal
export async function createAnimal(input: CreateAnimalInput) {
  const { data, error } = await supabase
    .from("animais")
    .insert([
      {
        nome: input.nome,
        especie: input.especie,
        raca: input.raca,
        sexo: input.sexo,
        data_nascimento: input.data_nascimento || null,
        castrado: input.castrado || false,
        status: input.status || "Animal Doméstico",
        descricao: input.descricao || null,
        foto_url: input.foto_url || null,
        projeto: input.projeto || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("[DB] Error creating animal:", error);
    throw new Error(`Failed to create animal: ${error.message}`);
  }

  return data as Animal;
}

// Update animal
export async function updateAnimal(input: UpdateAnimalInput) {
  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from("animais")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[DB] Error updating animal:", error);
    throw new Error(`Failed to update animal: ${error.message}`);
  }

  return data as Animal;
}

// Soft delete animal
export async function deleteAnimal(id: string) {
  const { data, error } = await supabase
    .from("animais")
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[DB] Error deleting animal:", error);
    throw new Error(`Failed to delete animal: ${error.message}`);
  }

  return data as Animal;
}

// Search animals by name or species
export async function searchAnimals(query: string) {
  const { data, error } = await supabase
    .from("animais")
    .select("*")
    .is("deleted_at", null)
    .or(`nome.ilike.%${query}%,especie.ilike.%${query}%,raca.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[DB] Error searching animals:", error);
    throw new Error(`Failed to search animals: ${error.message}`);
  }

  return data as Animal[];
}

// Get animals by status
export async function getAnimalsByStatus(status: string) {
  const { data, error } = await supabase
    .from("animais")
    .select("*")
    .eq("status", status)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[DB] Error fetching animals by status:", error);
    throw new Error(`Failed to fetch animals: ${error.message}`);
  }

  return data as Animal[];
}

// Get animals by project
export async function getAnimalsByProject(projeto: string | null, limit = 50, offset = 0) {
  const query = supabase
    .from("animais")
    .select("*", { count: "exact" })
    .is("deleted_at", null);

  if (projeto === null) {
    query.is("projeto", null);
  } else {
    query.eq("projeto", projeto);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("[DB] Error fetching animals by project:", error);
    throw new Error(`Failed to fetch animals: ${error.message}`);
  }

  return { animals: data as Animal[], total: count || 0 };
}

// Search animals by project
export async function searchAnimalsByProject(query: string, projeto: string | null) {
  const baseQuery = supabase
    .from("animais")
    .select("*")
    .is("deleted_at", null)
    .or(`nome.ilike.%${query}%,especie.ilike.%${query}%,raca.ilike.%${query}%`);

  if (projeto === null) {
    baseQuery.is("projeto", null);
  } else {
    baseQuery.eq("projeto", projeto);
  }

  const { data, error } = await baseQuery
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[DB] Error searching animals by project:", error);
    throw new Error(`Failed to search animals: ${error.message}`);
  }

  return data as Animal[];
}
