import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell } from 'lucide-react-native';
import * as Notifications from 'expo-notifications';

const COLORS = {
  background: '#FCFAF8',
  primary: '#243B5A',
  textSecondary: '#6B7280',
  divider: '#E5E7EB',
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<string>('checking...');

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setStatus(status === 'granted' ? 'Enabled' : 'Disabled');
  };

  const openSystemSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={COLORS.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Manage how Atmik.AI communicates with you.
        </Text>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Bell color={COLORS.primary} size={20} />
            <Text style={styles.rowLabel}>System Notifications</Text>
          </View>
          <Text style={styles.rowValue}>{status}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={openSystemSettings}>
          <Text style={styles.buttonText}>Manage in Device Settings</Text>
        </TouchableOpacity>
        
        <Text style={styles.note}>
          Daily reminders, inspiration, and wellness prompts require system notifications to be enabled.
        </Text>
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
  description: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 32 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    marginBottom: 24,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLabel: { fontSize: 16, color: COLORS.primary, marginLeft: 12 },
  rowValue: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary },
  button: {
    backgroundColor: 'rgba(36, 59, 90, 0.05)',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
  note: { fontSize: 13, color: COLORS.textSecondary, marginTop: 16, lineHeight: 20 },
});
