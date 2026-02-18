import { Component, OnInit, signal } from '@angular/core';
import { trpc } from './trpc.client';

/**
 * Root-Komponente: Zeigt den Verbindungsstatus zu Frontend & Backend.
 * Demonstriert: Standalone Component, Angular Signals, @if, Tailwind CSS, tRPC-Client.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">🚀 arsnova.click</h1>
        <p class="text-gray-500 mb-6">V3 – Vibe Coding Edition</p>

        <div class="bg-green-100 text-green-800 rounded-lg p-3 text-sm font-medium">
          ✅ Frontend läuft!
        </div>

        @if (apiStatus()) {
          <div class="mt-3 bg-blue-100 text-blue-800 rounded-lg p-3 text-sm font-medium">
            ✅ Backend verbunden ({{ apiStatus() }})
          </div>
        } @else {
          <div class="mt-3 bg-yellow-100 text-yellow-800 rounded-lg p-3 text-sm font-medium">
            ⏳ Backend wird kontaktiert…
          </div>
        }

        <p class="mt-6 text-xs text-gray-400">
          Lies die
          <code class="bg-gray-100 px-1 py-0.5 rounded">AGENT.md</code>
          bevor du loslegst!
        </p>
      </div>
    </div>
  `,
})
export class AppComponent implements OnInit {
  /** Reaktiver Status des Backend Health-Checks (Angular Signal) */
  apiStatus = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      const health = await trpc.health.check.query();
      this.apiStatus.set(health.status);
    } catch {
      this.apiStatus.set(null);
    }
  }
}
