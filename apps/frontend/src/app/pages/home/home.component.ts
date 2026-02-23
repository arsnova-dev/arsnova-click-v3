import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trpc } from '../../trpc.client';
import { ServerStatusWidgetComponent } from '../../components/server-status-widget/server-status-widget.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule, ServerStatusWidgetComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center dark:bg-gray-900 dark:shadow-gray-950">
        <h1 class="text-3xl font-bold text-gray-800 mb-2 dark:text-gray-100">arsnova.click</h1>
        <p class="text-gray-500 mb-6 dark:text-gray-400">V3 – Interaktive Quiz-Plattform</p>

        <div class="bg-green-100 text-green-800 rounded-lg p-3 text-sm font-medium dark:bg-green-900 dark:text-green-200">
          ✅ Frontend läuft!
        </div>

        @if (apiStatus()) {
          <div class="mt-3 bg-blue-100 text-blue-800 rounded-lg p-3 text-sm font-medium dark:bg-blue-900 dark:text-blue-200">
            ✅ Backend verbunden ({{ apiStatus() }})
            @if (redisStatus(); as r) {
              · Redis {{ r }}
            }
          </div>
        } @else {
          <div class="mt-3 bg-yellow-100 text-yellow-800 rounded-lg p-3 text-sm font-medium dark:bg-yellow-900 dark:text-yellow-200">
            ⏳ Backend wird kontaktiert…
          </div>
        }

        <!-- Session beitreten -->
        <div class="mt-6">
          <label for="session-code" class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
            Session beitreten
          </label>
          <div class="flex gap-2">
            <input
              id="session-code"
              type="text"
              maxlength="6"
              [(ngModel)]="sessionCode"
              placeholder="6-stelliger Code"
              class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-center text-lg font-mono uppercase tracking-widest
                     focus:outline-none focus:ring-2 focus:ring-indigo-500
                     dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              (keydown.enter)="joinSession()"
              aria-label="Session-Code eingeben"
            />
            <button
              (click)="joinSession()"
              [disabled]="sessionCode().length !== 6"
              class="rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium
                     hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                     dark:focus:ring-offset-gray-900"
              aria-label="Session beitreten"
            >
              Los
            </button>
          </div>
          @if (joinError()) {
            <p class="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">{{ joinError() }}</p>
          }
        </div>

        <!-- Dozent: Quiz erstellen -->
        <div class="mt-6">
          <a
            routerLink="/quiz"
            class="block w-full rounded-lg border-2 border-indigo-600 px-4 py-2 text-indigo-600 font-medium
                   hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500
                   dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-gray-800"
          >
            Quiz erstellen / verwalten
          </a>
        </div>

        <div class="mt-4">
          <app-server-status-widget />
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  apiStatus = signal<string | null>(null);
  redisStatus = signal<string | null>(null);
  sessionCode = signal('');
  joinError = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      const health = await trpc.health.check.query();
      this.apiStatus.set(health.status);
      this.redisStatus.set(health.redis ?? null);
    } catch {
      this.apiStatus.set(null);
    }
  }

  joinSession(): void {
    const code = this.sessionCode().trim().toUpperCase();
    if (code.length !== 6) return;
    this.joinError.set(null);
    window.location.href = `/session/${code}`;
  }
}
