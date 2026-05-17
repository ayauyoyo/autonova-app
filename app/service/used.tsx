import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/store/AppContext';
import { ListingCard } from '../../src/shared/ui/ListingCard';

export default function UsedCarsScreen() {
  const { colors, listings, toggleFavorite, isFavorite } = useApp();
  const router = useRouter();

  const used = useMemo(
    () => listings.filter((l) => l.isActive && l.condition === 'used'),
    [listings],
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.bg }}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/' as any)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Авто с пробегом</Text>
          <View style={{ width: 36 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {used.length} {used.length === 1 ? 'автомобиль' : used.length < 5 ? 'автомобиля' : 'автомобилей'}
        </Text>
        {used.map((l) => (
          <ListingCard
            key={l.id}
            listing={l}
            onPress={() => router.push({ pathname: '/listing', params: { id: l.id } } as any)}
            onFavorite={() => toggleFavorite(l.id)}
            isFavorite={isFavorite(l.id)}
            colors={colors}
          />
        ))}
        {used.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="car-outline" size={52} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Нет автомобилей с пробегом</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  content: { padding: 16, paddingBottom: 40 },
  count: { fontSize: 13, marginBottom: 12 },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 14 },
});