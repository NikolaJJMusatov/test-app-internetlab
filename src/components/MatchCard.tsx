import { StyleSheet, Text, View } from 'react-native';
import type { Match } from '../types/match';

const startsAtFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

function formatStartsAt(startsAt: string | null): string {
  if (startsAt === null) {
    return 'дата не назначена';
  }
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) {
    return 'дата не назначена';
  }
  return startsAtFormatter.format(date);
}

function formatStatus(match: Match): string {
  switch (match.status) {
    case 'scheduled':
      return 'Запланирован';
    case 'finished':
      return 'Завершён';
    case 'postponed':
      return 'Перенесён';
    case 'live':
      return match.minute === undefined ? 'Идёт' : `Идёт · ${match.minute}′`;
  }
}

type Props = {
  match: Match;
};

export function MatchCard({ match }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.teams}>
        <Text style={styles.team} numberOfLines={1}>
          {match.home.name}
        </Text>
        {match.score !== null ? (
          <Text style={styles.score}>
            {match.score.home}:{match.score.away}
          </Text>
        ) : (
          <Text style={styles.versus}>—</Text>
        )}
        <Text style={[styles.team, styles.away]} numberOfLines={1}>
          {match.away.name}
        </Text>
      </View>
      <Text style={styles.meta}>{formatStartsAt(match.startsAt)}</Text>
      <Text style={styles.status}>{formatStatus(match)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
  },
  teams: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  team: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  away: {
    textAlign: 'right',
  },
  score: {
    minWidth: 48,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  versus: {
    minWidth: 48,
    textAlign: 'center',
    fontSize: 16,
    color: '#9ca3af',
  },
  meta: {
    fontSize: 13,
    color: '#6b7280',
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
});
