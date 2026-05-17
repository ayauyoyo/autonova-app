export interface Listing {
  id: string;
  source: 'kolesa' | 'internal';
  sourceUrl?: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  priceKzt: number;
  city: string;
  region: string;
  generation?: string;
  bodyType: string;
  engineLiters?: number;
  fuelType: string;
  mileageKm: number;
  gearbox: string;
  drive: string;
  steeringWheel: 'left' | 'right';
  color: string;
  customsClearedKz: boolean;
  condition: 'new' | 'used';
  monthlyPaymentKzt?: number;
  downPaymentKzt?: number;
  options: string[];
  photos?: string[];
  photoColor: string;
  isHit: boolean;
  isActive: boolean;
  sellerComment?: string;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  bgColor: string;
  textColor: string;
  imageUrl?: string;
  accentColor?: string;
}

export interface AppNotification {
  id: string;
  type: 'system' | 'marketing' | 'search_match' | 'application';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface SavedSearch {
  id: string;
  title: string;
  filtersJson: string;
  createdAt: string;
}

export interface Application {
  id: string;
  type: 'callback' | 'tradein' | 'credit' | 'autoservice' | 'exchange';
  listingId?: string;
  listingTitle?: string;
  name?: string;
  phone: string;
  city?: string;
  date?: string;
  extra?: string;
  read: boolean;
  createdAt: string;
}
