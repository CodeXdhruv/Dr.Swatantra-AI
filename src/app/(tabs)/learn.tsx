import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Book, FileText, Headphones, PlayCircle, MessageSquare, Bookmark, Heart, User, Leaf, Quote, MoreVertical } from 'lucide-react-native';
import { Colors, Spacing, Radius, Shadows } from '@/constants/theme';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', label: 'All', icon: null },
  { id: 'books', label: 'Books', icon: Book },
  { id: 'articles', label: 'Articles', icon: FileText },
  { id: 'audios', label: 'Audios', icon: Headphones },
  { id: 'videos', label: 'Videos', icon: PlayCircle },
  { id: 'quotes', label: 'Quotes', icon: MessageSquare },
];

const FEATURED = [
  {
    id: '1',
    type: 'BOOK',
    title: 'The Science of Inner Peace',
    subtitle: 'Discover the path to lasting peace within.',
    meta: 'Dr. Swatantra Jain',
    metaIcon: User,
  },
  {
    id: '2',
    type: 'ARTICLE',
    title: 'Daily Habits for Inner Growth',
    subtitle: 'Small daily changes lead to profound transformation.',
    meta: '5 min read',
    metaIcon: null,
  },
  {
    id: '3',
    type: 'AUDIO',
    title: 'Morning Wisdom Meditation',
    subtitle: 'Start your day with clarity, gratitude and purpose.',
    meta: '12 min listen',
    metaIcon: Headphones,
  }
];

const EXPLORE_CATS = [
  { id: '1', title: 'Health &\nWellbeing', icon: Heart, color: '#4CAF50' },
  { id: '2', title: 'Spirituality &\nMeditation', icon: User, color: '#4285F4' },
  { id: '3', title: 'Atmik\nIntelligence', icon: 'lotus', color: '#DEAB5B' },
  { id: '4', title: 'Nature &\nEnvironment', icon: Leaf, color: '#4CAF50' },
  { id: '5', title: 'Wisdom\nQuotes', icon: Quote, color: '#9C27B0' },
];

const POPULAR = [
  {
    id: '1',
    title: 'The Power of Silence',
    subtitle: 'Silence is not empty, it is full of answers.',
    meta: 'Video • 8 min',
    type: 'VIDEO',
  },
  {
    id: '2',
    title: 'Guided Meditation for Peace',
    subtitle: 'A 15-minute journey to calm your mind.',
    meta: 'Audio • 15 min',
    type: 'AUDIO',
  },
  {
    id: '3',
    title: 'Understanding Karma',
    subtitle: 'The law of cause and effect in life.',
    meta: 'Article • 6 min read',
    type: 'ARTICLE',
  },
];

