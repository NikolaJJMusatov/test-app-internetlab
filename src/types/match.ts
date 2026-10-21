export type Team = {
  id: string;
  name: string;
  city: string;
};

/** Счёт. Ноль — валидное значение (0:0 не значит «счёта нет»). */
export type Score = {
  home: number;
  away: number;
};

type MatchBase = {
  id: string;
  home: Team;
  away: Team;
};

export type ScheduledMatch = MatchBase & {
  status: 'scheduled';
  startsAt: string;
  score: null;
};

export type FinishedMatch = MatchBase & {
  status: 'finished';
  startsAt: string;
  score: Score;
};

export type LiveMatch = MatchBase & {
  status: 'live';
  startsAt: string;
  score: Score;
  minute?: number;
};

export type PostponedMatch = MatchBase & {
  status: 'postponed';
  /** Перенесённый матч может быть без даты. */
  startsAt: string | null;
  score: null;
};

export type Match = ScheduledMatch | FinishedMatch | LiveMatch | PostponedMatch;

export type MatchStatus = Match['status'];
