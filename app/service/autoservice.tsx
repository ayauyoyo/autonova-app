import { Ionicons } from '@expo/vector-icons';
import * as Haptics from '../../src/shared/utils/haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/store/AppContext';
import { sendTelegramNotification } from '../../src/shared/utils/telegram';

const SERVICES = [
  { key: 'oil', icon: 'water-outline' as const, label: 'Замена масла', price: 'от 5 000 ₸' },
  { key: 'tires', icon: 'settings-outline' as const, label: 'Шиномонтаж', price: 'от 8 000 ₸' },
  { key: 'brake', icon: 'alert-circle-outline' as const, label: 'Тормозная система', price: 'от 15 000 ₸' },
  { key: 'diag', icon: 'pulse-outline' as const, label: 'Компьютерная диагностика', price: 'от 3 000 ₸' },
  { key: 'wash', icon: 'sparkles-outline' as const, label: 'Мойка автомобиля', price: 'от 2 500 ₸' },
  { key: 'body', icon: 'color-palette-outline' as const, label: 'Кузовной ремонт', price: 'от 50 000 ₸' },
];

export default function AutoServiceScreen() {
  const { colors, addApplication } = useApp();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleService = (key: string) => {
    setSelected((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  };

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Заполните поля', 'Введите имя и номер телефона.');
      return;
    }
    if (selected.length === 0) {
      Alert.alert('Выберите услугу', 'Выберите хотя бы одну услугу для записи.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const serviceLabels = selected.map((k) => SERVICES.find((s) => s.key === k)?.label ?? k).join(', ');
    addApplication({
      type: 'autoservice',
      name: name.trim(),
      phone: phone.trim(),
      extra: serviceLabels,
    });
    sendTelegramNotification(
      `🔧 <b>Новая заявка: Автосервис</b>\n\n` +
      `👤 Имя: ${name.trim()}\n` +
      `📱 Телефон: ${phone.trim()}\n` +
      `⚙️ Услуги: ${serviceLabels}\n` +
      `🕐 ${new Date().toLocaleString('ru-KZ')}`
    );
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
            <Text style={[styles.headerTitle, { color: colors.text }]}>Автосервис</Text>
            <View style={{ width: 36 }} />
          </View>
        </SafeAreaView>
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: '#22C55E18' }]}>
            <Ionicons name="checkmark-circle" size={64} color="#22C55E" />
          </View>
          <Text style={[styles.successTitle, { color: colors.text }]}>Заявка принята!</Text>
          <Text style={[styles.successText, { color: colors.textSecondary }]}>
            {`${name.trim()}, наш мастер свяжется с вами по номеру ${phone} и согласует удобное время.`}
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Автосервис</Text>
          <View style={{ width: 36 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Выберите нужные услуги и запишитесь онлайн — перезвоним в течение 15 минут
        </Text>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>УСЛУГИ</Text>
        {SERVICES.map((s) => {
          const active = selected.includes(s.key);
          return (
            <Pressable
              key={s.key}
              onPress={() => toggleService(s.key)}
              style={[styles.serviceRow, {
                backgroundColor: active ? '#1E4AE912' : colors.card,
                borderColor: active ? '#1E4AE9' : colors.border,
              }]}
            >
              <View style={[styles.serviceIcon, { backgroundColor: active ? '#1E4AE920' : colors.surface }]}>
                <Ionicons name={s.icon} size={22} color={active ? '#1E4AE9' : colors.icon} />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={[styles.serviceName, { color: colors.text }]}>{s.label}</Text>
                <Text style={[styles.servicePrice, { color: colors.textSecondary }]}>{s.price}</Text>
              </View>
              <View style={[styles.checkbox, { borderColor: active ? '#1E4AE9' : colors.border, backgroundColor: active ? '#1E4AE9' : 'transparent' }]}>
                {active && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
            </Pressable>
          );
        })}

        <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: 20 }]}>ВАШИ ДАННЫЕ</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
          placeholder="Имя"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
          placeholder="+7 (___) ___-__-__"
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Pressable onPress={handleSubmit} style={styles.submitBtn}>
          <Ionicons name="calendar-outline" size={18} color="#fff" />
          <Text style={styles.submitText}>Записаться на сервис</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  content: { padding: 16, paddingBottom: 40 },
  subtitle: { fontSize: 13, lineHeight: 20, marginBottom: 20 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: 12 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1.5, padding: 14, marginBottom: 10, gap: 12 },
  serviceIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 14, fontWeight: '700' },
  servicePrice: { fontSize: 12, marginTop: 2 },
  checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, marginBottom: 12 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1E4AE9', borderRadius: 14, paddingVertical: 16, marginTop: 8 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successIcon: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontSize: 22, fontWeight: '900', marginBottom: 12 },
  successText: { fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 28 },
  doneBtn: { backgroundColor: '#1E4AE9', borderRadius: 14, paddingVertical: 15, paddingHorizontal: 40 },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});