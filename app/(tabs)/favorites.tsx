import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../../src/shared/store/AppContext';
import { EmptyState } from '../../src/shared/ui/EmptyState';
import { ListingCard } from '../../src/shared/ui/ListingCard';

type Tab = 'announcements' | 'searches';

export default function FavoritesScreen() {
  const { colors, t, favorites, listings, toggleFavorite, isFavorite, savedSearches, clearFavorites, clearSavedSearches } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('announcements');

  const favListings = useMemo(
    () => listings.filter((l) => favorites.includes(l.id)),
    [listings, favorites],
  );

  const clearAll = () => {
    if (tab === 'announcements') {
      Alert.alert(t.clearAll, 'Очистить все избранные объявления?', [
        { text: t.deleteCancel, style: 'cancel' },
        { text: t.clearAll, style: 'destructive', onPress: clearFavorites },
      ]);
    } else {
      Alert.alert(t.clearAll, 'Очистить историю поисков?', [
        { text: t.deleteCancel, style: 'cancel' },
        { text: t.clearAll, style: 'destructive', onPress: clearSavedSearches },
      ]);
    }
  };

  const isEmpty = tab === 'announcements' ? favListings.length === 0 : savedSearches.length === 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      {/* Tabs + clear */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <View style={styles.tabsRow}>
          {(['announcements', 'searches'] as Tab[]).map((t2) => (
            <Pressable key={t2} onPress={() => setTab(t2)} style={[styles.tabBtn, tab === t2 && styles.tabBtnActive]}>
              <Text style={[styles.tabText, { color: tab === t2 ? '#1E4AE9' : colors.textSecondary }]}>
                {t2 === 'announcements' ? t.announcements : t.searches}
              </Text>
              {tab === t2 && <View style={styles.tabUnderline} />}
            </Pressable>
          ))}
        </View>
        {!isEmpty && (
          <Pressable onPress={clearAll} style={styles.clearBtn}>
            <Text style={styles.clearText}>{t.clearAll}</Text>
          </Pressable>
        )}
      </View>

      {/* Content */}
      {isEmpty ? (
        tab === 'announcements' ? (
          <EmptyState
            icon="heart-outline"
            title={t.noFavorites}
            description={t.noFavoritesDesc}
          />
        ) : (
          <EmptyState
            icon="search-outline"
            title={t.noSearches}
            description={t.noSearchesDesc}
          />
        )
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {tab === 'announcements'
            ? favListings.map((l) => (
                <ListingCard
                  key={l.id}
                  listing={l}
                  onPress={() => router.push({ pathname: '/listing', params: { id: l.id } } as any)}
                  onFavorite={() => toggleFavorite(l.id)}
                  isFavorite={isFavorite(l.id)}
                  colors={colors}
                />
              ))
            : savedSearches.map((s) => (
                <Pressable
                  key={s.id}
                  style={[styles.searchItem, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => router.push({ pathname: '/catalog', params: { savedSearch: s.filtersJson } } as any)}
                >
                  <View style={styles.searchLeft}>
                    <Ionicons name="search-outline" size={18} color="#1E4AE9" />
                    <Text style={[styles.searchTitle, { color: colors.text }]} numberOfLines={1}>{s.title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                </Pressable>
              ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  tabsRow: { flex: 1, flexDirection: 'row' },
  tabBtn: { paddingVertical: 14, paddingRight: 20, position: 'relative' },
  tabBtnActive: {},
  tabText: { fontSize: 15, fontWeight: '700' },
  tabUnderline: {
    position: 'absolute', bottom: 0, left: 0, right: 20,
    height: 2, backgroundColor: '#1E4AE9', borderRadius: 1,
  },
  clearBtn: { padding: 8 },
  clearText: { color: '#EF4444', fontSize: 14, fontWeight: '600' },
  list: { padding: 16, paddingBottom: 32 },
  searchItem: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, borderWidth: 1,
    padding: 14, marginBottom: 10,
  },
  searchLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchTitle: { fontSize: 14, fontWeight: '600', flex: 1 },
});
