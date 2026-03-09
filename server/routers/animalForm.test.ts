import { describe, it, expect } from "vitest";
import { z } from "zod";

// Test the validation schema
const animalFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").min(2, "Mínimo 2 caracteres"),
  especie: z.string().min(1, "Espécie é obrigatória"),
  raca: z.string().min(1, "Raça é obrigatória"),
  sexo: z.enum(["Macho", "Fêmea", "Desconhecido"]) as any,
  castrado: z.boolean().default(false),
  status: z.string().min(1, "Status é obrigatório"),
  descricao: z.string().optional(),
  data_nascimento: z.string().optional(),
});

describe("AnimalForm Validation", () => {
  it("should validate a complete animal form", () => {
    const validData = {
      nome: "Bolinha",
      especie: "Cão",
      raca: "Vira-lata",
      sexo: "Fêmea" as const,
      castrado: true,
      status: "Disponível para Adoção",
      descricao: "Cachorra muito dócil",
      data_nascimento: "2020-01-15",
    };

    const result = animalFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject form with missing required fields", () => {
    const invalidData = {
      nome: "",
      especie: "",
      raca: "",
      sexo: "Macho" as const,
      castrado: false,
      status: "",
    };

    const result = animalFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject form with short name", () => {
    const invalidData = {
      nome: "A",
      especie: "Cão",
      raca: "Vira-lata",
      sexo: "Macho" as const,
      castrado: false,
      status: "Animal Doméstico",
    };

    const result = animalFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject form with invalid sexo enum", () => {
    const invalidData = {
      nome: "Bolinha",
      especie: "Cão",
      raca: "Vira-lata",
      sexo: "Outro",
      castrado: false,
      status: "Animal Doméstico",
    };

    const result = animalFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should accept optional fields", () => {
    const minimalData = {
      nome: "Rex",
      especie: "Gato",
      raca: "Siamês",
      sexo: "Macho" as const,
      castrado: false,
      status: "Animal Doméstico",
    };

    const result = animalFormSchema.safeParse(minimalData);
    expect(result.success).toBe(true);
  });

  it("should set castrado default to false", () => {
    const data = {
      nome: "Mimi",
      especie: "Gato",
      raca: "Persa",
      sexo: "Fêmea" as const,
      status: "Adotado",
    };

    const result = animalFormSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.castrado).toBe(false);
    }
  });

  it("should validate all valid species", () => {
    const species = ["Cão", "Gato", "Coelho", "Pássaro", "Roedor", "Réptil", "Outro"];

    species.forEach((specie) => {
      const data = {
        nome: "Animal",
        especie: specie,
        raca: "Raça",
        sexo: "Macho" as const,
        castrado: false,
        status: "Animal Doméstico",
      };

      const result = animalFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  it("should validate all valid status options", () => {
    const statuses = [
      "Animal Doméstico",
      "Resgatado",
      "Em Tratamento",
      "Disponível para Adoção",
      "Adotado",
      "Falecido",
    ];

    statuses.forEach((status) => {
      const data = {
        nome: "Animal",
        especie: "Cão",
        raca: "Vira-lata",
        sexo: "Macho" as const,
        castrado: false,
        status: status,
      };

      const result = animalFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
