import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActionSheetIOS,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../src/shared/store/AppContext';

const PHONE = '+77712563880';
const PHONE_DISPLAY = '+7 (771) 256-38-80';
const WA_URL = 'https://wa.me/77712563880';
const TG_URL = 'https://t.me/ak1iu';
const IG_URL = 'https://www.instagram.com/aiawxmn';
const ADDRESS = 'г. Астана, ул. Примерная, 1';
const HOURS = 'Пн–Вс: 9:00 – 20:00';
const EMAIL = 'info@autonova.kz';

export default function ContactsScreen() {
  const { colors } = useApp();
  const router = useRouter();

  const handleCall = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { title: 'AutoNova', message: PHONE_DISPLAY, options: ['Позвонить', 'Отмена'], cancelButtonIndex: 1 },
        (i) => { if (i === 0) Linking.openURL(`tel:${PHONE}`); },
      );
    } else {
      Alert.alert('Позвонить', PHONE_DISPLAY, [
        { text: 'Позвонить', onPress: () => Linking.openURL(`tel:${PHONE}`) },
        { text: 'Отмена', style: 'cancel' },
      ]);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.bg }}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/' as any)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Контакты</Text>
          <View style={{ width: 36 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoBlock}>
          <View style={styles.logoCircle}>
            <Ionicons name="car-sport" size={36} color="#1E4AE9" />
          </View>
          <Text style={[styles.dealerName, { color: colors.text }]}>AutoNova</Text>
          <Text style={[styles.dealerTagline, { color: colors.textSecondary }]}>Ваш надёжный автосалон в Астане</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Row icon="call-outline" label="Телефон" value={PHONE_DISPLAY} colors={colors} />
          <Row icon="time-outline" label="Режим работы" value={HOURS} colors={colors} />
          <Row icon="location-outline" label="Адрес" value={ADDRESS} colors={colors} />
          <Row icon="mail-outline" label="Email" value={EMAIL} colors={colors} last />
        </View>

        <View style={styles.actions}>
          <Pressable onPress={handleCall} style={styles.callBtn}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.callBtnText}>Позвонить</Text>
          </Pressable>
          <Pressable onPress={() => Linking.openURL(IG_URL)} style={styles.igBtn}>
            <Ionicons name="logo-instagram" size={20} color="#fff" />
            <Text style={styles.igBtnText}>Instagram</Text>
          </Pressable>
        </View>

        <View style={styles.messengerRow}>
          <Pressable onPress={() => Linking.openURL(WA_URL)} style={styles.waBtn}>
            <Ionicons name="logo-whatsapp" size={22} color="#fff" />
            <Text style={styles.waBtnText}>WhatsApp</Text>
          </Pressable>
          <Pressable onPress={() => Linking.openURL(TG_URL)} style={styles.tgBtn}>
            <Ionicons name="paper-plane-outline" size={22} color="#fff" />
            <Text style={styles.tgBtnText}>Telegram</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function Row({ icon, label, value, colors, last }: any) {
  return (
    <View style={[styles.row, !last && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
      <Ionicons name={icon} size={18} color="#1E4AE9" style={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.rowValue, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  content: { padding: 20, paddingBottom: 40 },
  logoBlock: { alignItems: 'center', marginBottom: 24 },
  logoCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(30,74,233,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  dealerName: { fontSize: 22, fontWeight: '900' },
  dealerTagline: { fontSize: 13, marginTop: 4 },
  card: { borderRadius: 16, borderWidth: 1, marginBottom: 20, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  rowLabel: { fontSize: 11, marginBottom: 2 },
  rowValue: { fontSize: 14, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  callBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#22C55E', borderRadius: 14, paddingVertical: 15 },
  callBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  igBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 15, backgroundColor: '#E1306C' },
  igBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  messengerRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  waBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#25D366', borderRadius: 14, paddingVertical: 14 },
  waBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  tgBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#229ED9', borderRadius: 14, paddingVertical: 14 },
  tgBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});