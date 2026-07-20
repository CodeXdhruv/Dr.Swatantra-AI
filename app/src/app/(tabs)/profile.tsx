import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, Bell, Shield, Moon, Globe, LogOut, ChevronRight, Leaf } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#FAFBFC',
  card: '#FFFFFF',
  primary: '#243B5A',
  accent: '#D8B97A',
  divider: '#F0F0F0',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  journeyBg: '#F8F9F5', // Soft greenish/yellowish bg for Journey card
  iconBg: '#F3F4F6',
};

const FONTS = {
  heading: 'serif',
  title: 'System',
  body: 'System',
};

export default function ProfileScreen() {
  const router = useRouter();

  const ACCOUNT_ITEMS = [
    { id: '1', icon: User, title: 'Account Settings', subtitle: 'Manage your personal information' },
    { id: '2', icon: Bell, title: 'Notifications', subtitle: 'Manage your notification preferences' },
    { id: '3', icon: Shield, title: 'Privacy & Security', subtitle: 'Manage your privacy and security' },
    { id: '4', icon: Moon, title: 'Appearance', subtitle: 'Choose your theme preference' },
    { id: '5', icon: Globe, title: 'Language', subtitle: 'Select your preferred language' },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header Profile Section */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image 
                source={require('@/assets/images/app_icon.png')} 
                style={styles.avatarImage} 
                resizeMode="contain" 
              />
            </View>
            
            <Text style={styles.name}>Rahul</Text>
            
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <View style={styles.diamond} />
              <View style={styles.dividerLine} />
            </View>
            
            <Text style={styles.email}>rahul@example.com</Text>
            
            <TouchableOpacity style={styles.editProfileButton}>
              <Image source={require('@/assets/images/nav_bar_icon.png')} style={{width: 14, height: 14, tintColor: COLORS.accent, marginRight: 6}} resizeMode="contain" />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Account Section */}
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.accountCard}>
            {ACCOUNT_ITEMS.map((item, index) => (
              <TouchableOpacity key={item.id} style={[styles.accountItem, index === ACCOUNT_ITEMS.length - 1 && styles.accountItemLast]} activeOpacity={0.7}>
                <View style={styles.accountItemIcon}>
                  <item.icon color={COLORS.primary} size={20} strokeWidth={1.5} />
                </View>
                <View style={styles.accountItemText}>
                  <Text style={styles.accountItemTitle}>{item.title}</Text>
                  <Text style={styles.accountItemSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRight color={COLORS.textTertiary} size={20} strokeWidth={1.5} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity 
            style={styles.signOutCard} 
            activeOpacity={0.7}
            onPress={() => router.replace('/auth')}
          >
            <View style={[styles.accountItemIcon, { backgroundColor: COLORS.dangerBg }]}>
              <LogOut color={COLORS.danger} size={20} strokeWidth={1.5} />
            </View>
            <View style={styles.accountItemText}>
              <Text style={styles.signOutTitle}>Sign Out</Text>
              <Text style={styles.accountItemSubtitle}>You will be signed out from this device</Text>
            </View>
            <ChevronRight color={COLORS.danger} size={20} strokeWidth={1.5} />
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120, // Space for navigation bar
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
    marginBottom: 16,
  },
  avatarImage: {
    width: 64,
    height: 64,
  },
  name: {
    fontSize: 28,
    fontFamily: FONTS.heading,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  dividerLine: {
    width: 24,
    height: 1,
    backgroundColor: COLORS.accent,
    opacity: 0.5,
  },
  diamond: {
    width: 6,
    height: 6,
    backgroundColor: COLORS.accent,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 8,
  },
  email: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
    marginTop: 4,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  editProfileText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.primary,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 12,
    marginLeft: 4,
  },
  accountCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  accountItemLast: {
    borderBottomWidth: 0,
  },
  accountItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.iconBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  accountItemText: {
    flex: 1,
  },
  accountItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 2,
  },
  accountItemSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  signOutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)', // Very faint red border
  },
  signOutTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.danger,
    marginBottom: 2,
  },
});
