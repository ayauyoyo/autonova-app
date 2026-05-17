import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { AppProvider } from '../src/shared/store/AppContext';
import { DrawerContent } from '../src/shared/ui/DrawerContent';
import { useApp } from '../src/shared/store/AppContext';
import { COLORS } from '../src/shared/theme/colors';

const { width, height } = Dimensions.get('window');
// Circle big enough to cover screen when centered at top-right corner
const CIRCLE_SIZE = Math.ceil(Math.sqrt(width * width + height * height)) * 2 + 100;
const CIRCLE_LEFT = width - CIRCLE_SIZE / 2;   // centered horizontally at right edge
const CIRCLE_TOP  = 0    - CIRCLE_SIZE / 2;   // centered vertically at top edge

function DrawerNav() {
  const { theme } = useApp();
  const prevThemeRef = useRef(theme);
  const rippleScale = useRef(new Animated.Value(0)).current;
  const [waveColor, setWaveColor] = useState<string>(COLORS[theme].bg);

  useLayoutEffect(() => {
    if (prevThemeRef.current !== theme) {
      setWaveColor(COLORS[prevThemeRef.current].bg); // old theme color
      prevThemeRef.current = theme;
      rippleScale.setValue(1); // instantly cover full screen before paint

      // Collapse the old-theme circle back into the top-right corner
      Animated.timing(rippleScale, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.cubic),
      }).start();
    }
  }, [theme, rippleScale]);

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

      {/* Circular ripple — old theme collapses to top-right corner */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: CIRCLE_LEFT,
          top: CIRCLE_TOP,
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          borderRadius: CIRCLE_SIZE / 2,
          backgroundColor: waveColor,
          transform: [{ scale: rippleScale }],
          zIndex: 9999,
        }}
      />
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