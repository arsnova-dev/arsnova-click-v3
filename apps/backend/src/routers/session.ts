/**
 * Session-Router (Story 2.1a, 3.1, 4.6, 4.7, 0.5).
 */
import { TRPCError } from '@trpc/server';
import {
  CreateSessionInputSchema,
  GetSessionInfoInputSchema,
  JoinSessionInputSchema,
  JoinSessionOutputSchema,
  GetExportDataInputSchema,
  SessionInfoDTOSchema,
  SessionExportDTOSchema,
  type SessionExportDTO,
  type QuestionExportEntry,
  type OptionDistributionEntry,
  type FreetextAggregateEntry,
  type BonusTokenEntryDTO,
} from '@arsnova/shared-types';
import { publicProcedure, router, getClientIp } from '../trpc';
import { prisma } from '../db';
import {
  checkSessionCreateRate,
  isSessionCodeLockedOut,
  recordFailedSessionCodeAttempt,
} from '../lib/rateLimit';
import { randomBytes } from 'crypto';

const QUESTION_TEXT_SHORT_MAX = 100;

function generateSessionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[randomBytes(1)[0]! % chars.length];
  }
  return code;
}

async function ensureUniqueSessionCode(): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = generateSessionCode();
    const existing = await prisma.session.findUnique({ where: { code } });
    if (!existing) return code;
  }
  throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Konnte keinen freien Session-Code erzeugen.' });
}

