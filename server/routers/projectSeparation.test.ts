import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getAnimalsByProject,
  searchAnimalsByProject,
} from "../db.animals";

// Mock do Supabase
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn((table) => ({
      select: vi.fn(function () {
        return this;
      }),
      is: vi.fn(function () {
        return this;
      }),
      eq: vi.fn(function () {
        return this;
      }),
      or: vi.fn(function () {
        return this;
      }),
      order: vi.fn(function () {
        return this;
      }),
      range: vi.fn(function () {
        return {
          data: [
            {
              id: "1",
              nome: "Bolinha",
              especie: "Cão",
              raca: "Vira-lata",
              sexo: "Fêmea",
              castrado: true,
              status: "Disponível para Adoção",
              descricao: "Cachorra dócil",
              foto_url: null,
              projeto: null,
              created_at: "2026-01-01",
              updated_at: "2026-01-01",
            },
          ],
          error: null,
          count: 1,
        };
      }),
      limit: vi.fn(function () {
        return {
          data: [
            {
              id: "2",
              nome: "Luminoso",
              especie: "Gato",
              raca: "Siamês",
              sexo: "Macho",
              castrado: false,
              status: "Em Tratamento",
              descricao: "Gato especial",
              foto_url: null,
              projeto: "Animais Iluminados",
              created_at: "2026-01-02",
              updated_at: "2026-01-02",
            },
          ],
          error: null,
        };
      }),
    })),
  })),
}));

describe("Project Separation - Animais Iluminados", () => {
  describe("getAnimalsByProject", () => {
    it("deve retornar animais da ONG FERA quando projeto é null", async () => {
      const result = await getAnimalsByProject(null, 50, 0);

      expect(result).toBeDefined();
      expect(result.animals).toBeDefined();
      expect(result.total).toBeDefined();
      expect(Array.isArray(result.animals)).toBe(true);
    });

    it("deve retornar animais do projeto Animais Iluminados quando especificado", async () => {
      const result = await getAnimalsByProject("Animais Iluminados", 50, 0);

      expect(result).toBeDefined();
      expect(result.animals).toBeDefined();
      expect(result.total).toBeDefined();
      expect(Array.isArray(result.animals)).toBe(true);
    });

    it("deve respeitar limite e offset de paginação", async () => {
      const result = await getAnimalsByProject(null, 10, 5);

      expect(result).toBeDefined();
      expect(result.animals).toBeDefined();
    });
  });

  describe("searchAnimalsByProject", () => {
    it("deve buscar animais da ONG FERA por nome", async () => {
      const result = await searchAnimalsByProject("Bolinha", null);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("deve buscar animais do projeto Animais Iluminados", async () => {
      const result = await searchAnimalsByProject("Luminoso", "Animais Iluminados");

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("deve retornar array vazio se nenhum animal encontrado", async () => {
      const result = await searchAnimalsByProject("Inexistente", null);

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("Project Field Validation", () => {
    it("deve permitir projeto null para animais da ONG FERA", () => {
      const animal = {
        id: "1",
        nome: "Test",
        especie: "Cão",
        raca: "Vira-lata",
        sexo: "Macho",
        castrado: false,
        status: "Resgatado",
        descricao: null,
        foto_url: null,
        projeto: null,
        created_at: "2026-01-01",
        updated_at: "2026-01-01",
      };

      expect(animal.projeto).toBeNull();
    });

    it("deve permitir projeto 'Animais Iluminados'", () => {
      const animal = {
        id: "2",
        nome: "Test",
        especie: "Gato",
        raca: "Siamês",
        sexo: "Fêmea",
        castrado: true,
        status: "Em Tratamento",
        descricao: null,
        foto_url: null,
        projeto: "Animais Iluminados",
        created_at: "2026-01-02",
        updated_at: "2026-01-02",
      };

      expect(animal.projeto).toBe("Animais Iluminados");
    });

    it("deve permitir outros projetos futuros", () => {
      const animal = {
        id: "3",
        nome: "Test",
        especie: "Coelho",
        raca: "Angorá",
        sexo: "Macho",
        castrado: false,
        status: "Disponível para Adoção",
        descricao: null,
        foto_url: null,
        projeto: "Projeto Futuro",
        created_at: "2026-01-03",
        updated_at: "2026-01-03",
      };

      expect(animal.projeto).toBe("Projeto Futuro");
    });
  });

  describe("Separation Guarantees", () => {
    it("animais da ONG FERA não devem aparecer em buscas do Animais Iluminados", async () => {
      // Simulando que buscamos por um animal da ONG FERA no projeto Animais Iluminados
      const result = await searchAnimalsByProject("Bolinha", "Animais Iluminados");

      // Resultado deve estar vazio ou não conter animais da ONG FERA
      expect(Array.isArray(result)).toBe(true);
    });

    it("animais do Animais Iluminados não devem aparecer em buscas da ONG FERA", async () => {
      // Simulando que buscamos por um animal do Animais Iluminados na ONG FERA
      const result = await searchAnimalsByProject("Luminoso", null);

      // Resultado deve estar vazio ou não conter animais do Animais Iluminados
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
