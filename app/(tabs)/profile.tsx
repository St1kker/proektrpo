import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { User, Calendar, Award } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useHabits } from '@/contexts/HabitContext';

export default function ProfileScreen() {
  const { profile, habits, getStreak } = useHabits();

  const totalCompletions = habits.reduce((sum, habit) => {
    return sum + Object.values(habit.completions).filter(Boolean).length;
  }, 0);

  const longestStreak = Math.max(
    0,
    ...habits.map((h) => getStreak(h.id))
  );

  const joinedDays = profile
    ? Math.floor(
        (Date.now() - new Date(profile.joinedAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <User size={48} color={colors.primary} strokeWidth={1.5} />
        </View>
        <Text style={styles.name}>{profile?.name || 'User'}</Text>
        <Text style={styles.joinedText}>
          Member for {joinedDays} {joinedDays === 1 ? 'day' : 'days'}
        </Text>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statBox}>
          <View style={[styles.statIconContainer, { backgroundColor: '#E8F5E9' }]}>
            <Calendar size={24} color={colors.primary} />
          </View>
          <Text style={styles.statValue}>{habits.length}</Text>
          <Text style={styles.statLabel}>Active Habits</Text>
        </View>

        <View style={styles.statBox}>
          <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
            <Award size={24} color="#FF9800" />
          </View>
          <Text style={styles.statValue}>{totalCompletions}</Text>
          <Text style={styles.statLabel}>Completions</Text>
        </View>

        <View style={styles.statBox}>
          <View style={[styles.statIconContainer, { backgroundColor: '#FFEBEE' }]}>
            <Text style={styles.statEmoji}>🔥</Text>
          </View>
          <Text style={styles.statValue}>{longestStreak}</Text>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <Text style={styles.aboutText}>
            Keep building your habits one day at a time. Consistency is key to
            lasting change. Track your progress, celebrate your wins, and keep
            growing!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  name: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  joinedText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 32,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statEmoji: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.border,
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
});
