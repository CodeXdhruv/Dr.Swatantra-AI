import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

const COLORS = {
  background: '#FCFAF8',
  primary: '#243B5A',
  textSecondary: '#6B7280',
  divider: '#E5E7EB',
};

export default function TermsOfServiceScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={COLORS.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: September 2026</Text>

        <Text style={styles.paragraph}>
          Welcome to Atmik.AI. By accessing or using our mobile application, you agree to be bound by these Terms of Service.
        </Text>

        <Text style={styles.sectionTitle}>1. Services Provided</Text>
        <Text style={styles.paragraph}>
          Atmik.AI provides an AI-powered mindfulness and journaling platform. The guidance provided by the AI is for informational and educational purposes only and is not a substitute for professional mental health care or medical advice.
        </Text>

        <Text style={styles.sectionTitle}>2. User Accounts</Text>
        <Text style={styles.paragraph}>
          You must provide accurate information when creating an account. You are responsible for safeguarding the password and for all activities that occur under your account. We reserve the right to terminate accounts that violate these Terms.
        </Text>

        <Text style={styles.sectionTitle}>3. Acceptable Use</Text>
        <Text style={styles.paragraph}>
          You agree not to use the application to:{'\n'}
          • Submit illegal, harmful, or abusive content to the AI.{'\n'}
          • Attempt to reverse engineer or hack the application.{'\n'}
          • Interfere with or disrupt the integrity of the service.
        </Text>

        <Text style={styles.sectionTitle}>4. Intellectual Property</Text>
        <Text style={styles.paragraph}>
          The application, including its original content, features, and functionality, are owned by Atmik.AI and are protected by international copyright and intellectual property laws.
        </Text>

        <Text style={styles.sectionTitle}>5. Disclaimer of Warranties</Text>
        <Text style={styles.paragraph}>
          The service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties regarding the reliability, accuracy, or availability of the AI generation features.
        </Text>

        <Text style={styles.sectionTitle}>6. Contact Information</Text>
        <Text style={styles.paragraph}>
          For any questions regarding these Terms, please contact us at support@atmik.ai.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: COLORS.primary },
  content: { padding: 24, paddingBottom: 60 },
  lastUpdated: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 24, fontStyle: 'italic' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.primary, marginTop: 24, marginBottom: 12 },
  paragraph: { fontSize: 14, color: COLORS.primary, lineHeight: 22 },
});
