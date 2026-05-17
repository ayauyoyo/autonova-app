import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../src/shared/store/AppContext';

export default function SplashScreen() {
  const { setLang } = useApp();
  const router = useRouter();

  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoScale, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(btnOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const select = async (lang: 'ru' | 'kk') => {
    await setLang(lang);
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient colors={['#0A0A2E', '#1E4AE9', '#1535B0']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        {/* Logo + brand */}
        <View style={styles.center}>
          <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
            <View style={styles.iconCircle}>
              <Ionicons name="car-sport" size={52} color="#1E4AE9" />
            </View>
            <Text style={styles.appName}>AutoNova</Text>
            <Text style={styles.dealerName}>NovaCar</Text>
            <Text style={styles.tagline}>Ваш надёжный автосалон</Text>
          </Animated.View>
        </View>

        {/* Language buttons */}
        <Animated.View style={[styles.btnArea, { opacity: btnOpacity }]}>
          <Text style={styles.chooseText}>Выберите язык · Тілді таңдаңыз</Text>
          <View style={styles.btnRow}>
            <Pressable
              onPress={() => select('kk')}
              style={({ pressed }) => [styles.langBtn, styles.langBtnOutline, pressed && styles.pressed]}
            >
              <Text style={styles.langBtnOutlineText}>Қазақша</Text>
            </Pressable>
            <Pressable
              onPress={() => select('ru')}
              style={({ pressed }) => [styles.langBtn, styles.langBtnFill, pressed && styles.pressed]}
            >
              <Text style={styles.langBtnFillText}>Русский</Text>
            </Pressable>
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoWrap: { alignItems: 'center', gap: 10 },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  appName: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  dealerName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 4,
  },
  btnArea: {
    paddingHorizontal: 28,
    paddingBottom: 40,
    alignItems: 'center',
  },
  chooseText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    marginBottom: 20,
    textAlign: 'center',
  },
  btnRow: { flexDirection: 'row', gap: 14, width: '100%' },
  langBtn: { flex: 1, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  langBtnOutline: { borderWidth: 2, borderColor: 'rgba(255,255,255,0.65)' },
  langBtnOutlineText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  langBtnFill: { backgroundColor: '#fff' },
  langBtnFillText: { color: '#1E4AE9', fontSize: 16, fontWeight: '800' },
  pressed: { opacity: 0.8 },
});
