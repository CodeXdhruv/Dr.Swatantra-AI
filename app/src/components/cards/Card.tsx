import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle, StyleProp } from 'react-native';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { BlurView } from 'expo-blur';

interface CardProps extends ViewProps {
  variant?: 'default' | 'glass' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  style,
  ...props
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'sm': return 12;
      case 'md': return 20;
      case 'lg': return 24;
      default: return 20;
    }
  };

  const baseStyle: ViewStyle = {
    padding: getPadding(),
    borderRadius: Radius.lg,
  };

  if (variant === 'glass') {
    return (
      <BlurView intensity={40} tint="light" style={[styles.glassContainer, baseStyle, style]} {...props as any}>
        {children}
      </BlurView>
    );
  }

  const variantStyles = {
    default: {
      backgroundColor: Colors.card,
      ...Shadows.soft,
    },
    elevated: {
      backgroundColor: Colors.card,
      ...Shadows.glass,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: Colors.border,
    },
  };

  return (
    <View style={[styles.container, variantStyles[variant], baseStyle, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  glassContainer: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
  },
});
