type Entry = {
  count: number;
  lastAttempt: number;
};

const WINDOW_MS = 5 * 60 * 1000; // 5 minutos
const MAX_ATTEMPTS = 5;

const attempts = new Map<string, Entry>();

export function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry) {
    attempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }

  if (now - entry.lastAttempt > WINDOW_MS) {
    attempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return false;
  }

  entry.count++;
  entry.lastAttempt = now;
  attempts.set(ip, entry);
  return true;
}
