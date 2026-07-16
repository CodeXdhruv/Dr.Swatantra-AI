import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FlashList } from '@shopify/flash-list';
import { MotiView } from 'moti';
import { Colors, Spacing, Radius, Shadows } from '@/constants/theme';
import { Search, Bell, Lightbulb, CheckCircle2, Edit3, Heart, ChevronRight, Play } from 'lucide-react-native';


const { width } = Dimensions.get('window');

const HeroCarousel = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const quotes = [
    { id: 1, quote: "To heal the planet,\nwe must heal humanity.", author: "— Dr. Swatantra Jain" },
    { id: 2, quote: "Peace comes from within.\nDo not seek it without.", author: "— Dr. Swatantra Jain" },
    { id: 3, quote: "Mindfulness is the key\nto a balanced life.", author: "— Dr. Swatantra Jain" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % quotes.length;
        scrollRef.current?.scrollTo({ x: nextIndex * (width - Spacing.lg * 2), y: 0, animated: true });
        return nextIndex;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [width, quotes.length]);

  return (
    <View style={styles.heroContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / (width - Spacing.lg * 2));
          setActiveIndex(newIndex);
        }}
      >
        {quotes.map((item, index) => (
          <View key={item.id} style={[styles.heroCard, { width: width - Spacing.lg * 2 }]}>
            <ImageBackground 
              source={require('@/assets/images/quote_illustration.png')}
              style={styles.heroBackground}
              imageStyle={{ borderRadius: Radius.lg, resizeMode: 'cover' }}
            >
              <View style={styles.heroContent}>
                <View style={{ width: '65%' }}>
                  <View style={styles.heroLabelContainer}>
                    <Text style={styles.heroLabel}>Daily Inspiration</Text>
                    <Lightbulb color={Colors.textPrimary} size={14} style={{marginLeft: 4}} />
                  </View>
                  <Text style={styles.heroQuote}>{item.quote}</Text>
                  <Text style={styles.heroAuthor}>{item.author}</Text>
                </View>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>
      <View style={styles.paginationDots}>
        {quotes.map((_, idx) => (
          <View key={idx} style={[styles.dot, activeIndex === idx && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('@/assets/images/app_icon.png')} style={{ width: 36, height: 36, marginRight: 12 }} resizeMode="contain" />
                <Text style={styles.greeting}>Welcome back, Dhruv!</Text>
              </View>
              <Text style={styles.subGreeting}>How are you feeling today?</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Search color={Colors.textPrimary} size={20} strokeWidth={1.5} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <View style={styles.notificationDot} />
              <Bell color={Colors.textPrimary} size={20} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Inspiration Hero */}
        <HeroCarousel />
        
        {/* Your Daily Practice */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Daily Practice</Text>
            <Text style={{color: Colors.textSecondary, letterSpacing: 2}}>•••</Text>
          </View>
          <View style={styles.practiceContainer}>
            <TouchableOpacity style={styles.practiceItem}>
              <CheckCircle2 color={Colors.primary} size={20} />
              <Text style={styles.practiceTitle}>Daily Habits</Text>
              <Text style={styles.practiceStatus}>2/5 completed</Text>
              <ChevronRight color={Colors.textSecondary} size={16} />
            </TouchableOpacity>
            <View style={styles.practiceDivider} />
            <TouchableOpacity style={styles.practiceItem}>
              <Edit3 color={Colors.primary} size={20} />
              <Text style={styles.practiceTitle}>Journal Reflection</Text>
              <Text style={styles.practiceStatus}>Write your thoughts</Text>
              <ChevronRight color={Colors.textSecondary} size={16} />
            </TouchableOpacity>
            <View style={styles.practiceDivider} />
            <TouchableOpacity style={styles.practiceItem}>
              <Heart color={Colors.primary} size={20} />
              <Text style={styles.practiceTitle}>Gratitude</Text>
              <Text style={styles.practiceStatus}>3 things to be grateful for</Text>
              <ChevronRight color={Colors.textSecondary} size={16} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recommended for You */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <Text style={styles.viewAllAction}>View all</Text>
          </View>
          <View style={{ minHeight: 150 }}>
            <FlashList
              data={[
                { title: 'Inner Peace\nMeditation', subtitle: '12 Min • Guided', hasPlay: true },
                { title: 'The Power of\nGratitude', subtitle: 'Article • 5 Min Read', hasPlay: false },
                { title: '16 Health\nChallenges', subtitle: 'Day 4 of 16', hasPlay: false },
              ]}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
              estimatedItemSize={240}
              renderItem={({ item, index }) => (
                <MotiView
                  from={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'timing', duration: 700, delay: index * 150 }}
                  style={styles.recommendedCard}
                >
                  <View style={styles.recommendedImagePlaceholder}>
                    {item.hasPlay && (
                      <View style={styles.playButtonOverlay}>
                        <Play color={Colors.surface} size={16} fill={Colors.surface} />
                      </View>
                    )}
                  </View>
                  <View style={styles.recommendedContent}>
                    <Text style={styles.recommendedTitle}>{item.title}</Text>
                    <Text style={styles.recommendedSubtitle}>{item.subtitle}</Text>
                  </View>
                </MotiView>
              )}
            />
          </View>
        </View>

      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity style={styles.fab}>
        <Heart color={Colors.accent} size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 140, // Space for Bottom Tab
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    marginTop: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginRight: 12,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.primary,
    fontFamily: 'serif',
  },
  subGreeting: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
    zIndex: 1,
  },
  heroContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  heroCard: {
    height: 220,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: '#EAF0F6', // Fallback color
  },
  heroBackground: { flex: 1 },
  heroContent: {
    padding: Spacing.lg,
    flex: 1,
  },
  heroLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  heroQuote: {
    fontSize: 24,
    color: Colors.primary,
    fontFamily: 'serif',
    fontStyle: 'italic',
    lineHeight: 32,
    marginBottom: 12,
  },
  heroAuthor: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 16,
    backgroundColor: Colors.primary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryTextContainer: {
    justifyContent: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  summaryUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  summaryLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  horizontalScroll: {
    paddingHorizontal: Spacing.lg,
    gap: 16,
  },
  journeyCard: {
    width: 160,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadows.soft,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  journeyImagePlaceholder: {
    height: 80,
    backgroundColor: Colors.secondary,
    borderRadius: Radius.sm,
    marginBottom: -16, // To overlap progress
  },
  journeyProgress: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: 8,
    marginLeft: 8,
  },
  journeyProgressText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary,
  },
  journeyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 2,
  },
  journeySubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  journeyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  journeyAction: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  practiceContainer: {
    marginHorizontal: Spacing.lg,
    backgroundColor: '#FAFAFA',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  practiceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 12,
    flex: 1,
  },
  practiceStatus: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  practiceDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 48,
  },
  viewAllAction: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '500',
  },
  recommendedCard: {
    width: 240,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    overflow: 'hidden',
    ...Shadows.soft,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  recommendedImagePlaceholder: {
    height: 100,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonOverlay: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 8,
    left: 8,
  },
  recommendedContent: {
    padding: Spacing.sm,
  },
  recommendedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  recommendedSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: 110, // Above the tab bar
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF8E7', // Light gold background
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
});

