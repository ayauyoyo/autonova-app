import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/store/AppContext';
import { CarCard } from '../../src/shared/ui/CarCard';
import { ListingCard } from '../../src/shared/ui/ListingCard';
import { ALL_BRANDS, POPULAR_BRANDS, KZ_REGION_CITIES, POPULAR_CITIES } from '../../src/shared/data/mockData';
import type { Listing } from '../../src/shared/data/types';

type Condition = 'all' | 'new' | 'used';
type FilterMode = 'choose' | 'exclude';

interface Filters {
  condition: Condition;
  region: string;
  brand: string;
  model: string;
  brandExclude: boolean;
  yearFrom: string;
  yearTo: string;
  priceFrom: string;
  priceTo: string;
  creditOnly: boolean;
  monthlyFrom: string;
  monthlyTo: string;
  downFrom: string;
  downTo: string;
  withPhoto: boolean;
}

const DEFAULT_FILTERS: Filters = {
  condition: 'all',
  region: '',
  brand: '',
  model: '',
  brandExclude: false,
  yearFrom: '',
  yearTo: '',
  priceFrom: '',
  priceTo: '',
  creditOnly: false,
  monthlyFrom: '',
  monthlyTo: '',
  downFrom: '',
  downTo: '',
  withPhoto: false,
};

function applyFilters(listings: Listing[], f: Filters, params: Record<string, string>): Listing[] {
  let result = listings.filter((l) => l.isActive);

  if (params.maxMonthly) {
    const max = parseInt(params.maxMonthly, 10);
    if (max > 0) result = result.filter((l) => l.monthlyPaymentKzt && l.monthlyPaymentKzt <= max);
  }
  if (params.filter === 'hits') result = result.filter((l) => l.isHit);
  if (params.filter === 'credit') result = result.filter((l) => !!l.monthlyPaymentKzt);
  if (params.filter === 'new') result = result.filter((l) => l.condition === 'new');

  if (f.condition !== 'all') result = result.filter((l) => l.condition === f.condition);
  if (f.region) result = result.filter((l) => l.region === f.region || l.city === f.region);
  if (f.brand) {
    if (f.brandExclude) result = result.filter((l) => l.brand !== f.brand);
    else result = result.filter((l) => l.brand === f.brand);
  }
  if (f.yearFrom) result = result.filter((l) => l.year >= parseInt(f.yearFrom, 10));
  if (f.yearTo) result = result.filter((l) => l.year <= parseInt(f.yearTo, 10));
  if (f.priceFrom) result = result.filter((l) => l.priceKzt >= parseInt(f.priceFrom.replace(/\s/g, ''), 10));
  if (f.priceTo) result = result.filter((l) => l.priceKzt <= parseInt(f.priceTo.replace(/\s/g, ''), 10));
  if (f.creditOnly) result = result.filter((l) => !!l.monthlyPaymentKzt);
  if (f.monthlyFrom) result = result.filter((l) => l.monthlyPaymentKzt && l.monthlyPaymentKzt >= parseInt(f.monthlyFrom.replace(/\s/g, ''), 10));
  if (f.monthlyTo) result = result.filter((l) => l.monthlyPaymentKzt && l.monthlyPaymentKzt <= parseInt(f.monthlyTo.replace(/\s/g, ''), 10));
  if (f.downFrom) result = result.filter((l) => l.downPaymentKzt && l.downPaymentKzt >= parseInt(f.downFrom.replace(/\s/g, ''), 10));
  if (f.downTo) result = result.filter((l) => l.downPaymentKzt && l.downPaymentKzt <= parseInt(f.downTo.replace(/\s/g, ''), 10));

  return result;
}

