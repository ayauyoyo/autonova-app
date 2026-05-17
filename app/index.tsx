import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../src/shared/store/AppContext';

export default function Index() {
  const { loaded, langSelected } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!loaded) return;
    if (langSelected) {
      router.replace('/(tabs)');
    } else {
      router.replace('/splash');
    }
  }, [loaded, langSelected]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1E4AE9" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});
