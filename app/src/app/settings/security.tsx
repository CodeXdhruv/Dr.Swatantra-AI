import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, ShieldCheck } from 'lucide-react-native';
import auth from '@react-native-firebase/auth';

const COLORS = {
  background: '#FCFAF8',
  primary: '#243B5A',
  textSecondary: '#6B7280',
  divider: '#E5E7EB',
  success: '#10B981',
};

export default function SecurityScreen() {
  const router = useRouter();
  const user = auth().currentUser;
  
  // Basic check for auth provider
  const providers = user?.providerData.map(p => p.providerId) || [];
  const isGoogle = providers.includes('google.com');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={COLORS.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.statusCard}>
          <ShieldCheck color={COLORS.success} size={32} />
          <Text style={styles.statusTitle}>Account Secured</Text>
          <Text style={styles.statusDescription}>
            Your authentication and session security is fully managed by your login provider.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Sign-in method</Text>
        <View style={styles.providerRow}>
          <Text style={styles.providerLabel}>Linked Provider</Text>
          <Text style={styles.providerValue}>{isGoogle ? 'Google Account' : 'Email/Password'}</Text>
        </View>
      </View>
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
  content: { padding: 24 },
  statusCard: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: 32,
  },
  statusTitle: { fontSize: 16, fontWeight: '600', color: COLORS.primary, marginTop: 12, marginBottom: 4 },
  statusDescription: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: COLORS.primary, marginBottom: 16 },
  providerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  providerLabel: { fontSize: 16, color: COLORS.primary },
  providerValue: { fontSize: 16, color: COLORS.textSecondary },
});
