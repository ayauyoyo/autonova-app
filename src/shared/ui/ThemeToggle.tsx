import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useApp } from '../store/AppContext';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useApp();
  return (
    <Pressable onPress={toggleTheme} style={styles.btn} hitSlop={8}>
      <Ionicons
        name={isDark ? 'moon' : 'sunny'}
        size={22}
        color={isDark ? '#FCD34D' : '#F59E0B'}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 6 },
});