export default function CatalogScreen() {
  const { colors, t, listings, toggleFavorite, isFavorite } = useApp();
  const router = useRouter();
  const params = useLocalSearchParams<{ filter?: string; maxMonthly?: string; downPayment?: string }>();

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [brandSheetOpen, setBrandSheetOpen] = useState(false);
  const [regionPickerOpen, setRegionPickerOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [regionSearch, setRegionSearch] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('choose');
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);

  const filtered = useMemo(
    () => applyFilters(listings, filters, params as Record<string, string>),
    [listings, filters, params],
  );
  const hits = useMemo(() => filtered.filter((l) => l.isHit), [filtered]);
  const creditCars = useMemo(() => filtered.filter((l) => !!l.monthlyPaymentKzt), [filtered]);
  const newCars = useMemo(() => filtered.filter((l) => l.condition === 'new'), [filtered]);

  const openFilter = () => {
    setDraftFilters({ ...filters });
    setFilterOpen(true);
  };

  const closeFilter = () => {
    setFilterOpen(false);
  };

  const applyFilter = () => {
    setFilters({ ...draftFilters });
    closeFilter();
  };

  const resetFilter = () => {
    setDraftFilters({ ...DEFAULT_FILTERS });
    setFilters({ ...DEFAULT_FILTERS });
    closeFilter();
  };

  const formatNum = (v: string) => v.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  const goListing = (id: string) =>
    router.push({ pathname: '/listing', params: { id } } as any);

  const filteredBrands = useMemo(() => {
    const q = brandSearch.toLowerCase();
    return ALL_BRANDS.filter((b) => b.toLowerCase().includes(q));
  }, [brandSearch]);

  const filteredRegionEntries = useMemo((): [string, string[]][] => {
    const q = regionSearch.toLowerCase().trim();
    if (!q) return Object.entries(KZ_REGION_CITIES);
    return Object.entries(KZ_REGION_CITIES).filter(
      ([region, cities]) =>
        region.toLowerCase().includes(q) ||
        cities.some((c) => c.toLowerCase().includes(q)),
    );
  }, [regionSearch]);

  const filteredPopularCities = useMemo(() => {
    const q = regionSearch.toLowerCase().trim();
    if (!q) return POPULAR_CITIES;
    return POPULAR_CITIES.filter((c) => c.toLowerCase().includes(q));
  }, [regionSearch]);

  const SectionRow = ({ label, count, filterKey }: { label: string; count: number; filterKey: string }) => (
    <Pressable
      onPress={() => router.push({ pathname: '/catalog', params: { filter: filterKey } } as any)}
      style={[styles.sectionRow, { borderColor: colors.border, backgroundColor: colors.card }]}
    >
      <Text style={[styles.sectionRowLabel, { color: colors.text }]}>{label}</Text>
      <View style={styles.sectionRowRight}>
        <Text style={[styles.sectionRowCount, { color: colors.textSecondary }]}>{count}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </View>
    </Pressable>
  );

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => {
    const def = DEFAULT_FILTERS[k as keyof Filters];
    return v !== def;
  });

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.header }}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/' as any)} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={colors.icon} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t.catalog}</Text>
          <Pressable onPress={openFilter} style={styles.filterBtn} hitSlop={8}>
            <Ionicons name="options-outline" size={22} color={hasActiveFilters ? '#1E4AE9' : colors.icon} />
            {hasActiveFilters && <View style={styles.filterDot} />}
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.sectionRows}>
          <SectionRow label={t.creditCars} count={creditCars.length} filterKey="credit" />
          <SectionRow label={t.newCars} count={newCars.length} filterKey="new" />
        </View>

        {hits.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.hitsSection}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
              {hits.map((l) => (
                <CarCard key={l.id} listing={l} onPress={() => goListing(l.id)} colors={colors} width={175} />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>
            {t.allAutos} ({filtered.length})
          </Text>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="car-outline" size={52} color={colors.border} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Ничего не найдено</Text>
              <Pressable onPress={resetFilter} style={styles.resetBtn}>
                <Text style={styles.resetBtnText}>{t.reset}</Text>
              </Pressable>
            </View>
          ) : (
            filtered.map((l) => (
              <ListingCard
                key={l.id}
                listing={l}
                onPress={() => goListing(l.id)}
                onFavorite={() => toggleFavorite(l.id)}
                isFavorite={isFavorite(l.id)}
                colors={colors}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* ── FILTER MODAL ── */}
      <Modal visible={filterOpen} transparent animationType="none" onRequestClose={closeFilter}>
        <TouchableWithoutFeedback onPress={closeFilter}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={[styles.filterSheet, { backgroundColor: colors.bg }]}>
          <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
            <Pressable onPress={resetFilter}>
              <Text style={styles.resetText}>{t.reset}</Text>
            </Pressable>
            <Text style={[styles.sheetTitle, { color: colors.text }]}>{t.filter}</Text>
            <Pressable onPress={closeFilter}>
              <Ionicons name="close" size={22} color={colors.icon} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.filterBody} showsVerticalScrollIndicator={false}>
            {/* Condition */}
            <FilterSection title={t.condition} colors={colors}>
              <View style={styles.conditionRow}>
                {(['all', 'new', 'used'] as Condition[]).map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setDraftFilters((p) => ({ ...p, condition: c }))}
                    style={[styles.condChip, {
                      backgroundColor: draftFilters.condition === c ? '#1E4AE9' : colors.surface,
                      borderColor: draftFilters.condition === c ? '#1E4AE9' : colors.border,
                    }]}
                  >
                    <Text style={{ color: draftFilters.condition === c ? '#fff' : colors.text, fontWeight: '600', fontSize: 13 }}>
                      {c === 'all' ? t.conditionAll : c === 'new' ? t.conditionNew : t.conditionUsed}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </FilterSection>

            {/* Region */}
            <FilterSection title={t.region} colors={colors}>
              <Pressable
                onPress={() => { setRegionSearch(''); setRegionPickerOpen(true); }}
                style={[styles.picker, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Text style={[styles.pickerText, { color: draftFilters.region ? colors.text : colors.textMuted }]}>
                  {draftFilters.region || t.allRegions}
                </Text>
                <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
              </Pressable>
              {draftFilters.region ? (
                <Pressable onPress={() => setDraftFilters((p) => ({ ...p, region: '' }))} style={styles.clearChip}>
                  <Text style={styles.clearChipText}>{draftFilters.region}</Text>
                  <Ionicons name="close-circle" size={14} color="#1E4AE9" />
                </Pressable>
              ) : null}
            </FilterSection>

            {/* Brand */}
            <FilterSection title={t.brand} colors={colors}>
              <View style={styles.modeRow}>
                {(['choose', 'exclude'] as FilterMode[]).map((m) => (
                  <Pressable
                    key={m}
                    onPress={() => setFilterMode(m)}
                    style={[styles.modeBtn, {
                      borderColor: filterMode === m ? '#1E4AE9' : colors.border,
                      backgroundColor: filterMode === m ? '#1E4AE9' : colors.surface,
                    }]}
                  >
                    <Text style={{ color: filterMode === m ? '#fff' : colors.textSecondary, fontSize: 13, fontWeight: '600' }}>
                      {m === 'choose' ? t.choose : t.exclude}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Pressable
                onPress={() => setBrandSheetOpen(true)}
                style={[styles.picker, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Text style={[styles.pickerText, { color: draftFilters.brand ? colors.text : colors.textMuted }]}>
                  {draftFilters.brand || t.brand}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </Pressable>
            </FilterSection>

            {/* Year */}
            <FilterSection title="Год выпуска" colors={colors}>
              <View style={styles.rangeRow}>
                <TextInput
                  style={[styles.rangeInput, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                  placeholder="1990"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  maxLength={4}
                  value={draftFilters.yearFrom}
                  onChangeText={(v) => setDraftFilters((p) => ({ ...p, yearFrom: v.replace(/\D/g, '') }))}
                />
                <Text style={[styles.rangeSep, { color: colors.textSecondary }]}>—</Text>
                <TextInput
                  style={[styles.rangeInput, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                  placeholder="2025"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  maxLength={4}
                  value={draftFilters.yearTo}
                  onChangeText={(v) => setDraftFilters((p) => ({ ...p, yearTo: v.replace(/\D/g, '') }))}
                />
              </View>
            </FilterSection>

            {/* Price */}
            <FilterSection title="Цена, ₸" colors={colors}>
              <View style={styles.rangeRow}>
                <TextInput
                  style={[styles.rangeInput, { flex: 1, color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                  placeholder="от"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={draftFilters.priceFrom}
                  onChangeText={(v) => setDraftFilters((p) => ({ ...p, priceFrom: formatNum(v) }))}
                />
                <Text style={[styles.rangeSep, { color: colors.textSecondary }]}>—</Text>
                <TextInput
                  style={[styles.rangeInput, { flex: 1, color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                  placeholder="до"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={draftFilters.priceTo}
                  onChangeText={(v) => setDraftFilters((p) => ({ ...p, priceTo: formatNum(v) }))}
                />
              </View>
            </FilterSection>

            {/* Credit toggle */}
            <FilterSection title="" colors={colors} noBorder>
              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.toggleLabel, { color: colors.text }]}>{t.availableCredit}</Text>
                  <Text style={[styles.toggleSub, { color: colors.textSecondary }]}>{t.dealIn30}</Text>
                </View>
                <Switch
                  value={draftFilters.creditOnly}
                  onValueChange={(v) => setDraftFilters((p) => ({ ...p, creditOnly: v }))}
                  trackColor={{ true: '#1E4AE9', false: colors.border }}
                  thumbColor="#fff"
                />
              </View>

              {draftFilters.creditOnly && (
                <View style={styles.creditSubFields}>
                  <Text style={[styles.subFieldLabel, { color: colors.textSecondary }]}>{t.monthlyPaymentFilter}</Text>
                  <View style={styles.rangeRow}>
                    <TextInput
                      style={[styles.rangeInput, { flex: 1, color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                      placeholder="от"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="numeric"
                      value={draftFilters.monthlyFrom}
                      onChangeText={(v) => setDraftFilters((p) => ({ ...p, monthlyFrom: formatNum(v) }))}
                    />
                    <Text style={[styles.rangeSep, { color: colors.textSecondary }]}>—</Text>
                    <TextInput
                      style={[styles.rangeInput, { flex: 1, color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                      placeholder="до"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="numeric"
                      value={draftFilters.monthlyTo}
                      onChangeText={(v) => setDraftFilters((p) => ({ ...p, monthlyTo: formatNum(v) }))}
                    />
                  </View>
                  <Text style={[styles.subFieldLabel, { color: colors.textSecondary, marginTop: 12 }]}>Первоначальный взнос, ₸</Text>
                  <View style={styles.rangeRow}>
                    <TextInput
                      style={[styles.rangeInput, { flex: 1, color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                      placeholder="от"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="numeric"
                      value={draftFilters.downFrom}
                      onChangeText={(v) => setDraftFilters((p) => ({ ...p, downFrom: formatNum(v) }))}
                    />
                    <Text style={[styles.rangeSep, { color: colors.textSecondary }]}>—</Text>
                    <TextInput
                      style={[styles.rangeInput, { flex: 1, color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                      placeholder="до"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="numeric"
                      value={draftFilters.downTo}
                      onChangeText={(v) => setDraftFilters((p) => ({ ...p, downTo: formatNum(v) }))}
                    />
                  </View>
                </View>
              )}
            </FilterSection>

            {/* With photo */}
            <FilterSection title="" colors={colors} noBorder>
              <Pressable
                onPress={() => setDraftFilters((p) => ({ ...p, withPhoto: !p.withPhoto }))}
                style={styles.checkRow}
              >
                <View style={[styles.checkbox, {
                  borderColor: draftFilters.withPhoto ? '#1E4AE9' : colors.border,
                  backgroundColor: draftFilters.withPhoto ? '#1E4AE9' : 'transparent',
                }]}>
                  {draftFilters.withPhoto && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <Text style={[styles.checkLabel, { color: colors.text }]}>{t.withPhoto}</Text>
              </Pressable>
            </FilterSection>
          </ScrollView>

          <View style={[styles.filterFooter, { borderTopColor: colors.border, backgroundColor: colors.bg }]}>
            <Pressable
              onPress={applyFilter}
              style={({ pressed }) => [styles.applyBtn, { opacity: pressed ? 0.85 : 1 }]}
            >
              <Text style={styles.applyBtnText}>
                {t.showListings} {filtered.length} {t.listings}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ── REGION PICKER MODAL ── */}
      <Modal visible={regionPickerOpen} animationType="slide" onRequestClose={() => setRegionPickerOpen(false)}>
        <SafeAreaView edges={['top']} style={[styles.regionModal, { backgroundColor: colors.bg }]}>
          <View style={[styles.brandSheetHeader, { borderBottomColor: colors.border }]}>
            <View style={[styles.brandSearchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="search" size={16} color={colors.textMuted} />
              <TextInput
                style={[styles.brandSearchInput, { color: colors.text }]}
                placeholder="Город или регион"
                placeholderTextColor={colors.textMuted}
                value={regionSearch}
                onChangeText={setRegionSearch}
                autoFocus
              />
            </View>
            <Pressable onPress={() => setRegionPickerOpen(false)}>
              <Text style={styles.cancelText}>{t.cancel}</Text>
            </Pressable>
          </View>

          <ScrollView>
            {/* All regions option */}
            <Pressable
              onPress={() => { setDraftFilters((p) => ({ ...p, region: '' })); setRegionPickerOpen(false); }}
              style={[styles.brandItem, { borderBottomColor: colors.border }]}
            >
              <Ionicons name="globe-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.brandName, { color: colors.text, fontWeight: '700' }]}>Все регионы</Text>
              {!draftFilters.region && <Ionicons name="checkmark" size={18} color="#1E4AE9" />}
            </Pressable>

            {/* Popular cities */}
            {filteredPopularCities.length > 0 && (
              <>
                <Text style={[styles.brandGroup, { color: colors.textSecondary }]}>Популярные города</Text>
                {filteredPopularCities.map((city) => (
                  <Pressable
                    key={city}
                    onPress={() => { setDraftFilters((p) => ({ ...p, region: city })); setRegionPickerOpen(false); }}
                    style={[styles.brandItem, { borderBottomColor: colors.border }]}
                  >
                    <View style={[styles.brandIcon, { backgroundColor: '#1E4AE918' }]}>
                      <Ionicons name="location-outline" size={16} color="#1E4AE9" />
                    </View>
                    <Text style={[styles.brandName, { color: colors.text }]}>{city}</Text>
                    {draftFilters.region === city && <Ionicons name="checkmark" size={18} color="#1E4AE9" />}
                  </Pressable>
                ))}
              </>
            )}

            {/* Regions with cities */}
            {filteredRegionEntries.length > 0 && (
              <>
                <Text style={[styles.brandGroup, { color: colors.textSecondary }]}>Все регионы</Text>
                {filteredRegionEntries.map(([region, cities]) => {
                  const isExpanded = expandedRegion === region || !!regionSearch;
                  const isSelected = draftFilters.region === region;
                  return (
                    <View key={region}>
                      <Pressable
                        onPress={() => {
                          if (regionSearch) {
                            setDraftFilters((p) => ({ ...p, region }));
                            setRegionPickerOpen(false);
                          } else {
                            setExpandedRegion(isExpanded ? null : region);
                          }
                        }}
                        style={[styles.regionRow, { borderBottomColor: colors.border, backgroundColor: isSelected ? '#1E4AE908' : 'transparent' }]}
                      >
                        <View style={[styles.brandIcon, { backgroundColor: isSelected ? '#1E4AE918' : colors.surface }]}>
                          <Ionicons name="map-outline" size={16} color={isSelected ? '#1E4AE9' : colors.textSecondary} />
                        </View>
                        <Text style={[styles.brandName, { color: isSelected ? '#1E4AE9' : colors.text, fontWeight: isSelected ? '700' : '400' }]}>
                          {region}
                        </Text>
                        {isSelected
                          ? <Ionicons name="checkmark" size={18} color="#1E4AE9" />
                          : <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
                        }
                      </Pressable>
                      {isExpanded && cities.map((city) => (
                        <Pressable
                          key={city}
                          onPress={() => { setDraftFilters((p) => ({ ...p, region: city })); setRegionPickerOpen(false); }}
                          style={[styles.cityRow, { borderBottomColor: colors.border, backgroundColor: draftFilters.region === city ? '#1E4AE908' : 'transparent' }]}
                        >
                          <Text style={[styles.cityRowText, { color: draftFilters.region === city ? '#1E4AE9' : colors.text }]}>
                            {city}
                          </Text>
                          {draftFilters.region === city && <Ionicons name="checkmark" size={16} color="#1E4AE9" />}
                        </Pressable>
                      ))}
                    </View>
                  );
                })}
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ── BRAND SHEET ── */}
      <Modal visible={brandSheetOpen} transparent animationType="slide" onRequestClose={() => setBrandSheetOpen(false)}>
        <View style={[styles.brandSheet, { backgroundColor: colors.bg }]}>
          <View style={[styles.brandSheetHeader, { borderBottomColor: colors.border }]}>
            <View style={[styles.brandSearchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="search" size={16} color={colors.textMuted} />
              <TextInput
                style={[styles.brandSearchInput, { color: colors.text }]}
                placeholder={t.searchBrand}
                placeholderTextColor={colors.textMuted}
                value={brandSearch}
                onChangeText={setBrandSearch}
                autoFocus
              />
            </View>
            <Pressable onPress={() => setBrandSheetOpen(false)}>
              <Text style={styles.cancelText}>{t.cancel}</Text>
            </Pressable>
          </View>
          <ScrollView>
            {!brandSearch && (
              <>
                <Text style={[styles.brandGroup, { color: colors.textSecondary }]}>{t.popularBrands}</Text>
                {POPULAR_BRANDS.map((b) => (
                  <Pressable
                    key={b}
                    onPress={() => { setDraftFilters((p) => ({ ...p, brand: b, brandExclude: filterMode === 'exclude' })); setBrandSheetOpen(false); }}
                    style={[styles.brandItem, { borderBottomColor: colors.border }]}
                  >
                    <View style={[styles.brandIcon, { backgroundColor: '#1E4AE918' }]}>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: '#1E4AE9' }}>{b[0]}</Text>
                    </View>
                    <Text style={[styles.brandName, { color: colors.text }]}>{b}</Text>
                    {draftFilters.brand === b && <Ionicons name="checkmark" size={18} color="#1E4AE9" />}
                  </Pressable>
                ))}
                <Text style={[styles.brandGroup, { color: colors.textSecondary }]}>{t.allBrands}</Text>
              </>
            )}
            {(brandSearch ? filteredBrands : ALL_BRANDS).map((b) => (
              <Pressable
                key={b}
                onPress={() => { setDraftFilters((p) => ({ ...p, brand: b, brandExclude: filterMode === 'exclude' })); setBrandSheetOpen(false); }}
                style={[styles.brandItem, { borderBottomColor: colors.border }]}
              >
                <View style={[styles.brandIcon, { backgroundColor: '#1E4AE918' }]}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#1E4AE9' }}>{b[0]}</Text>
                </View>
                <Text style={[styles.brandName, { color: colors.text }]}>{b}</Text>
                {draftFilters.brand === b && <Ionicons name="checkmark" size={18} color="#1E4AE9" />}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

function FilterSection({
  title,
  colors,
  children,
  noBorder,
}: {
  title: string;
  colors: any;
  children: React.ReactNode;
  noBorder?: boolean;
}) {
  return (
    <View style={[styles.filterSection, !noBorder && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
      {title ? <Text style={[styles.filterSectionTitle, { color: colors.textSecondary }]}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, gap: 12 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '800' },
  filterBtn: { position: 'relative', padding: 4 },
  filterDot: { position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#1E4AE9' },
  scroll: { paddingBottom: 32 },
  sectionRows: { paddingHorizontal: 16, paddingTop: 14, gap: 8 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 12, borderWidth: 1, paddingVertical: 14, paddingHorizontal: 16 },
  sectionRowLabel: { fontSize: 15, fontWeight: '600' },
  sectionRowRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sectionRowCount: { fontSize: 14 },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800' },
  hScroll: { paddingBottom: 4 },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { fontSize: 15, marginTop: 12 },
  resetBtn: { marginTop: 16, paddingHorizontal: 24, paddingVertical: 10, backgroundColor: '#1E4AE9', borderRadius: 10 },
  resetBtnText: { color: '#fff', fontWeight: '700' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  filterSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: '92%', borderTopLeftRadius: 22, borderTopRightRadius: 22, overflow: 'hidden' },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  sheetTitle: { fontSize: 16, fontWeight: '800' },
  resetText: { fontSize: 14, color: '#1E4AE9', fontWeight: '600' },
  filterBody: { paddingBottom: 8 },
  filterSection: { paddingHorizontal: 16, paddingVertical: 16 },
  filterSectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  conditionRow: { flexDirection: 'row', gap: 8 },
  condChip: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  picker: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 8, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 13 },
  pickerText: { fontSize: 15 },
  clearChip: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginTop: 8, backgroundColor: '#1E4AE912', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  clearChipText: { color: '#1E4AE9', fontSize: 13, fontWeight: '600' },
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  modeBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  rangeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rangeInput: { flex: 1, borderRadius: 8, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  rangeSep: { fontSize: 15, paddingHorizontal: 2 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  toggleLabel: { fontSize: 15, fontWeight: '600' },
  toggleSub: { fontSize: 12, marginTop: 2 },
  creditSubFields: { marginTop: 12 },
  subFieldLabel: { fontSize: 13, marginBottom: 8 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  checkLabel: { fontSize: 15 },

  filterFooter: { borderTopWidth: 1, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  applyBtn: { backgroundColor: '#1E4AE9', borderRadius: 10, paddingVertical: 16, alignItems: 'center' },
  applyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  regionModal: { flex: 1 },
  regionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1 },
  cityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 56, paddingVertical: 11, borderBottomWidth: 1 },
  cityRowText: { fontSize: 14 },

  brandSheet: { flex: 1, marginTop: 60 },
  brandSheetHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  brandSearchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  brandSearchInput: { flex: 1, fontSize: 14 },
  cancelText: { color: '#1E4AE9', fontSize: 14, fontWeight: '600' },
  brandGroup: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', paddingHorizontal: 16, paddingVertical: 10, letterSpacing: 0.5 },
  brandItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1 },
  brandIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  brandName: { flex: 1, fontSize: 15 },
});