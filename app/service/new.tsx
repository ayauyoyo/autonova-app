import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/store/AppContext';
import { ListingCard } from '../../src/shared/ui/ListingCard';

export default function NewCarsScreen() {
  const { colors, listings, toggleFavorite, isFavorite } = useApp();
  const router = useRouter();

  const newCars = useMemo(
    () => listings.filter((l) => l.isActive && l.condition === 'new'),
    [listings],
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.bg }}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/' as any)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Новые авто</Text>
          <View style={{ width: 36 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.banner, { backgroundColor: '#1E4AE9' }]}>
          <Ionicons name="car-sport" size={28} color="rgba(255,255,255,0.8)" />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Новые автомобили</Text>
            <Text style={styles.bannerSub}>Официальная гарантия · Кредит от 14%</Text>
          </View>
        </View>

        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {newCars.length} {newCars.length === 1 ? 'автомобиль' : newCars.length < 5 ? 'автомобиля' : 'автомобилей'} в наличии
        </Text>

        {newCars.map((l) => (
          <ListingCard
            key={l.id}
            listing={l}
            onPress={() => router.push({ pathname: '/listing', params: { id: l.id } } as any)}
            onFavorite={() => toggleFavorite(l.id)}
            isFavorite={isFavorite(l.id)}
            colors={colors}
          />
        ))}
        {newCars.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="car-sport-outline" size={52} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Нет новых автомобилей</Text>
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
  banner: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, padding: 18, marginBottom: 16 },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  bannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  count: { fontSize: 13, marginBottom: 12 },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 14 },
});