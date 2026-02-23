import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { trpc } from '../../trpc.client';
import type { SessionInfoDTO } from '@arsnova/shared-types';

/**
 * Session-Seite (Epic 2 + 3).
 * Platzhalter – zeigt Session-Info per Code an.
 * Wird mit Story 2.2 (Lobby), 2.3 (Steuerung), 3.1 (Beitreten) erweitert.
 */
@Component({
  selector: 'app-session',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      <div class="mx-auto max-w-md">
        <a
          routerLink="/"
          class="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
          aria-label="Zurück zur Startseite"
        >
          ← Startseite
        </a>

        @if (loading()) {
          <div class="mt-8 text-center">
            <p class="text-gray-500 dark:text-gray-400">Session wird geladen…</p>
          </div>
        } @else if (error()) {
          <div class="mt-8 rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900 dark:text-red-200" role="alert">
            <p class="font-medium">Fehler</p>
            <p class="text-sm mt-1">{{ error() }}</p>
          </div>
        } @else if (session(); as s) {
          <div class="mt-8 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <div class="text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">Session-Code</p>
              <p class="text-4xl font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
                {{ s.code }}
              </p>
            </div>
            <div class="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><span class="font-medium">Status:</span> {{ s.status }}</p>
              <p><span class="font-medium">Typ:</span> {{ s.type }}</p>
              @if (s.quizName) {
                <p><span class="font-medium">Quiz:</span> {{ s.quizName }}</p>
              }
              <p><span class="font-medium">Teilnehmer:</span> {{ s.participantCount }}</p>
            </div>
            <p class="mt-6 text-xs text-gray-400 dark:text-gray-500 text-center">
              Lobby, Steuerung und Abstimmung werden in Epic 2 + 3 implementiert.
            </p>
          </div>
        }
      </div>
    </div>
  `,
})
export class SessionComponent implements OnInit {
  session = signal<SessionInfoDTO | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    const code = this.route.snapshot.paramMap.get('code') ?? '';
    if (code.length !== 6) {
      this.error.set('Ungültiger Session-Code.');
      this.loading.set(false);
      return;
    }
    try {
      const info = await trpc.health.check.query();
      if (info.status !== 'ok') throw new Error('Backend nicht erreichbar');
      const session = await trpc.session.getInfo.query({ code: code.toUpperCase() });
      this.session.set(session);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Session nicht gefunden.';
      this.error.set(msg);
    } finally {
      this.loading.set(false);
    }
  }
}
