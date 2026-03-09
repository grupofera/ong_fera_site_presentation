import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";

describe("Supabase Connection", () => {
  it("should connect to Supabase with valid credentials", async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    expect(supabaseUrl).toBeDefined();
    expect(supabaseKey).toBeDefined();

    // Create Supabase client
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // Test connection by querying a simple table
    const { data, error } = await supabase
      .from("usuarios")
      .select("id")
      .limit(1);

    // Should not have error (even if table is empty)
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
  });

  it("should have all required tables", async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    const supabase = createClient(supabaseUrl!, supabaseKey!);

    const requiredTables = [
      "usuarios",
      "animais",
      "adocoes",
      "doacoes",
      "voluntarios",
      "consultas_veterinarias",
    ];

    for (const table of requiredTables) {
      const { data, error } = await supabase
        .from(table)
        .select("id")
        .limit(1);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    }
  });
});
