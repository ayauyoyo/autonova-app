import { Ionicons } from '@expo/vector-icons';
import * as Haptics from '../../src/shared/utils/haptics';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/store/AppContext';
import { POPULAR_CITIES } from '../../src/shared/data/mockData';
import { BRAND_COLORS } from '../../src/shared/theme/colors';
import { sendTelegramNotification } from '../../src/shared/utils/telegram';

// Замените на ссылку вашей Google Form для трейд-ин
const TRADEIN_FORM_URL = 'https://forms.gle/ВСТАВЬТЕ_ССЫЛКУ_СЮДА';

export default function TradeInScreen() {
  const { colors, listings, addApplication } = useApp();
  const router = useRouter();
  const { listingId } = useLocalSearchParams<{ listingId?: string }>();

  const listing = listingId ? listings.find((l) => l.id === listingId) : null;
  const bgColor = listing ? (BRAND_COLORS[listing.brand] ?? BRAND_COLORS.default) : '#1E4AE9';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = name.trim().length > 0 && phone.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) {
      Alert.alert('Заполните поля', 'Введите имя и номер телефона.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addApplication({
      type: 'exchange',
      listingId: listing?.id,
      listingTitle: listing?.title,
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
    });
    sendTelegramNotification(
      `🔄 <b>Новая заявка: Трейд-ин</b>\n\n` +
      `👤 Имя: ${name.trim()}\n` +
      `📱 Телефон: ${phone.trim()}\n` +
      `🏙 Город: ${city || 'не указан'}\n` +
      `🚗 Авто: ${listing ? `${listing.title}` : 'не выбрано'}\n` +
      `🕐 ${new Date().toLocaleString('ru-KZ')}`
    );
    // Открываем Google Form
    Linking.openURL(TRADEIN_FORM_URL).catch(() => {
      setSubmitted(true);
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={[styles.root, { backgroundColor: colors.bg }]}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: colors.bg }}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/' as any)} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Обмен авто</Text>
            <View style={{ width: 36 }} />
          </View>
        </SafeAreaView>
        <View style={styles.success}>
          <View style={[styles.successIcon, { backgroundColor: '#22C55E18' }]}>
            <Ionicons name="swap-horizontal" size={56} color="#22C55E" />
          </View>
          <Text style={[styles.successTitle, { color: colors.text }]}>Заявка на обмен принята!</Text>
          <Text style={[styles.successText, { color: colors.textSecondary }]}>
            {`${name.trim()}, наш эксперт свяжется с вами по номеру ${phone} и согласует дату осмотра.`}
          </Text>
          <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/' as any)} style={styles.doneBtn}>
            <Text style={styles.doneBtnText}>Готово</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.bg }}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/' as any)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Обменяйте свой автомобиль</Text>
          <View style={{ width: 36 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Запишитесь на осмотр вашего авто в салоне AutoNova. Мы оценим его и обменяем на наше авто с доплатой в обе стороны.
        </Text>

        {/* Car comparison */}
        <View style={styles.compareRow}>
          <View style={[styles.compareCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {listing ? (
              <>
                <View style={[styles.comparePhoto, { backgroundColor: bgColor }]}>
                  {listing.photos?.[0] ? (
                    <Image source={{ uri: listing.photos[0] }} style={styles.compareImg} resizeMode="cover" />
                  ) : (
                    <Ionicons name="car-sport" size={32} color="rgba(255,255,255,0.7)" />
                  )}
                </View>
                <Text style={[styles.compareName, { color: colors.text }]} numberOfLines={1}>
                  {listing.title}
                </Text>
                <Text style={[styles.comparePrice, { color: '#1E4AE9' }]}>
                  {(listing.priceKzt / 1000000).toFixed(1)} млн ₸
                </Text>
              </>
            ) : (
              <>
                <View style={[styles.comparePhoto, { backgroundColor: '#1E4AE9' }]}>
                  <Ionicons name="car-sport" size={32} color="rgba(255,255,255,0.7)" />
                </View>
                <Text style={[styles.compareName, { color: colors.text }]}>Авто AutoNova</Text>
                <Text style={[styles.comparePrice, { color: '#1E4AE9' }]}>На ваш выбор</Text>
              </>
            )}
          </View>

          <View style={[styles.swapCircle, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="sync-outline" size={22} color="#1E4AE9" />
          </View>

          <View style={[styles.compareCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.comparePhoto, { backgroundColor: '#E2E8F0' }]}>
              <Ionicons name="car-outline" size={32} color="#94A3B8" />
            </View>
            <Text style={[styles.compareName, { color: colors.text }]}>Ваш автомобиль</Text>
            <Text style={[styles.comparePrice, { color: colors.textSecondary }]}>
              Оценка после осмотра
            </Text>
          </View>
        </View>

        {/* Form */}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Имя *</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
          placeholder="Ваше имя"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
        />

        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Город</Text>
        <Pressable
          onPress={() => setCityPickerOpen(true)}
          style={[styles.input, styles.inputPicker, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <Text style={{ color: city ? colors.text : colors.textSecondary, fontSize: 15, flex: 1 }}>
            {city || 'Выберите город'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
        </Pressable>

        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Телефон *</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
          placeholder="+7 (___) ___-__-__"
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Pressable
          onPress={handleSubmit}
          style={[styles.submitBtn, { opacity: canSubmit ? 1 : 0.6 }]}
        >
          <Ionicons name="document-text-outline" size={18} color="#fff" />
          <Text style={styles.submitText}>Записаться на осмотр</Text>
        </Pressable>
      </ScrollView>

      <Modal visible={cityPickerOpen} transparent animationType="slide" onRequestClose={() => setCityPickerOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setCityPickerOpen(false)}>
          <Pressable style={[styles.citySheet, { backgroundColor: colors.card }]} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={[styles.sheetTitle, { color: colors.text }]}>Выберите город</Text>
            <ScrollView>
              {POPULAR_CITIES.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => { setCity(c); setCityPickerOpen(false); }}
                  style={[styles.cityItem, { borderBottomColor: colors.border }]}
                >
                  <Text style={[styles.cityItemText, { color: city === c ? '#1E4AE9' : colors.text }]}>{c}</Text>
                  {city === c && <Ionicons name="checkmark" size={18} color="#1E4AE9" />}
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800' },
  content: { padding: 20, paddingBottom: 40 },
  subtitle: { fontSize: 13, lineHeight: 20, marginBottom: 20 },

  compareRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  compareCard: { flex: 1, borderRadius: 14, borderWidth: 1, overflow: 'hidden', alignItems: 'center' },
  comparePhoto: { width: '100%', height: 100, alignItems: 'center', justifyContent: 'center' },
  compareImg: { width: '100%', height: '100%' },
  compareName: { fontSize: 12, fontWeight: '700', marginTop: 8, paddingHorizontal: 8, textAlign: 'center' },
  comparePrice: { fontSize: 11, marginBottom: 10, paddingHorizontal: 6, textAlign: 'center' },
  swapCircle: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center', zIndex: 1, marginHorizontal: -4 },

  fieldLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, fontSize: 15, marginBottom: 14 },
  inputPicker: { flexDirection: 'row', alignItems: 'center' },

  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1E4AE9', borderRadius: 16, paddingVertical: 16, marginTop: 8 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  success: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successIcon: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 14 },
  successText: { fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 20 },
  doneBtn: { backgroundColor: '#1E4AE9', borderRadius: 14, paddingVertical: 15, paddingHorizontal: 40 },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  citySheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '70%', paddingBottom: 40 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#ccc', alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  sheetTitle: { fontSize: 17, fontWeight: '800', paddingHorizontal: 20, marginBottom: 8 },
  cityItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
  cityItemText: { fontSize: 15 },
});