export default function LearnScreen() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header without Background Image */}
        <View style={styles.headerBackground}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, paddingRight: Spacing.md }}>
              <Text style={styles.headerTitle}>Library & Wisdom</Text>
              <Text style={styles.headerSubtitle}>Explore timeless knowledge for{'\n'}a better you and a better world.</Text>
            </View>
            <TouchableOpacity style={styles.searchButton}>
              <Search color={Colors.primary} size={20} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Horizontal Scroll */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const Icon = cat.icon;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => setActiveCategory(cat.id)}
              >
                {Icon && (
                  <Icon 
                    color={isActive ? '#DEAB5B' : Colors.textSecondary} 
                    size={16} 
                    strokeWidth={2} 
                    style={{ marginRight: 6 }} 
                  />
                )}
                {!Icon && isActive && (
                  <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#DEAB5B', marginRight: 6, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' }} />
                  </View>
                )}
                <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured for You */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured for You</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all {'>'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.featuredScroll}
          snapToInterval={width * 0.75 + Spacing.md}
          decelerationRate="fast"
        >
          {FEATURED.map((item) => (
            <View key={item.id} style={[styles.featuredCard, { width: width * 0.75 }]}>
              <ImageBackground 
                source={require('@/assets/images/mountain_bg.png')}
                style={styles.featuredImage}
              >
                <View style={styles.featuredImageOverlay}>
                  <View style={[styles.typeTag, 
                    item.type === 'BOOK' ? { backgroundColor: '#E3F2FD' } : 
                    item.type === 'ARTICLE' ? { backgroundColor: '#E8F5E9' } : 
                    { backgroundColor: '#E8EAF6' }
                  ]}>
                    <Text style={[styles.typeTagText,
                      item.type === 'BOOK' ? { color: '#1565C0' } : 
                      item.type === 'ARTICLE' ? { color: '#2E7D32' } : 
                      { color: '#283593' }
                    ]}>{item.type}</Text>
                  </View>
                  <TouchableOpacity style={styles.bookmarkButton}>
                    <Bookmark color={Colors.primary} size={20} strokeWidth={1.5} />
                  </TouchableOpacity>
                </View>
              </ImageBackground>
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>{item.title}</Text>
                <Text style={styles.featuredSubtitle}>{item.subtitle}</Text>
                <View style={styles.featuredMetaRow}>
                  {item.metaIcon && <item.metaIcon color={Colors.textSecondary} size={14} style={{ marginRight: 6 }} />}
                  <Text style={styles.featuredMetaText}>{item.meta}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.paginationDots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Explore Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore Categories</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all {'>'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.exploreScroll}
        >
          {EXPLORE_CATS.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.exploreCard}>
              <View style={styles.exploreIconContainer}>
                {cat.icon === 'lotus' ? (
                  <Image source={require('@/assets/images/nav_bar_icon.png')} style={{ width: 28, height: 28, tintColor: cat.color }} resizeMode="contain" />
                ) : (
                  // @ts-ignore
                  <cat.icon color={cat.color} size={28} strokeWidth={1.5} />
                )}
              </View>
              <Text style={styles.exploreCardText}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular this week */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular this week</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all {'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.popularList}>
          {POPULAR.map((item) => (
            <TouchableOpacity key={item.id} style={styles.popularItem}>
              <ImageBackground 
                source={require('@/assets/images/mountain_bg.png')}
                style={styles.popularImage}
                imageStyle={{ borderRadius: Radius.md }}
              >
                <View style={styles.popularTypeIconContainer}>
                  {item.type === 'VIDEO' && <PlayCircle color="#fff" size={12} fill="#000" />}
                  {item.type === 'AUDIO' && <Headphones color="#fff" size={12} />}
                  {item.type === 'ARTICLE' && <FileText color="#fff" size={12} />}
                </View>
              </ImageBackground>
              <View style={styles.popularContent}>
                <Text style={styles.popularTitle}>{item.title}</Text>
                <Text style={styles.popularSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                <Text style={styles.popularMeta}>{item.meta}</Text>
              </View>
              <View style={styles.popularActions}>
                <TouchableOpacity style={{ marginBottom: 12 }}>
                  <Bookmark color={Colors.textSecondary} size={20} strokeWidth={1.5} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <MoreVertical color={Colors.textSecondary} size={20} strokeWidth={1.5} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFBFC', // Light off-white from mockup
  },
  scrollContent: {
    paddingBottom: 160,
  },
  headerBackground: {
    width: '100%',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    backgroundColor: '#FAFBFC',
    zIndex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerLogoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.light,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.light,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#0A2540',
    marginBottom: Spacing.sm,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 22,
  },
  categoryScroll: {
    paddingHorizontal: Spacing.lg,
    marginTop: 0,
    marginBottom: Spacing.xl,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.light,
  },
  categoryChipActive: {
    backgroundColor: '#0A2540',
    borderColor: '#0A2540',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: '600',
    color: '#0A2540',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#DEAB5B',
  },
  featuredScroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  featuredCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: Spacing.md,
    ...Shadows.medium,
    overflow: 'hidden',
  },
  featuredImage: {
    height: 160,
    width: '100%',
  },
  featuredImageOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.sm,
  },
  typeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  bookmarkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredContent: {
    padding: Spacing.md,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A2540',
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 13,
    color: '#4A5568',
    marginBottom: 12,
    lineHeight: 18,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredMetaText: {
    fontSize: 12,
    color: '#718096',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  dot: {
    width: 16,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#DEAB5B',
  },
  exploreScroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  exploreCard: {
    width: 110,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
  },
  exploreIconContainer: {
    marginBottom: 8,
  },
  exploreCardText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4A5568',
    textAlign: 'center',
  },
  popularList: {
    paddingHorizontal: Spacing.lg,
  },
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  popularImage: {
    width: 80,
    height: 80,
    borderRadius: Radius.md,
    justifyContent: 'flex-end',
    padding: 6,
  },
  popularTypeIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(10, 37, 64, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  popularTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A2540',
    marginBottom: 4,
  },
  popularSubtitle: {
    fontSize: 13,
    color: '#4A5568',
    marginBottom: 6,
  },
  popularMeta: {
    fontSize: 12,
    color: '#718096',
  },
  popularActions: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: Spacing.sm,
  },
});
