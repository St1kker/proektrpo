import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type { Habit, UserProfile } from '@/types/habit';

const HABITS_KEY = '@habits';
const PROFILE_KEY = '@profile';

export const [HabitProvider, useHabits] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const habitsQuery = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(HABITS_KEY);
      return stored ? JSON.parse(stored) : [];
    },
  });

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(PROFILE_KEY);
      return stored ? JSON.parse(stored) : null;
    },
  });

  const saveHabitsMutation = useMutation({
    mutationFn: async (newHabits: Habit[]) => {
      await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(newHabits));
      return newHabits;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  const saveProfileMutation = useMutation({
    mutationFn: async (newProfile: UserProfile) => {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
      return newProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  useEffect(() => {
    if (habitsQuery.data) {
      setHabits(habitsQuery.data);
    }
  }, [habitsQuery.data]);

  useEffect(() => {
    if (profileQuery.data) {
      setProfile(profileQuery.data);
    }
  }, [profileQuery.data]);

  const addHabit = (habit: Habit) => {
    const updated = [...habits, habit];
    setHabits(updated);
    saveHabitsMutation.mutate(updated);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    const updated = habits.map((h) => (h.id === id ? { ...h, ...updates } : h));
    setHabits(updated);
    saveHabitsMutation.mutate(updated);
  };

  const deleteHabit = (id: string) => {
    const updated = habits.filter((h) => h.id !== id);
    setHabits(updated);
    saveHabitsMutation.mutate(updated);
  };

  const toggleCompletion = (habitId: string, date: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const completions = { ...habit.completions };
    completions[date] = !completions[date];

    updateHabit(habitId, { completions });
  };

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveProfileMutation.mutate(newProfile);
  };

  const getStreak = (habitId: string): number => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return 0;

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      if (habit.completions[dateStr]) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return streak;
  };

  const getCompletionRate = (habitId: string, days: number = 30): number => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return 0;

    let completed = 0;
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      if (habit.completions[dateStr]) {
        completed++;
      }
    }

    return Math.round((completed / days) * 100);
  };

  return {
    habits,
    profile,
    isLoading: habitsQuery.isLoading || profileQuery.isLoading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    updateProfile,
    getStreak,
    getCompletionRate,
  };
});
