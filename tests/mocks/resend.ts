// Phase 3 / Plan 03-01 — Vitest mock factory for Resend SDK. Used by app/api/contact/route.test.ts (Plan 03-03).
import { vi } from 'vitest';

export const mockResendSend = vi.fn().mockResolvedValue({
  data: { id: 'mock-resend-id-test' },
  error: null,
});

export const mockResendFailure = vi.fn().mockResolvedValue({
  data: null,
  error: { name: 'application_error', message: 'mock send failure' },
});

export function installResendMock(impl = mockResendSend) {
  vi.doMock('resend', () => ({
    Resend: vi.fn().mockImplementation(() => ({
      emails: { send: impl },
    })),
  }));
}
