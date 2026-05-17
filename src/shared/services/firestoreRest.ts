import type { Listing } from '../data/types';

const PROJECT_ID = 'autonova-salon';
const API_KEY = 'AIzaSyBdCVlDKiWyuZyNFwTlWE6LiHAq2vA8WKU';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

type FsField =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { arrayValue: { values?: FsField[] } }
  | { nullValue: null };

function parse(v: FsField | undefined): any {
  if (!v) return undefined;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('arrayValue' in v) return (v.arrayValue.values ?? []).map(parse);
  return undefined;
}

function docToListing(doc: { name: string; fields: Record<string, FsField> }): Listing {
  const f = doc.fields;
  const g = (k: string) => parse(f[k]);
  return {
    id: doc.name.split('/').pop()!,
    source: (g('source') ?? 'internal') as 'kolesa' | 'internal',
    sourceUrl: g('sourceUrl'),
    title: g('title') ?? '',
    brand: g('brand') ?? '',
    model: g('model') ?? '',
    year: g('year') ?? 2000,
    priceKzt: g('priceKzt') ?? 0,
    city: g('city') ?? '',
    region: g('region') ?? '',
    generation: g('generation'),
    bodyType: g('bodyType') ?? '',
    engineLiters: g('engineLiters'),
    fuelType: g('fuelType') ?? '',
    mileageKm: g('mileageKm') ?? 0,
    gearbox: g('gearbox') ?? '',
    drive: g('drive') ?? '',
    steeringWheel: (g('steeringWheel') ?? 'left') as 'left' | 'right',
    color: g('color') ?? '',
    customsClearedKz: g('customsClearedKz') ?? false,
    condition: (g('condition') ?? 'used') as 'new' | 'used',
    monthlyPaymentKzt: g('monthlyPaymentKzt'),
    downPaymentKzt: g('downPaymentKzt'),
    options: g('options') ?? [],
    photos: g('photos') ?? [],
    photoColor: g('photoColor') ?? '#1E4AE9',
    isHit: g('isHit') ?? false,
    isActive: g('isActive') ?? true,
    sellerComment: g('sellerComment'),
    createdAt: g('createdAt') ?? new Date().toISOString(),
  };
}

export async function fetchFirestoreListings(): Promise<Listing[]> {
  const res = await fetch(`${BASE}/listings?key=${API_KEY}&pageSize=100`);
  if (!res.ok) throw new Error(`Firestore ${res.status}`);
  const data: { documents?: any[] } = await res.json();
  if (!data.documents?.length) return [];
  return data.documents.map(docToListing);
}
