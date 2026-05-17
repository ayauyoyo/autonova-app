import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../../src/shared/store/AppContext';
import { BannerCarousel } from '../../src/shared/ui/BannerCarousel';
import { CarCard } from '../../src/shared/ui/CarCard';
import { ListingCard } from '../../src/shared/ui/ListingCard';

const SERVICES = [
  { key: 'services', icon: 'construct-outline' as const },
  { key: 'machines', icon: 'car-outline' as const },
  { key: 'credit', icon: 'card-outline' as const },
  { key: 'tradein', icon: 'swap-horizontal-outline' as const },
];

const PAGE_SIZE = 10;

export default function HomeScreen() {
  const { colors, t, listings, toggleFavorite, isFavorite, recentlyViewed } = useApp();
  const router = useRouter();
  const [page, setPage] = useState(1);

  const activeListings = useMemo(() => listings.filter((l) => l.isActive), [listings]);
  const hits = useMemo(() => activeListings.filter((l) => l.isHit), [activeListings]);
  const visibleFeed = useMemo(() => activeListings.slice(0, page * PAGE_SIZE), [activeListings, page]);

  const recentListings = useMemo(
    () => recentlyViewed.map((id) => listings.find((l) => l.id === id)).filter(Boolean) as typeof listings,
    [recentlyViewed, listings],
  );

  const serviceLabels: Record<string, string> = {
    services: t.quickServices,
    machines: t.quickMachines,
    credit: t.quickCredit,
    tradein: t.quickTradeIn,
  };

  const goListing = (id: string) => router.push({ pathname: '/listing', params: { id } } as any);
  const goCatalog = (filter?: string) =>
    router.push(filter ? ({ pathname: '/catalog', params: { filter } } as any) : ('/catalog' as any));

  const loadMore = useCallback(() => {
    if (visibleFeed.length < activeListings.length) {
      setPage((p) => p + 1);
    }
  }, [visibleFeed.length, activeListings.length]);

  const Header = useMemo(() => (
    <View style={{ backgroundColor: colors.bg }}>
      <BannerCarousel />

      {/* Quick services */}
      <View style={styles.servicesRow}>
        {SERVICES.map((s) => (
          <Pressable
            key={s.key}
            onPress={() => {
              if (s.key === 'machines') goCatalog();
              else if (s.key === 'credit') router.push('/(tabs)/credit' as any);
              else if (s.key === 'services') router.push('/(tabs)/services' as any);
              else if (s.key === 'tradein') router.push('/service/tradein' as any);
            }}
            style={({ pressed }: { pressed: boolean }) => [
              styles.serviceItem,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <View style={styles.serviceIcon}>
              <Ionicons name={s.icon} size={22} color="#1E4AE9" />
            </View>
            <Text style={[styles.serviceLabel, { color: colors.text }]} numberOfLines={2}>
              {serviceLabels[s.key]}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Hits */}
      {hits.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="star" size={18} color="#F59E0B" />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.hits}</Text>
            </View>
            <Pressable onPress={() => goCatalog('hits')}>
              <Text style={styles.sectionLink}>{t.allCatalog}</Text>
            </Pressable>
          </View>
          <FlatList
            data={hits}
            keyExtractor={(l) => l.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
            renderItem={({ item: l }) => (
              <CarCard key={l.id} listing={l} onPress={() => goListing(l.id)} colors={colors} width={175} />
            )}
          />
        </View>
      )}

      {/* Recently viewed */}
      {recentListings.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Вы смотрели</Text>
            </View>
          </View>
          <FlatList
            data={recentListings}
            keyExtractor={(l) => l.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
            renderItem={({ item: l }) => (
              <CarCard key={l.id} listing={l} onPress={() => goListing(l.id)} colors={colors} width={175} />
            )}
          />
        </View>
      )}

      {/* Feed header */}
      <View style={[styles.section, { marginBottom: 4 }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Персонально для вас
        </Text>
      </View>
    </View>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [colors, hits, recentListings, t]);

  const Footer = useMemo(() => {
    if (visibleFeed.length >= activeListings.length) return null;
    return (
      <View style={styles.loadMoreWrap}>
        <Pressable onPress={loadMore} style={[styles.loadMoreBtn, { borderColor: colors.border }]}>
          <Text style={[styles.loadMoreText, { color: colors.text }]}>Показать ещё</Text>
          <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
        </Pressable>
      </View>
    );
  }, [visibleFeed.length, activeListings.length, colors, loadMore]);

  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      data={visibleFeed}
      keyExtractor={(l) => l.id}
      ListHeaderComponent={Header}
      ListFooterComponent={Footer}
      ListEmptyComponent={
        <View style={styles.emptyFeed}>
          <Text style={[styles.emptyFeedText, { color: colors.textSecondary }]}>Нет автомобилей</Text>
        </View>
      }
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      renderItem={({ item: l }) => (
        <View style={styles.feedItem}>
          <ListingCard
            listing={l}
            onPress={() => goListing(l.id)}
            onFavorite={() => toggleFavorite(l.id)}
            isFavorite={isFavorite(l.id)}
            colors={colors}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 32 },
  servicesRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 16, gap: 10 },
  serviceItem: { flex: 1, borderRadius: 14, borderWidth: 1, alignItems: 'center', paddingVertical: 14, paddingHorizontal: 4, gap: 8 },
  serviceIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(30,74,233,0.08)', alignItems: 'center', justifyContent: 'center' },
  serviceLabel: { fontSize: 10, fontWeight: '600', textAlign: 'center', lineHeight: 13 },
  section: { marginTop: 22, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: 17, fontWeight: '800' },
  sectionLink: { fontSize: 13, color: '#1E4AE9', fontWeight: '600' },
  hScroll: { paddingBottom: 4 },
  feedItem: { paddingHorizontal: 16 },
  loadMoreWrap: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16 },
  loadMoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderRadius: 12, paddingVertical: 13 },
  loadMoreText: { fontSize: 14, fontWeight: '600' },
  emptyFeed: { paddingVertical: 40, alignItems: 'center' },
  emptyFeedText: { fontSize: 14 },
});