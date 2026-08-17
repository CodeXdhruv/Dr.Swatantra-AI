import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Canvas, Circle, Group, SweepGradient, vec, Path, Skia, Paint, BlurMask, DashPathEffect } from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
  interpolate,
  useDerivedValue,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const CX = width / 2;
const CY = height / 2; // Exact center of the screen
const ORBIT_RADIUS = width * 0.35;

export function SplashScreen() {
  const router = useRouter();

  // Animation values
  const particleY = useSharedValue(height + 20); // Starts below screen
  const particleOpacity = useSharedValue(0);

  const rippleRadius = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);

  const wordmarkOpacity = useSharedValue(0);

  const orbitOpacity = useSharedValue(0);
  const orbitAngle = useSharedValue(-Math.PI / 2); // Start at top
  const orbitParticleOpacity = useSharedValue(0);

  useEffect(() => {
    // Sequence orchestration
    // 1. Light appears and rises
    particleOpacity.value = withTiming(1, { duration: 800 });
    particleY.value = withTiming(CY, { duration: 2500, easing: Easing.bezier(0.25, 1, 0.5, 1) }, (finished) => {
      if (finished) {
        // 2. Ripple expands
        rippleRadius.value = withTiming(150, { duration: 1500, easing: Easing.out(Easing.ease) });
        rippleOpacity.value = withSequence(
          withTiming(0.4, { duration: 200 }),
          withTiming(0, { duration: 1300 })
        );
        particleOpacity.value = withTiming(0, { duration: 300 });

        // 3. Wordmark fades in
        wordmarkOpacity.value = withDelay(400, withTiming(1, { duration: 1500 }));

        // 4. Orbit appears and particle moves
        orbitOpacity.value = withDelay(1000, withTiming(0.3, { duration: 1000 }));
        orbitParticleOpacity.value = withDelay(1000, withTiming(1, { duration: 1000 }));

        orbitAngle.value = withDelay(
          1200,
          withTiming(Math.PI * 1.5, { duration: 3000, easing: Easing.inOut(Easing.ease) }, (finished2) => {
            if (finished2) {
              // 5. Transition to Home
              runOnJS(navigateToAuth)();
            }
          })
        );
      }
    });
  }, []);

  const navigateToAuth = () => {
    // Add a slight delay before replacing to let the user absorb the logo
    setTimeout(() => {
      router.replace('/auth');
    }, 800);
  };

  // Skia derived values
  const orbitParticleX = useDerivedValue(() => CX + Math.cos(orbitAngle.value) * ORBIT_RADIUS);
  const orbitParticleY = useDerivedValue(() => CY + Math.sin(orbitAngle.value) * ORBIT_RADIUS);

  // Orbit path
  const orbitPath = Skia.Path.Make();
  orbitPath.addCircle(CX, CY, ORBIT_RADIUS);

  // Wordmark animated style
  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmarkOpacity.value,
    transform: [{ scale: interpolate(wordmarkOpacity.value, [0, 1], [0.95, 1]) }],
  }));

  return (
    <View style={styles.container}>
      <Canvas style={StyleSheet.absoluteFill}>
        {/* Background is handled by View styling */}

        {/* The Orbit */}
        <Group opacity={orbitOpacity}>
          <Path
            path={orbitPath}
            style="stroke"
            strokeWidth={1}
            color="#D4AF37" // Luxury Gold
          >
            {/* Make it an incomplete/dashed line */}
            <DashPathEffect intervals={[4, 12]} />
          </Path>
        </Group>

        {/* Orbit Particle with Bloom */}
        <Group opacity={orbitParticleOpacity}>
          {/* Glow layer */}
          <Circle cx={orbitParticleX} cy={orbitParticleY} r={6} color="#D4AF37">
            <BlurMask blur={8} style="normal" />
          </Circle>
          {/* Core layer */}
          <Circle cx={orbitParticleX} cy={orbitParticleY} r={2} color="#FFF1D0" />
        </Group>

        {/* The Ripple */}
        <Group opacity={rippleOpacity}>
          <Circle cx={CX} cy={CY} r={rippleRadius} color="#D4AF37" style="stroke" strokeWidth={1}>
            <BlurMask blur={4} style="normal" />
          </Circle>
        </Group>

        {/* Bottom Rising Particle */}
        <Group opacity={particleOpacity}>
          {/* Glow layer */}
          <Circle cx={CX} cy={particleY} r={8} color="#D4AF37">
            <BlurMask blur={12} style="normal" />
          </Circle>
          {/* Core layer */}
          <Circle cx={CX} cy={particleY} r={2.5} color="#FFF1D0" />
        </Group>
      </Canvas>

      {/* Overlaid Wordmark */}
      <Animated.View style={[styles.wordmarkContainer, wordmarkStyle]}>
        <View style={styles.row}>
          <Animated.Text style={[styles.samarkanText, { color: '#1C1C1E' }]}>Atmik AI</Animated.Text>
        </View>
        <Animated.Text style={styles.tagline} numberOfLines={1} adjustsFontSizeToFit>
          CONSCIOUSNESS • WISDOM • INTELLIGENCE
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFAF8', // Minimal clean off-white
  },
  wordmarkContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10, // Ensure it's visually above the canvas
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  samarkanText: {
    fontFamily: 'Samarkan',
    fontSize: 64,
    color: '#1C1C1E',
    marginTop: 8,
  },
  aiText: {
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: 4,
    marginLeft: 8,
    marginTop: 16,
  },
  tagline: {
    marginTop: 16,
    fontSize: 9,
    letterSpacing: 3,
    color: '#8E8E93',
    fontWeight: '500',
    textAlign: 'center',
  },
});

