import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { BRAND_COLORS } from '../theme/colors';
import { formatPrice, formatKm, formatMonthly } from '../utils/formatters';
import type { Listing } from '../data/types';

interface Props {
  listing: Listing;
  onPress?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  colors: {
    card: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}

export const ListingCard = memo(function ListingCard({
  listing,
  onPress,
  onFavorite,
  isFavorite = false,
  colors,
}: Props) {
  const bgColor = BRAND_COLORS[listing.brand] ?? BRAND_COLORS.default;
  const firstPhoto = listing.photos?.[0];
  const photoCount = listing.photos?.length ?? 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderColor: colors.border }, pressed && styles.pressed]}
    >
      <View style={[styles.photo, { backgroundColor: bgColor }]}>
        {firstPhoto ? (
          <Image source={{ uri: firstPhoto }} style={styles.photoImg} resizeMode="cover" />
        ) : (
          <Ionicons name="car-sport" size={46} color="rgba(255,255,255,0.75)" />
        )}
        {listing.condition === 'new' && (
          <View style={styles.newBadge}>
            <Text style={styles.newText}>NEW</Text>
          </View>
        )}
        {photoCount > 0 && (
          <View style={styles.photoCount}>
            <Ionicons name="images-outline" size={11} color="#fff" />
            <Text style={styles.photoCountText}> {photoCount}</Text>
          </View>
        )}
        {listing.isHit && (
          <View style={styles.hitBadge}>
            <Ionicons name="star" size={10} color="#F59E0B" />
            <Text style={styles.hitText}> Хит</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {listing.title}
            </Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]} numberOfLines={1}>
              {listing.bodyType} · {listing.gearbox} · {listing.city}
            </Text>
          </View>
          {onFavorite && (
            <Pressable onPress={onFavorite} hitSlop={8} style={styles.heartBtn}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorite ? '#EF4444' : colors.textSecondary}
              />
            </Pressable>
          )}
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(listing.priceKzt)}</Text>
          {listing.mileageKm > 0 && (
            <Text style={[styles.mileage, { color: colors.textSecondary }]}>
              {formatKm(listing.mileageKm)}
            </Text>
          )}
        </View>

        {listing.monthlyPaymentKzt ? (
          <Text style={[styles.monthly, { color: colors.textSecondary }]}>
            от {formatMonthly(listing.monthlyPaymentKzt)}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 12 },
  pressed: { opacity: 0.88 },
  photo: { height: 200, alignItems: 'center', justifyContent: 'center' },
  photoImg: { width: '100%', height: '100%' },
  newBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#22C55E', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  newText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  photoCount: { position: 'absolute', bottom: 8, right: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, gap: 3 },
  photoCountText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  hitBadge: { position: 'absolute', top: 10, right: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  hitText: { color: '#F59E0B', fontSize: 11, fontWeight: '700' },
  body: { padding: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  title: { fontSize: 15, fontWeight: '700', lineHeight: 20 },
  sub: { fontSize: 12, marginTop: 2 },
  heartBtn: { padding: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginTop: 8 },
  price: { fontSize: 17, fontWeight: '800', color: '#1E4AE9' },
  mileage: { fontSize: 12 },
  monthly: { fontSize: 12, marginTop: 2 },
});