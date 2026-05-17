import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { BRAND_COLORS } from '../theme/colors';
import { formatPrice, formatKm } from '../utils/formatters';
import type { Listing } from '../data/types';

interface Props {
  listing: Listing;
  onPress?: () => void;
  colors: { card: string; text: string; textSecondary: string; border: string; primary?: string };
  width?: number;
}

export const CarCard = memo(function CarCard({ listing, onPress, colors, width = 180 }: Props) {
  const bgColor = BRAND_COLORS[listing.brand] ?? BRAND_COLORS.default;
  const firstPhoto = listing.photos?.[0];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }: { pressed: boolean }) => [styles.card, { backgroundColor: colors.card, borderColor: colors.border, width }, pressed && styles.pressed]}
    >
      <View style={[styles.photo, { backgroundColor: bgColor }]}>
        {firstPhoto ? (
          <Image source={{ uri: firstPhoto }} style={styles.img} resizeMode="cover" />
        ) : (
          <Ionicons name="car-sport" size={38} color="rgba(255,255,255,0.7)" />
        )}
        {listing.condition === 'new' && (
          <View style={styles.newBadge}>
            <Text style={styles.newText}>NEW</Text>
          </View>
        )}
        {listing.photos && listing.photos.length > 1 && (
          <View style={styles.photoBadge}>
            <Ionicons name="images-outline" size={10} color="#fff" />
            <Text style={styles.photoBadgeText}> {listing.photos.length}</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {listing.title}
        </Text>
        {!listing.title.includes(String(listing.year)) && (
          <Text style={[styles.year, { color: colors.textSecondary }]}>{listing.year}</Text>
        )}
        <Text style={[styles.price, { color: '#1E4AE9' }]}>
          {formatPrice(listing.priceKzt)}
        </Text>
        {listing.mileageKm > 0 && (
          <Text style={[styles.mileage, { color: colors.textSecondary }]}>
            {formatKm(listing.mileageKm)}
          </Text>
        )}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginRight: 12 },
  pressed: { opacity: 0.85 },
  photo: { height: 110, alignItems: 'center', justifyContent: 'center' },
  img: { width: '100%', height: '100%' },
  newBadge: {
    position: 'absolute', top: 6, left: 6,
    backgroundColor: '#22C55E', borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  newText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  photoBadge: {
    position: 'absolute', bottom: 6, right: 6,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 6,
    paddingHorizontal: 5, paddingVertical: 2,
  },
  photoBadgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  info: { padding: 10 },
  title: { fontSize: 13, fontWeight: '700' },
  year: { fontSize: 11, marginTop: 2 },
  price: { fontSize: 13, fontWeight: '800', marginTop: 4 },
  mileage: { fontSize: 11, marginTop: 2 },
});
