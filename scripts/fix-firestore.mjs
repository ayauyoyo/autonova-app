const PROJECT_ID = 'autonova-salon';
const API_KEY = 'AIzaSyBdCVlDKiWyuZyNFwTlWE6LiHAq2vA8WKU';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function kp(uuid, prefix, count) {
  return Array.from({ length: count }, (_, i) =>
    `https://kolesa-photos.kcdn.online/webp/${prefix}/${uuid}/${i + 1}-750x470.webp`
  );
}
function str(v) { return { stringValue: String(v) }; }
function int(v) { return { integerValue: String(v) }; }
function dbl(v) { return { doubleValue: v }; }
function bool(v) { return { booleanValue: v }; }
function arr(items) { return { arrayValue: { values: items.map(str) } }; }
function nul() { return { nullValue: null }; }

function toDoc(l) {
  return { fields: {
    source: str(l.source), sourceUrl: l.sourceUrl ? str(l.sourceUrl) : nul(),
    title: str(l.title), brand: str(l.brand), model: str(l.model), year: int(l.year),
    priceKzt: int(l.priceKzt), city: str(l.city), region: str(l.region),
    generation: l.generation ? str(l.generation) : nul(), bodyType: str(l.bodyType),
    engineLiters: l.engineLiters != null ? dbl(l.engineLiters) : nul(),
    fuelType: str(l.fuelType), mileageKm: int(l.mileageKm), gearbox: str(l.gearbox),
    drive: str(l.drive), steeringWheel: str(l.steeringWheel), color: str(l.color),
    customsClearedKz: bool(l.customsClearedKz), condition: str(l.condition),
    monthlyPaymentKzt: l.monthlyPaymentKzt != null ? int(l.monthlyPaymentKzt) : nul(),
    downPaymentKzt: l.downPaymentKzt != null ? int(l.downPaymentKzt) : nul(),
    options: arr(l.options ?? []), photos: arr(l.photos ?? []),
    photoColor: str(l.photoColor), isHit: bool(l.isHit), isActive: bool(l.isActive),
    sellerComment: l.sellerComment ? str(l.sellerComment) : nul(), createdAt: str(l.createdAt),
  }};
}

// Удаляем все kolesa-0 … kolesa-17
const TO_DELETE = Array.from({length: 18}, (_, i) => `kolesa-${i}`);

