import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Appearance } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export function TopBar() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();
  const progress = useSharedValue(colorScheme === 'dark' ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(colorScheme === 'dark' ? 1 : 0);
  }, [colorScheme]);

  const toggleTheme = () => {
    const nextTheme = colorScheme === 'light' ? 'dark' : 'light';
    Appearance.setColorScheme(nextTheme);
  };

  const sunStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 0.5], [1, 0]),
      transform: [
        { scale: interpolate(progress.value, [0, 1], [1, 0.5]) },
        { rotate: `${interpolate(progress.value, [0, 1], [0, 45])}deg` }
      ],
    };
  });

  const moonStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0.5, 1], [0, 1]),
      transform: [
        { scale: interpolate(progress.value, [0, 1], [0.5, 1]) },
        { rotate: `${interpolate(progress.value, [0, 1], [-45, 0])}deg` }
      ],
      position: 'absolute',
    };
  });

  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.icon + '33' }]}>
      <TouchableOpacity 
        onPress={() => router.push('/modal')} 
        style={styles.iconButton}
      >
        <IconSymbol name="gearshape.fill" size={24} color={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
        <View style={styles.iconContainer}>
          <Animated.View style={sunStyle}>
            <IconSymbol name="sun.max.fill" size={24} color={colors.tint} />
          </Animated.View>
          <Animated.View style={moonStyle}>
            <IconSymbol name="moon.stars.fill" size={24} color={colors.tint} />
          </Animated.View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  iconButton: {
    padding: 8,
  },
  themeToggle: {
    padding: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
