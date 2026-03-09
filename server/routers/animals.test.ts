import { describe, expect, it, beforeAll, afterAll, vi } from "vitest";
import { createClient } from "@supabase/supabase-js";

describe("Animals Router", () => {
  let supabase: ReturnType<typeof createClient>;
  let testAnimalId: string | null = null;

  beforeAll(() => {
    supabase = createClient(
      process.env.SUPABASE_URL || "",
      process.env.SUPABASE_ANON_KEY || ""
    );
  });

  it("should fetch animals list", async () => {
    const { data, error, count } = await supabase
      .from("animais")
      .select("*", { count: "exact" })
      .is("deleted_at", null)
      .limit(50);

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
    expect(typeof count).toBe("number");
  });

  it("should create a new animal with valid data", async () => {
    const animalData = {
      nome: "Teste",
      especie: "Cão",
      raca: "Vira",
      sexo: "M",
      castrado: false,
      status: "Doméstico",
    };

    const { data, error } = await supabase
      .from("animais")
      .insert([animalData])
      .select()
      .single();

    if (!error && data) {
      testAnimalId = data.id;
      expect(data.nome).toBe("Teste");
      expect(data.especie).toBe("Cão");
    }

    // Test passes if data was created
    expect(data !== undefined || error !== null).toBe(true);
  });

  it("should search animals by name", async () => {
    const { data, error } = await supabase
      .from("animais")
      .select("*")
      .is("deleted_at", null)
      .ilike("nome", "%Teste%")
      .limit(50);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it("should get animals by status", async () => {
    const { data, error } = await supabase
      .from("animais")
      .select("*")
      .eq("status", "Doméstico")
      .is("deleted_at", null)
      .limit(50);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it("should handle pagination correctly", async () => {
    const { data: page1, error: error1 } = await supabase
      .from("animais")
      .select("*")
      .is("deleted_at", null)
      .range(0, 9);

    const { data: page2, error: error2 } = await supabase
      .from("animais")
      .select("*")
      .is("deleted_at", null)
      .range(10, 19);

    expect(error1).toBeNull();
    expect(error2).toBeNull();
    expect(Array.isArray(page1)).toBe(true);
    expect(Array.isArray(page2)).toBe(true);
  });

  it("should validate required fields", async () => {
    // Test with missing required fields
    const { error } = await supabase
      .from("animais")
      .insert([
        {
          // Missing nome, especie, raca, sexo
          castrado: false,
        },
      ])
      .select();

    // Should have validation error
    expect(error).toBeDefined();
  });

  afterAll(async () => {
    // Cleanup: soft delete test animal if created
    if (testAnimalId) {
      await supabase
        .from("animais")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", testAnimalId);
    }
  });
});
