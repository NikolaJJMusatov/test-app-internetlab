import type { Match } from '../types/match';

export type MatchFilter = 'all' | 'upcoming' | 'finished';

/** Live и postponed не входят ни в предстоящие, ни в завершённые. */
export function filterMatches(matches: Match[], tab: MatchFilter): Match[] {
  switch (tab) {
    case 'all':
      return matches;
    case 'upcoming':
      return matches.filter((match) => match.status === 'scheduled');
    case 'finished':
      return matches.filter((match) => match.status === 'finished');
  }
}
