import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../src/shared/store/AppContext';
import type { Listing } from '../src/shared/data/types';
import { formatPrice } from '../src/shared/utils/formatters';

type AdminTab = 'listings' | 'applications' | 'banners';

const APP_TYPE_LABELS: Record<string, string> = {
  callback: 'Обратный звонок',
  credit: 'Кредит',
  exchange: 'Обмен',
  tradein: 'Трейд-ин',
  autoservice: 'Автосервис',
};
const APP_TYPE_COLORS: Record<string, string> = {
  callback: '#1E4AE9',
  credit: '#F59E0B',
  exchange: '#8B5CF6',
  tradein: '#06B6D4',
  autoservice: '#EF4444',
};

function EditListingModal({ listing, onClose, onSave }: {
  listing: Listing;
  onClose: () => void;
  onSave: (patch: Partial<Listing>) => void;
}) {
  const [title, setTitle] = useState(listing.title);
  const [brand, setBrand] = useState(listing.brand);
  const [model, setModel] = useState(listing.model);
  const [year, setYear] = useState(String(listing.year));
  const [price, setPrice] = useState(String(listing.priceKzt));
  const [city, setCity] = useState(listing.city);
  const [bodyType, setBodyType] = useState(listing.bodyType);
  const [fuelType, setFuelType] = useState(listing.fuelType);
  const [mileage, setMileage] = useState(String(listing.mileageKm));
  const [gearbox, setGearbox] = useState(listing.gearbox);
  const [drive, setDrive] = useState(listing.drive);
  const [color, setColor] = useState(listing.color);
  const [engineLiters, setEngineLiters] = useState(String(listing.engineLiters ?? ''));
  const [condition, setCondition] = useState<'new' | 'used'>(listing.condition);
  const [sellerComment, setSellerComment] = useState(listing.sellerComment ?? '');
  const [photos, setPhotos] = useState<string[]>(listing.photos ?? []);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.85,
    });
    if (!result.canceled) {
      setPhotos((prev) => [...prev, ...result.assets.map((a: { uri: string }) => a.uri)]);
    }
  };

  const removePhoto = (uri: string) => setPhotos((prev) => prev.filter((p) => p !== uri));

  const handleSave = () => {
    onSave({
      title: title.trim(),
      brand: brand.trim(),
      model: model.trim(),
      year: parseInt(year) || listing.year,
      priceKzt: parseInt(price) || listing.priceKzt,
      city: city.trim(),
      bodyType: bodyType.trim(),
      fuelType: fuelType.trim(),
      mileageKm: parseInt(mileage) || listing.mileageKm,
      gearbox: gearbox.trim(),
      drive: drive.trim(),
      color: color.trim(),
      engineLiters: parseFloat(engineLiters) || listing.engineLiters,
      condition,
      sellerComment: sellerComment.trim(),
      photos,
    });
    onClose();
  };

  const Field = ({ label, value, onChangeText, keyboardType = 'default' }: {
    label: string; value: string; onChangeText: (v: string) => void; keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  }) => (
    <View style={editStyles.fieldWrap}>
      <Text style={editStyles.fieldLabel}>{label}</Text>
      <TextInput
        style={editStyles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor="#94A3B8"
      />
    </View>
  );

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff', flex: 1 }}>
        <View style={editStyles.header}>
          <Pressable onPress={onClose} style={editStyles.closeBtn}>
            <Ionicons name="close" size={22} color="#0F172A" />
          </Pressable>
          <Text style={editStyles.headerTitle}>Редактировать</Text>
          <Pressable onPress={handleSave} style={editStyles.saveBtn}>
            <Text style={editStyles.saveBtnText}>Сохранить</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={editStyles.content}>
          {/* Photos */}
          <Text style={editStyles.sectionTitle}>Фотографии</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={editStyles.photosRow}>
            {photos.map((uri) => (
              <View key={uri} style={editStyles.photoThumb}>
                <Image source={{ uri }} style={editStyles.thumbImg} resizeMode="cover" />
                <Pressable onPress={() => removePhoto(uri)} style={editStyles.photoDelete}>
                  <Ionicons name="close-circle" size={20} color="#EF4444" />
                </Pressable>
              </View>
            ))}
            <Pressable onPress={pickPhoto} style={editStyles.addPhotoBtn}>
              <Ionicons name="camera-outline" size={28} color="#1E4AE9" />
              <Text style={editStyles.addPhotoText}>Добавить</Text>
            </Pressable>
          </ScrollView>

          <Text style={editStyles.sectionTitle}>Основные данные</Text>
          <Field label="Название" value={title} onChangeText={setTitle} />
          <Field label="Марка" value={brand} onChangeText={setBrand} />
          <Field label="Модель" value={model} onChangeText={setModel} />
          <Field label="Год" value={year} onChangeText={setYear} keyboardType="numeric" />
          <Field label="Цена (₸)" value={price} onChangeText={setPrice} keyboardType="numeric" />
          <Field label="Город" value={city} onChangeText={setCity} />

          <Text style={editStyles.sectionTitle}>Характеристики</Text>
          <Field label="Тип кузова" value={bodyType} onChangeText={setBodyType} />
          <Field label="Тип топлива" value={fuelType} onChangeText={setFuelType} />
          <Field label="Пробег (км)" value={mileage} onChangeText={setMileage} keyboardType="numeric" />
          <Field label="Объём двигателя (л)" value={engineLiters} onChangeText={setEngineLiters} keyboardType="decimal-pad" />
          <Field label="КПП" value={gearbox} onChangeText={setGearbox} />
          <Field label="Привод" value={drive} onChangeText={setDrive} />
          <Field label="Цвет" value={color} onChangeText={setColor} />

          <Text style={editStyles.sectionTitle}>Состояние</Text>
          <View style={editStyles.conditionRow}>
            {(['new', 'used'] as const).map((c) => (
              <Pressable
                key={c}
                onPress={() => setCondition(c)}
                style={[editStyles.conditionChip, condition === c && editStyles.conditionChipActive]}
              >
                <Text style={[editStyles.conditionText, condition === c && editStyles.conditionTextActive]}>
                  {c === 'new' ? 'Новый' : 'С пробегом'}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={editStyles.sectionTitle}>Комментарий продавца</Text>
          <TextInput
            style={[editStyles.fieldInput, { height: 80, textAlignVertical: 'top' }]}
            value={sellerComment}
            onChangeText={setSellerComment}
            multiline
            placeholderTextColor="#94A3B8"
            placeholder="Описание, особенности..."
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default function AdminScreen() {
  const {
    colors, isAdmin, loginAdmin, logoutAdmin,
    listings, updateListing, deleteListing,
    banners, addBanner, deleteBanner,
    applications, markApplicationRead, unreadApplications,
  } = useApp();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [tab, setTab] = useState<AdminTab>('listings');

  // Editing listing
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  // Banner form
  const [addingBanner, setAddingBanner] = useState(false);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSub, setBannerSub] = useState('');
  const [bannerBg, setBannerBg] = useState('#1E4AE9');
  const [bannerImageUri, setBannerImageUri] = useState('');

  const handleLogin = () => {
    const ok = loginAdmin(email.trim(), password);
    if (!ok) Alert.alert('Ошибка', 'Неверный email или пароль.');
  };

  const confirmDelete = (id: string, title: string) => {
    Alert.alert('Удалить объявление?', title, [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: () => deleteListing(id) },
    ]);
  };

  const confirmDeleteBanner = (id: string) => {
    Alert.alert('Удалить баннер?', 'Это действие нельзя отменить.', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: () => deleteBanner(id) },
    ]);
  };

  const pickBannerPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (!result.canceled) setBannerImageUri(result.assets[0].uri);
  };

  const handleAddBanner = () => {
    if (!bannerTitle.trim()) return;
    addBanner({
      title: bannerTitle.trim(),
      subtitle: bannerSub.trim(),
      bgColor: bannerBg || '#1E4AE9',
      textColor: '#fff',
      imageUrl: bannerImageUri || undefined,
      accentColor: 'rgba(255,255,255,0.25)',
    });
    setBannerTitle('');
    setBannerSub('');
    setBannerBg('#1E4AE9');
    setBannerImageUri('');
    setAddingBanner(false);
  };

  if (!isAdmin) {
    return (
      <View style={[styles.root, { backgroundColor: colors.bg }]}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: colors.bg }}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/' as any)} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Вход для администратора</Text>
            <View style={{ width: 36 }} />
          </View>
        </SafeAreaView>

        <View style={styles.loginContainer}>
          <View style={styles.loginIcon}>
            <Ionicons name="shield-checkmark" size={44} color="#1E4AE9" />
          </View>
          <Text style={[styles.loginTitle, { color: colors.text }]}>Панель управления</Text>
          <Text style={[styles.loginSub, { color: colors.textSecondary }]}>Только для сотрудников AutoNova</Text>

          <TextInput
            style={[styles.loginInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.passRow}>
            <TextInput
              style={[styles.loginInput, { flex: 1, color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
              placeholder="Пароль"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <Pressable onPress={() => setShowPass((p) => !p)} style={[styles.eyeBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          <Pressable onPress={handleLogin} style={styles.loginBtn}>
            <Text style={styles.loginBtnText}>Войти</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.bg }}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/' as any)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Панель управления</Text>
          <Pressable onPress={() => { logoutAdmin(); router.canGoBack() ? router.back() : router.replace('/(tabs)/' as any); }} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          {[
            { key: 'listings' as AdminTab, icon: 'car-outline', label: `Объявления (${listings.length})` },
            { key: 'applications' as AdminTab, icon: 'document-text-outline', label: `Заявки${unreadApplications > 0 ? ` (${unreadApplications})` : ''}` },
            { key: 'banners' as AdminTab, icon: 'image-outline', label: `Баннеры (${banners.length})` },
          ].map((t) => (
            <Pressable key={t.key} onPress={() => setTab(t.key)} style={[styles.tabItem, tab === t.key && styles.tabItemActive]}>
              <Ionicons name={t.icon as any} size={15} color={tab === t.key ? '#1E4AE9' : colors.textSecondary} />
              <Text style={[styles.tabLabel, { color: tab === t.key ? '#1E4AE9' : colors.textSecondary }]} numberOfLines={1}>
                {t.label}
              </Text>
              {t.key === 'applications' && unreadApplications > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadApplications}</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        {/* ── LISTINGS TAB ── */}
        {tab === 'listings' && listings.map((l) => (
          <View key={l.id} style={[styles.listingRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Photo */}
            <View style={styles.listingPhoto}>
              {l.photos?.[0] ? (
                <Image source={{ uri: l.photos[0] }} style={styles.listingPhotoImg} resizeMode="cover" />
              ) : (
                <View style={[styles.listingPhotoPlaceholder, { backgroundColor: l.photoColor ?? '#1E4AE9' }]}>
                  <Ionicons name="car-sport" size={22} color="rgba(255,255,255,0.7)" />
                </View>
              )}
              <View style={[styles.statusDot, { backgroundColor: l.isActive ? '#22C55E' : '#EF4444' }]} />
            </View>

            <View style={styles.listingInfo}>
              <Text style={[styles.listingTitle, { color: colors.text }]} numberOfLines={1}>{l.title} {l.year}</Text>
              <Text style={[styles.listingPrice, { color: '#1E4AE9' }]}>{formatPrice(l.priceKzt)}</Text>
              <Text style={[styles.listingCity, { color: colors.textSecondary }]}>{l.city} · {l.mileageKm.toLocaleString()} км</Text>
            </View>

            <View style={styles.rowActions}>
              <Pressable
                onPress={() => updateListing(l.id, { isActive: !l.isActive })}
                style={[styles.actionBtn, { backgroundColor: l.isActive ? '#EF444420' : '#22C55E20' }]}
              >
                <Ionicons name={l.isActive ? 'eye-off-outline' : 'eye-outline'} size={16} color={l.isActive ? '#EF4444' : '#22C55E'} />
              </Pressable>
              <Pressable
                onPress={() => setEditingListing(l)}
                style={[styles.actionBtn, { backgroundColor: '#1E4AE920' }]}
              >
                <Ionicons name="create-outline" size={16} color="#1E4AE9" />
              </Pressable>
              <Pressable
                onPress={() => confirmDelete(l.id, `${l.title} ${l.year}`)}
                style={[styles.actionBtn, { backgroundColor: '#EF444420' }]}
              >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
              </Pressable>
            </View>
          </View>
        ))}

        {/* ── APPLICATIONS TAB ── */}
        {tab === 'applications' && (
          <>
            {applications.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={48} color="#CBD5E1" />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Заявок пока нет</Text>
              </View>
            )}
            {applications.map((app) => {
              const typeColor = APP_TYPE_COLORS[app.type] ?? '#1E4AE9';
              const typeLabel = APP_TYPE_LABELS[app.type] ?? app.type;
              const date = new Date(app.createdAt);
              const dateStr = `${date.getDate()}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
              return (
                <Pressable
                  key={app.id}
                  onPress={() => markApplicationRead(app.id)}
                  style={[styles.appRow, {
                    backgroundColor: colors.card,
                    borderColor: app.read ? colors.border : typeColor + '60',
                    borderWidth: app.read ? 1 : 1.5,
                  }]}
                >
                  {!app.read && <View style={[styles.unreadDot, { backgroundColor: typeColor }]} />}
                  <View style={[styles.appTypeBadge, { backgroundColor: typeColor + '20' }]}>
                    <Text style={[styles.appTypeText, { color: typeColor }]}>{typeLabel}</Text>
                  </View>
                  {app.listingTitle && (
                    <Text style={[styles.appListingTitle, { color: colors.textSecondary }]} numberOfLines={1}>
                      {app.listingTitle}
                    </Text>
                  )}
                  <View style={styles.appContactRow}>
                    {app.name && (
                      <View style={styles.appContact}>
                        <Ionicons name="person-outline" size={13} color={colors.textSecondary} />
                        <Text style={[styles.appContactText, { color: colors.text }]}>{app.name}</Text>
                      </View>
                    )}
                    <View style={styles.appContact}>
                      <Ionicons name="call-outline" size={13} color={colors.textSecondary} />
                      <Text style={[styles.appContactText, { color: colors.text }]}>{app.phone}</Text>
                    </View>
                    {app.city ? (
                      <View style={styles.appContact}>
                        <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
                        <Text style={[styles.appContactText, { color: colors.text }]}>{app.city}</Text>
                      </View>
                    ) : null}
                  </View>
                  {app.extra ? <Text style={[styles.appExtra, { color: colors.textSecondary }]}>{app.extra}</Text> : null}
                  {app.date ? (
                    <View style={styles.appContact}>
                      <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
                      <Text style={[styles.appContactText, { color: colors.text }]}>Дата: {app.date}</Text>
                    </View>
                  ) : null}
                  <Text style={[styles.appDate, { color: colors.textSecondary }]}>{dateStr}</Text>
                </Pressable>
              );
            })}
          </>
        )}

        {/* ── BANNERS TAB ── */}
        {tab === 'banners' && (
          <>
            {banners.map((b) => (
              <View key={b.id} style={[styles.bannerRow, { backgroundColor: b.bgColor }]}>
                {b.imageUrl ? (
                  <Image source={{ uri: b.imageUrl }} style={styles.bannerThumb} resizeMode="cover" />
                ) : null}
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bannerRowTitle, { color: b.textColor }]} numberOfLines={1}>{b.title}</Text>
                  <Text style={[styles.bannerRowSub, { color: b.textColor }]} numberOfLines={1}>{b.subtitle}</Text>
                </View>
                <Pressable onPress={() => confirmDeleteBanner(b.id)} style={styles.bannerDeleteBtn}>
                  <Ionicons name="trash-outline" size={16} color="#fff" />
                </Pressable>
              </View>
            ))}

            {addingBanner ? (
              <View style={[styles.addBannerForm, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.formTitle, { color: colors.text }]}>Новый баннер</Text>

                {/* Photo picker */}
                <Pressable onPress={pickBannerPhoto} style={styles.bannerPhotoPicker}>
                  {bannerImageUri ? (
                    <Image source={{ uri: bannerImageUri }} style={styles.bannerPhotoPreview} resizeMode="cover" />
                  ) : (
                    <>
                      <Ionicons name="image-outline" size={32} color="#1E4AE9" />
                      <Text style={styles.bannerPhotoText}>Выбрать фото из альбома</Text>
                    </>
                  )}
                </Pressable>
                {bannerImageUri ? (
                  <Pressable onPress={() => setBannerImageUri('')} style={styles.removePhotoLink}>
                    <Text style={styles.removePhotoText}>Удалить фото</Text>
                  </Pressable>
                ) : null}

                <TextInput
                  style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                  placeholder="Заголовок *"
                  placeholderTextColor={colors.textSecondary}
                  value={bannerTitle}
                  onChangeText={setBannerTitle}
                />
                <TextInput
                  style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                  placeholder="Подзаголовок"
                  placeholderTextColor={colors.textSecondary}
                  value={bannerSub}
                  onChangeText={setBannerSub}
                />

                {/* BG Color presets */}
                <Text style={[styles.colorLabel, { color: colors.textSecondary }]}>Цвет фона:</Text>
                <View style={styles.colorRow}>
                  {['#1E4AE9', '#0F1923', '#14532D', '#DC2626', '#F59E0B', '#8B5CF6'].map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => setBannerBg(c)}
                      style={[styles.colorSwatch, { backgroundColor: c, borderWidth: bannerBg === c ? 3 : 0, borderColor: '#fff' }]}
                    />
                  ))}
                </View>

                <View style={styles.formBtns}>
                  <Pressable onPress={() => setAddingBanner(false)} style={[styles.cancelFormBtn, { borderColor: colors.border }]}>
                    <Text style={[styles.cancelFormText, { color: colors.textSecondary }]}>Отмена</Text>
                  </Pressable>
                  <Pressable onPress={handleAddBanner} style={styles.saveFormBtn}>
                    <Text style={styles.saveFormText}>Сохранить</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable onPress={() => setAddingBanner(true)} style={[styles.addBtn, { borderColor: '#1E4AE9' }]}>
                <Ionicons name="add-circle-outline" size={20} color="#1E4AE9" />
                <Text style={styles.addBtnText}>Добавить баннер</Text>
              </Pressable>
            )}
          </>
        )}
      </ScrollView>

      {/* Edit listing modal */}
      {editingListing && (
        <EditListingModal
          listing={editingListing}
          onClose={() => setEditingListing(null)}
          onSave={(patch) => updateListing(editingListing.id, patch)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 15, fontWeight: '800' },
  logoutBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  tabsBar: { flexDirection: 'row', borderBottomWidth: 1 },
  tabItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 10, paddingHorizontal: 4 },
  tabItemActive: { borderBottomWidth: 2, borderBottomColor: '#1E4AE9' },
  tabLabel: { fontSize: 11, fontWeight: '600' },
  badge: { backgroundColor: '#EF4444', borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  content: { padding: 16, paddingBottom: 40 },

  // Listings
  listingRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, padding: 10, marginBottom: 10, gap: 10 },
  listingPhoto: { position: 'relative' },
  listingPhotoImg: { width: 72, height: 54, borderRadius: 10 },
  listingPhotoPlaceholder: { width: 72, height: 54, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statusDot: { position: 'absolute', bottom: 4, right: 4, width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: '#fff' },
  listingInfo: { flex: 1 },
  listingTitle: { fontSize: 13, fontWeight: '700' },
  listingPrice: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  listingCity: { fontSize: 11, marginTop: 2 },
  rowActions: { gap: 6 },
  actionBtn: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },

  // Applications
  appRow: { borderRadius: 14, padding: 14, marginBottom: 10, gap: 6 },
  unreadDot: { position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: 4 },
  appTypeBadge: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  appTypeText: { fontSize: 12, fontWeight: '700' },
  appListingTitle: { fontSize: 12, marginTop: 2 },
  appContactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 6 },
  appContact: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  appContactText: { fontSize: 13, fontWeight: '600' },
  appExtra: { fontSize: 12, marginTop: 4 },
  appDate: { fontSize: 11, marginTop: 6 },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 14 },

  // Banners
  bannerRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 14, marginBottom: 10, gap: 10, overflow: 'hidden' },
  bannerThumb: { width: 52, height: 40, borderRadius: 8 },
  bannerRowTitle: { fontSize: 13, fontWeight: '800' },
  bannerRowSub: { fontSize: 11, marginTop: 2, opacity: 0.85 },
  bannerDeleteBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center' },
  addBannerForm: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 12 },
  formTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  bannerPhotoPicker: { borderRadius: 12, borderWidth: 1.5, borderColor: '#1E4AE9', borderStyle: 'dashed', height: 100, alignItems: 'center', justifyContent: 'center', marginBottom: 10, overflow: 'hidden', gap: 6 },
  bannerPhotoPreview: { width: '100%', height: '100%' },
  bannerPhotoText: { color: '#1E4AE9', fontSize: 13, fontWeight: '600' },
  removePhotoLink: { alignSelf: 'center', marginBottom: 10 },
  removePhotoText: { color: '#EF4444', fontSize: 13 },
  colorLabel: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
  colorRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  colorSwatch: { width: 32, height: 32, borderRadius: 16 },
  formInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, marginBottom: 10 },
  formBtns: { flexDirection: 'row', gap: 10 },
  cancelFormBtn: { flex: 1, borderRadius: 10, borderWidth: 1, paddingVertical: 11, alignItems: 'center' },
  cancelFormText: { fontSize: 14, fontWeight: '600' },
  saveFormBtn: { flex: 1, borderRadius: 10, backgroundColor: '#1E4AE9', paddingVertical: 11, alignItems: 'center' },
  saveFormText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed', paddingVertical: 14 },
  addBtnText: { color: '#1E4AE9', fontSize: 14, fontWeight: '700' },

  // Login
  loginContainer: { flex: 1, padding: 32, alignItems: 'center', justifyContent: 'center' },
  loginIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(30,74,233,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  loginTitle: { fontSize: 22, fontWeight: '900', marginBottom: 6 },
  loginSub: { fontSize: 13, marginBottom: 28 },
  loginInput: { width: '100%', borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, marginBottom: 12 },
  passRow: { flexDirection: 'row', gap: 8, width: '100%', marginBottom: 20 },
  eyeBtn: { width: 50, borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  loginBtn: { width: '100%', backgroundColor: '#1E4AE9', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

const editStyles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  saveBtn: { backgroundColor: '#1E4AE9', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#64748B', letterSpacing: 0.6, marginTop: 20, marginBottom: 10 },
  photosRow: { gap: 10, paddingBottom: 4, marginBottom: 4 },
  photoThumb: { width: 90, height: 68, borderRadius: 10, overflow: 'visible', position: 'relative' },
  thumbImg: { width: 90, height: 68, borderRadius: 10 },
  photoDelete: { position: 'absolute', top: -8, right: -8 },
  addPhotoBtn: { width: 90, height: 68, borderRadius: 10, borderWidth: 1.5, borderColor: '#1E4AE9', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 4 },
  addPhotoText: { color: '#1E4AE9', fontSize: 11, fontWeight: '600' },
  fieldWrap: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: '#64748B', marginBottom: 5 },
  fieldInput: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, color: '#0F172A', backgroundColor: '#F8FAFC' },
  conditionRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  conditionChip: { flex: 1, borderRadius: 10, borderWidth: 1.5, borderColor: '#E2E8F0', paddingVertical: 11, alignItems: 'center' },
  conditionChipActive: { borderColor: '#1E4AE9', backgroundColor: '#1E4AE912' },
  conditionText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  conditionTextActive: { color: '#1E4AE9' },
});