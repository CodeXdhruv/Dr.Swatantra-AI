import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, MessageSquare, BookOpen, Heart, User } from 'lucide-react-native';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

const { width } = Dimensions.get('window');

export const GlassTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="light" style={[StyleSheet.absoluteFill, styles.blurContainer]} />
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const isCenter = index === 2; // AI Chat button in the center

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const getIcon = () => {
            const color = isFocused ? Colors.primary : Colors.textSecondary;
            const size = 24;
            const strokeWidth = 1.75;

            switch (route.name) {
              case 'index': return <Home color={color} size={size} strokeWidth={strokeWidth} />;
              case 'learn': return <BookOpen color={color} size={size} strokeWidth={strokeWidth} />;
              case 'chat': return <MessageSquare color={Colors.surface} size={28} strokeWidth={strokeWidth} />;
              case 'health': return <Heart color={color} size={size} strokeWidth={strokeWidth} />;
              case 'profile': return <User color={color} size={size} strokeWidth={strokeWidth} />;
              default: return <Home color={color} size={size} strokeWidth={strokeWidth} />;
            }
          };

          if (isCenter) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.tabItem}
                activeOpacity={0.8}
              >
                <View style={styles.centerButton}>
                  <Image source={require('@/assets/images/nav_bar_icon.png')} style={{ width: 100, height: 100, tintColor: '#DEAB5B', marginTop: 6 }} resizeMode="contain" />
                </View>
                {isFocused && <View style={[styles.indicator, { backgroundColor: '#DEAB5B' }]} />}
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.6}
            >
              {getIcon()}
              {isFocused && <View style={styles.indicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    backgroundColor: 'transparent',
    borderRadius: 36,
  },
  blurContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(222, 171, 91, 0.3)', // Light orange accent border
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 72 : 64,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  indicator: {
    position: 'absolute',
    bottom: 12,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  centerButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0, // Perfectly centered with other icons
  },
  centerButton: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
