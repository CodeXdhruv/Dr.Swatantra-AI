import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Search, Book, FileText, Headphones, PlayCircle, MessageSquare, Bookmark, Heart, User, Leaf, Quote, MoreVertical } from 'lucide-react-native';
import { Colors, Spacing, Radius, Shadows } from '@/constants/theme';
import { apiService } from '../../services/api';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', label: 'All', icon: null },
  { id: 'books', label: 'Books', icon: Book },
  { id: 'articles', label: 'Articles', icon: FileText },
  { id: 'quotes', label: 'Quotes', icon: MessageSquare },
];

export default function LearnScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [libraryContent, setLibraryContent] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        const data = await apiService.fetchLibraryContent();
        setLibraryContent(data);
      }
      loadData();
    }, [])
  );

  const filteredContent = libraryContent.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'books' && item.type === 'BOOK') return true;
    if (activeCategory === 'articles' && item.type === 'ARTICLE') return true;
    if (activeCategory === 'quotes' && item.type === 'QUOTE') return true;
    return false;
  });

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
          {filteredContent.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.featuredCard, { width: width * 0.75 }]} 
              onPress={() => { 
                if (item.fileUrl) {
                  const contentType = item.type?.toUpperCase();
                  if (contentType === 'BOOK') {
                    router.push({ pathname: '/reader', params: { url: item.fileUrl, title: item.title } });
                  } else if (contentType === 'ARTICLE') {
                    router.push({ 
                      pathname: '/article', 
                      params: { 
                        title: item.title, 
                        description: item.description, 
                        coverUrl: item.coverUrl, 
                        author: item.author, 
                        readTime: item.readTime 
                      } 
                    });
                  } else {
                    Linking.openURL(item.fileUrl);
                  }
                } 
              }}
            >
              <ImageBackground 
                source={item.coverUrl ? { uri: item.coverUrl } : require('@/assets/images/mountain_bg.png')}
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
                    ]}>{item.type || 'CONTENT'}</Text>
                  </View>
                  <TouchableOpacity style={styles.bookmarkButton}>
                    <Bookmark color={Colors.primary} size={20} strokeWidth={1.5} />
                  </TouchableOpacity>
                </View>
              </ImageBackground>
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.featuredSubtitle} numberOfLines={2}>Explore this {item.type?.toLowerCase() || 'content'} in our library.</Text>
                <View style={styles.featuredMetaRow}>
                  <Text style={styles.featuredMetaText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.paginationDots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
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

});
