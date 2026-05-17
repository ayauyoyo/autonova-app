import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useApp } from '../../src/shared/store/AppContext';
import { calcMonthlyPayment } from '../../src/shared/utils/credit';
import { formatPrice } from '../../src/shared/utils/formatters';

const TERMS = [12, 24, 36, 48, 60, 72, 84];

export default function CreditScreen() {
  const { colors, t } = useApp();
  const router = useRouter();
  const [carPrice, setCarPrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [term, setTerm] = useState(60);

  const carPriceNum = parseInt(carPrice.replace(/\s/g, ''), 10) || 0;
  const downPaymentNum = parseInt(downPayment.replace(/\s/g, ''), 10) || 0;
  const monthly = calcMonthlyPayment(carPriceNum, downPaymentNum, term);

  const formatInput = (raw: string) =>
    raw.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  const showCars = () => {
    router.push({
      pathname: '/catalog',
      params: { maxMonthly: String(monthly || ''), downPayment: String(downPaymentNum || '') },
    } as any);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView
        style={{ backgroundColor: colors.bg }}
        contentContainerStyle={[styles.container, { paddingBottom: 40 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Loan amount */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t.loanAmount}</Text>

          <View style={[styles.fieldGroup, { borderColor: colors.border }]}>
            <View style={[styles.field, { borderBottomColor: colors.border }]}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t.carCost}</Text>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder={t.enterAmount}
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={carPrice}
                onChangeText={(v) => setCarPrice(formatInput(v))}
              />
            </View>
            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t.downPayment}</Text>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder={t.enterAmount}
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={downPayment}
                onChangeText={(v) => setDownPayment(formatInput(v))}
              />
            </View>
          </View>
        </View>

        {/* Loan term */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 12 }]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t.loanTerm}</Text>
          <View style={styles.termsRow}>
            {TERMS.map((m) => (
              <Pressable
                key={m}
                onPress={() => setTerm(m)}
                style={[styles.termChip, { borderColor: m === term ? '#1E4AE9' : colors.border, backgroundColor: m === term ? '#1E4AE9' : colors.surface }]}
              >
                <Text style={[styles.termText, { color: m === term ? '#fff' : colors.textSecondary }]}>
                  {m}{t.months}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Result */}
        <View style={[styles.resultCard, { backgroundColor: '#1E4AE9' }]}>
          <Text style={styles.resultLabel}>{t.monthlyPayment}*</Text>
          <Text style={styles.resultAmount}>
            {monthly > 0 ? formatPrice(monthly) : '—'}{monthly > 0 ? '/мес' : ''}
          </Text>
          {monthly > 0 && carPriceNum > 0 && (
            <Text style={styles.resultNote}>
              Кредит: {formatPrice(carPriceNum - downPaymentNum)} · {term} мес · 14% год.
            </Text>
          )}
        </View>

        <Pressable
          onPress={showCars}
          style={({ pressed }) => [styles.showBtn, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={styles.showBtnText}>{t.showCars}</Text>
        </Pressable>

        <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
          * Расчёт носит ориентировочный характер. Итоговые условия уточняйте у менеджера.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 14, textTransform: 'uppercase' },
  fieldGroup: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  field: { padding: 14, borderBottomWidth: 1 },
  fieldLabel: { fontSize: 12, marginBottom: 6 },
  input: { fontSize: 18, fontWeight: '700', padding: 0 },
  termsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  termChip: { borderRadius: 10, borderWidth: 1.5, paddingHorizontal: 12, paddingVertical: 8 },
  termText: { fontSize: 13, fontWeight: '700' },
  resultCard: { borderRadius: 16, padding: 22, marginTop: 12, alignItems: 'center' },
  resultLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 6 },
  resultAmount: { color: '#fff', fontSize: 32, fontWeight: '900' },
  resultNote: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 6, textAlign: 'center' },
  showBtn: {
    marginTop: 16, backgroundColor: '#1E4AE9',
    borderRadius: 14, paddingVertical: 16,
    alignItems: 'center',
  },
  showBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  disclaimer: { fontSize: 11, marginTop: 16, textAlign: 'center', lineHeight: 16 },
});
