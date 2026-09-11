import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Wind, Check } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius } from '@/constants/theme';
import forYouData from '../../../assets/for_you_today.json';

// ── Design tokens ──────────────────────────────────────────────
const CARD_BG    = '#F9F3EA';   
const CARD_TEXT  = '#1B2D4F';   
const CARD_MUTED = '#8A7E6E';   
const GOLD       = '#B8954A';   
const WORD_TEXT  = '#2C4068';   
const HISTORY_KEY = forYouData.selection.storageKey; // '@atmik/for_you_today/history_v1'

// ── Types ──────────────────────────────────────────────────────
type MicroExperience = {
  id: string;
  label: string;
  question: string;
  helper: string;
  releaseOptions: string[];
  transitionLabel: string;
  secondQuestion: string;
  spaceOptions: string[];
  completion: {
    title: string;
    message_templates: string[];
  };
};

// ── Background SVG ────────────────────────────────────────────
const RippleDecoration = () => (
  <Svg width={130} height={130} viewBox="0 0 130 130" style={styles.svgDecor}>
    <Defs>
      <RadialGradient id="rg" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor={GOLD} stopOpacity="0.18" />
        <Stop offset="100%" stopColor={GOLD} stopOpacity="0" />
      </RadialGradient>
    </Defs>
    <Circle cx="65" cy="65" r="65" fill="url(#rg)" />
    <Circle cx="65" cy="65" r="20" fill="none" stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.35" />
    <Circle cx="65" cy="65" r="35" fill="none" stroke={GOLD} strokeWidth="0.7" strokeOpacity="0.28" />
    <Circle cx="65" cy="65" r="50" fill="none" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.20" />
    <Circle cx="65" cy="65" r="65" fill="none" stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.12" />
    <Circle cx="65" cy="65" r="3" fill={GOLD} fillOpacity="0.5" />
    <Circle cx="65" cy="65" r="1.5" fill={GOLD} fillOpacity="0.8" />
  </Svg>
);

// ── Particle ──────────────────────────────────────────────────
const Particle = ({ isActive }: { isActive: boolean }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);

  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 18 + 8;

  useEffect(() => {
    if (isActive) {
      opacity.value = withSequence(
        withTiming(0.9, { duration: 100 }),
        withTiming(0, { duration: 800 + Math.random() * 300 })
      );
      translateX.value = withTiming(Math.cos(angle) * distance, { duration: 900, easing: Easing.out(Easing.quad) });
      translateY.value = withTiming(Math.sin(angle) * distance - 10, { duration: 900, easing: Easing.out(Easing.quad) });
      scale.value = withTiming(0, { duration: 900 });
    }
  }, [isActive]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
  }));

  return <Animated.View style={[styles.particle, style]} />;
};

// ── Floating word chip ─────────────────────────────────────────
const FloatingWord = ({
  word, index, isLast, onPress, selectedWord, status,
}: {
  word: string; index: number; isLast: boolean;
  onPress: (w: string, i: number) => void; selectedWord: string | null;
  status: 'idle' | 'animating';
}) => {
  const floatY    = useSharedValue(0);
  const scale     = useSharedValue(1);
  const translateY = useSharedValue(0);
  const opacity   = useSharedValue(1);
  const particlesActive = status === 'animating' && selectedWord === word;

  useEffect(() => {
    if (status === 'idle') {
      floatY.value = 0;
      scale.value = 1;
      translateY.value = 0;
      opacity.value = withTiming(1, { duration: 400 });
    }
  }, [status]);

  useEffect(() => {
    if (status === 'animating') {
      // Smoothly return the floating word to baseline instead of snapping to 0
      floatY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) });
      
      if (selectedWord === word) {
        scale.value = withTiming(1.05, { duration: 300, easing: Easing.out(Easing.quad) });
        translateY.value = withDelay(150, withTiming(-16, { duration: 800, easing: Easing.out(Easing.cubic) }));
        opacity.value = withDelay(250, withTiming(0, { duration: 700 }));
      } else {
        opacity.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) });
      }
    }
  }, [status, selectedWord]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: floatY.value + translateY.value }, { scale: scale.value }],
  }));

  const particles = Array.from({ length: 8 }).map((_, i) => <Particle key={i} isActive={particlesActive} />);

  return (
    <Animated.View style={[styles.wordWrapper, animStyle]}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => { if (status === 'idle') onPress(word, index); }}
        accessibilityRole="button"
        accessibilityLabel={`Select ${word}`}
        style={styles.wordTouch}
      >
        <View style={styles.wordChip}>
          <Text style={styles.wordText}>{word}</Text>
          {particles}
        </View>
      </TouchableOpacity>
      {!isLast && <View style={styles.wordDivider} />}
    </Animated.View>
  );
};

