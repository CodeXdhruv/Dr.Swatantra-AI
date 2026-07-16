import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { Card } from '@/components/cards/Card';

export default function LearnScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Library & Wisdom</Text>
          <Text style={styles.subtitle}>Explore modules, books, and articles.</Text>
        </View>

        <Card variant="elevated" style={styles.placeholderCard} padding="lg">
          <View style={styles.imagePlaceholder} />
          <Text style={styles.cardTitle}>The Science of the Soul</Text>
          <Text style={styles.cardSubtitle}>5 min read</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: 120,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  placeholderCard: {
    marginBottom: Spacing.lg,
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    marginBottom: Spacing.md,
    opacity: 0.5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
