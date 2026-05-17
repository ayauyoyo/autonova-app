import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../store/AppContext';
import { ThemeToggle } from './ThemeToggle';

export function DrawerContent(props: any) {
  const { colors, t, lang, setLang } = useApp();
  const router = useRouter();

  const items = [
    { icon: 'home-outline' as const, label: t.drawerHome, route: '/(tabs)' },
    { icon: 'information-circle-outline' as const, label: t.drawerAbout, route: null },
    { icon: 'call-outline' as const, label: t.drawerContact, route: '/contacts' },
  ];

  const go = (route: string | null) => {
    if (!route) return;
    router.navigate(route as any);
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1 }}
      style={{ backgroundColor: colors.bg }}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.logoRow}>
          <Ionicons name="car-sport" size={28} color="#1E4AE9" />
          <Text style={[styles.logoText, { color: colors.text }]}>AutoNova</Text>
        </View>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>{t.tagline}</Text>
      </View>

      {/* Nav items */}
      <View style={styles.nav}>
        {items.map((item) => (
          <Pressable
            key={item.label}
            onPress={() => go(item.route)}
            style={({ pressed }) => [styles.navItem, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name={item.icon} size={20} color={colors.icon} />
            <Text style={[styles.navLabel, { color: colors.text }]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.langRow}>
          <Pressable
            onPress={() => setLang('ru')}
            style={[styles.langBtn, { backgroundColor: lang === 'ru' ? '#1E4AE9' : colors.surface, borderColor: colors.border }]}
          >
            <Text style={{ color: lang === 'ru' ? '#fff' : colors.text, fontSize: 13, fontWeight: '600' }}>RU</Text>
          </Pressable>
          <Pressable
            onPress={() => setLang('kk')}
            style={[styles.langBtn, { backgroundColor: lang === 'kk' ? '#1E4AE9' : colors.surface, borderColor: colors.border }]}
          >
            <Text style={{ color: lang === 'kk' ? '#fff' : colors.text, fontSize: 13, fontWeight: '600' }}>KK</Text>
          </Pressable>
          <ThemeToggle />
        </View>

        <Text style={[styles.contact, { color: colors.textSecondary }]}>{t.phone}</Text>
        <Text style={[styles.contact, { color: colors.textSecondary }]}>{t.address}</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: { padding: 20, paddingTop: 16, borderBottomWidth: 1 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoText: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  tagline: { fontSize: 12, marginTop: 4 },
  nav: { paddingVertical: 10 },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, paddingHorizontal: 20 },
  navLabel: { fontSize: 15 },
  footer: { padding: 20, borderTopWidth: 1, marginTop: 'auto' },
  langRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  langBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8, borderWidth: 1 },
  contact: { fontSize: 12, marginBottom: 4 },
});