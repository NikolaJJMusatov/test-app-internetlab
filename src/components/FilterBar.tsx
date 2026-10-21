import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MatchFilter } from '../utils/filterMatches';

const TABS: { id: MatchFilter; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'upcoming', label: 'Предстоящие' },
  { id: 'finished', label: 'Завершённые' },
];

type Props = {
  value: MatchFilter;
  onChange: (tab: MatchFilter) => void;
};

export function FilterBar({ value, onChange }: Props) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {TABS.map((tab) => {
        const selected = tab.id === value;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={tab.label}
            style={[styles.tab, selected && styles.tabSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  tabSelected: {
    backgroundColor: '#ef3124',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  labelSelected: {
    color: '#fff',
  },
});
