import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../../src/shared/store/AppContext';

const SERVICE_ITEMS = [
  { key: 'machines', icon: 'car-outline' as const, color: '#1E4AE9', route: '/catalog' },
  { key: 'credit', icon: 'card-outline' as const, color: '#7C3AED', route: '/(tabs)/credit' },
  { key: 'autoservice', icon: 'construct-outline' as const, color: '#0891B2', route: '/service/autoservice' },
  { key: 'used', icon: 'time-outline' as const, color: '#059669', route: '/service/used' },
  { key: 'new', icon: 'car-sport-outline' as const, color: '#DC2626', route: '/service/new' },
  { key: 'tradein', icon: 'swap-horizontal-outline' as const, color: '#D97706', route: '/service/tradein' },
];

export default function ServicesScreen() {
  const { colors, t } = useApp();
  const router = useRouter();

  const labels: Record<string, { title: string; desc: string }> = {
    machines: { title: t.serviceMachines, desc: t.serviceMachinesDesc },
    credit: { title: t.serviceAutoCredit, desc: t.serviceCreditDesc },
    autoservice: { title: t.serviceAutoService, desc: t.serviceAutoServiceDesc },
    used: { title: t.serviceUsed, desc: t.serviceUsedDesc },
    new: { title: t.serviceNew, desc: t.serviceNewDesc },
    tradein: { title: t.serviceTradeIn, desc: t.serviceTradeInDesc },
  };

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.container}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>{t.servicesTitle}</Text>
      {SERVICE_ITEMS.map((item) => (
        <Pressable
          key={item.key}
          onPress={() => router.push(item.route as any)}
          style={({ pressed }: { pressed: boolean }) => [styles.card, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.88 : 1 }]}
        >
          <View style={[styles.iconBox, { backgroundColor: item.color + '18' }]}>
            <Ionicons name={item.icon} size={28} color={item.color} />
          </View>
          <View style={styles.cardBody}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{labels[item.key].title}</Text>
            <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>{labels[item.key].desc}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: '900', marginBottom: 16 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, borderWidth: 1,
    padding: 16, marginBottom: 12, gap: 14,
  },
  iconBox: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  cardDesc: { fontSize: 12, lineHeight: 16 },
});