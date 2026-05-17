import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { AppProvider } from '../src/shared/store/AppContext';
import { DrawerContent } from '../src/shared/ui/DrawerContent';

function DrawerNav() {
  return (
    <View style={styles.root}>
      <Drawer
        screenOptions={{ headerShown: false }}
        drawerContent={(props) => <DrawerContent {...props} />}
      >
        <Drawer.Screen name="index"    options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="splash"   options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="(tabs)"   options={{ drawerLabel: 'Главная' }} />
        <Drawer.Screen name="catalog"  options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="listing"  options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="admin"    options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="contacts" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="service"  options={{ drawerItemStyle: { display: 'none' } }} />
      </Drawer>
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AppProvider>
        <DrawerNav />
      </AppProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});