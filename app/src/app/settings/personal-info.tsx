import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import auth from '@react-native-firebase/auth';

const COLORS = {
  background: '#FCFAF8',
  primary: '#243B5A',
  textSecondary: '#6B7280',
  divider: '#E5E7EB',
};

export default function PersonalInfoScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: 'Loading...',
    email: '...',
  });

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setUserData({
        name: user.displayName || 'Atmik User',
        email: user.email || '',
      });
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={COLORS.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal information</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Your personal information is securely managed via Google Authentication.
        </Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{userData.name}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email Address</Text>
          <Text style={styles.value}>{userData.email}</Text>
        </View>
        
        <Text style={styles.note}>
          To change this information, update your Google Account settings.
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
  description: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 24 },
  fieldContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  label: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 4 },
  value: { fontSize: 16, color: COLORS.primary },
  note: { fontSize: 12, color: COLORS.textSecondary, marginTop: 16, fontStyle: 'italic' }
});
