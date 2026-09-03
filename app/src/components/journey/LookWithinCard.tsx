import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { dbService } from '../../services/db';
import { CircleDot, ArrowRight } from 'lucide-react-native';

type LookWithinData = {
  id: string;
  prompt: string;
  options: string[];
  responses: Record<string, string>;
};

export const LookWithinCard = ({ data }: { data: LookWithinData }) => {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const expandProgress = useSharedValue(0);

  const handleExpand = () => {
    if (!expanded) {
      setExpanded(true);
      expandProgress.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
    }
  };

  const handleSelect = (opt: string) => {
    setSelected(opt);
  };

  const handleSave = async () => {
    if (selected && !saved) {
      await dbService.saveReflection({
        type: 'look_within',
        contentId: data.id,
        question: data.prompt,
        userResponse: selected,
        atmikResponse: data.responses[selected],
      });
      setSaved(true);
      
      // Optionally collapse after a moment
      setTimeout(() => {
        expandProgress.value = withTiming(0, { duration: 400, easing: Easing.inOut(Easing.quad) });
        setTimeout(() => {
          setExpanded(false);
          setSelected(null);
          setSaved(false);
        }, 400);
      }, 1500);
    }
  };

  const containerStyle = useAnimatedStyle(() => {
    const height = interpolate(expandProgress.value, [0, 1], [100, 320]); // Approximate expanded height
    return { height };
  });
  
  const expandedContentStyle = useAnimatedStyle(() => {
    return {
      opacity: expandProgress.value,
      transform: [{ translateY: interpolate(expandProgress.value, [0, 1], [20, 0]) }],
    };
  });

  return (
    <Animated.View style={[styles.card, containerStyle]}>
      <TouchableOpacity 
        style={styles.header} 
        activeOpacity={expanded ? 1 : 0.7} 
        onPress={handleExpand}
      >
        <View style={styles.headerLeft}>
          <CircleDot color="#B8954A" size={20} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Look Within</Text>
            <Text style={styles.subtitle}>Notice what's happening inside</Text>
          </View>
        </View>
        {!expanded && <ArrowRight color={Colors.textSecondary} size={20} />}
      </TouchableOpacity>

      {expanded && (
        <Animated.View style={[styles.expandedContent, expandedContentStyle]}>
          <Text style={styles.prompt}>{data.prompt}</Text>
          
          <View style={styles.optionsGrid}>
            {data.options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.optionBtn,
                  selected === opt && styles.optionBtnActive,
                  selected && selected !== opt && { opacity: 0.5 }
                ]}
                onPress={() => handleSelect(opt)}
                disabled={selected !== null}
              >
                <Text style={[styles.optionText, selected === opt && styles.optionTextActive]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {selected && (
            <Animated.View style={styles.responseArea}>
              <Text style={styles.response}>{data.responses[selected]}</Text>
              {!saved ? (
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.saveBtnText}>Keep this reflection</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.savedText}>✓ Saved to your reflections</Text>
              )}
            </Animated.View>
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(27, 45, 79, 0.05)',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerText: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B2D4F',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#8A7E6E',
  },
  expandedContent: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(27, 45, 79, 0.05)',
    flex: 1,
  },
  prompt: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#1B2D4F',
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    backgroundColor: '#F9F3EA',
  },
  optionBtnActive: {
    backgroundColor: '#1B2D4F',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1B2D4F',
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
  responseArea: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(27, 45, 79, 0.05)',
  },
  response: {
    fontSize: 15,
    color: '#1B2D4F',
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  saveBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#F9F3EA',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Radius.md,
  },
  saveBtnText: {
    color: '#B8954A',
    fontWeight: '600',
    fontSize: 13,
  },
  savedText: {
    fontSize: 13,
    color: '#B8954A',
    fontWeight: '500',
  }
});
