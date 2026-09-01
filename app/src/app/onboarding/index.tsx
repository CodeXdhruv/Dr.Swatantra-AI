import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors, Spacing } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setActiveIndex(currentIndex);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        bounces={false}
      >
        {/* Screen 1 */}
        <View style={{ width, height }}>
          <ImageBackground
            source={require('@/assets/images/onboarding_first.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.contentContainer}>
                <View style={[styles.textContainer, { justifyContent: 'center', marginTop: 180 }]}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.title, { fontSize: 36 }]}>Begin within</Text>
                    <View style={styles.dot} />
                  </View>

                  <View style={[styles.divider, { alignSelf: 'flex-start', marginTop: 12, marginBottom: 12 }]} />

                  <Text style={[styles.subtitle, { fontSize: 18, lineHeight: 30 }]}>
                    Awareness is the first step{'\n'}toward transformation.
                  </Text>
                </View>
              </View>
            </SafeAreaView>
          </ImageBackground>
        </View>

        {/* Screen 2 */}
        <View style={{ width, height }}>
          <ImageBackground
            source={require('@/assets/images/onboarding_second.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.contentContainer}>
                {/* Center text below the lotus, which is part of the illustration */}
                <View style={[styles.textContainer, { justifyContent: 'center', alignItems: 'center', marginTop: 310 }]}>
                  <View style={styles.titleRowCentered}>
                    <Text style={[styles.title, { textAlign: 'center', fontSize: 36 }]}>Awaken. Understand.{'\n'}Transform</Text>
                    <View style={[styles.dot, { marginBottom: 12 }]} />
                  </View>
                  <View style={[styles.divider, { marginBottom: 16, marginTop: 4 }]} />

                  <Text style={[styles.subtitle, { textAlign: 'center', marginTop: 8, fontSize: 18, lineHeight: 30 }]}>
                    Thoughtful insights and timeless{'\n'}practices for a meaningful life.
                  </Text>
                </View>

                <View style={styles.footer}>
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => router.push('/auth')}
                  >
                    <Text style={styles.nextButtonText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </ImageBackground>
        </View>
      </ScrollView>

      {/* Pagination Indicators (Optional but good for carousels) */}
      <View style={styles.paginationContainer}>
        {[0, 1].map((index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              activeIndex === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    width: width,
    height: height,
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  titleRowCentered: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32, // Slightly smaller to fit "Awaken. Understand. Transform."
    fontWeight: '600',
    color: '#0F265C', // Dark blue
    fontFamily: 'serif',
    letterSpacing: -0.5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4AF37', // Gold dot
    marginLeft: 4,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: '#D4AF37', // Gold line
    marginTop: 20,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16, // Slightly smaller
    color: '#64748B', // Slate gray
    lineHeight: 24,
    fontFamily: 'sans-serif',
  },
  footer: {
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#0F265C',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: height * 0.2,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#0F265C',
    width: 24,
  },
});
