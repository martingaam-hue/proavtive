// Phase 3 / Plan 03-01 — Sample contact-form payloads for unit tests in Plan 03-03.
// Mirrors the JSON body shape declared in 03-UI-SPEC.md §6.10.
export const validHKPayload = {
  name: 'Maria Chen',
  email: 'maria@example.com',
  phone: '+852 9123 4567',
  age: '4 and 7',
  message: 'Hello — I would love to bring my children to a trial class.',
  market: 'hk' as const,
};

export const validSGPayload = {
  ...validHKPayload,
  market: 'sg' as const,
  phone: '+65 9123 4567',
};

export const honeypotPayload = {
  ...validHKPayload,
  'bot-trap': 'a-bot-filled-this',
};

export const invalidMarketPayload = {
  ...validHKPayload,
  market: 'moon' as unknown as 'hk' | 'sg',
};

export const invalidEmailPayload = {
  ...validHKPayload,
  email: 'not-an-email',
};

export const missingNamePayload = {
  ...validHKPayload,
  name: '',
};

export const tooShortMessagePayload = {
  ...validHKPayload,
  message: 'short',
};

export const careersPayload = {
  ...validHKPayload,
  subject: 'Job application',
};
