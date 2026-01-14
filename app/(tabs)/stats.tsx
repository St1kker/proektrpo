import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { TrendingUp, Flame, Target } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useHabits } from '@/contexts/HabitContext';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const { habits, getStreak, getCompletionRate } = useHabits();

  const totalHabits = habits.length;
  const totalCompletions = habits.reduce((sum, habit) => {
    return sum + Object.values(habit.completions).filter(Boolean).length;
  }, 0);

  const longestStreak = Math.max(
    0,
    ...habits.map((h) => getStreak(h.id))
  );

  const avgCompletionRate =
    habits.length > 0
      ? Math.round(
          habits.reduce((sum, h) => sum + getCompletionRate(h.id, 30), 0) /
            habits.length
        )
      : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Last 30 days</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
            <Target size={24} color={colors.primary} />
          </View>
          <Text style={styles.statValue}>{totalHabits}</Text>
          <Text style={styles.statLabel}>Active Habits</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
            <Flame size={24} color="#FF9800" />
          </View>
          <Text style={styles.statValue}>{longestStreak}</Text>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
            <TrendingUp size={24} color="#2196F3" />
          </View>
          <Text style={styles.statValue}>{avgCompletionRate}%</Text>
          <Text style={styles.statLabel}>Completion Rate</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#F3E5F5' }]}>
            <Text style={styles.statEmoji}>✓</Text>
          </View>
          <Text style={styles.statValue}>{totalCompletions}</Text>
          <Text style={styles.statLabel}>Total Completions</Text>
        </View>
      </View>

      {habits.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habit Details</Text>
          {habits.map((habit) => {
            const streak = getStreak(habit.id);
            const rate = getCompletionRate(habit.id, 30);

            return (
              <View key={habit.id} style={styles.habitDetailCard}>
                <View style={styles.habitDetailHeader}>
                  <View style={styles.habitDetailLeft}>
                    <View
                      style={[
                        styles.habitColorDot,
                        { backgroundColor: habit.color },
                      ]}
                    />
                    <Text style={styles.habitDetailName}>{habit.name}</Text>
                  </View>
                </View>

                <View style={styles.habitDetailStats}>
                  <View style={styles.habitDetailStat}>
                    <Text style={styles.habitDetailStatValue}>{streak}</Text>
                    <Text style={styles.habitDetailStatLabel}>Current Streak</Text>
                  </View>
                  <View style={styles.habitDetailStat}>
                    <Text style={styles.habitDetailStatValue}>{rate}%</Text>
                    <Text style={styles.habitDetailStatLabel}>Completion</Text>
                  </View>
                </View>

                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${rate}%`,
                        backgroundColor: habit.color,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      )}

      {habits.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No data yet</Text>
          <Text style={styles.emptySubtext}>
            Start tracking habits to see your progress
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 18,
    gap: 12,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.border,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statEmoji: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
  },
  habitDetailCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  habitDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  habitDetailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  habitDetailName: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
  },
  habitDetailStats: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 24,
  },
  habitDetailStat: {
    flex: 1,
  },
  habitDetailStatValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  habitDetailStatLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
