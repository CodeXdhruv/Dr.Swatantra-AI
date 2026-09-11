import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, AlertTriangle } from 'lucide-react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const COLORS = {
  background: '#FCFAF8',
  primary: '#243B5A',
  textSecondary: '#6B7280',
  divider: '#E5E7EB',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
};

export default function DeleteAccountScreen() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Are you absolutely sure?",
      "This action cannot be undone. All your data, chat history, and personal information will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete My Account", 
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              const user = auth().currentUser;
              if (user) {
                // 1. In a real production app, call your backend /delete endpoint here
                // await fetch(`https://your-api.com/users/${user.uid}`, { method: 'DELETE' });

                // 2. Delete from Firebase Auth
                await user.delete();

                // 3. Clear Google Signin cache if applicable
                try {
                  await GoogleSignin.signOut();
                } catch (e) {}

                // 4. Navigate out
                router.replace('/auth');
              }
            } catch (error: any) {
              console.error(error);
              if (error.code === 'auth/requires-recent-login') {
                Alert.alert("Re-authentication required", "Please sign out and sign back in to verify your identity before deleting your account.");
              } else {
                Alert.alert("Error", "An error occurred while deleting your account.");
              }
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={COLORS.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delete Account</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.warningContainer}>
          <AlertTriangle color={COLORS.danger} size={32} />
          <Text style={styles.warningTitle}>Delete your account?</Text>
        </View>

        <Text style={styles.description}>
          This action permanently deletes your account and applicable associated data.
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• All your profile information</Text>
          <Text style={styles.bulletItem}>• Your entire chat history with AI</Text>
          <Text style={styles.bulletItem}>• Any server-stored preferences</Text>
          <Text style={styles.bulletItem}>• Notification tokens</Text>
        </View>

        <Text style={styles.note}>
          Local app data (like unsynced habits) will be cleared when you uninstall the app.
        </Text>

        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={handleDeleteAccount}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.deleteButtonText}>I understand, delete my account</Text>
          )}
        </TouchableOpacity>
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
  warningContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.dangerBg,
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
  },
  warningTitle: { fontSize: 18, fontWeight: '700', color: COLORS.danger, marginTop: 12 },
  description: { fontSize: 15, color: COLORS.primary, lineHeight: 22, marginBottom: 20 },
  bulletList: { marginBottom: 24, paddingLeft: 8 },
  bulletItem: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
  note: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic', marginBottom: 40 },
  deleteButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: { fontSize: 15, fontWeight: '600', color: '#FFF' },
});