// ── Main Component ─────────────────────────────────────────────
type Stage = 'loading' | 'let_go' | 'make_space' | 'completed';

export function LetItGoCard() {
  const [stage, setStage] = useState<Stage>('loading');
  const [experience, setExperience] = useState<MicroExperience | null>(null);
  const [experienceIndex, setExperienceIndex] = useState(0);
  
  // Selection state
  const [firstChoice, setFirstChoice] = useState<{word: string, index: number} | null>(null);
  const [secondChoice, setSecondChoice] = useState<{word: string, index: number} | null>(null);
  const [finalMessage, setFinalMessage] = useState('');

  // UI state
  const [interactionStatus, setInteractionStatus] = useState<'idle' | 'animating'>('idle');
  const contentOpacity = useSharedValue(0);
  const completionScale = useSharedValue(0.95);

  // Load experience on mount
  useEffect(() => {
    const loadExperience = async () => {
      try {
        const historyStr = await AsyncStorage.getItem(HISTORY_KEY);
        const completedIds: string[] = historyStr ? JSON.parse(historyStr) : [];
        
        const experiences = forYouData.experiences as MicroExperience[];
        const available = experiences.filter(exp => !completedIds.includes(exp.id));
        
        let selected: MicroExperience;
        let selectedIndex: number;
        
        if (available.length > 0) {
          // Select first available (or could be random/day-of-year)
          selected = available[0];
          selectedIndex = experiences.findIndex(e => e.id === selected.id);
        } else {
          // Fallback if all are completed: clear history and start over
          await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([]));
          selected = experiences[0];
          selectedIndex = 0;
        }

        setExperience(selected);
        setExperienceIndex(selectedIndex);
        setStage('let_go');
        contentOpacity.value = withTiming(1, { duration: 600 });
      } catch (error) {
        // Fallback to first on error
        const exps = forYouData.experiences as MicroExperience[];
        setExperience(exps[0]);
        setExperienceIndex(0);
        setStage('let_go');
        contentOpacity.value = withTiming(1, { duration: 600 });
      }
    };
    
    loadExperience();
  }, []);

  const saveCompletion = async (id: string) => {
    try {
      const historyStr = await AsyncStorage.getItem(HISTORY_KEY);
      const completedIds: string[] = historyStr ? JSON.parse(historyStr) : [];
      
      // Limit history to what's defined in the schema
      const limit = forYouData.selection.historyLimit || 30;
      if (!completedIds.includes(id)) {
        const newHistory = [id, ...completedIds].slice(0, limit);
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      }
    } catch (e) {
      console.error('Failed to save completion history', e);
    }
  };

  const advanceStage = (nextStage: Stage) => {
    setStage(nextStage);
    setInteractionStatus('idle');
    
    if (nextStage === 'completed' && experience) {
      saveCompletion(experience.id);
    }

    // Delay the Reanimated fade-in slightly so React has time to completely
    // unmount the old stage and mount the new stage, preventing ghost flashes.
    setTimeout(() => {
      contentOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
      if (nextStage === 'completed') {
        completionScale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.ease) });
      }
    }, 100);
  };

  const handleSelection = (word: string, index: number) => {
    if (interactionStatus !== 'idle') return;
    
    if (stage === 'let_go') {
      setFirstChoice({ word, index });
    } else if (stage === 'make_space') {
      setSecondChoice({ word, index });
      
      // Compute final message before transitioning to completed
      if (experience && firstChoice) {
        const tplArray = experience.completion.message_templates;
        // Formula: (firstChoiceIndex + secondChoiceIndex + experienceIndex) % message_templates.length
        const messageIndex = (index + firstChoice.index + experienceIndex) % tplArray.length;
        let msg = tplArray[messageIndex];
        
        msg = msg.replace('{first_choice}', firstChoice.word);
        msg = msg.replace('{second_choice}', word);
        setFinalMessage(msg);
      }
    }

    setInteractionStatus('animating');

    setTimeout(() => {
      contentOpacity.value = withTiming(0, { duration: 600 }, (finished) => {
        if (finished) {
          if (stage === 'let_go') runOnJS(advanceStage)('make_space');
          else if (stage === 'make_space') runOnJS(advanceStage)('completed');
        }
      });
    }, 1400);
  };

  const resetCard = () => {
    // If they want to try again, just reset visually for now.
    // They will get a new one tomorrow when the app reloads.
    setStage('loading');
    setFirstChoice(null);
    setSecondChoice(null);
    setInteractionStatus('idle');
    
    // In a real app this might trigger a context reload, but for local state:
    setStage('let_go');
    contentOpacity.value = withTiming(1, { duration: 600 });
  };

  const contentAnimStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));
  const completionAnimStyle = useAnimatedStyle(() => ({ transform: [{ scale: completionScale.value }] }));

  const renderQuestion = (label: string, question: string, helper: string | null, words: string[], activeChoice: string | null) => (
    <>
      <View style={styles.cardHeader}>
        <Wind color={GOLD} size={13} strokeWidth={2} />
        <Text style={styles.cardLabel}>{label}</Text>
        <View style={styles.headerLine} />
      </View>
      
      <View style={styles.contentArea}>
        <View style={styles.questionContainer}>
          <Text style={styles.question}>{question}</Text>
          {helper && <Text style={styles.instruction}>{helper}</Text>}
        </View>
      </View>

      <View style={styles.wordsRow}>
        {words.map((word, index) => (
          <FloatingWord
            key={word} word={word} index={index}
            isLast={index === words.length - 1}
            onPress={handleSelection} selectedWord={activeChoice} status={interactionStatus}
          />
        ))}
      </View>
    </>
  );

  if (!experience) {
    return <View style={styles.container}><View style={styles.card} /></View>; // Loading shell
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <RippleDecoration />
        
        {stage !== 'completed' && (
          <Animated.View style={[styles.innerFlow, contentAnimStyle]}>
            {stage === 'let_go' && renderQuestion(
              experience.label,
              experience.question,
              experience.helper,
              experience.releaseOptions,
              firstChoice?.word || null
            )}
            {stage === 'make_space' && renderQuestion(
              experience.transitionLabel,
              experience.secondQuestion,
              null,
              experience.spaceOptions,
              secondChoice?.word || null
            )}
          </Animated.View>
        )}

        {stage === 'completed' && (
          <Animated.View style={[styles.innerFlow, styles.completedContainer, completionAnimStyle]}>
            <View style={styles.checkIconWrapper}>
              <Check color={GOLD} size={18} strokeWidth={2.5} />
            </View>
            <Text style={styles.completedTitle}>{experience.completion.title}</Text>
            <Text style={styles.completedText}>{finalMessage}</Text>
            
            <TouchableOpacity onPress={resetCard} style={styles.doneBtn} activeOpacity={0.6}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    paddingTop: 14,
    paddingBottom: 14,
    shadowColor: '#8A7E6E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
    height: 220,
    overflow: 'hidden',
  },
  innerFlow: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // ── SVG decoration ──────────────────────────────────────────
  svgDecor: {
    position: 'absolute',
    top: -22,
    right: -22,
    opacity: 1,
  },

  // ── Header ──────────────────────────────────────────────────
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 1.8,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(184,149,74,0.25)',
    marginLeft: 4,
  },

  // ── Content ──────────────────────────────────────────────────
  contentArea: {
    flex: 1,
    justifyContent: 'center',
  },
  questionContainer: {
    justifyContent: 'center',
  },
  question: {
    fontSize: 22,
    fontFamily: 'serif',
    fontStyle: 'italic',
    color: CARD_TEXT,
    lineHeight: 30,
    marginBottom: 6,
  },
  instruction: {
    fontSize: 13,
    color: CARD_MUTED,
  },

  // ── Words ────────────────────────────────────────────────────
  wordsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(184,149,74,0.2)',
  },
  wordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  wordTouch: { flex: 1, alignItems: 'center' },
  wordChip: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    position: 'relative',
  },
  wordText: {
    fontSize: 15,
    fontWeight: '500',
    color: WORD_TEXT,
    letterSpacing: 0.2,
  },
  wordDivider: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(184,149,74,0.3)',
  },

  // ── Particles ────────────────────────────────────────────────
  particle: {
    position: 'absolute',
    top: '50%', left: '50%',
    width: 3, height: 3,
    borderRadius: 1.5,
    backgroundColor: GOLD,
  },

  // ── Completed ────────────────────────────────────────────────
  completedContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: Spacing.xl,
  },
  checkIconWrapper: {
    marginBottom: 12,
  },
  completedTitle: {
    fontSize: 18,
    fontFamily: 'serif',
    fontStyle: 'italic',
    color: CARD_TEXT,
    marginBottom: 8,
  },
  completedText: {
    fontSize: 14,
    color: CARD_MUTED,
    lineHeight: 22,
    paddingRight: 20,
  },
  doneBtn: {
    marginTop: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: GOLD,
  },
  doneText: {
    fontSize: 12,
    fontWeight: '600',
    color: GOLD,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
