import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  withDelay,
  Easing,
  interpolate,
  runOnJS,
  Extrapolation,
} from 'react-native-reanimated';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { dbService } from '../../services/db';

type ExperienceData = {
  id: string;
  theme: string;
  questionType: string;
  responseType: string;
  question: string;
  helperText: string;
  backHelperText: string;
  options?: string[];
  responseConfiguration: {
    atmik_response_template: string;
  };
};

// Sub-component: Typewriter
const TypewriterText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);
    
    const interval = setInterval(() => {
      index++;
      setDisplayedText(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    }, 25); // 25ms per char
    
    return () => clearInterval(interval);
  }, [text]);

  const handleTap = () => {
    if (isTyping) {
      setDisplayedText(text);
      setIsTyping(false);
      if (onComplete) onComplete();
    }
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={handleTap}>
      <Text style={styles.atmikResponse}>{displayedText}</Text>
    </TouchableOpacity>
  );
};

export const TodaysReflectionCard = ({ data }: { data: ExperienceData }) => {
  const [stage, setStage] = useState<'front' | 'input' | 'atmik_reply' | 'done'>('front');
  const [userText, setUserText] = useState('');
  const [atmikResponse, setAtmikResponse] = useState('');
  
  // Animation values
  const flipValue = useSharedValue(0); // 0 = front, 1 = back
  const pressScale = useSharedValue(1);

  const flipToBack = () => {
    pressScale.value = withSequence(
      withTiming(0.96, { duration: 150, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 150 })
    );
    flipValue.value = withDelay(
      50, 
      withSpring(1, { 
        damping: 18, 
        stiffness: 120, 
        mass: 0.8,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01
      }, (finished) => {
        if (finished) {
          runOnJS(setStage)('input');
        }
      })
    );
  };

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipValue.value, [0, 1], [0, 180], Extrapolation.CLAMP);
    const opacity = interpolate(flipValue.value, [0, 0.5, 0.51, 1], [1, 1, 0, 0]);
    return {
      opacity,
      transform: [
        { perspective: 1000 },
        { scale: pressScale.value },
        { rotateY: `${rotateY}deg` }
      ],
      zIndex: flipValue.value < 0.5 ? 2 : 1,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipValue.value, [0, 1], [-180, 0], Extrapolation.CLAMP);
    const opacity = interpolate(flipValue.value, [0, 0.5, 0.51, 1], [0, 0, 1, 1]);
    return {
      opacity,
      transform: [
        { perspective: 1000 },
        { scale: pressScale.value },
        { rotateY: `${rotateY}deg` }
      ],
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: flipValue.value >= 0.5 ? 2 : 1,
    };
  });

  const handleSubmit = () => {
    Keyboard.dismiss();
    let response = data.responseConfiguration.atmik_response_template;
    if (data.responseType === 'choice') {
      response = response.replace('{choice}', userText.toLowerCase());
    }
    setAtmikResponse(response);
    setStage('atmik_reply');
  };

  const handleSave = async (save: boolean) => {
    if (save) {
      await dbService.saveReflection({
        type: 'todays_reflection',
        contentId: data.id,
        theme: data.theme,
        question: data.question,
        userResponse: userText,
        atmikResponse: atmikResponse,
      });
    }
    setStage('done');
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, frontStyle]}>
        <Text style={styles.label}>TODAY'S REFLECTION</Text>
        <View style={styles.contentContainer}>
          <Text style={styles.question}>{data.question}</Text>
          <Text style={styles.helper}>{data.helperText}</Text>
        </View>
        <TouchableOpacity style={styles.tapToBeginBtn} onPress={flipToBack} activeOpacity={0.9}>
          <Text style={styles.tapToBeginText}>Flip ↺</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.card, backStyle]}>
        {stage !== 'done' ? (
          <>
            <Text style={styles.label}>TAKE A MOMENT</Text>
            <View style={styles.backContentContainer}>
              <Text style={styles.backQuestion}>{data.question}</Text>
              <Text style={styles.helper}>{data.backHelperText}</Text>
              
              {stage === 'input' && (
                <View style={styles.inputArea}>
                  {data.responseType === 'text' ? (
                    <TextInput
                      style={styles.textInput}
                      placeholder="Write whatever comes to mind..."
                      placeholderTextColor={Colors.textSecondary}
                      multiline
                      value={userText}
                      onChangeText={setUserText}
                      autoFocus
                    />
                  ) : (
                    <View style={styles.optionsGrid}>
                      {data.options?.map((opt) => (
                        <TouchableOpacity 
                          key={opt}
                          style={[styles.choiceBtn, userText === opt && styles.choiceBtnActive]}
                          onPress={() => setUserText(opt)}
                        >
                          <Text style={[styles.choiceText, userText === opt && styles.choiceTextActive]}>{opt}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  <TouchableOpacity 
                    style={[styles.submitBtn, !userText.trim() && { opacity: 0.5 }]} 
                    onPress={handleSubmit}
                    disabled={!userText.trim()}
                  >
                    <Text style={styles.submitText}>Done →</Text>
                  </TouchableOpacity>
                </View>
              )}

              {stage === 'atmik_reply' && (
                <View style={styles.replyArea}>
                  <Text style={styles.atmikLabel}>Atmik</Text>
                  <TypewriterText text={atmikResponse} />
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.saveBtn} onPress={() => handleSave(true)}>
                      <Text style={styles.saveBtnText}>Keep this reflection</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.discardBtn} onPress={() => handleSave(false)}>
                      <Text style={styles.discardBtnText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </>
        ) : (
          <View style={styles.completedState}>
            <Text style={styles.label}>TODAY'S REFLECTION</Text>
            <Text style={styles.completedIcon}>✓</Text>
            <Text style={styles.completedTitle}>Reflected today</Text>
            <Text style={styles.helper}>You can revisit this moment in Your Reflections.</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 380,
    marginHorizontal: Spacing.lg,
  },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 380,
    backgroundColor: '#F9F3EA',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    justifyContent: 'space-between',
    backfaceVisibility: 'hidden', // Native optimization
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B8954A',
    letterSpacing: 1.5,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  question: {
    fontSize: 28,
    fontFamily: 'serif',
    color: '#1B2D4F',
    lineHeight: 38,
    marginBottom: 16,
    textAlign: 'center',
  },
  helper: {
    fontSize: 14,
    color: '#8A7E6E',
    lineHeight: 20,
    textAlign: 'center',
  },
  tapToBeginBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tapToBeginText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8A7E6E',
    letterSpacing: 0.5,
  },
  backContentContainer: {
    flex: 1,
    marginTop: 20,
  },
  backQuestion: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#1B2D4F',
    marginBottom: 8,
  },
  inputArea: {
    flex: 1,
    marginTop: 24,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1B2D4F',
    textAlignVertical: 'top',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(184,149,74,0.2)',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  choiceBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(184,149,74,0.3)',
    backgroundColor: 'transparent',
  },
  choiceBtnActive: {
    backgroundColor: '#1B2D4F',
    borderColor: '#1B2D4F',
  },
  choiceText: {
    fontSize: 15,
    color: '#1B2D4F',
  },
  choiceTextActive: {
    color: '#FFFFFF',
  },
  submitBtn: {
    alignSelf: 'flex-end',
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  submitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B2D4F',
  },
  replyArea: {
    flex: 1,
    marginTop: 24,
    justifyContent: 'space-between',
  },
  atmikLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B8954A',
    marginBottom: 8,
  },
  atmikResponse: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#1B2D4F',
    lineHeight: 28,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(184,149,74,0.15)',
    paddingTop: 16,
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: '#1B2D4F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: Radius.md,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  discardBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  discardBtnText: {
    color: '#8A7E6E',
    fontSize: 14,
    fontWeight: '500',
  },
  completedState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedIcon: {
    fontSize: 32,
    color: '#B8954A',
    marginVertical: 16,
  },
  completedTitle: {
    fontSize: 22,
    fontFamily: 'serif',
    color: '#1B2D4F',
    marginBottom: 8,
  }
});
