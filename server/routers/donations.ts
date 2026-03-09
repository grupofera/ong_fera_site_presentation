import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

const donationSchema = z.object({
  doador_nome: z.string().min(1, "Nome do doador é obrigatório"),
  doador_email: z.string().email("Email inválido"),
  doador_telefone: z.string().optional(),
  tipo_doacao: z.enum(["PIX", "Banco", "Item"]) as any,
  valor: z.number().min(1, "Valor deve ser maior que 0").optional(),
  descricao_item: z.string().optional(),
  data_doacao: z.string().optional(),
  observacoes: z.string().optional(),
  recorrente: z.boolean().default(false),
});

export type DonationFormValues = z.infer<typeof donationSchema>;

export const donationsRouter = router({
  create: publicProcedure
    .input(donationSchema)
    .mutation(async ({ input }) => {
      try {
        return {
          id: Math.random().toString(36).substr(2, 9),
          ...input,
          created_at: new Date(),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao registrar doação",
        });
      }
    }),

  list: publicProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        return {
          donations: [],
          total: 0,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao listar doações",
        });
      }
    }),

  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      try {
        return [];
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar doações",
        });
      }
    }),

  byType: publicProcedure
    .input(z.object({ tipo: z.enum(["PIX", "Banco", "Item"]) as any }))
    .query(async ({ input }) => {
      try {
        return [];
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao filtrar doações",
        });
      }
    }),

  stats: publicProcedure.query(async () => {
    try {
      return {
        total_doadores: 0,
        doadores_recorrentes: 0,
        total_valor_pix: 0,
        total_valor_banco: 0,
        total_itens: 0,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao buscar estatísticas",
      });
    }
  }),

  byMonth: publicProcedure.query(async () => {
    try {
      return [];
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao buscar doações por mês",
      });
    }
  }),
});
