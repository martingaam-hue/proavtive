// Phase 3 / Plan 03-01 — Vitest global setup. RTL + jest-dom matchers + cleanup hook.
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
