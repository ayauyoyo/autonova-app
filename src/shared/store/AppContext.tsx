import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../theme/colors';
import { TRANSLATIONS, type Lang, type Translation } from '../i18n/translations';
import { SEED_LISTINGS, DEFAULT_NOTIFICATIONS, BANNERS as DEFAULT_BANNERS } from '../data/mockData';
import type { AppNotification, Application, Banner, Listing, SavedSearch } from '../data/types';
import { fetchFirestoreListings } from '../services/firestoreRest';
import { sendTelegramNotification } from '../utils/telegram';

type ThemeMode = 'light' | 'dark';

interface AppContextValue {
  loaded: boolean;
  lang: Lang;
  langSelected: boolean;
  setLang: (lang: Lang) => Promise<void>;
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof COLORS.light | typeof COLORS.dark;
  t: Translation;
  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id' | 'createdAt'>) => void;
  updateListing: (id: string, patch: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  getListingById: (id: string) => Listing | undefined;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
  savedSearches: SavedSearch[];
  addSavedSearch: (title: string, filtersJson: string) => void;
  clearSavedSearches: () => void;
  notifications: AppNotification[];
  markAllRead: () => void;
  unreadCount: number;
  recentlyViewed: string[];
  addRecentlyViewed: (id: string) => void;
  banners: Banner[];
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateBanner: (id: string, patch: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  isAdmin: boolean;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
  requestCallback: (listingId: string, phone: string) => void;
  applications: Application[];
  addApplication: (data: Omit<Application, 'id' | 'createdAt' | 'read'>) => void;
  markApplicationRead: (id: string) => void;
  unreadApplications: number;
}

const AppContext = createContext<AppContextValue>(null!);

function uid(): string {
  return 'local-' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

const ADMIN_EMAIL = 'admin@autonova.kz';
const ADMIN_PASSWORD = 'NovaCar2024!';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [lang, setLangState] = useState<Lang>('ru');
  const [langSelected, setLangSelected] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS);
  const [isAdmin, setIsAdmin] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [l, t, f, ss, notifs, ls, rv, bn, apps, localRaw] = await Promise.all([
          AsyncStorage.getItem('lang'),
          AsyncStorage.getItem('theme'),
          AsyncStorage.getItem('favorites'),
          AsyncStorage.getItem('savedSearches'),
          AsyncStorage.getItem('notifications'),
          AsyncStorage.getItem('listings'),
          AsyncStorage.getItem('recentlyViewed'),
          AsyncStorage.getItem('banners'),
          AsyncStorage.getItem('applications'),
          AsyncStorage.getItem('listingsLocal'),
        ]);

        if (l === 'ru' || l === 'kk') { setLangState(l); setLangSelected(true); }
        if (t === 'light' || t === 'dark') setTheme(t);
        if (f) setFavorites(JSON.parse(f));
        if (ss) setSavedSearches(JSON.parse(ss));
        if (notifs) {
          setNotifications(JSON.parse(notifs));
        } else {
          setNotifications(DEFAULT_NOTIFICATIONS);
          await AsyncStorage.setItem('notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
        }
        if (rv) setRecentlyViewed(JSON.parse(rv));
        if (bn) setBanners(JSON.parse(bn));
        if (apps) setApplications(JSON.parse(apps));

        // Admin-added listings stored locally
        const localAdditions: Listing[] = localRaw ? JSON.parse(localRaw) : [];

        // Try Firestore via REST API (works in Expo Go — no native SDK)
        let fsListings: Listing[] = [];
        try {
          fsListings = await fetchFirestoreListings();
        } catch {}

        if (fsListings.length > 0) {
          // Firestore data available — merge with local admin additions
          const fsIds = new Set(fsListings.map((l) => l.id));
          const merged = [...fsListings, ...localAdditions.filter((l) => !fsIds.has(l.id))];
          setListings(merged);
          AsyncStorage.setItem('listings', JSON.stringify(fsListings)); // offline cache
        } else if (ls) {
          // Offline: use cached Firestore data + local additions
          const cached: Listing[] = JSON.parse(ls);
          const cachedIds = new Set(cached.map((l) => l.id));
          setListings([...cached, ...localAdditions.filter((l) => !cachedIds.has(l.id))]);
        } else {
          // First launch, no network: fall back to built-in seed data
          setListings([...SEED_LISTINGS, ...localAdditions]);
          AsyncStorage.setItem('listings', JSON.stringify(SEED_LISTINGS));
        }
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const setLang = useCallback(async (l: Lang) => {
    setLangState(l);
    setLangSelected(true);
    await AsyncStorage.setItem('lang', l);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem('theme', next);
      return next;
    });
  }, []);

