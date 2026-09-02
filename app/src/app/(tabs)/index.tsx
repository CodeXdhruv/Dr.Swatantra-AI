import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors, Spacing, Radius, Shadows } from '@/constants/theme';
import { Bell, Lightbulb, CheckCircle2, Check, Edit3, Edit2, Heart, ChevronRight, Bookmark } from 'lucide-react-native';
import { usePracticeStore } from '../../store/usePracticeStore';
import { apiService } from '../../services/api';
import * as Linking from 'expo-linking';


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
              source={require('@/assets/images/quotes_background.png')}
              style={styles.heroBackground}
              imageStyle={{ borderRadius: Radius.lg - 0.5, resizeMode: 'cover' }}
            >
              <View style={styles.heroContent}>
                <View style={{ width: '65%' }}>
                  <View style={styles.heroLabelContainer}>
                    <Text style={styles.heroLabel}>Daily Inspiration</Text>
                    <Lightbulb color={Colors.textPrimary} size={14} style={{ marginLeft: 4 }} />
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
  const router = useRouter();
  const { habits, journalSaved, gratitudes } = usePracticeStore();
  
  const completedHabits = habits.filter(h => h.completed).length;
  const isGratitudeComplete = gratitudes.every(g => g.trim().length > 0);

  const [recommendedContent, setRecommendedContent] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        const data = await apiService.fetchLibraryContent();
        setRecommendedContent(data.slice(0, 5));
      }
      loadData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View>
              <Text style={styles.greeting}>Welcome back, Dhruv!</Text>
              <Text style={styles.subGreeting}>How are you feeling today?</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
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
            <TouchableOpacity onPress={() => router.push('/(tabs)/health')}>
              <Text style={styles.viewAllAction}>View all {'>'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.practiceGridRow}>
            {/* Daily Habits */}
            <TouchableOpacity style={styles.practiceCardBox} onPress={() => router.push('/(tabs)/health')}>
              <View style={[styles.iconBadge, { backgroundColor: '#E8F0FE' }]}>
                <Check color="#4285F4" size={20} strokeWidth={2.5} />
              </View>
              <Text style={styles.practiceCardTitle}>Daily Habits</Text>
              <View style={{ flex: 1 }} />
              <View style={styles.practiceCardFooter}>
                <Text style={styles.practiceCardSubtitle}>{completedHabits} / {habits.length} completed</Text>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarFill, { width: habits.length ? `${(completedHabits / habits.length) * 100}%` : '0%' }]} />
                </View>
              </View>
            </TouchableOpacity>

            {/* Journal Reflection */}
            <TouchableOpacity style={styles.practiceCardBox} onPress={() => router.push('/(tabs)/health')}>
              <View style={[styles.iconBadge, { backgroundColor: '#F3E8FF' }]}>
                <Edit2 color="#9333EA" size={20} strokeWidth={2.5} />
              </View>
              <Text style={styles.practiceCardTitle}>Journal Reflection</Text>
              <View style={{ flex: 1 }} />
              <View style={styles.practiceCardFooterRow}>
                <Text style={styles.practiceCardSubtitle} numberOfLines={1}>{journalSaved ? 'Completed' : 'Write your thoughts'}</Text>
                <ChevronRight color={Colors.textSecondary} size={14} />
              </View>
            </TouchableOpacity>

            {/* Gratitude */}
            <TouchableOpacity style={styles.practiceCardBox} onPress={() => router.push('/(tabs)/health')}>
              <View style={[styles.iconBadge, { backgroundColor: '#FEF3C7' }]}>
                <Heart color="#D97706" size={20} strokeWidth={2.5} />
              </View>
              <Text style={styles.practiceCardTitle}>Gratitude</Text>
              <View style={{ flex: 1 }} />
              <View style={styles.practiceCardFooterRow}>
                <Text style={styles.practiceCardSubtitle} numberOfLines={1}>{isGratitudeComplete ? 'Completed' : '3 things to be grateful for'}</Text>
                <ChevronRight color={Colors.textSecondary} size={14} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recommended for You */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/learn')}>
              <Text style={styles.viewAllAction}>View all {'>'}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.pillContainer}>
            <TouchableOpacity style={[styles.pill, styles.pillActive]}>
              <Text style={styles.pillTextActive}>For You</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pill}>
              <Text style={styles.pillText}>Books</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pill}>
              <Text style={styles.pillText}>Articles</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recommendationGrid}>
            {/* Left Column - Featured Book */}
            <View style={styles.recommendationLeftCol}>
              <TouchableOpacity style={styles.featuredBookCard}>
                <View style={styles.bookTag}>
                  <Text style={styles.bookTagText}>BOOK</Text>
                </View>
                <Image
                  source={require('@/assets/images/mountain_bg.png')}
                  style={styles.featuredBookImage}
                  resizeMode="cover"
                />
                <View style={styles.featuredBookContent}>
                  <Text style={styles.featuredBookTitle}>The Power of Mindful Living</Text>
                  <View style={styles.featuredBookFooterRow}>
                    <Text style={styles.featuredBookAuthor}>Dr. Swatantra Jain</Text>
                    <Bookmark color={Colors.textSecondary} size={16} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Right Column - Articles List */}
            <View style={styles.recommendationRightCol}>
              {[
                { title: 'The Art of Letting Go', time: '5 min read', img: require('@/assets/images/mountain_bg.png') },
                { title: 'Finding Clarity in Everyday Life', time: '7 min read', img: require('@/assets/images/quotes_background.png') },
                { title: 'Building Better Habits for Peaceful Living', time: '6 min read', img: require('@/assets/images/quotes_background.png') }
              ].map((article, index) => (
                <TouchableOpacity key={index} style={styles.articleListItem}>
                  <View style={styles.articleListContent}>
                    <View style={styles.articleTag}>
                      <Text style={styles.articleTagText}>ARTICLE</Text>
                    </View>
                    <Text style={styles.articleListTitle} numberOfLines={2}>{article.title}</Text>
                    <Text style={styles.articleListTime}>{article.time}</Text>
                  </View>
                  <View style={styles.articleListRight}>
                    <Bookmark color={Colors.textSecondary} size={14} style={{ marginBottom: 4 }} />
                    <Image source={article.img} style={styles.articleListThumbnail} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
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
  practiceGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    gap: 8,
  },
  practiceCardBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    ...Shadows.soft,
    alignItems: 'center',
    height: 120,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  practiceCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  practiceCardFooter: {
    width: '100%',
    alignItems: 'center',
  },
  practiceCardSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4285F4',
    borderRadius: 2,
  },
  practiceCardFooterRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pillContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    gap: 8,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  pillActive: {
    backgroundColor: '#E8F0FE',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  pillTextActive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4285F4',
  },
  recommendationGrid: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: 12,
  },
  recommendationLeftCol: {
    flex: 0.45,
  },
  recommendationRightCol: {
    flex: 0.55,
    gap: 12,
  },
  featuredBookCard: {
    height: '100%',
    minHeight: 220,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: Spacing.sm,
    justifyContent: 'space-between',
    ...Shadows.soft,
  },
  bookTag: {
    backgroundColor: '#24385A',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  bookTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  featuredBookImage: {
    width: '100%',
    height: 100,
    borderRadius: Radius.sm,
    marginBottom: 12,
  },
  featuredBookContent: {
    justifyContent: 'flex-end',
  },
  featuredBookTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  featuredBookFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  featuredBookAuthor: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  articleListItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadows.soft,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 70,
  },
  articleListContent: {
    flex: 1,
    paddingRight: 8,
  },
  articleTag: {
    backgroundColor: '#E8F0FE',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  articleTagText: {
    color: '#4285F4',
    fontSize: 8,
    fontWeight: '700',
  },
  articleListTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 2,
  },
  articleListTime: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  articleListRight: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
  },
  articleListThumbnail: {
    width: 36,
    height: 36,
    borderRadius: 4,
    resizeMode: 'cover',
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

