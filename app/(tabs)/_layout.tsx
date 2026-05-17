import { Ionicons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../../src/shared/store/AppContext';
import { ThemeToggle } from '../../src/shared/ui/ThemeToggle';

function TabIcon({ name, focused, color }: { name: keyof typeof Ionicons.glyphMap; focused: boolean; color: string }) {
  return <Ionicons name={focused ? name : (name + '-outline') as any} size={24} color={color} />;
}

export default function TabsLayout() {
  const { colors, t } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.header, elevation: 0, shadowOpacity: 0 },
        headerTintColor: colors.text,
        headerLeft: () => (
          <View style={styles.headerLeft}>
            <DrawerToggleButton tintColor={colors.icon} />
          </View>
        ),
        headerTitle: () => (
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            AutoNova<Text style={styles.headerDot}>.</Text><Text style={styles.headerKz}>kz</Text>
          </Text>
        ),
        headerRight: () => (
          <View style={styles.headerRight}>
            <ThemeToggle />
          </View>
        ),
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 96 : 90,
          paddingBottom: Platform.OS === 'ios' ? 30 : 30,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#1E4AE9',
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.home,
          tabBarIcon: ({ focused, color }) => <TabIcon name="home" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t.favorites,
          tabBarIcon: ({ focused, color }) => <TabIcon name="heart" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="credit"
        options={{
          title: t.credit,
          tabBarIcon: ({ focused, color }) => <TabIcon name="calculator" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: t.services,
          tabBarIcon: ({ focused, color }) => <TabIcon name="grid" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerLeft: { paddingLeft: 4 },
  headerRight: { paddingRight: 12, flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerTitle: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  headerDot: { color: '#1E4AE9', fontWeight: '900' },
  headerKz: { color: '#1E4AE9', fontWeight: '900' },
});