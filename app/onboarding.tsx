import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Leaf } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useHabits } from '@/contexts/HabitContext';

export default function OnboardingScreen() {
  const [name, setName] = useState<string>('');
  const { updateProfile } = useHabits();

  const handleGetStarted = () => {
    if (name.trim()) {
      updateProfile({
        name: name.trim(),
        joinedAt: new Date().toISOString(),
      });
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Leaf size={80} color={colors.primary} strokeWidth={1.5} />
        </View>
        
        <Text style={styles.title}>Welcome to Habit Tracker</Text>
        <Text style={styles.subtitle}>
          Build better habits, one day at a time
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>What should we call you?</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="words"
            autoFocus
          />
        </View>

        <Pressable
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          onPress={handleGetStarted}
          disabled={!name.trim()}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 48,
  },
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600' as const,
  },
});
