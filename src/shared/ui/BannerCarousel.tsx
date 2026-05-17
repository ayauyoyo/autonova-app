import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../store/AppContext';

const { width } = Dimensions.get('window');
const BANNER_W = width - 32;
const BANNER_H = 150;
const AUTO_SCROLL_INTERVAL = 4000;

export function BannerCarousel() {
  const { banners } = useApp();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, AUTO_SCROLL_INTERVAL);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[current];

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={[styles.banner, { backgroundColor: banner.bgColor, width: BANNER_W }]}
        onPress={() => {}}
      >
        {banner.imageUrl ? (
          <Image source={{ uri: banner.imageUrl }} style={styles.bgImage} resizeMode="cover" />
        ) : null}
        <View style={[styles.overlay, banner.imageUrl ? styles.overlayDark : null]}>
          <View style={styles.textContent}>
            <Text style={[styles.title, { color: banner.textColor }]} numberOfLines={2}>
              {banner.title}
            </Text>
            <Text style={[styles.subtitle, { color: banner.textColor }]} numberOfLines={2}>
              {banner.subtitle}
            </Text>
          </View>
        </View>
      </Pressable>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {banners.map((b, i) => (
          <Pressable key={b.id} onPress={() => setCurrent(i)}>
            <View style={[
              styles.dot,
              {
                width: i === current ? 20 : 7,
                backgroundColor: i === current ? '#1E4AE9' : '#CBD5E1',
              },
            ]} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 16, marginTop: 12 },
  banner: { height: BANNER_H, borderRadius: 18, overflow: 'hidden', justifyContent: 'center' },
  bgImage: { ...StyleSheet.absoluteFillObject },
  overlay: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 18, gap: 12 },
  overlayDark: { backgroundColor: 'rgba(0,0,0,0.35)' },
  textContent: { flex: 1 },
  title: { fontSize: 17, fontWeight: '800', lineHeight: 22 },
  subtitle: { fontSize: 12, marginTop: 5, opacity: 0.9, lineHeight: 16 },
  dotsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 10 },
  dot: { height: 7, borderRadius: 3.5 },
});