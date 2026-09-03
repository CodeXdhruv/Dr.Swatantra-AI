import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { dbService, ReflectionRecord } from '../../services/db';
import { MessageCircle, CircleDot, Star } from 'lucide-react-native';

export const ReflectionsPreview = () => {
  const router = useRouter();
  const [recent, setRecent] = useState<ReflectionRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadRecent = async () => {
        const records = await dbService.getRecentReflections(3);
        setRecent(records);
      };
      loadRecent();
    }, [])
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'look_within': return <CircleDot color="#B8954A" size={14} />;
      case 'wisdom': return <Star color="#B8954A" size={14} />;
      case 'conversation': return <MessageCircle color="#1B2D4F" size={14} />;
      default: return null;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'todays_reflection': return "TODAY'S REFLECTION";
      case 'look_within': return "LOOK WITHIN";
      case 'wisdom': return "A THOUGHT TO CARRY";
      case 'conversation': return "CONVERSATION";
      default: return "REFLECTION";
    }
  };

  if (recent.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Your meaningful moments will appear here.</Text>
        <Text style={styles.emptySub}>Take a moment whenever something feels worth keeping.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {recent.map((record) => (
        <View key={record.id} style={styles.itemCard}>
          <View style={styles.itemHeader}>
            {getIcon(record.type)}
            <Text style={styles.itemLabel}>{getLabel(record.type)}</Text>
          </View>
          
          {record.question && <Text style={styles.questionText}>{record.question}</Text>}
          
          {record.userResponse && (
            <Text style={styles.responseText} numberOfLines={3}>
              "{record.userResponse}"
            </Text>
          )}

          <TouchableOpacity 
            style={styles.viewBtn}
            onPress={() => router.push(`/reflections/${record.id}`)}
          >
            <Text style={styles.viewBtnText}>View →</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity 
        style={styles.viewAllBtn}
        onPress={() => router.push('/reflections')}
      >
        <Text style={styles.viewAllText}>View all →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(27, 45, 79, 0.02)',
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#1B2D4F',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 13,
    color: '#8A7E6E',
    textAlign: 'center',
    lineHeight: 20,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(27, 45, 79, 0.05)',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  itemLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A7E6E',
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1B2D4F',
    marginBottom: 8,
    lineHeight: 22,
  },
  responseText: {
    fontSize: 14,
    color: '#8A7E6E',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  viewBtn: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  viewBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B8954A',
  },
  viewAllBtn: {
    alignSelf: 'center',
    paddingVertical: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B2D4F',
  }
});
