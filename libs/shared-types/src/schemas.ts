import { z } from 'zod';

// ---------------------------------------------------------------------------
// Quiz-Schemas (Zod) – werden in Backend (Validierung) & Frontend (Forms) genutzt
// ---------------------------------------------------------------------------

/** Schema für die Erstellung eines neuen Quizzes */
export const CreateQuizInputSchema = z.object({
  name: z.string().min(1, 'Quiz-Name darf nicht leer sein').max(200),
  description: z.string().max(1000).optional(),
});

export type CreateQuizInput = z.infer<typeof CreateQuizInputSchema>;

/** Health-Check Response */
export const HealthCheckResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string(),
  version: z.string(),
});

export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;
