import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { MessageCircle, ArrowRight } from 'lucide-react-native';

export const TalkToAtmikCard = () => {
  const router = useRouter();

  const handlePress = () => {
    // Navigates to the chat screen. 
    // The chat screen will use standard setup or contextual opening.
    router.push('/chat');
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7} 
      onPress={handlePress}
    >
      <View style={styles.headerLeft}>
        <View style={styles.iconBadge}>
          <MessageCircle color="#1B2D4F" size={20} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Talk to Atmik</Text>
          <Text style={styles.subtitle}>Bring whatever is on your mind</Text>
        </View>
      </View>
      <ArrowRight color={Colors.textSecondary} size={20} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(27, 45, 79, 0.05)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 76,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DDE4F0', // subtle blue tint
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B2D4F',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#8A7E6E',
  }
});
