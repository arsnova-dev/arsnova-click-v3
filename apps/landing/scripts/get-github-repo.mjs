#!/usr/bin/env node
/**
 * Gibt owner/repo des Git-Remote "origin" aus (für PUBLIC_GITHUB_REPO).
 * Nutzung: PUBLIC_GITHUB_REPO=$(node scripts/get-github-repo.mjs) npm run build
 */
import { execSync } from 'child_process';

try {
  const url = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
  // https://github.com/owner/repo.git oder git@github.com:owner/repo.git
  const match = url.match(/github\.com[:/]([\w.-]+\/[\w.-]+?)(?:\.git)?$/i);
  if (match) {
    console.log(match[1]);
  }
} catch {
  // Fallback, wenn kein origin oder kein Git
  process.exit(1);
}
