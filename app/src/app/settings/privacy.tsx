import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react-native';

const COLORS = {
  background: '#FCFAF8',
  primary: '#243B5A',
  textSecondary: '#6B7280',
  divider: '#E5E7EB',
};

export default function PrivacyScreen() {
  const router = useRouter();

  const SettingsRow = ({ title, onPress }: { title: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.rowText}>{title}</Text>
      <ChevronRight color={COLORS.textSecondary} size={20} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={COLORS.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Data</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Shield color={COLORS.primary} size={40} strokeWidth={1.5} />
        </View>
        <Text style={styles.description}>
          Atmik.AI believes in data minimization. We only collect the information absolutely necessary to provide you with a personalized experience.
        </Text>

        <View style={styles.section}>
          <SettingsRow title="Privacy Policy" onPress={() => router.push('/settings/privacy-policy')} />
          <SettingsRow title="Terms of Service" onPress={() => router.push('/settings/tos')} />
        </View>
        
        <View style={[styles.section, { marginTop: 32 }]}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <SettingsRow title="Delete Account" onPress={() => router.push('/settings/delete-account')} />
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
  iconContainer: { marginBottom: 16 },
  description: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 22, marginBottom: 32 },
  section: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 8, marginTop: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  rowText: { fontSize: 16, color: COLORS.primary },
});
