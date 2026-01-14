import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useHabits } from '@/contexts/HabitContext';

export default function TodayScreen() {
  const { habits, toggleCompletion, getStreak } = useHabits();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const dateStr = selectedDate.toISOString().split('T')[0];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const todayHabits = habits.filter((habit) => {
    if (habit.frequency === 'daily') return true;
    if (habit.frequency === 'weekly' && habit.weekDays) {
      return habit.weekDays.includes(selectedDate.getDay());
    }
    return true;
  });

  const completedCount = todayHabits.filter(
    (h) => h.completions[dateStr]
  ).length;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Today</Text>
          <Text style={styles.date}>
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long',
              day: 'numeric' 
            })}
          </Text>
        </View>
        {todayHabits.length > 0 && (
          <View style={styles.progressBadge}>
            <Text style={styles.progressText}>
              {completedCount}/{todayHabits.length}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.weekSelector}>
        {weekDates.map((date, index) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <Pressable
              key={index}
              style={[
                styles.dayButton,
                isSelected && styles.dayButtonSelected,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[
                styles.dayLabel,
                isSelected && styles.dayLabelSelected,
              ]}>
                {weekDays[date.getDay()]}
              </Text>
              <Text style={[
                styles.dayNumber,
                isSelected && styles.dayNumberSelected,
                isToday && !isSelected && styles.dayNumberToday,
              ]}>
                {date.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {todayHabits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No habits for today</Text>
            <Text style={styles.emptySubtext}>
              Add habits to start tracking
            </Text>
          </View>
        ) : (
          <View style={styles.habitsList}>
            {todayHabits.map((habit) => {
              const isCompleted = habit.completions[dateStr];
              const streak = getStreak(habit.id);

              return (
                <Pressable
                  key={habit.id}
                  style={[
                    styles.habitCard,
                    isCompleted && styles.habitCardCompleted,
                  ]}
                  onPress={() => toggleCompletion(habit.id, dateStr)}
                >
                  <View style={styles.habitLeft}>
                    <View
                      style={[
                        styles.colorIndicator,
                        { backgroundColor: habit.color },
                      ]}
                    />
                    <View style={styles.habitInfo}>
                      <Text style={[
                        styles.habitName,
                        isCompleted && styles.habitNameCompleted,
                      ]}>
                        {habit.name}
                      </Text>
                      {streak > 0 && (
                        <Text style={styles.streakText}>
                          🔥 {streak} day streak
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.checkIcon}>
                    {isCompleted ? (
                      <CheckCircle2
                        size={28}
                        color={habit.color}
                        fill={habit.color}
                      />
                    ) : (
                      <Circle size={28} color={colors.border} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.text,
  },
  date: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 4,
  },
  progressBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  weekSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 8,
  },
  dayButton: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  dayButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dayLabelSelected: {
    color: '#FFFFFF',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  dayNumberSelected: {
    color: '#FFFFFF',
  },
  dayNumberToday: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  habitsList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  habitCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  habitCardCompleted: {
    opacity: 0.7,
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 16,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  habitNameCompleted: {
    textDecorationLine: 'line-through',
  },
  streakText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  checkIcon: {
    marginLeft: 12,
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