export const sessionRouter = router({
  /** Session erstellen (Story 2.1a). Rate-Limit: 10/h pro IP (Story 0.5). */
  create: publicProcedure
    .input(CreateSessionInputSchema)
    .mutation(async ({ ctx, input }) => {
      const ip = getClientIp(ctx);
      const limit = await checkSessionCreateRate(ip);
      if (!limit.allowed) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: `Maximal ${limit.remaining === 0 ? '0' : '10'} Sessions pro Stunde. Bitte später erneut versuchen.`,
          cause: { retryAfterSeconds: limit.retryAfterSeconds },
        });
      }
      const code = await ensureUniqueSessionCode();
      const session = await prisma.session.create({
        data: {
          code,
          type: input.type ?? 'QUIZ',
          quizId: input.quizId ?? null,
          title: input.title ?? null,
          moderationMode: input.moderationMode ?? false,
          status: 'LOBBY',
        },
        include: { quiz: { select: { name: true } } },
      });
      return {
        sessionId: session.id,
        code: session.code,
        status: session.status,
        quizName: session.quiz?.name ?? null,
      };
    }),

  /** Session-Info per Code (für Beitritt, Story 3.1). */
  getInfo: publicProcedure
    .input(GetSessionInfoInputSchema)
    .output(SessionInfoDTOSchema)
    .query(async ({ input }) => {
      const session = await prisma.session.findUnique({
        where: { code: input.code.toUpperCase() },
        include: { quiz: { select: { name: true } }, _count: { select: { participants: true } } },
      });
      if (!session) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Session nicht gefunden.' });
      }
      return {
        id: session.id,
        code: session.code,
        type: session.type,
        status: session.status,
        quizName: session.quiz?.name ?? null,
        title: session.title ?? null,
        participantCount: session._count.participants,
      };
    }),

  /** Session beitreten (Story 3.1). Rate-Limit: 5 Fehlversuche/5 Min, 60s Lockout (Story 0.5). */
  join: publicProcedure
    .input(JoinSessionInputSchema)
    .output(JoinSessionOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const ip = getClientIp(ctx);
      const lockout = await isSessionCodeLockedOut(ip);
      if (lockout.locked) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Zu viele Fehlversuche. Bitte warten Sie vor dem nächsten Versuch.',
          cause: { retryAfterSeconds: lockout.retryAfterSeconds },
        });
      }
      const session = await prisma.session.findUnique({
        where: { code: input.code.toUpperCase() },
        include: { quiz: { select: { name: true } }, _count: { select: { participants: true } } },
      });
      if (!session) {
        const after = await recordFailedSessionCodeAttempt(ip);
        if (after.locked) {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: 'Ungültiger Code. Zu viele Fehlversuche – bitte warten Sie vor dem nächsten Versuch.',
            cause: { retryAfterSeconds: after.retryAfterSeconds },
          });
        }
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Session nicht gefunden.' });
      }
      if (session.status === 'FINISHED') {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Diese Session ist bereits beendet.' });
      }
      const participant = await prisma.participant.create({
        data: { sessionId: session.id, nickname: input.nickname.trim().slice(0, 30) },
      }).catch(() => {
        throw new TRPCError({ code: 'CONFLICT', message: 'Dieser Nickname ist in dieser Session bereits vergeben.' });
      });
      return {
        id: session.id,
        code: session.code,
        type: session.type,
        status: session.status,
        quizName: session.quiz?.name ?? null,
        title: session.title ?? null,
        participantCount: session._count.participants + 1,
        participantId: participant.id,
      };
    }),

  /**
   * Liefert aggregierte Export-Daten für eine beendete Session (Story 4.7).
   * Nur für Session-Status FINISHED; nur anonymisierte/aggregierte Daten (DSGVO-konform).
   * TODO: Berechtigung prüfen (nur Dozent/Ersteller der Session), sobald Auth vorhanden.
   */
  getExportData: publicProcedure
    .input(GetExportDataInputSchema)
    .output(SessionExportDTOSchema)
    .query(async ({ input }) => {
      const session = await prisma.session.findUnique({
        where: { id: input.sessionId },
        include: {
          quiz: {
            include: {
              questions: {
                orderBy: { order: 'asc' },
                include: { answers: true },
              },
            },
          },
          votes: {
            include: {
              selectedAnswers: { include: { answerOption: true } },
            },
          },
          bonusTokens: true,
          participants: { select: { id: true } },
        },
      });

      if (!session) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Session nicht gefunden.' });
      }
      if (session.status !== 'FINISHED') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Export nur für beendete Sessions verfügbar.',
        });
      }
      if (session.type !== 'QUIZ' || !session.quiz) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Export nur für Quiz-Sessions verfügbar.',
        });
      }

      const quizName = session.quiz.name;
      const questions = session.quiz.questions;
      const votesByQuestion = new Map<string, typeof session.votes>();
      for (const vote of session.votes) {
        const list = votesByQuestion.get(vote.questionId) ?? [];
        list.push(vote);
        votesByQuestion.set(vote.questionId, list);
      }

      const questionEntries: QuestionExportEntry[] = questions.map((q) => {
        const votes = votesByQuestion.get(q.id) ?? [];
        const participantCount = votes.length;

        let optionDistribution: OptionDistributionEntry[] | undefined;
        let freetextAggregates: FreetextAggregateEntry[] | undefined;
        let ratingDistribution: Record<string, number> | undefined;
        let ratingAverage: number | undefined;
        let ratingStandardDeviation: number | undefined;
        let averageScore: number | undefined;

        switch (q.type) {
          case 'MULTIPLE_CHOICE':
          case 'SINGLE_CHOICE': {
            const optionCounts = new Map<string, { count: number; isCorrect?: boolean }>();
            for (const opt of q.answers) {
              optionCounts.set(opt.id, { count: 0, isCorrect: opt.isCorrect });
            }
            for (const v of votes) {
              for (const sa of v.selectedAnswers) {
                const key = sa.answerOptionId;
                const cur = optionCounts.get(key);
                if (cur) {
                  cur.count += 1;
                }
              }
            }
            const total = votes.length || 1;
            optionDistribution = q.answers.map((opt) => {
              const { count, isCorrect } = optionCounts.get(opt.id) ?? { count: 0 };
              return {
                text: opt.text,
                count,
                percentage: Math.round((count / total) * 1000) / 10,
                isCorrect,
              };
            });
            break;
          }
          case 'FREETEXT': {
            const byText = new Map<string, number>();
            for (const v of votes) {
              const t = (v.freeText ?? '').trim() || '(leer)';
            byText.set(t, (byText.get(t) ?? 0) + 1);
            }
            freetextAggregates = Array.from(byText.entries(), ([text, count]) => ({ text, count }));
            break;
          }
          case 'RATING': {
            const dist: Record<string, number> = {};
            let sum = 0;
            for (const v of votes) {
              if (v.ratingValue !== null && v.ratingValue !== undefined) {
                const key = String(v.ratingValue);
                dist[key] = (dist[key] ?? 0) + 1;
                sum += v.ratingValue;
              }
            }
            ratingDistribution = Object.keys(dist).length > 0 ? dist : undefined;
            if (votes.length > 0 && Object.keys(dist).length > 0) {
              ratingAverage = Math.round((sum / votes.length) * 100) / 100;
              const avg = sum / votes.length;
              let variance = 0;
              for (const v of votes) {
                if (v.ratingValue !== null && v.ratingValue !== undefined) {
                  variance += (v.ratingValue - avg) ** 2;
                }
              }
              ratingStandardDeviation =
                Math.round(Math.sqrt(variance / votes.length) * 100) / 100;
            }
            break;
          }
          case 'SURVEY':
            // Keine spezielle Verteilung im Export-Schema; participantCount reicht
            break;
          default:
            break;
        }

        if (votes.length > 0 && votes.some((v) => v.score !== undefined && v.score > 0)) {
          const totalScore = votes.reduce((a, v) => a + (v.score ?? 0), 0);
          averageScore = Math.round((totalScore / votes.length) * 100) / 100;
        }

        return {
          questionOrder: q.order,
          questionTextShort: q.text.slice(0, QUESTION_TEXT_SHORT_MAX),
          type: q.type,
          participantCount,
          optionDistribution,
          freetextAggregates,
          ratingDistribution,
          ratingAverage,
          ratingStandardDeviation,
          averageScore,
        };
      });

      const bonusTokens: BonusTokenEntryDTO[] | undefined = session.bonusTokens.length
        ? session.bonusTokens.map((t) => ({
            token: t.token,
            nickname: t.nickname,
            quizName: t.quizName,
            totalScore: t.totalScore,
            rank: t.rank,
            generatedAt: t.generatedAt.toISOString(),
          }))
        : undefined;

      const result: SessionExportDTO = {
        sessionId: session.id,
        sessionCode: session.code,
        quizName,
        finishedAt: session.endedAt?.toISOString() ?? new Date().toISOString(),
        participantCount: session.participants.length,
        questions: questionEntries,
        bonusTokens,
      };

      return result;
    }),
});
