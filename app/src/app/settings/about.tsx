import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import packageJson from '../../../package.json';

const COLORS = {
  background: '#FCFAF8',
  primary: '#243B5A',
  textSecondary: '#6B7280',
  divider: '#E5E7EB',
};

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={COLORS.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={require('@/assets/images/app_icon.png')} style={styles.logo} />
        </View>
        <Text style={styles.appName}>Atmik.AI</Text>
        <Text style={styles.version}>Version {packageJson.version}</Text>

        <Text style={styles.description}>
          A minimal, secure platform for mindfulness, habit tracking, and personal growth powered by AI.
        </Text>

        <View style={styles.footer}>
          <Text style={styles.copyright}>© 2026 Atmik.AI. All rights reserved.</Text>
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
  content: { padding: 24, alignItems: 'center', paddingTop: 60 },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
    overflow: 'hidden',
  },
  logo: { width: '80%', height: '80%', resizeMode: 'contain' },
  appName: { fontSize: 24, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
  version: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 24 },
  description: { fontSize: 15, color: COLORS.primary, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
  footer: { marginTop: 60 },
  copyright: { fontSize: 12, color: COLORS.textSecondary },
});
