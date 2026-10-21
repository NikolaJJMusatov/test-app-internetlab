import type { Match, Score, Team } from '../types/match';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseTeam(value: unknown): Team | null {
  if (!isRecord(value)) {
    return null;
  }
  if (typeof value.id !== 'string' || value.id.length === 0) {
    return null;
  }
  if (typeof value.name !== 'string' || value.name.length === 0) {
    return null;
  }
  if (typeof value.city !== 'string') {
    return null;
  }
  return { id: value.id, name: value.name, city: value.city };
}

function isValidScoreNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

/**
 * null — счёта нет (ещё не играли).
 * { home: 0, away: 0 } — сыграли 0:0, это не отсутствие счёта.
 * undefined — поле битое, карточку нельзя принять.
 */
function parseScore(value: unknown): Score | null | undefined {
  if (value === null || value === undefined) {
    return null;
  }
  if (!isRecord(value) || !isValidScoreNumber(value.home) || !isValidScoreNumber(value.away)) {
    return undefined;
  }
  return { home: value.home, away: value.away };
}

function parseIsoDate(value: unknown): string | null | undefined {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== 'string' || value.length === 0) {
    return undefined;
  }
  if (Number.isNaN(Date.parse(value))) {
    return undefined;
  }
  return value;
}

function parseMinute(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return undefined;
  }
  return value;
}

function parseMatch(value: unknown): Match | null {
  if (!isRecord(value)) {
    return null;
  }
  if (typeof value.id !== 'string' || value.id.length === 0) {
    return null;
  }
  if (typeof value.status !== 'string') {
    return null;
  }

  const home = parseTeam(value.home);
  const away = parseTeam(value.away);
  if (!home || !away) {
    return null;
  }

  const startsAt = parseIsoDate(value.startsAt);
  if (startsAt === undefined) {
    return null;
  }

  const score = parseScore(value.score);
  if (score === undefined) {
    return null;
  }

  const id = value.id;

  switch (value.status) {
    case 'scheduled': {
      if (startsAt === null) {
        return null;
      }
      return { id, status: 'scheduled', startsAt, home, away, score: null };
    }
    case 'finished': {
      if (startsAt === null || score === null) {
        return null;
      }
      return { id, status: 'finished', startsAt, home, away, score };
    }
    case 'live': {
      if (startsAt === null || score === null) {
        return null;
      }
      const minute = parseMinute(value.minute);
      if (minute === undefined) {
        return { id, status: 'live', startsAt, home, away, score };
      }
      return { id, status: 'live', startsAt, home, away, score, minute };
    }
    case 'postponed': {
      return { id, status: 'postponed', startsAt, home, away, score: null };
    }
    default:
      return null;
  }
}

/** Разбирает тело ответа `{ matches: unknown[] }`. Битые карточки пропускает. */
export function parseMatches(data: unknown): Match[] {
  if (!isRecord(data) || !Array.isArray(data.matches)) {
    throw new Error('Ответ сервера должен содержать массив matches');
  }

  const matches: Match[] = [];
  for (const item of data.matches) {
    const match = parseMatch(item);
    if (match !== null) {
      matches.push(match);
    }
  }
  return matches;
}
