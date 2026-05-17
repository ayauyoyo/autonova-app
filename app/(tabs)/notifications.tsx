import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../../src/shared/store/AppContext';
import { EmptyState } from '../../src/shared/ui/EmptyState';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'только что';
  if (m < 60) return `${m} мин назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч назад`;
  const d = Math.floor(h / 24);
  return `${d} д назад`;
}

const TYPE_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  system: 'information-circle-outline',
  marketing: 'megaphone-outline',
  search_match: 'search-outline',
  application: 'document-text-outline',
};

const TYPE_COLOR: Record<string, string> = {
  system: '#1E4AE9',
  marketing: '#7C3AED',
  search_match: '#0891B2',
  application: '#059669',
};

export default function NotificationsScreen() {
  const { colors, t, notifications, markAllRead, unreadCount } = useApp();

  if (notifications.length === 0) {
    return (
      <View style={[styles.root, { backgroundColor: colors.bg }]}>
        <EmptyState icon="notifications-outline" title={t.noNotifications} description={t.noNotificationsDesc} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      {unreadCount > 0 && (
        <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
          <Text style={[styles.topBarText, { color: colors.textSecondary }]}>
            Непрочитанных: {unreadCount}
          </Text>
          <Pressable onPress={markAllRead}>
            <Text style={styles.markRead}>{t.markRead}</Text>
          </Pressable>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.list}>
        {notifications.map((n) => (
          <View
            key={n.id}
            style={[
              styles.item,
              { backgroundColor: colors.card, borderColor: colors.border },
              !n.read && styles.itemUnread,
            ]}
          >
            <View style={[styles.iconBox, { backgroundColor: (TYPE_COLOR[n.type] ?? '#1E4AE9') + '18' }]}>
              <Ionicons name={TYPE_ICON[n.type] ?? 'notifications-outline'} size={22} color={TYPE_COLOR[n.type] ?? '#1E4AE9'} />
            </View>
            <View style={styles.body}>
              <View style={styles.titleRow}>
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{n.title}</Text>
                {!n.read && <View style={styles.unreadDot} />}
              </View>
              {n.body ? <Text style={[styles.body2, { color: colors.textSecondary }]} numberOfLines={2}>{n.body}</Text> : null}
              <Text style={[styles.time, { color: colors.textMuted }]}>{timeAgo(n.createdAt)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1,
  },
  topBarText: { fontSize: 13 },
  markRead: { fontSize: 13, color: '#1E4AE9', fontWeight: '600' },
  list: { padding: 16, gap: 10, paddingBottom: 32 },
  item: { flexDirection: 'row', borderRadius: 14, borderWidth: 1, padding: 14, gap: 12 },
  itemUnread: { borderLeftWidth: 3, borderLeftColor: '#1E4AE9' },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  body: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { flex: 1, fontSize: 14, fontWeight: '700' },
  body2: { fontSize: 13, marginTop: 3, lineHeight: 18 },
  time: { fontSize: 11, marginTop: 5 },
  unreadDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#1E4AE9' },
});