  const saveLocalListings = (all: Listing[]) => {
    const local = all.filter((l) => l.id.startsWith('local-'));
    AsyncStorage.setItem('listingsLocal', JSON.stringify(local));
  };

  const addListing = useCallback((data: Omit<Listing, 'id' | 'createdAt'>) => {
    const newListing: Listing = { ...data, id: uid(), createdAt: new Date().toISOString() };
    setListings((prev) => {
      const next = [newListing, ...prev];
      saveLocalListings(next);
      return next;
    });
  }, []);

  const updateListing = useCallback((id: string, patch: Partial<Listing>) => {
    setListings((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, ...patch } : l));
      saveLocalListings(next);
      return next;
    });
  }, []);

  const deleteListing = useCallback((id: string) => {
    setListings((prev) => {
      const next = prev.filter((l) => l.id !== id);
      saveLocalListings(next);
      return next;
    });
    setFavorites((prev) => {
      const next = prev.filter((fid) => fid !== id);
      AsyncStorage.setItem('favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  const getListingById = useCallback(
    (id: string) => listings.find((l) => l.id === id),
    [listings],
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      AsyncStorage.setItem('favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    AsyncStorage.setItem('favorites', JSON.stringify([]));
  }, []);

  const addSavedSearch = useCallback((title: string, filtersJson: string) => {
    const item: SavedSearch = { id: uid(), title, filtersJson, createdAt: new Date().toISOString() };
    setSavedSearches((prev) => {
      const next = [item, ...prev.slice(0, 19)];
      AsyncStorage.setItem('savedSearches', JSON.stringify(next));
      return next;
    });
  }, []);

  const clearSavedSearches = useCallback(() => {
    setSavedSearches([]);
    AsyncStorage.setItem('savedSearches', JSON.stringify([]));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      AsyncStorage.setItem('notifications', JSON.stringify(next));
      return next;
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addRecentlyViewed = useCallback((id: string) => {
    setRecentlyViewed((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 20);
      AsyncStorage.setItem('recentlyViewed', JSON.stringify(next));
      return next;
    });
  }, []);

  const addBanner = useCallback((data: Omit<Banner, 'id'>) => {
    const banner: Banner = { ...data, id: uid() };
    setBanners((prev) => {
      const next = [...prev, banner];
      AsyncStorage.setItem('banners', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateBanner = useCallback((id: string, patch: Partial<Banner>) => {
    setBanners((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, ...patch } : b));
      AsyncStorage.setItem('banners', JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteBanner = useCallback((id: string) => {
    setBanners((prev) => {
      const next = prev.filter((b) => b.id !== id);
      AsyncStorage.setItem('banners', JSON.stringify(next));
      return next;
    });
  }, []);

  const loginAdmin = useCallback((email: string, password: string): boolean => {
    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logoutAdmin = useCallback(() => setIsAdmin(false), []);

  const addApplication = useCallback((data: Omit<Application, 'id' | 'createdAt' | 'read'>) => {
    const app: Application = { ...data, id: uid(), createdAt: new Date().toISOString(), read: false };
    setApplications((prev) => {
      const next = [app, ...prev];
      AsyncStorage.setItem('applications', JSON.stringify(next));
      return next;
    });
  }, []);

  const markApplicationRead = useCallback((id: string) => {
    setApplications((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, read: true } : a));
      AsyncStorage.setItem('applications', JSON.stringify(next));
      return next;
    });
  }, []);

  const unreadApplications = applications.filter((a) => !a.read).length;

  const requestCallback = useCallback((listingId: string, phone: string) => {
    const listing = listings.find((l) => l.id === listingId);
    addApplication({
      type: 'callback',
      listingId,
      listingTitle: listing?.title,
      phone,
    });
    sendTelegramNotification(
      `📞 <b>Заявка на звонок</b>\n\n` +
      `📱 Телефон: ${phone}\n` +
      `🚗 Авто: ${listing ? listing.title : listingId}\n` +
      `🕐 ${new Date().toLocaleString('ru-KZ')}`
    );
  }, [listings, addApplication]);

  return (
    <AppContext.Provider
      value={{
        loaded,
        lang,
        langSelected,
        setLang,
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        colors: COLORS[theme],
        t: TRANSLATIONS[lang],
        listings,
        addListing,
        updateListing,
        deleteListing,
        getListingById,
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        savedSearches,
        addSavedSearch,
        clearSavedSearches,
        notifications,
        markAllRead,
        unreadCount,
        recentlyViewed,
        addRecentlyViewed,
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        requestCallback,
        applications,
        addApplication,
        markApplicationRead,
        unreadApplications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);