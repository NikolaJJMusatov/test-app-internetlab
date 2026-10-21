import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useMatches } from '../hooks/useMatches';

// Экран «Матчи тура» — задание в README.md, часть 1.
export function MatchesScreen() {
  const { state, reload } = useMatches();

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
  } else if (state.matches.length === 0) {
    body = (
      <View style={styles.centered}>
        <Text style={styles.message}>Матчей пока нет</Text>
      </View>
    );
  } else {
    body = <Text style={styles.placeholder}>Загружено матчей: {state.matches.length}</Text>;
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
  placeholder: {
    marginTop: 16,
    fontSize: 16,
    color: '#111827',
  },
});
