import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, RotateCcw, Heart, BookOpen, Star, Leaf, CheckCheck, ThumbsUp, Copy, Volume2, Sparkles, Mic, Send, ShieldCheck } from 'lucide-react-native';
import { Colors, Spacing, Radius, Shadows, Fonts } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function ChatScreen() {
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton}>
            <ChevronLeft color={Colors.textPrimary} size={24} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <View style={styles.headerTitleRow}>
              <Image source={require('@/assets/images/lotus_icon.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
              <Text style={styles.headerTitle}>AI Chat</Text>
            </View>
            <Text style={styles.headerSubtitle}>Your Inner Guide, Always with You</Text>
          </View>
          
          <TouchableOpacity style={styles.iconButton}>
            <RotateCcw color={Colors.textPrimary} size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Banner Card */}
          <View style={styles.bannerContainer}>
            <LinearGradient
              colors={['#ffffff', '#f0f5f9']}
              style={styles.bannerCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.bannerContent}>
                <View style={styles.bannerAvatar}>
                  <Image source={require('@/assets/images/lotus_icon.png')} style={{ width: 20, height: 20 }} resizeMode="contain" />
                </View>
                <View style={styles.bannerTextContainer}>
                  <View style={styles.botNameRow}>
                    <Text style={styles.botName}>Dr. Swatantra AI</Text>
                    <View style={styles.onlineDot} />
                  </View>
                  <Text style={styles.botDescription}>
                    Your companion for wisdom,{'\n'}health, growth and inner peace.
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Categories/Topics */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.topicsScroll}
            style={styles.topicsContainer}
          >
            {[
              { label: 'Meditation', image: require('@/assets/images/lotus_icon.png') },
              { label: 'Health', icon: Heart },
              { label: 'Wisdom', icon: BookOpen },
              { label: 'Atmik Intelligence', image: require('@/assets/images/lotus_icon.png') },
              { label: 'Nature', image: require('@/assets/images/lotus_icon.png') },
            ].map((topic, index) => (
              <TouchableOpacity key={index} style={styles.topicChip}>
                {topic.image ? (
                  <Image source={topic.image} style={{ width: 14, height: 14 }} resizeMode="contain" />
                ) : (
                  topic.icon && <topic.icon color={Colors.textSecondary} size={14} />
                )}
                <Text style={styles.topicText}>{topic.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerDiamond} />
            <Text style={styles.dividerText}>Today, 10:30 AM</Text>
            <View style={styles.dividerDiamond} />
            <View style={styles.dividerLine} />
          </View>

          {/* User Message 1 */}
          <View style={styles.userMessageContainer}>
            <View style={styles.userBubble}>
              <Text style={styles.userMessageText}>
                How can I improve my mental peace and reduce daily stress?
              </Text>
              <View style={styles.messageFooter}>
                <Text style={styles.messageTime}>10:30 AM</Text>
                <CheckCheck color="#3B82F6" size={14} />
              </View>
            </View>
          </View>

          {/* AI Message 1 */}
          <View style={styles.aiMessageContainer}>
            <View style={styles.aiAvatar}>
              <Image source={require('@/assets/images/lotus_icon.png')} style={{ width: 20, height: 20 }} resizeMode="contain" />
            </View>
            <View style={styles.aiBubbleContainer}>
              <View style={styles.aiBubble}>
                <Text style={styles.aiMessageText}>
                  Mental peace comes from understanding your true self and living in alignment with your values.{'\n\n'}
                  Here are a few steps you can follow:
                </Text>
                
                <View style={styles.bulletList}>
                  {[
                    'Start your day with 10 minutes of deep breathing.',
                    'Practice gratitude daily.',
                    'Reduce overthinking by focusing on one task at a time.',
                    'Spend time in nature.',
                    'Read uplifting wisdom and reflect.'
                  ].map((bullet, i) => (
                    <View key={i} style={styles.bulletItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
                
                <Text style={styles.aiMessageText}>
                  Consistency is the key. Small daily steps create a powerful transformation.
                </Text>
                <Text style={styles.aiMessageTime}>10:31 AM</Text>
              </View>
            </View>
            
            <View style={styles.messageActions}>
              <TouchableOpacity style={styles.actionButton}>
                <ThumbsUp color={Colors.textSecondary} size={14} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Copy color={Colors.textSecondary} size={14} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Volume2 color={Colors.textSecondary} size={14} />
              </TouchableOpacity>
            </View>
          </View>

          {/* User Message 2 */}
          <View style={styles.userMessageContainer}>
            <View style={styles.userBubble}>
              <Text style={styles.userMessageText}>
                Can you suggest a simple daily routine for a balanced body and mind?
              </Text>
              <View style={styles.messageFooter}>
                <Text style={styles.messageTime}>10:32 AM</Text>
                <CheckCheck color="#3B82F6" size={14} />
              </View>
            </View>
          </View>
          
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.sparkleButton}>
              <Sparkles color={Colors.accent} size={20} />
            </TouchableOpacity>
            
            <TextInput 
              style={styles.textInput}
              placeholder="Type your message..."
              placeholderTextColor={Colors.textSecondary}
              multiline
            />
            
            <TouchableOpacity style={styles.micButton}>
              <Mic color={Colors.textSecondary} size={20} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.sendButton}>
              <Send color="#FFFFFF" size={18} style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.disclaimerContainer}>
            <ShieldCheck color={Colors.textSecondary} size={12} />
            <Text style={styles.disclaimerText}>
              AI responses are for guidance only, not a substitute for professional advice.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFCFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg, // increased to avoid camera bezel
    paddingBottom: Spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.soft,
    shadowOpacity: 0.02,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.primary,
    fontFamily: Fonts.serif,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  bannerContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  bannerCard: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8F1F8',
    ...Shadows.soft,
  },
  bannerContent: {
    flex: 1,
    zIndex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...Shadows.soft,
  },
  bannerTextContainer: {
    alignItems: 'center',
  },
  botNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  botName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    fontFamily: Fonts.serif,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  botDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
  },
  topicsContainer: {
    marginTop: Spacing.md,
  },
  topicsScroll: {
    paddingHorizontal: Spacing.lg,
    gap: 12,
  },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.soft,
    shadowOpacity: 0.02,
  },
  topicText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  dividerLine: {
    width: 24,
    height: 1,
    backgroundColor: Colors.accent,
    opacity: 0.5,
  },
  dividerDiamond: {
    width: 4,
    height: 4,
    backgroundColor: Colors.accent,
    transform: [{ rotate: '45deg' }],
  },
  dividerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginHorizontal: 12,
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  userBubble: {
    backgroundColor: '#EEF4FF',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderBottomRightRadius: 4,
    maxWidth: '80%',
  },
  userMessageText: {
    fontSize: 15,
    color: Colors.primary,
    lineHeight: 22,
    fontFamily: Fonts.serif,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 8,
  },
  messageTime: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  aiMessageContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'flex-end',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 20,
    ...Shadows.soft,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  aiBubbleContainer: {
    flex: 1,
    marginRight: 12,
  },
  aiBubble: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderBottomLeftRadius: 4,
    ...Shadows.soft,
    shadowOpacity: 0.04,
    borderWidth: 1,
    borderColor: '#F8FAFC',
  },
  aiMessageText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  bulletList: {
    marginVertical: 12,
    paddingLeft: 8,
    gap: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
    marginTop: 8,
    marginRight: 10,
  },
  bulletText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
    flex: 1,
  },
  aiMessageTime: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  messageActions: {
    gap: 8,
    marginBottom: 20,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    backgroundColor: '#FAFCFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 8,
    ...Shadows.glass,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  sparkleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF8E7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 15,
    color: Colors.textPrimary,
    maxHeight: 100,
  },
  micButton: {
    padding: 8,
    marginRight: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    marginBottom: Platform.OS === 'ios' ? 0 : 70, // Extra padding for Android tab bar
  },
  disclaimerText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
});