// 8 новых машин с нормальными ID
const NEW_LISTINGS = [
  {
    id: 'mazda-6-2002', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/217260068',
    title: 'Mazda 6 2002', brand: 'Mazda', model: '6', year: 2002,
    priceKzt: 2300000, city: 'Петропавловск', region: 'Северо-Казахстанская область',
    generation: '2002–2005, GG/GY', bodyType: 'Седан', engineLiters: 2.0,
    fuelType: 'бензин', mileageKm: 245000, gearbox: 'Автомат', drive: 'Передний привод',
    steeringWheel: 'left', color: 'синий металлик', customsClearedKz: true, condition: 'used',
    monthlyPaymentKzt: 70620, downPaymentKzt: 345000,
    options: ['Литые диски','Тонировка','Спойлер','Ветровики','Линзованная оптика','Велюр','ГУР','ABS','SRS','Сигнализация','Автозапуск','Полный электропакет','Климат-контроль','Мультируль','Подогрев сидений'],
    photos: kp('e9571b63-9ba0-4c45-97f0-a190079aef76', 'e9', 9),
    photoColor: '#910002', isHit: false, isActive: true,
    sellerComment: 'Ухоженный автомобиль. Всё работает. Налог уплачен, техосмотр пройден. Торг уместен.',
    createdAt: new Date(Date.now() - 1000*60*60*24*4).toISOString(),
  },
  {
    id: 'chery-tiggo2pro-2024', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/219880154',
    title: 'Chery Tiggo 2 Pro 2024', brand: 'Chery', model: 'Tiggo 2 Pro', year: 2024,
    priceKzt: 5600000, city: 'Алматы', region: 'Алматинская область',
    generation: '2023–н.в., 2 поколение', bodyType: 'Кроссовер', engineLiters: 1.5,
    fuelType: 'бензин', mileageKm: 12000, gearbox: 'Вариатор', drive: 'Передний привод',
    steeringWheel: 'left', color: 'белый перламутр', customsClearedKz: true, condition: 'used',
    monthlyPaymentKzt: 97600, downPaymentKzt: 1400000,
    options: ['Литые диски','Тонировка','Хрустальная оптика','Дневные ходовые огни','Противотуманки','Обогрев зеркал','Подогрев лобового стекла','Велюр','Аудиосистема','Bluetooth','USB','Android Auto / CarPlay','Климат-контроль','ABS','Круиз-контроль','Автохолд','Бесключевой доступ','Подогрев руля','Подогрев сидений','Камера заднего вида','Парктроники','Датчик давления в шинах'],
    photos: kp('1358249c-c67d-414c-876d-a1c168cf9210', '13', 11),
    photoColor: '#BB0A0A', isHit: true, isActive: true,
    sellerComment: 'Автомобиль в идеальном состоянии. Один владелец. Полная комплектация. Машина на гарантии.',
    createdAt: new Date(Date.now() - 1000*60*60*24*1).toISOString(),
  },
  {
    id: 'toyota-camry-2004', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/219880124',
    title: 'Toyota Camry 2004', brand: 'Toyota', model: 'Camry', year: 2004,
    priceKzt: 5900000, city: 'Туркестан', region: 'Туркестанская область',
    generation: '2004–2006, XV30 рестайлинг', bodyType: 'Седан', engineLiters: 2.4,
    fuelType: 'бензин', mileageKm: 230000, gearbox: 'Автомат', drive: 'Передний привод',
    steeringWheel: 'left', color: 'зелёный металлик', customsClearedKz: true, condition: 'used',
    monthlyPaymentKzt: 181154, downPaymentKzt: 885000,
    options: ['Литые диски','Тонировка','Ксенон','Кожа','Аудиосистема','CD','Климат-контроль','ABS','Полный электропакет','Круиз-контроль','Мультируль','Подогрев сидений','Память сидений'],
    photos: kp('ce4b2a94-4176-4219-9c06-a1c168af61c0', 'ce', 7),
    photoColor: '#EB0A1E', isHit: false, isActive: true,
    sellerComment: 'Легендарная Camry в хорошем состоянии. Растаможена. Все документы в порядке.',
    createdAt: new Date(Date.now() - 1000*60*60*24*5).toISOString(),
  },
  {
    id: 'lexus-lx570-2013', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/219880029',
    title: 'Lexus LX 570 2013', brand: 'Lexus', model: 'LX 570', year: 2013,
    priceKzt: 28000000, city: 'Жетысай', region: 'Туркестанская область',
    generation: '2012–2015, 3 поколение рестайлинг (J2)', bodyType: 'Внедорожник', engineLiters: 5.7,
    fuelType: 'бензин', mileageKm: 240000, gearbox: 'Автомат', drive: 'Полный привод',
    steeringWheel: 'left', color: 'белый металлик', customsClearedKz: true, condition: 'used',
    monthlyPaymentKzt: 487000, downPaymentKzt: 7000000,
    options: ['Литые диски','Тонировка','Люк','Ветровики','Багажник','Ксенон','Линзованная оптика','Дневные ходовые огни','Противотуманки','Омыватель фар','Корректор фар','Кожа','Дерево','Аудиосистема','Bluetooth','USB','ГУР','ABS','SRS','Зимний режим','Спортивный режим','Сигнализация','Бесключевой доступ','Полный электропакет','Центрозамок','Круиз-контроль','Бортовой компьютер','Мультируль','Подогрев руля','Подогрев сидений','Подогрев задних сидений','Вентиляция сидений','Память сидений','Память руля','Парктроники','Камера заднего вида','Датчик света','Датчик дождя','Датчик давления в шинах','Пневмоподвеска','Изменяемый клиренс','Климат-контроль'],
    photos: kp('1148f33f-cd6f-48a2-bed2-a1c1684a72e1', '11', 30),
    photoColor: '#1A1A1A', isHit: true, isActive: true,
    sellerComment: 'Легендарный Lexus LX 570. Вложений не требует. Полная комплектация. Пневмоподвеска в рабочем состоянии.',
    createdAt: new Date(Date.now() - 1000*60*60*24*2).toISOString(),
  },
  {
    id: 'toyota-tacoma-2022', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/219879906',
    title: 'Toyota Tacoma 2022', brand: 'Toyota', model: 'Tacoma', year: 2022,
    priceKzt: 27000000, city: 'Актау', region: 'Мангистауская область',
    generation: '2015–2023, 3 поколение', bodyType: 'Пикап', engineLiters: 3.5,
    fuelType: 'бензин', mileageKm: 62000, gearbox: 'Автомат', drive: 'Полный привод',
    steeringWheel: 'left', color: 'чёрный металлик', customsClearedKz: true, condition: 'used',
    monthlyPaymentKzt: 584907, downPaymentKzt: 9000000,
    options: ['Литые диски','Тонировка','Рейлинги','Ксенон','Противотуманки','Обогрев зеркал','Кожа','Аудиосистема','Bluetooth','USB','Android Auto / CarPlay','Климат-контроль','Круиз-контроль','Мультируль','Подогрев руля','Подогрев сидений','Камера заднего вида','Парктроники','Бесключевой доступ','Датчик давления в шинах'],
    photos: kp('de4a8e9e-2f18-401e-b5d3-a1c167de9014', 'de', 14),
    photoColor: '#EB0A1E', isHit: true, isActive: true,
    sellerComment: 'Надёжный американский пикап. Отличная проходимость. Идеален для казахстанских дорог.',
    createdAt: new Date(Date.now() - 1000*60*60*24*3).toISOString(),
  },
  {
    id: 'hyundai-sonata-2023', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/219879991',
    title: 'Hyundai Sonata 2023', brand: 'Hyundai', model: 'Sonata', year: 2023,
    priceKzt: 12900000, city: 'Шымкент', region: 'Туркестанская область',
    generation: '2019–н.в., DN8, 8 поколение', bodyType: 'Седан', engineLiters: 2.5,
    fuelType: 'бензин', mileageKm: 53000, gearbox: 'Автомат', drive: 'Передний привод',
    steeringWheel: 'left', color: 'серый металлик', customsClearedKz: true, condition: 'used',
    monthlyPaymentKzt: 377265, downPaymentKzt: 1290000,
    options: ['Литые диски','Тонировка','Багажник','Ксенон','Корректор фар','Обогрев зеркал','Кожа','Шторки','Аудиосистема','Bluetooth','USB','Климат-контроль','ГУР','ABS','Спортивный режим','Бесключевой доступ','Полный электропакет','Центрозамок','Круиз-контроль','Бортовой компьютер','Навигационная система','Мультируль','Подогрев руля','Подогрев сидений','Подогрев задних сидений','Вентиляция сидений','Память сидений','Парктроники','Камера заднего вида','Датчик света','Датчик дождя','Датчик давления в шинах'],
    photos: kp('96a8fff6-a72c-4ddd-9439-a1c1682c472e', '96', 7),
    photoColor: '#002C5F', isHit: false, isActive: true,
    sellerComment: 'Налог уплачен. Вложений не требует. Автомобиль в отличном состоянии.',
    createdAt: new Date(Date.now() - 1000*60*60*24*2).toISOString(),
  },
  {
    id: 'renault-sandero-2020', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/219880158',
    title: 'Renault Sandero Stepway 2020', brand: 'Renault', model: 'Sandero Stepway', year: 2020,
    priceKzt: 3600000, city: 'Алматы', region: 'Алматинская область',
    generation: '2018–н.в., 2 поколение рестайлинг (B8)', bodyType: 'Хэтчбек', engineLiters: 1.6,
    fuelType: 'бензин', mileageKm: 190000, gearbox: 'Механика', drive: 'Передний привод',
    steeringWheel: 'left', color: 'белый', customsClearedKz: true, condition: 'used',
    monthlyPaymentKzt: 99435, downPaymentKzt: 540000,
    options: ['Литые диски','Тонировка','Ветровики','Велюр','Аудиосистема','Bluetooth','USB','Кондиционер','ABS','Центрозамок','Полный электропакет','Мультируль','Подогрев сидений'],
    photos: kp('d0f93127-c76f-4b1d-a529-a1c168d4ce12', 'd0', 7),
    photoColor: '#CC0000', isHit: false, isActive: true,
    sellerComment: 'Экономичный и надёжный автомобиль. Идеален для города. Низкий расход топлива.',
    createdAt: new Date(Date.now() - 1000*60*60*24*6).toISOString(),
  },
  {
    id: 'chevrolet-cobalt-2022', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/219279437',
    title: 'Chevrolet Cobalt 2022', brand: 'Chevrolet', model: 'Cobalt', year: 2022,
    priceKzt: 4500000, city: 'Алматы', region: 'Алматинская область',
    generation: '2020–н.в., 2 поколение рестайлинг', bodyType: 'Седан', engineLiters: 1.5,
    fuelType: 'бензин', mileageKm: 97000, gearbox: 'Автомат', drive: 'Передний привод',
    steeringWheel: 'left', color: 'серый', customsClearedKz: true, condition: 'used',
    monthlyPaymentKzt: 131604, downPaymentKzt: 450000,
    options: ['Литые диски','Тонировка','Хрустальная оптика','Велюр','Аудиосистема','Bluetooth','USB','Кондиционер','ABS','Мультируль','Подогрев сидений','Камера заднего вида'],
    photos: kp('e429d82f-d1c6-480c-af4d-a1b4fe429f70', 'e4', 8),
    photoColor: '#CC0000', isHit: false, isActive: true,
    sellerComment: 'Популярный автомобиль в Казахстане. Хорошее состояние. Обслуживался регулярно.',
    createdAt: new Date(Date.now() - 1000*60*60*24*7).toISOString(),
  },
];

async function deleteDoc(id) {
  const res = await fetch(`${BASE}/listings/${id}?key=${API_KEY}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 404) throw new Error(`HTTP ${res.status}`);
}

async function uploadDoc(listing) {
  const res = await fetch(`${BASE}/listings/${listing.id}?key=${API_KEY}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toDoc(listing)),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
}

async function main() {
  console.log('Шаг 1: Удаляем kolesa-0 … kolesa-17...');
  for (const id of TO_DELETE) {
    process.stdout.write(`  Удаляю ${id}... `);
    try { await deleteDoc(id); console.log('✓'); }
    catch (e) { console.log('✗', e.message); }
  }

  console.log('\nШаг 2: Загружаем 8 новых машин с нормальными ID...');
  for (const l of NEW_LISTINGS) {
    process.stdout.write(`  ${l.id}  (${l.title})... `);
    try { await uploadDoc(l); console.log('✓'); }
    catch (e) { console.log('✗', e.message); }
  }

  console.log('\nГотово! Итого в Firestore: 10 старых + 8 новых = 18 машин.');
}

main();