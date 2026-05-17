import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../store/AppContext';

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
}

export function EmptyState({ icon = 'heart-outline', title, description }: Props) {
  const { colors } = useApp();
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={56} color={colors.border} />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {description ? (
        <Text style={[styles.desc, { color: colors.textSecondary }]}>{description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontSize: 17, fontWeight: '700', marginTop: 16, textAlign: 'center' },
  desc: { fontSize: 14, marginTop: 8, textAlign: 'center', lineHeight: 20 },
});
