import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  getAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  searchAnimals,
  getAnimalsByStatus,
} from "../db.animals";

export const animalsRouter = router({
  // Get all animals with pagination
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      return getAnimals(input.limit, input.offset);
    }),

  // Get single animal by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return getAnimalById(input.id);
    }),

  // Create new animal
  create: publicProcedure
    .input(
      z.object({
        nome: z.string().min(1, "Nome é obrigatório"),
        especie: z.string().min(1, "Espécie é obrigatória"),
        raca: z.string().min(1, "Raça é obrigatória"),
        sexo: z.enum(["Macho", "Fêmea", "Desconhecido"]),
        data_nascimento: z.string().optional(),
        castrado: z.boolean().optional(),
        status: z.string().optional(),
        descricao: z.string().optional(),
        foto_url: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createAnimal(input);
    }),

  // Update animal
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        nome: z.string().optional(),
        especie: z.string().optional(),
        raca: z.string().optional(),
        sexo: z.enum(["Macho", "Fêmea", "Desconhecido"]).optional(),
        data_nascimento: z.string().optional(),
        castrado: z.boolean().optional(),
        status: z.string().optional(),
        descricao: z.string().optional(),
        foto_url: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return updateAnimal(input);
    }),

  // Delete animal (soft delete)
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return deleteAnimal(input.id);
    }),

  // Search animals
  search: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }) => {
      return searchAnimals(input.query);
    }),

  // Get animals by status
  getByStatus: publicProcedure
    .input(z.object({ status: z.string() }))
    .query(async ({ input }) => {
      return getAnimalsByStatus(input.status);
    }),
});
