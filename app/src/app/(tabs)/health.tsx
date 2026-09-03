import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  ChevronRight,
  ArrowRight,
  MessageCircle,
  Gem,
  Sparkles,
  Lightbulb,
} from 'lucide-react-native';
import { Colors, Spacing, Radius, Shadows } from '@/constants/theme';
import { usePracticeStore } from '../../store/usePracticeStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Local constants (aligned with home page theme) ─────
const FONT_SERIF = 'serif'; // matches home page fontFamily: 'serif'
const ACCENT_LIGHT = '#F5EDD8'; // pale gold tint for reflection card bg

// ─── Lotus icon ──────────────────────────────────────────
const LotusIcon = () => (
  <View style={styles.lotusContainer}>
    <Text style={styles.lotusSymbol}>✿</Text>
  </View>
);

// ─── Horizon icon ────────────────────────────────────────
const HorizonIcon = () => (
  <Text style={styles.horizonIcon}>☀</Text>
);

export default function DailyPracticeScreen() {
  const router = useRouter();
  const { journalSaved, checkAndResetDaily } = usePracticeStore();

  useFocusEffect(
    React.useCallback(() => {
      checkAndResetDaily();
    }, [checkAndResetDaily])
  );

  const discoveryItems = [
    {
      id: 'reflect',
      title: 'Self Reflection',
      subtitle: 'Understand your thoughts',
      icon: <MessageCircle color={Colors.primary} size={20} strokeWidth={1.5} />,
      iconBg: Colors.secondary,
      onPress: () => router.push('/(tabs)/health'),
    },
    {
      id: 'chat',
      title: 'Atmik Conversation',
      subtitle: 'Talk. Question. Discover.',
      icon: <Gem color={Colors.primary} size={20} strokeWidth={1.5} />,
      iconBg: Colors.secondary,
      onPress: () => router.push('/chat'),
    },
    {
      id: 'wisdom',
      title: "Today's Wisdom",
      subtitle: 'A thought worth carrying',
      icon: <Sparkles color={Colors.accent} size={20} strokeWidth={1.5} />,
      iconBg: '#F5EDD8',
      onPress: () => router.push('/(tabs)/learn'),
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>Your Inner Journey</Text>
            <Text style={styles.headerSubtitle}>Pause. Reflect. Understand.</Text>
          </View>
          <LotusIcon />
        </View>

        {/* ── Today's Reflection Card ───────────────────── */}
        <View style={styles.reflectionCard}>
          {/* Top row: label + sun icon */}
          <View style={styles.reflectionTopRow}>
            <View>
              <View style={styles.goldAccentBar} />
              <Text style={styles.reflectionLabel}>TODAY'S REFLECTION</Text>
            </View>
            <HorizonIcon />
          </View>

          {/* Big question prompt */}
          <Text style={styles.reflectionQuestion}>
            What is occupying{'\n'}your mind{'\n'}right now?
          </Text>

          {/* Grouped Bottom Section to maintain even spacing */}
          <View>
            {/* Bottom row: hint text + Begin button */}
            <View style={styles.reflectionBottomRow}>
              <Text style={styles.reflectionHint}>
                Take a moment to pause,{'\n'}listen within and reflect.
              </Text>
              <TouchableOpacity
                style={styles.beginBtn}
                activeOpacity={0.85}
                onPress={() => router.push('/(tabs)/health')}
              >
                <Text style={styles.beginBtnText}>Begin</Text>
                <ArrowRight color="#FFFFFF" size={16} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Continue Your Self-Discovery ─────────────── */}
        <Text style={styles.sectionLabel}>CONTINUE YOUR SELF-DISCOVERY</Text>

        <View style={styles.discoveryCard}>
          {discoveryItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={styles.discoveryRow}
                activeOpacity={0.75}
                onPress={item.onPress}
              >
                {/* Icon badge */}
                <View style={[styles.discoveryIconBadge, { backgroundColor: item.iconBg }]}>
                  {item.icon}
                </View>

                {/* Text */}
                <View style={styles.discoveryTextBlock}>
                  <Text style={styles.discoveryTitle}>{item.title}</Text>
                  <Text style={styles.discoverySubtitle}>{item.subtitle}</Text>
                </View>

                {/* Chevron */}
                <ChevronRight color={Colors.textSecondary} size={18} strokeWidth={1.5} />
              </TouchableOpacity>

              {/* Divider between rows (not after last) */}
              {index < discoveryItems.length - 1 && (
                <View style={styles.internalDivider} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* ── Your Reflections Stats ────────────────────── */}
        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>YOUR REFLECTIONS</Text>

          <View style={styles.statsRow}>
            {/* Conversations */}
            <View style={styles.statItem}>
              <View style={[styles.statIconBadge, { backgroundColor: '#DDE4F0' }]}>
                <MessageCircle color={Colors.primary} size={20} strokeWidth={1.5} />
              </View>
              <View style={styles.statTextBlock}>
                <Text style={styles.statValue}>
                  {journalSaved ? '1' : '0'}
                </Text>
                <Text style={styles.statUnit}>Conversations</Text>
              </View>
            </View>

            {/* Vertical rule */}
            <View style={styles.statsDivider} />

            {/* Insights */}
            <View style={styles.statItem}>
              <View style={[styles.statIconBadge, { backgroundColor: '#F5EDD8' }]}>
                <Lightbulb color={Colors.accent} size={20} strokeWidth={1.5} />
              </View>
              <View style={styles.statTextBlock}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statUnit}>Insights</Text>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: 120,
  },

  // ── Header ────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
    marginTop: Spacing.md,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    // Matches home greeting: serif, 20px, weight 500
    fontSize: 20,
    fontFamily: FONT_SERIF,
    fontWeight: '500',
    color: Colors.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    // Matches home subGreeting: 14px, textSecondary
    fontSize: 14,
    color: Colors.textSecondary,
  },
  lotusContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  lotusSymbol: {
    fontSize: 18,
    color: Colors.accent,
  },

  // ── Reflection Card ───────────────────────────────────
  reflectionCard: {
    height: 220,
    justifyContent: 'space-between',
    backgroundColor: ACCENT_LIGHT,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.soft,
  },
  reflectionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  goldAccentBar: {
    width: 24,
    height: 2,
    backgroundColor: Colors.accent,
    borderRadius: 2,
    marginBottom: 6,
  },
  reflectionLabel: {
    // Matches home heroLabel: 12px, 600
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: Colors.accent,
  },
  horizonIcon: {
    fontSize: 24,
    color: Colors.accent,
    opacity: 0.85,
  },
  reflectionQuestion: {
    // Matches home heroQuote: 24px, serif, italic
    fontSize: 24,
    fontFamily: FONT_SERIF,
    fontStyle: 'italic',
    color: Colors.primary,
    lineHeight: 32,
  },
  reflectionBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  reflectionHint: {
    // Matches home body text: 14px, textSecondary
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    flex: 1,
    marginRight: Spacing.sm,
  },
  beginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.xl,
    gap: 6,
  },
  beginBtnText: {
    // Matches home viewAllAction scale: 14px, 500
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },

  // ── Section Label — matches home sectionTitle scale ─────
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },

  // ── Discovery Card ────────────────────────────────────
  discoveryCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.soft,
  },
  discoveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  discoveryIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  discoveryTextBlock: {
    flex: 1,
  },
  discoveryTitle: {
    // Matches home practiceCardTitle scale: 14px, 600
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 2,
  },
  discoverySubtitle: {
    // Matches home body: 12px, textSecondary
    fontSize: 12,
    color: Colors.textSecondary,
  },
  internalDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 68,
  },

  // ── Stats Card ────────────────────────────────────────
  statsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.soft,
  },
  statsLabel: {
    // Matches sectionLabel
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  statIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTextBlock: {},
  statValue: {
    // Matches home summaryValue: 16px, 700
    fontSize: 16,
    fontFamily: FONT_SERIF,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statUnit: {
    // Matches home summaryLabel: 10px, textSecondary
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statsDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
});
