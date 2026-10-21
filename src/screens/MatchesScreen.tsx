import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FilterBar } from '../components/FilterBar';
import { MatchCard } from '../components/MatchCard';
import { UpdatedAgo } from '../components/UpdatedAgo';
import { useFavorites } from '../hooks/useFavorites';
import { useMatches } from '../hooks/useMatches';
import type { Match } from '../types/match';
import { filterMatches, type MatchFilter } from '../utils/filterMatches';

function keyExtractor(item: Match) {
  return item.id;
}

// Экран «Матчи тура» — задание в README.md, часть 1.
export function MatchesScreen() {
  const { state, refreshing, reload } = useMatches();
  const { favorites, isFavorite, toggle } = useFavorites();
  const [tab, setTab] = useState<MatchFilter>('all');
  const [refreshHovered, setRefreshHovered] = useState(false);

  const renderMatch = ({ item }: { item: Match }) => (
    <MatchCard
      match={item}
      favorite={isFavorite(item.id)}
      onToggleFavorite={() => toggle(item.id)}
    />
  );

  const visibleMatches = useMemo(() => {
    if (state.status !== 'success') {
      return [];
    }
    return filterMatches(state.matches, tab);
  }, [state, tab]);

  const refreshControl = (
    <RefreshControl refreshing={refreshing} onRefresh={reload} />
  );

  let body = null;
  if (state.status === 'loading') {
    body = (
      <View style={styles.centered}>
        <ActivityIndicator size="large" accessibilityLabel="Загрузка" />
      </View>
    );
  } else if (state.status === 'error') {
    body = (
      <View style={styles.centered}>
        <Text style={styles.message}>{state.message}</Text>
        <Pressable
          onPress={reload}
          accessibilityRole="button"
          accessibilityLabel="Повторить"
          style={styles.retryButton}
        >
          <Text style={styles.retryLabel}>Повторить</Text>
        </Pressable>
      </View>
    );
  } else {
    body = (
      <>
        <FilterBar value={tab} onChange={setTab} />
        <Pressable
          onPress={reload}
          onHoverIn={() => setRefreshHovered(true)}
          onHoverOut={() => setRefreshHovered(false)}
          accessibilityRole="button"
          accessibilityLabel="Обновить"
          style={({ pressed }) => [
            styles.refreshButton,
            refreshHovered && styles.refreshButtonHovered,
            pressed && styles.refreshButtonPressed,
          ]}
        >
          <Text style={[styles.refreshLabel, refreshHovered && styles.refreshLabelHovered]}>
            Обновить
          </Text>
          <UpdatedAgo since={state.updatedAt} />
        </Pressable>
        {visibleMatches.length === 0 ? (
          <ScrollView
            contentContainerStyle={styles.centered}
            refreshControl={refreshControl}
          >
            <Text style={styles.message}>Матчей пока нет</Text>
          </ScrollView>
        ) : (
          <FlatList
            data={visibleMatches}
            keyExtractor={keyExtractor}
            renderItem={renderMatch}
            extraData={favorites}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            refreshControl={refreshControl}
          />
        )}
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Матчи тура</Text>
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    ...Platform.select({
      web: {
        width: '100%',
        maxWidth: 560,
        alignSelf: 'center',
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  message: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  retryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef3124',
  },
  refreshButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  refreshButtonHovered: {
    backgroundColor: '#f3f4f6',
    borderColor: '#ef3124',
  },
  refreshButtonPressed: {
    backgroundColor: '#fee2e2',
  },
  refreshLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  refreshLabelHovered: {
    color: '#ef3124',
  },
  list: {
    flex: 1,
    marginTop: 12,
  },
  listContent: {
    gap: 10,
    paddingBottom: 24,
  },
});
