import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useHabits } from '@/contexts/HabitContext';
import type { Habit, HabitCategory, HabitFrequency } from '@/types/habit';

export default function HabitsScreen() {
  const { habits, addHabit, deleteHabit } = useHabits();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No habits yet</Text>
            <Text style={styles.emptySubtext}>
              Create your first habit to get started
            </Text>
          </View>
        ) : (
          <View style={styles.habitsList}>
            {habits.map((habit) => (
              <View key={habit.id} style={styles.habitCard}>
                <View
                  style={[
                    styles.colorIndicator,
                    { backgroundColor: habit.color },
                  ]}
                />
                <View style={styles.habitInfo}>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <View style={styles.habitMeta}>
                    <Text style={styles.habitMetaText}>
                      {habit.frequency === 'daily' ? 'Daily' : 
                       habit.frequency === 'weekly' ? 'Weekly' : 'Custom'}
                    </Text>
                    <Text style={styles.habitMetaText}>•</Text>
                    <Text style={styles.habitMetaText}>
                      {habit.category}
                    </Text>
                  </View>
                </View>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => deleteHabit(habit.id)}
                >
                  <Trash2 size={20} color={colors.error} />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
      >
        <Plus size={24} color="#FFFFFF" />
      </Pressable>

      {isModalVisible && (
        <AddHabitModal
          onClose={() => setIsModalVisible(false)}
          onAdd={addHabit}
        />
      )}
    </View>
  );
}

function AddHabitModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (habit: Habit) => void;
}) {
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [selectedColor, setSelectedColor] = useState<string>(colors.habitColors.mint);

  const categories: HabitCategory[] = [
    'health',
    'productivity',
    'fitness',
    'mindfulness',
    'learning',
    'social',
    'other',
  ];

  const colorOptions = Object.values(colors.habitColors);

  const handleCreate = () => {
    if (!name.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: name.trim(),
      color: selectedColor,
      category,
      frequency,
      createdAt: new Date().toISOString(),
      completions: {},
    };

    onAdd(newHabit);
    onClose();
  };

  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Pressable onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </Pressable>
          <Text style={styles.modalTitle}>New Habit</Text>
          <Pressable onPress={handleCreate} disabled={!name.trim()}>
            <Text
              style={[
                styles.createButton,
                !name.trim() && styles.createButtonDisabled,
              ]}
            >
              Create
            </Text>
          </Pressable>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Habit Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Drink water"
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Color</Text>
            <View style={styles.colorGrid}>
              {colorOptions.map((color) => (
                <Pressable
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Frequency</Text>
            <View style={styles.optionsRow}>
              <Pressable
                style={[
                  styles.optionButton,
                  frequency === 'daily' && styles.optionButtonSelected,
                ]}
                onPress={() => setFrequency('daily')}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    frequency === 'daily' && styles.optionButtonTextSelected,
                  ]}
                >
                  Daily
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.optionButton,
                  frequency === 'weekly' && styles.optionButtonSelected,
                ]}
                onPress={() => setFrequency('weekly')}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    frequency === 'weekly' && styles.optionButtonTextSelected,
                  ]}
                >
                  Weekly
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Category</Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <Pressable
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.categoryButtonSelected,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      category === cat && styles.categoryButtonTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingTop: 16,
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
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
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
    marginBottom: 6,
  },
  habitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  habitMetaText: {
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  deleteButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 120,
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
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
  },
  cancelButton: {
    fontSize: 17,
    color: colors.textSecondary,
  },
  createButton: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  createButtonDisabled: {
    opacity: 0.4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.border,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: colors.text,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
  },
  optionButtonTextSelected: {
    color: '#FFFFFF',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  categoryButtonSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.text,
    textTransform: 'capitalize',
  },
  categoryButtonTextSelected: {
    color: '#FFFFFF',
  },
});
