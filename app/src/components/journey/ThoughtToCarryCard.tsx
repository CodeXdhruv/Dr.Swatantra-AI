import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { dbService } from '../../services/db';
import { Star, ArrowRight, Heart } from 'lucide-react-native';

type WisdomData = {
  id: string;
  text: string;
};

export const ThoughtToCarryCard = ({ data }: { data: WisdomData }) => {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);
  const expandProgress = useSharedValue(0);

  const handleExpand = () => {
    if (!expanded) {
      setExpanded(true);
      expandProgress.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
    }
  };

  const handleSave = async () => {
    if (!saved) {
      await dbService.saveReflection({
        type: 'wisdom',
        contentId: data.id,
        userResponse: data.text, // store the wisdom text for easy display later
      });
      setSaved(true);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `"${data.text}" — Atmik AI`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const containerStyle = useAnimatedStyle(() => {
    const height = interpolate(expandProgress.value, [0, 1], [76, 220]);
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
          <View style={styles.iconBadge}>
            <Star color="#B8954A" size={18} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>A Thought to Carry</Text>
            <Text style={styles.subtitle}>One thought for your day</Text>
          </View>
        </View>
        {!expanded && <ArrowRight color={Colors.textSecondary} size={20} />}
      </TouchableOpacity>

      {expanded && (
        <Animated.View style={[styles.expandedContent, expandedContentStyle]}>
          <View style={styles.wisdomContainer}>
            <Text style={styles.wisdomText}>"{data.text}"</Text>
          </View>
          
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleSave}>
              <Heart color={saved ? "#B8954A" : Colors.textSecondary} size={18} fill={saved ? "#B8954A" : "transparent"} />
              <Text style={[styles.actionText, saved && { color: "#B8954A" }]}>
                {saved ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(27, 45, 79, 0.05)',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 76,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F9F3EA',
    justifyContent: 'center',
    alignItems: 'center',
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
    borderTopWidth: 1,
    borderTopColor: 'rgba(27, 45, 79, 0.05)',
    flex: 1,
  },
  wisdomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  wisdomText: {
    fontSize: 20,
    fontFamily: 'serif',
    color: '#1B2D4F',
    lineHeight: 30,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 24,
    paddingBottom: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  }
});
