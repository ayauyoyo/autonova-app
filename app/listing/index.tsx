import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from '../../src/shared/utils/haptics';
import * as Linking from 'expo-linking';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/store/AppContext';
import { CarCard } from '../../src/shared/ui/CarCard';
import { BRAND_COLORS } from '../../src/shared/theme/colors';
import { formatPrice, formatKm, formatMonthly } from '../../src/shared/utils/formatters';
import { calcMonthlyPayment } from '../../src/shared/utils/credit';

const { width: SCREEN_W } = Dimensions.get('window');
const PHOTO_H = 280;
const DEALER_PHONE = '+77712563880';
const DEALER_PHONE_DISPLAY = '+7 (771) 256-38-80';
const DEALER_WA = 'https://wa.me/77712563880';
const DEALER_TG = 'https://t.me/ak1iu';
const DEALER_IG = 'https://www.instagram.com/aiawxmn';
const CREDIT_FORM_URL = 'https://forms.gle/NMob6iAJKXVAqmxp8';

const formatNum = (v: string) => v.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export default function ListingDetailScreen() {
  const { colors, t, listings, toggleFavorite, isFavorite, addRecentlyViewed } = useApp();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const listing = listings.find((l) => l.id === id);
  const scrollRef = useRef<ScrollView>(null);
  const creditSectionY = useRef(0);

  const [optionsExpanded, setOptionsExpanded] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [creditTerm, setCreditTerm] = useState(60);
  const [messageVisible, setMessageVisible] = useState(false);
  const [photoViewerVisible, setPhotoViewerVisible] = useState(false);
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0);
  const photoViewerRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (id) addRecentlyViewed(id);
    setCurrentPhoto(0);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [id]);

  if (!listing) {
    return (
      <View style={[styles.root, { backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="car-outline" size={64} color={colors.border} />
        <Text style={[styles.notFound, { color: colors.text }]}>Объявление не найдено</Text>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/' as any)} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Назад</Text>
        </Pressable>
      </View>
    );
  }

  const bgColor = BRAND_COLORS[listing.brand] ?? BRAND_COLORS.default;
  const isFav = isFavorite(listing.id);
  const photos = listing.photos ?? [];
  const photosCount = photos.length || 1;

  const similar = listings
    .filter((l) => l.isActive && l.id !== listing.id && (l.brand === listing.brand || l.bodyType === listing.bodyType))
    .slice(0, 8);

  const newCars = listings
    .filter((l) => l.isActive && l.condition === 'new' && l.id !== listing.id)
    .slice(0, 8);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${listing.title} — ${formatPrice(listing.priceKzt)}\n${listing.sourceUrl ?? 'AutoNova'}`,
      });
    } catch {}
  };

  const handleCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { title: listing.title, message: DEALER_PHONE_DISPLAY, options: ['Позвонить', 'Отмена'], cancelButtonIndex: 1 },
        (idx) => { if (idx === 0) Linking.openURL(`tel:${DEALER_PHONE}`); },
      );
    } else {
      Alert.alert('Позвонить', `${DEALER_PHONE_DISPLAY}\n\n${listing.title}`, [
        { text: 'Позвонить', onPress: () => Linking.openURL(`tel:${DEALER_PHONE}`) },
        { text: 'Отмена', style: 'cancel' },
      ]);
    }
  };

  const openMessenger = (channel: 'whatsapp' | 'telegram' | 'instagram') => {
    const text = encodeURIComponent(`Здравствуйте! Интересует ${listing.title} за ${formatPrice(listing.priceKzt)}`);
    const url = channel === 'whatsapp' ? `${DEALER_WA}?text=${text}`
      : channel === 'telegram' ? `${DEALER_TG}?text=${text}`
      : DEALER_IG;
    Linking.openURL(url).catch(() => Alert.alert('Ошибка', 'Не удалось открыть приложение.'));
    setMessageVisible(false);
  };

  const scrollToCredit = () => {
    scrollRef.current?.scrollTo({ y: creditSectionY.current, animated: true });
  };

  const TERMS = [12, 24, 36, 48, 60, 72, 84];
  const carP = listing.priceKzt;
  const [downPaymentInput, setDownPaymentInput] = useState(
    listing.downPaymentKzt ? formatNum(String(listing.downPaymentKzt)) : ''
  );
  const downP = parseInt(downPaymentInput.replace(/\s/g, ''), 10) || 0;
  const monthly = calcMonthlyPayment(carP, downP, creditTerm);

  const CharRow = ({ label, value }: { label: string; value: string }) => (
    <View style={[styles.charRow, { borderBottomColor: colors.divider }]}>
      <Text style={[styles.charLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.charValue, { color: colors.text }]}>{value}</Text>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      {/* Floating header */}
      <SafeAreaView edges={['top']} style={styles.floatingHeaderWrap}>
        <View style={styles.floatingHeader}>
          <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/' as any)} style={[styles.floatBtn, { backgroundColor: 'rgba(0,0,0,0.45)' }]}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </Pressable>
          <View style={styles.floatRight}>
            <Pressable onPress={handleShare} style={[styles.floatBtn, { backgroundColor: 'rgba(0,0,0,0.45)' }]}>
              <Ionicons name="share-outline" size={20} color="#fff" />
            </Pressable>
            <Pressable
              onPress={() => router.push({ pathname: '/service/tradein', params: { listingId: listing.id } } as any)}
              style={[styles.floatBtn, { backgroundColor: 'rgba(0,0,0,0.45)' }]}
            >
              <Ionicons name="sync-outline" size={20} color="#fff" />
            </Pressable>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleFavorite(listing.id); }}
              style={[styles.floatBtn, { backgroundColor: 'rgba(0,0,0,0.45)' }]}
            >
              <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={20} color={isFav ? '#EF4444' : '#fff'} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {/* Photo gallery */}
        <View style={[styles.photoGallery, { backgroundColor: bgColor }]}>
          {photos.length > 0 ? (
            <ScrollView
              horizontal pagingEnabled showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
                setCurrentPhoto(idx);
              }}
              style={styles.photoScroll}
            >
              {photos.map((uri, i) => (
                <Pressable key={i} onPress={() => { setPhotoViewerIndex(i); setPhotoViewerVisible(true); }}>
                  <Image source={{ uri }} style={styles.photoImg} resizeMode="cover" />
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <Ionicons name="car-sport" size={80} color="rgba(255,255,255,0.6)" />
          )}
          {listing.condition === 'new' && (
            <View style={styles.newBadge}><Text style={styles.newText}>NEW</Text></View>
          )}
          {listing.isHit && (
            <View style={styles.hitBadge}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.hitText}> Хит продаж</Text>
            </View>
          )}
          <View style={styles.photoCounter}>
            <Ionicons name="images-outline" size={13} color="#fff" />
            <Text style={styles.photoCounterText}> {currentPhoto + 1}/{photosCount}</Text>
          </View>
          {photos.length > 1 && (
            <View style={styles.photoDots}>
              {photos.map((_, i) => (
                <View key={i} style={[styles.photoDot, { opacity: i === currentPhoto ? 1 : 0.35, backgroundColor: '#fff' }]} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.mainTitle, { color: colors.text }]}>{listing.title}</Text>
              <Text style={[styles.subTitle, { color: colors.textSecondary }]}>{listing.bodyType} · {listing.city}</Text>
            </View>
          </View>

          <Text style={styles.price}>{formatPrice(listing.priceKzt)}</Text>

          {listing.monthlyPaymentKzt ? (
            <View style={[styles.creditBlock, { backgroundColor: '#1E4AE912', borderColor: '#1E4AE930' }]}>
              <View style={styles.creditRow}>
                <View>
                  <Text style={[styles.creditLabel, { color: colors.textSecondary }]}>{t.monthlyPayment}</Text>
                  <Text style={styles.creditMonthly}>{formatMonthly(listing.monthlyPaymentKzt)}</Text>
                </View>
                {listing.downPaymentKzt ? (
                  <View>
                    <Text style={[styles.creditLabel, { color: colors.textSecondary }]}>{t.downPayment}</Text>
                    <Text style={[styles.creditDown, { color: colors.text }]}>{formatPrice(listing.downPaymentKzt)}</Text>
                  </View>
                ) : null}
              </View>
              <Pressable onPress={scrollToCredit} style={styles.creditBtn}>
                <Ionicons name="calculator-outline" size={15} color="#fff" />
                <Text style={styles.creditBtnText}>{t.calculateCredit}</Text>
              </Pressable>
            </View>
          ) : null}

          {/* CTA buttons */}
          <Pressable onPress={handleCall} style={styles.ctaGreen}>
            <Ionicons name="call" size={18} color="#fff" />
            <Text style={styles.ctaText}>Позвонить</Text>
          </Pressable>
          <Pressable onPress={() => setMessageVisible(true)} style={[styles.ctaMessage, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Ionicons name="chatbubble-outline" size={18} color="#1E4AE9" />
            <Text style={[styles.ctaMessageText, { color: '#1E4AE9' }]}>Написать сообщение</Text>
          </Pressable>

          {/* Characteristics */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Характеристики</Text>
            <CharRow label="Год выпуска" value={String(listing.year)} />
            <CharRow label={t.cityLabel} value={listing.city} />
            {listing.generation ? <CharRow label={t.generationLabel} value={listing.generation} /> : null}
            <CharRow label={t.bodyLabel} value={listing.bodyType} />
            {listing.engineLiters ? <CharRow label="Объём двигателя" value={`${listing.engineLiters} л`} /> : null}
            {listing.fuelType ? <CharRow label="Тип топлива" value={listing.fuelType} /> : null}
            <CharRow label={t.mileageLabel} value={listing.mileageKm > 0 ? formatKm(listing.mileageKm) : 'Новый'} />
            <CharRow label={t.gearboxLabel} value={listing.gearbox} />
            <CharRow label={t.driveLabel} value={listing.drive} />
            <CharRow label={t.steeringLabel} value={listing.steeringWheel === 'left' ? t.left : t.right} />
            {listing.color ? <CharRow label={t.colorLabel} value={listing.color} /> : null}
            <CharRow label="Состояние" value={listing.condition === 'new' ? 'Новый' : 'С пробегом'} />
            <CharRow label={t.customsLabel} value={listing.customsClearedKz ? t.yes : t.no} />
          </View>

          {/* Options */}
          {listing.options && listing.options.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Pressable onPress={() => setOptionsExpanded((p) => !p)} style={styles.optionsHeader}>
                <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 0 }]}>Опции и характеристики</Text>
                <Ionicons name={optionsExpanded ? 'chevron-up' : 'chevron-down'} size={18} color="#1E4AE9" />
              </Pressable>
              {optionsExpanded && (
                <>
                  <View style={styles.optionChips}>
                    {listing.options.map((opt, i) => (
                      <View key={i} style={[styles.optionChip, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                        <Text style={[styles.optionChipText, { color: colors.text }]}>{opt}</Text>
                      </View>
                    ))}
                  </View>
                  <Pressable onPress={() => setOptionsExpanded(false)} style={[styles.optionsHideRow, { borderTopColor: colors.divider }]}>
                    <Text style={styles.optionsHideText}>Скрыть опции и характеристики</Text>
                    <Ionicons name="chevron-up" size={15} color="#1E4AE9" />
                  </Pressable>
                </>
              )}
            </View>
          )}

          {/* Seller comment */}
          {listing.sellerComment ? (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{t.sellerComment}</Text>
              <Text style={[styles.commentText, { color: colors.textSecondary }]}>{listing.sellerComment}</Text>
            </View>
          ) : null}

          {/* Credit calculator */}
          <View
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onLayout={(e) => { creditSectionY.current = e.nativeEvent.layout.y + PHOTO_H; }}
          >
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t.creditTitle}</Text>
            <Text style={[styles.creditCalcSub, { color: colors.textSecondary }]}>Рассчитайте удобный платёж</Text>

            <View style={[styles.calcRow, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <View style={styles.calcField}>
                <Text style={[styles.calcFieldLabel, { color: colors.textSecondary }]}>Стоимость авто</Text>
                <Text style={[styles.calcFieldValue, { color: colors.text }]}>{formatPrice(carP)}</Text>
              </View>
              <View style={[styles.calcDivider, { backgroundColor: colors.border }]} />
              <View style={styles.calcField}>
                <Text style={[styles.calcFieldLabel, { color: colors.textSecondary }]}>Первоначальный взнос</Text>
                <TextInput
                  style={[styles.calcFieldInput, { color: colors.text }]}
                  keyboardType="numeric"
                  placeholder="0 ₸"
                  placeholderTextColor={colors.textSecondary}
                  value={downPaymentInput}
                  onChangeText={(v) => setDownPaymentInput(formatNum(v))}
                />
              </View>
            </View>

            <View style={styles.calcTerms}>
              {TERMS.map((m) => (
                <Pressable
                  key={m}
                  onPress={() => setCreditTerm(m)}
                  style={[styles.termChip, {
                    borderColor: m === creditTerm ? '#1E4AE9' : colors.border,
                    backgroundColor: m === creditTerm ? '#1E4AE9' : colors.surface,
                  }]}
                >
                  <Text style={{ color: m === creditTerm ? '#fff' : colors.textSecondary, fontSize: 12, fontWeight: '700' }}>
                    {m}м
                  </Text>
                </Pressable>
              ))}
            </View>

            {monthly > 0 && (
              <View style={[styles.calcResult, { backgroundColor: '#1E4AE9' }]}>
                <Text style={styles.calcResultLabel}>{t.monthlyPayment}*</Text>
                <Text style={styles.calcResultAmount}>{formatMonthly(monthly)}</Text>
              </View>
            )}

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Linking.openURL(CREDIT_FORM_URL).catch(() => {
                  router.push({ pathname: '/service/apply', params: { listingId: listing.id, listingTitle: listing.title } } as any);
                });
              }}
              style={styles.learnBtn}
            >
              <Ionicons name="document-text-outline" size={17} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.learnBtnText}>Подать заявку</Text>
            </Pressable>
          </View>

          {/* Trade-in */}
          <Pressable
            onPress={() => router.push({ pathname: '/service/tradein', params: { listingId: listing.id } } as any)}
            style={[styles.exchangeCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.exchangeIconWrap, { backgroundColor: '#1E4AE915' }]}>
              <Ionicons name="sync-outline" size={28} color="#1E4AE9" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.exchangeTitle, { color: colors.text }]}>Предложить обмен</Text>
              <Text style={[styles.exchangeSub, { color: colors.textSecondary }]}>Обменяйте свой автомобиль с доплатой в обе стороны</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </Pressable>

          {/* Similar listings */}
          {similar.length > 0 && (
            <View style={styles.relSection}>
              <Text style={[styles.relTitle, { color: colors.text }]}>{t.similarListings}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
                {similar.map((l) => (
                  <CarCard key={l.id} listing={l} onPress={() => router.push({ pathname: '/listing', params: { id: l.id } } as any)} colors={colors} width={175} />
                ))}
              </ScrollView>
            </View>
          )}

          {newCars.length > 0 && (
            <View style={styles.relSection}>
              <Text style={[styles.relTitle, { color: colors.text }]}>{t.newCarsForYou}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
                {newCars.map((l) => (
                  <CarCard key={l.id} listing={l} onPress={() => router.push({ pathname: '/listing', params: { id: l.id } } as any)} colors={colors} width={175} />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Full-screen photo viewer */}
      <Modal
        visible={photoViewerVisible}
        transparent
        statusBarTranslucent
        onRequestClose={() => setPhotoViewerVisible(false)}
      >
        <View style={styles.photoViewer}>
          <SafeAreaView edges={['top']} style={{ zIndex: 10 }}>
            <View style={styles.photoViewerHeader}>
              <Pressable onPress={() => setPhotoViewerVisible(false)} style={styles.photoViewerClose}>
                <Ionicons name="close" size={26} color="#fff" />
              </Pressable>
              <Text style={styles.photoViewerCounter}>{photoViewerIndex + 1} из {photos.length}</Text>
              <View style={{ width: 44 }} />
            </View>
          </SafeAreaView>
          <ScrollView
            ref={photoViewerRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
              setPhotoViewerIndex(idx);
            }}
            onLayout={() => {
              photoViewerRef.current?.scrollTo({ x: photoViewerIndex * SCREEN_W, animated: false });
            }}
            style={{ flex: 1 }}
          >
            {photos.map((uri, i) => (
              <View key={i} style={styles.photoViewerItem}>
                <Image source={{ uri }} style={styles.photoViewerImg} resizeMode="contain" />
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Message modal */}
      <Modal visible={messageVisible} transparent animationType="slide" onRequestClose={() => setMessageVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMessageVisible(false)}>
          <Pressable style={[styles.modalSheet, { backgroundColor: colors.card }]} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Написать сообщение</Text>
            <View style={styles.messengerRow}>
              <Pressable onPress={() => openMessenger('whatsapp')} style={styles.waBtn}>
                <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                <Text style={styles.waBtnText}>WhatsApp</Text>
              </Pressable>
              <Pressable onPress={() => openMessenger('telegram')} style={styles.tgBtn}>
                <Ionicons name="paper-plane-outline" size={20} color="#fff" />
                <Text style={styles.tgBtnText}>Telegram</Text>
              </Pressable>
            </View>
            <Pressable onPress={() => openMessenger('instagram')} style={styles.igBtn}>
              <Ionicons name="logo-instagram" size={20} color="#fff" />
              <Text style={styles.igBtnText}>Instagram</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  photoViewer: { flex: 1, backgroundColor: '#000' },
  photoViewerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10 },
  photoViewerClose: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  photoViewerCounter: { color: '#fff', fontSize: 16, fontWeight: '700' },
  photoViewerItem: { width: SCREEN_W, flex: 1, alignItems: 'center', justifyContent: 'center' },
  photoViewerImg: { width: SCREEN_W, height: SCREEN_W * 1.1 },
  floatingHeaderWrap: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  floatingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  floatBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  floatRight: { flexDirection: 'row', gap: 8 },

  photoGallery: { height: PHOTO_H, alignItems: 'center', justifyContent: 'center' },
  photoScroll: { width: SCREEN_W, height: PHOTO_H },
  photoImg: { width: SCREEN_W, height: PHOTO_H },
  newBadge: { position: 'absolute', top: 54, left: 16, backgroundColor: '#22C55E', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  newText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  hitBadge: { position: 'absolute', top: 54, right: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  hitText: { color: '#F59E0B', fontSize: 12, fontWeight: '700' },
  photoCounter: { position: 'absolute', bottom: 40, right: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  photoCounterText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  photoDots: { position: 'absolute', bottom: 14, flexDirection: 'row', gap: 5 },
  photoDot: { width: 7, height: 7, borderRadius: 3.5 },

  content: { padding: 16, paddingBottom: 20 },
  titleRow: { flexDirection: 'row', marginBottom: 4 },
  mainTitle: { fontSize: 20, fontWeight: '800', lineHeight: 26 },
  subTitle: { fontSize: 13, marginTop: 3 },
  price: { fontSize: 26, fontWeight: '900', color: '#1E4AE9', marginTop: 8, marginBottom: 14 },

  creditBlock: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 14 },
  creditRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  creditLabel: { fontSize: 11, marginBottom: 3 },
  creditMonthly: { fontSize: 18, fontWeight: '800', color: '#1E4AE9' },
  creditDown: { fontSize: 14, fontWeight: '600' },
  creditBtn: { backgroundColor: '#EF4444', borderRadius: 10, paddingVertical: 11, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  creditBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },

  ctaGreen: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: '#22C55E', borderRadius: 14, paddingVertical: 14, marginBottom: 10 },
  ctaText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  ctaMessage: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, borderWidth: 1.5, paddingVertical: 13, marginBottom: 16 },
  ctaMessageText: { fontSize: 14, fontWeight: '700' },

  card: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  charRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  charLabel: { fontSize: 13 },
  charValue: { fontSize: 13, fontWeight: '600', textAlign: 'right', flex: 1, marginLeft: 8 },

  optionsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  optionChip: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  optionChipText: { fontSize: 13 },
  optionsHideRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 14, paddingTop: 12, borderTopWidth: 1 },
  optionsHideText: { color: '#1E4AE9', fontSize: 13, fontWeight: '600' },
  commentText: { fontSize: 14, lineHeight: 22 },

  creditCalcSub: { fontSize: 13, marginBottom: 14 },
  calcRow: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, marginBottom: 14, overflow: 'hidden' },
  calcField: { flex: 1, padding: 12 },
  calcFieldLabel: { fontSize: 11, marginBottom: 4 },
  calcFieldValue: { fontSize: 14, fontWeight: '700' },
  calcFieldInput: { fontSize: 14, fontWeight: '700', padding: 0 },
  calcDivider: { width: 1 },
  calcTerms: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  termChip: { borderRadius: 8, borderWidth: 1.5, paddingHorizontal: 10, paddingVertical: 7 },
  calcResult: { borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12 },
  calcResultLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 4 },
  calcResultAmount: { color: '#fff', fontSize: 22, fontWeight: '900' },
  learnBtn: { backgroundColor: '#1E4AE9', borderRadius: 12, paddingVertical: 13, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  learnBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  relSection: { marginBottom: 20 },
  relTitle: { fontSize: 17, fontWeight: '800', marginBottom: 12 },
  hScroll: { paddingBottom: 4 },

  notFound: { fontSize: 16, marginTop: 12 },
  backBtn: { marginTop: 16, backgroundColor: '#1E4AE9', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 },
  backBtnText: { color: '#fff', fontWeight: '700' },


  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#ccc', alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  messengerRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  waBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#25D366', borderRadius: 14, paddingVertical: 14 },
  waBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  tgBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#229ED9', borderRadius: 14, paddingVertical: 14 },
  tgBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  igBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#E1306C', borderRadius: 14, paddingVertical: 14 },
  igBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  exchangeCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  exchangeIconWrap: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  exchangeTitle: { fontSize: 15, fontWeight: '800', marginBottom: 3 },
  exchangeSub: { fontSize: 12, lineHeight: 17 },
});