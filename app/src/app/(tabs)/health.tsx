import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  LayoutAnimation, 
  UIManager, 
  Platform, 
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, ChevronUp, Check, Plus, Circle, CheckCircle2, Feather, Heart, Sun } from 'lucide-react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const COLORS = {
  background: '#FCFAF8',
  card: '#FFFFFF',
  primary: '#1C2A3A',
  accent: '#D9A05B',
  divider: '#ECECEC',
  success: '#D9A05B',
  text: '#1C2A3A',
  textSecondary: '#8C8C8C',
  textTertiary: '#A0A0A0',
};

const FONTS = {
  heading: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  title: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  body: 'System',
  prompt: Platform.OS === 'ios' ? 'Georgia' : 'serif',
};

export default function DailyPracticeScreen() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Habits State
  const [habits, setHabits] = useState([
    { id: '1', label: 'Meditation', completed: false },
    { id: '2', label: 'Drink Water', completed: true },
    { id: '3', label: 'Walk', completed: false },
    { id: '4', label: 'Read Wisdom', completed: false },
    { id: '5', label: 'Journal', completed: false },
  ]);
  const [showAddHabit, setShowAddHabit] = useState(false);

  // Journal State
  const [journalText, setJournalText] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);
  const currentPrompt = "What brought peace today?";

  // Gratitude State
  const [gratitudes, setGratitudes] = useState(['', '', '']);
  const isGratitudeComplete = gratitudes.every(g => g.trim().length > 0);

  const toggleExpand = (card: string) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        300,
        LayoutAnimation.Types.spring,
        LayoutAnimation.Properties.opacity
      )
    );
    if (expandedCard === card) {
      setExpandedCard(null);
    } else {
      setExpandedCard(card);
    }
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const completedHabits = habits.filter(h => h.completed).length;

  const saveJournal = () => {
    setJournalSaved(true);
    toggleExpand('journal');
  };

  const updateGratitude = (text: string, index: number) => {
    const newG = [...gratitudes];
    newG[index] = text;
    setGratitudes(newG);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Daily Practice</Text>
            <Text style={styles.headerSubtitle}>Small daily reflections create lifelong transformation.</Text>
          </View>

          {/* 1. Daily Habits Card */}
          <View style={styles.card}>
            <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpand('habits')} activeOpacity={0.7}>
              <View style={styles.cardHeaderLeft}>
                <Sun color={COLORS.primary} size={24} strokeWidth={1.5} />
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>Daily Habits</Text>
                  <Text style={styles.cardMeta}>{completedHabits} / {habits.length} Completed</Text>
                </View>
              </View>
              {expandedCard === 'habits' ? (
                <ChevronUp color={COLORS.textTertiary} size={24} strokeWidth={1.5} />
              ) : (
                <ChevronDown color={COLORS.textTertiary} size={24} strokeWidth={1.5} />
              )}
            </TouchableOpacity>

            {expandedCard === 'habits' && (
              <View style={styles.expandedContent}>
                <View style={styles.goldDivider} />
                
                {habits.map((habit) => (
                  <TouchableOpacity 
                    key={habit.id} 
                    style={styles.habitRow} 
                    onPress={() => toggleHabit(habit.id)}
                    activeOpacity={0.7}
                  >
                    {habit.completed ? (
                      <CheckCircle2 color={COLORS.accent} size={24} fill="transparent" strokeWidth={1.5} />
                    ) : (
                      <Circle color={COLORS.textTertiary} size={24} strokeWidth={1.5} />
                    )}
                    <Text style={[styles.habitLabel, habit.completed && styles.habitLabelCompleted]}>
                      {habit.label}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity 
                  style={styles.addHabitButton}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setShowAddHabit(!showAddHabit);
                  }}
                >
                  <Plus color={COLORS.accent} size={16} strokeWidth={2} />
                  <Text style={styles.addHabitText}>Add Habit</Text>
                </TouchableOpacity>

                {showAddHabit && (
                  <View style={styles.habitChipsContainer}>
                    {['Walking', 'Sleep', 'Nutrition', 'Exercise', 'Nature'].map((chip) => (
                      <TouchableOpacity 
                        key={chip} 
                        style={styles.habitChip}
                        onPress={() => {
                          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                          setHabits([...habits, { id: Math.random().toString(), label: chip, completed: false }]);
                          setShowAddHabit(false);
                        }}
                      >
                        <Text style={styles.habitChipText}>{chip}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>

          {/* 2. Journal Reflection Card */}
          <View style={styles.card}>
            <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpand('journal')} activeOpacity={0.7}>
              <View style={styles.cardHeaderLeft}>
                <Feather color={COLORS.primary} size={24} strokeWidth={1.5} />
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>Journal Reflection</Text>
                  {journalSaved ? (
                    <Text style={[styles.cardMeta, { color: COLORS.success }]}>✓ Saved Today</Text>
                  ) : (
                    <Text style={styles.cardMeta}>"{currentPrompt}"</Text>
                  )}
                </View>
              </View>
              {expandedCard === 'journal' ? (
                <ChevronUp color={COLORS.textTertiary} size={24} strokeWidth={1.5} />
              ) : (
                <ChevronDown color={COLORS.textTertiary} size={24} strokeWidth={1.5} />
              )}
            </TouchableOpacity>

            {expandedCard === 'journal' && (
              <View style={styles.expandedContent}>
                <View style={styles.goldDivider} />
                
                <Text style={styles.journalPromptText}>{currentPrompt}</Text>
                
                <TextInput
                  style={styles.journalInput}
                  multiline
                  placeholder="Begin writing here..."
                  placeholderTextColor={COLORS.textTertiary}
                  value={journalText}
                  onChangeText={setJournalText}
                  autoFocus={false}
                  selectionColor={COLORS.accent}
                />

                <View style={styles.journalFooter}>
                  <Text style={styles.charCount}>{journalText.length} characters</Text>
                  <View style={styles.journalActions}>
                    <TouchableOpacity onPress={() => toggleExpand('journal')} style={styles.actionBtn}>
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={saveJournal} style={styles.saveBtn}>
                      <Text style={styles.saveBtnText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* 3. Gratitude Card */}
          <View style={styles.card}>
            <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpand('gratitude')} activeOpacity={0.7}>
              <View style={styles.cardHeaderLeft}>
                <Heart color={COLORS.primary} size={24} strokeWidth={1.5} />
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>Gratitude</Text>
                  {isGratitudeComplete && expandedCard !== 'gratitude' ? (
                    <Text style={styles.cardMeta}>{gratitudes.join(', ')}</Text>
                  ) : (
                    <Text style={styles.cardMeta}>Add three blessings today</Text>
                  )}
                </View>
              </View>
              {expandedCard === 'gratitude' ? (
                <ChevronUp color={COLORS.textTertiary} size={24} strokeWidth={1.5} />
              ) : (
                <ChevronDown color={COLORS.textTertiary} size={24} strokeWidth={1.5} />
              )}
            </TouchableOpacity>

            {expandedCard === 'gratitude' && (
              <View style={styles.expandedContent}>
                <View style={styles.goldDivider} />
                
                {!isGratitudeComplete ? (
                  <View style={styles.gratitudeList}>
                    {[0, 1, 2].map((index) => (
                      <View key={index} style={styles.gratitudeRow}>
                        <Text style={styles.gratitudeNumber}>{index + 1}.</Text>
                        <TextInput
                          style={styles.gratitudeInput}
                          placeholder="What are you thankful for?"
                          placeholderTextColor={COLORS.textTertiary}
                          value={gratitudes[index]}
                          onChangeText={(text) => updateGratitude(text, index)}
                          maxLength={40}
                          selectionColor={COLORS.accent}
                        />
                        {gratitudes[index].trim().length > 0 && (
                          <Check color={COLORS.accent} size={20} strokeWidth={2} />
                        )}
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.gratitudeSuccess}>
                    <Text style={styles.successEmoji}>✧</Text>
                    <Text style={styles.successText}>Today's Gratitude Completed</Text>
                  </View>
                )}
              </View>
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: FONTS.heading,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(236, 236, 236, 0.5)', // Very subtle border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    backgroundColor: COLORS.card,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitleContainer: {
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: FONTS.title,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  cardMeta: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
  },
  expandedContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  goldDivider: {
    width: 24,
    height: 2,
    backgroundColor: COLORS.accent,
    marginBottom: 24,
    opacity: 0.6,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  habitLabel: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: COLORS.text,
    marginLeft: 16,
  },
  habitLabelCompleted: {
    color: COLORS.textTertiary,
    textDecorationLine: 'line-through',
  },
  addHabitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8,
  },
  addHabitText: {
    fontSize: 15,
    fontFamily: FONTS.body,
    color: COLORS.accent,
    marginLeft: 8,
    fontWeight: '500',
  },
  habitChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 10,
  },
  habitChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  habitChipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  journalPromptText: {
    fontSize: 20,
    fontFamily: FONTS.prompt,
    fontStyle: 'italic',
    color: COLORS.primary,
    marginBottom: 20,
    lineHeight: 28,
  },
  journalInput: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: COLORS.text,
    minHeight: 120,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  journalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 16,
  },
  charCount: {
    fontSize: 13,
    color: COLORS.textTertiary,
  },
  journalActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 15,
    color: COLORS.textTertiary,
  },
  saveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    marginLeft: 8,
  },
  saveBtnText: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: '500',
  },
  gratitudeList: {
    marginTop: 8,
  },
  gratitudeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingVertical: 12,
    marginBottom: 8,
  },
  gratitudeNumber: {
    fontSize: 16,
    color: COLORS.accent,
    marginRight: 12,
    fontWeight: '500',
  },
  gratitudeInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.body,
    color: COLORS.text,
  },
  gratitudeSuccess: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  successEmoji: {
    fontSize: 32,
    color: COLORS.accent,
    marginBottom: 16,
  },
  successText: {
    fontSize: 18,
    fontFamily: FONTS.title,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
