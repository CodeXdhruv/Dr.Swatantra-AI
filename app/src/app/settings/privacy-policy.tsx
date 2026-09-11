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

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={COLORS.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: September 2026</Text>

        <Text style={styles.paragraph}>
          Atmik.AI ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
        </Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Account Information:</Text> When you sign in using Google or Email, we collect your email address, name, and profile picture provided by the authentication service (Firebase Auth).{'\n\n'}
          <Text style={styles.bold}>Chat History:</Text> When you interact with our AI, the content of your conversations is transmitted to our servers and stored in our database (Cloudflare D1) to maintain conversation context.{'\n\n'}
          <Text style={styles.bold}>Device & App Data:</Text> We collect notification push tokens via Expo to send you reminders. Usage data and wellness habits are stored locally on your device.
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          • To provide, maintain, and personalize the application.{'\n'}
          • To communicate with the AI models to generate responses.{'\n'}
          • To send you requested push notifications.{'\n'}
          • To manage your account and provide customer support.
        </Text>

        <Text style={styles.sectionTitle}>3. Information Sharing</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>AI Processors:</Text> Your chat prompts are transmitted to our AI API partners (e.g., OpenAI or Anthropic) solely for the purpose of generating responses. These partners are strictly prohibited from using your data to train their public models.{'\n\n'}
          <Text style={styles.bold}>Infrastructure:</Text> Data is stored securely on Cloudflare D1 and Firebase.
          {'\n\n'}We do not sell your personal information to third parties.
        </Text>

        <Text style={styles.sectionTitle}>4. Data Retention & Deletion</Text>
        <Text style={styles.paragraph}>
          We retain your personal information only for as long as your account is active. You may delete your account at any time via the Settings menu. Deleting your account will permanently erase your profile, email, chat history, and notification tokens from our active databases. Local device data is removed when you uninstall the app.
        </Text>

        <Text style={styles.sectionTitle}>5. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have questions about this Privacy Policy, please contact us at support@atmik.ai.
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
  bold: { fontWeight: '700' },
});
