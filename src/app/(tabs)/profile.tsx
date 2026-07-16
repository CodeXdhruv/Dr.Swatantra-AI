import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder} />
          <Text style={styles.name}>Rahul</Text>
          <Text style={styles.email}>rahul@example.com</Text>
        </View>

        <Card variant="default" style={styles.placeholderCard} padding="lg">
          <Text style={styles.cardTitle}>Account Settings</Text>
          <Text style={styles.cardSubtitle}>Manage your preferences.</Text>
        </Card>

        <Button 
          title="Sign Out" 
          variant="outline" 
          onPress={() => router.push('/auth')} 
          style={styles.signOutButton}
        />
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
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.accent,
    opacity: 0.2,
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  placeholderCard: {
    marginBottom: Spacing.xl,
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
  signOutButton: {
    marginTop: 'auto',
  },
});
