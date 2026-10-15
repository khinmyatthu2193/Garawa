import 'server-only';
import { createHash, randomBytes } from 'node:crypto';

const tokenPattern = /^[A-Za-z0-9_-]{43,64}$/;

export function createShareToken() {
  const raw = randomBytes(32).toString('base64url');
  return { raw, hash: hashShareToken(raw) };
}

export function hashShareToken(raw: string) {
  return createHash('sha256').update(raw).digest('hex');
}

export function isValidShareToken(raw: string) {
  return tokenPattern.test(raw);
}
