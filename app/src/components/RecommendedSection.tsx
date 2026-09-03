import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { Bookmark, ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, Radius, Shadows } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 22;
const COLUMN_GAP = 12;
const CONTENT_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;
const BOOK_COL_WIDTH = CONTENT_WIDTH * 0.42;
const ARTICLE_COL_WIDTH = CONTENT_WIDTH * 0.58 - COLUMN_GAP;

// ─── Types ───────────────────────────────────────────────
interface LibraryItem {
  id: string;
  title: string;
  type: 'BOOK' | 'ARTICLE' | string;
  coverUrl?: string | null;
  fileUrl?: string | null;
  author?: string | null;
  description?: string | null;
  readTime?: number | null;
  createdAt?: string;
}

interface RecommendedSectionProps {
  content: LibraryItem[];
  onViewAll: () => void;
  onPressBook: (item: LibraryItem) => void;
  onPressArticle: (item: LibraryItem) => void;
}

// ─── Featured Book Card ──────────────────────────────────
const FeaturedBookCard = ({
  item,
  onPress,
}: {
  item: LibraryItem;
  onPress: () => void;
}) => {
  const coverSource = item.coverUrl
    ? { uri: item.coverUrl }
    : require('@/assets/images/mountain_bg.png');

  return (
    <TouchableOpacity
      style={styles.bookCard}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {/* Cover image — occupies upper ~65% */}
      <ImageBackground
        source={coverSource}
        style={styles.bookCover}
        imageStyle={styles.bookCoverImage}
        resizeMode="cover"
      >
        <View style={styles.bookBadge}>
          <Text style={styles.bookBadgeText}>BOOK</Text>
        </View>
      </ImageBackground>

      {/* Info — occupies lower ~35% */}
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title || 'Untitled'}
        </Text>
        <View style={styles.bookFooter}>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {item.author || 'Dr. Swatantra Jain'}
          </Text>
          <Bookmark
            color={Colors.textSecondary}
            size={15}
            strokeWidth={1.5}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Article Recommendation Card ─────────────────────────
const ArticleRecommendationCard = ({
  item,
  onPress,
}: {
  item: LibraryItem;
  onPress: () => void;
}) => {
  const thumbSource = item.coverUrl
    ? { uri: item.coverUrl }
    : require('@/assets/images/quotes_background.png');

  return (
    <TouchableOpacity
      style={styles.articleCard}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {/* Left side — text content */}
      <View style={styles.articleTextCol}>
        <View style={styles.articleBadge}>
          <Text style={styles.articleBadgeText}>ARTICLE</Text>
        </View>
        <Text style={styles.articleTitle} numberOfLines={2}>
          {item.title || 'Untitled'}
        </Text>
        <Text style={styles.articleMeta}>
          {item.readTime ? `${item.readTime} min read` : '5 min read'}
        </Text>
      </View>

      {/* Right side — thumbnail + bookmark */}
      <View style={styles.articleRightCol}>
        <Bookmark
          color={Colors.textSecondary}
          size={14}
          strokeWidth={1.5}
        />
        <Image
          source={thumbSource}
          style={styles.articleThumb}
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Section ────────────────────────────────────────
export const RecommendedSection = ({
  content,
  onViewAll,
  onPressBook,
  onPressArticle,
}: RecommendedSectionProps) => {
  // Pick the first BOOK for the featured card
  const featuredBook = content.find((i) => i.type === 'BOOK') || content[0];

  // Pick up to 3 articles (or non-featured items) for the right column
  const articles = content
    .filter((i) => i.id !== featuredBook?.id)
    .slice(0, 3);

  if (!featuredBook && articles.length === 0) {
    return null; // nothing to show
  }

  return (
    <View style={styles.section}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionHeading}>Recommended for You</Text>
        <TouchableOpacity
          onPress={onViewAll}
          style={styles.viewAllBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>View all</Text>
          <ChevronRight
            color={Colors.accent}
            size={14}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>

      {/* Two-column grid */}
      <View style={styles.grid}>
        {/* Left — Featured Book */}
        <View style={{ width: BOOK_COL_WIDTH }}>
          {featuredBook && (
            <FeaturedBookCard
              item={featuredBook}
              onPress={() => onPressBook(featuredBook)}
            />
          )}
        </View>

        {/* Right — Articles stack */}
        <View style={styles.articleColumn}>
          {articles.map((item) => (
            <ArticleRecommendationCard
              key={item.id}
              item={item}
              onPress={() => onPressArticle(item)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────
const BOOK_CARD_HEIGHT = 240;
const ARTICLE_GAP = 7;
// Each article card height = (bookCardHeight - 2 * gap) / 3
const ARTICLE_CARD_HEIGHT = (BOOK_CARD_HEIGHT - ARTICLE_GAP * 2) / 3;

const styles = StyleSheet.create({
  // Section wrapper
  section: {
    marginBottom: Spacing.lg,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.primary,
    fontFamily: 'serif',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.accent,
  },

  // Grid
  grid: {
    flexDirection: 'row',
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: COLUMN_GAP,
  },

  // ─── Book Card ──────────────────────────────────────
  bookCard: {
    height: BOOK_CARD_HEIGHT,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.soft,
  },
  bookCover: {
    flex: 0.65,
    justifyContent: 'flex-start',
    padding: 10,
  },
  bookCoverImage: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  bookBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  bookBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bookInfo: {
    flex: 0.35,
    padding: 12,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'serif',
    lineHeight: 19,
  },
  bookFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookAuthor: {
    fontSize: 10,
    color: Colors.textSecondary,
    flex: 1,
    marginRight: 6,
  },

  // ─── Article Column ─────────────────────────────────
  articleColumn: {
    flex: 1,
    height: BOOK_CARD_HEIGHT,
    justifyContent: 'space-between',
    gap: ARTICLE_GAP,
  },

  // ─── Article Card ───────────────────────────────────
  articleCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 5,
    ...Shadows.soft,
  },
  articleTextCol: {
    flex: 1,
    paddingRight: 6,
    justifyContent: 'center',
  },
  articleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 3,
  },
  articleBadgeText: {
    color: '#4F6DC5',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  articleTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    lineHeight: 16,
    marginBottom: 2,
  },
  articleMeta: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  articleRightCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    paddingVertical: 2,
  },
  articleThumb: {
    width: 44,
    height: 44,
    borderRadius: 6,
  },
});
