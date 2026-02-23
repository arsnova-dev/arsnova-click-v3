import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Quiz-Verwaltungsseite (Epic 1).
 * Platzhalter – wird mit Story 1.1 (Quiz erstellen) implementiert.
 */
@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      <div class="mx-auto max-w-2xl">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Meine Quizzes</h1>
          <a
            routerLink="/"
            class="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
            aria-label="Zurück zur Startseite"
          >
            ← Startseite
          </a>
        </div>

        <div class="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <p class="text-gray-500 dark:text-gray-400 mb-4">
            Noch keine Quizzes vorhanden.
          </p>
          <button
            class="rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium
                   hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                   dark:focus:ring-offset-gray-950"
            aria-label="Neues Quiz erstellen"
          >
            + Neues Quiz erstellen
          </button>
          <p class="mt-4 text-xs text-gray-400 dark:text-gray-500">
            Story 1.1 – Wird in Epic 1 implementiert.
          </p>
        </div>
      </div>
    </div>
  `,
})
export class QuizComponent {}
