import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../store/AppContext';

const { width } = Dimensions.get('window');
const BANNER_W = width - 32;
const BANNER_H = 150;
const AUTO_SCROLL_INTERVAL = 4000;

export function BannerCarousel() {
  const { banners } = useApp();
  const scrollRef = useRef<ScrollView>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % banners.length;
        scrollRef.current?.scrollTo({ x: next * (BANNER_W + 12), animated: true });
        return next;
      });
    }, AUTO_SCROLL_INTERVAL);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={BANNER_W + 12}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / (BANNER_W + 12));
          setCurrent(Math.min(idx, banners.length - 1));
        }}
      >
        {banners.map((banner) => (
          <Pressable
            key={banner.id}
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
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {banners.map((b, i) => (
          <Pressable
            key={b.id}
            onPress={() => {
              scrollRef.current?.scrollTo({ x: i * (BANNER_W + 12), animated: true });
              setCurrent(i);
            }}
          >
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
  scrollContent: { gap: 12, paddingRight: 16 },
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