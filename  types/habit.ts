export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export type HabitCategory = 'health' | 'productivity' | 'fitness' | 'mindfulness' | 'learning' | 'social' | 'other';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  weekDays?: number[];
  createdAt: string;
  completions: {
    [date: string]: boolean;
  };
}

export interface UserProfile {
  name: string;
  joinedAt: string;
}
