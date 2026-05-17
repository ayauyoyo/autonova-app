import { Ionicons } from '@expo/vector-icons';
import * as Haptics from '../../src/shared/utils/haptics';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/store/AppContext';

const CREDIT_FORM_URL = 'https://forms.gle/NMob6iAJKXVAqmxp8';

const DOCS = [
  { icon: 'person-outline' as const, label: 'ФИО заявителя' },
  { icon: 'people-outline' as const, label: '1-е доверенное лицо — ФИО и номер телефона' },
  { icon: 'people-outline' as const, label: '2-е доверенное лицо — ФИО и номер телефона' },
  { icon: 'cash-outline' as const, label: 'Заработная плата (справка или сумма)' },
  { icon: 'camera-outline' as const, label: 'Фото заявителя' },
  { icon: 'document-outline' as const, label: 'Фото техпаспорта (2 стороны)' },
  { icon: 'card-outline' as const, label: 'Фото удостоверения личности' },
  { icon: 'newspaper-outline' as const, label: 'Выписка из банка за 6 месяцев' },
  { icon: 'newspaper-outline' as const, label: 'Выписка из банка за 1 год' },
];

export default function ApplyScreen() {
  const { colors } = useApp();
  const router = useRouter();
  const { listingTitle } = useLocalSearchParams<{ listingId?: string; listingTitle?: string }>();

  const handleOpen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(CREDIT_FORM_URL).catch(() => {});
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.bg }}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/' as any)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Подать заявку</Text>
          <View style={{ width: 36 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {listingTitle ? (
          <View style={[styles.carBadge, { backgroundColor: '#1E4AE912', borderColor: '#1E4AE930' }]}>
            <Ionicons name="car-sport" size={18} color="#1E4AE9" />
            <Text style={[styles.carBadgeText, { color: '#1E4AE9' }]} numberOfLines={1}>{listingTitle}</Text>
          </View>
        ) : null}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Необходимые документы</Text>
        <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
          Подготовьте следующие документы и данные — их нужно будет загрузить в форму заявки.
        </Text>

        <View style={[styles.docsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {DOCS.map((doc, i) => (
            <View
              key={i}
              style={[styles.docRow, i < DOCS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
            >
              <View style={[styles.docIconWrap, { backgroundColor: '#1E4AE912' }]}>
                <Ionicons name={doc.icon} size={18} color="#1E4AE9" />
              </View>
              <Text style={[styles.docLabel, { color: colors.text }]}>{doc.label}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.infoCard, { backgroundColor: '#F59E0B12', borderColor: '#F59E0B30' }]}>
          <Ionicons name="information-circle-outline" size={20} color="#F59E0B" />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            После нажатия кнопки откроется форма в браузере. Заполните все поля и загрузите фотографии — данные сохранятся автоматически.
          </Text>
        </View>

        <Pressable onPress={handleOpen} style={styles.openBtn}>
          <Ionicons name="document-text-outline" size={20} color="#fff" />
          <Text style={styles.openBtnText}>Открыть форму заявки</Text>
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
  content: { padding: 20, paddingBottom: 40 },
  carBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 20 },
  carBadgeText: { fontSize: 14, fontWeight: '700', flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '900', marginBottom: 6 },
  sectionSub: { fontSize: 13, lineHeight: 20, marginBottom: 16 },
  docsCard: { borderRadius: 16, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  docIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  docLabel: { fontSize: 14, flex: 1, lineHeight: 20 },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 20 },
  infoText: { fontSize: 13, lineHeight: 20, flex: 1 },
  openBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1E4AE9', borderRadius: 16, paddingVertical: 16 },
  openBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});