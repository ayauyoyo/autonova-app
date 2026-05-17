// Скрипт для загрузки/обновления всех объявлений в Firestore
// Запуск: node apps/mobile/scripts/upload-listings.mjs

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

function toDoc(listing) {
  return {
    fields: {
      source:            str(listing.source),
      sourceUrl:         listing.sourceUrl ? str(listing.sourceUrl) : nul(),
      title:             str(listing.title),
      brand:             str(listing.brand),
      model:             str(listing.model),
      year:              int(listing.year),
      priceKzt:          int(listing.priceKzt),
      city:              str(listing.city),
      region:            str(listing.region),
      generation:        listing.generation ? str(listing.generation) : nul(),
      bodyType:          str(listing.bodyType),
      engineLiters:      listing.engineLiters != null ? dbl(listing.engineLiters) : nul(),
      fuelType:          str(listing.fuelType),
      mileageKm:         int(listing.mileageKm),
      gearbox:           str(listing.gearbox),
      drive:             str(listing.drive),
      steeringWheel:     str(listing.steeringWheel),
      color:             str(listing.color),
      customsClearedKz:  bool(listing.customsClearedKz),
      condition:         str(listing.condition),
      monthlyPaymentKzt: listing.monthlyPaymentKzt != null ? int(listing.monthlyPaymentKzt) : nul(),
      downPaymentKzt:    listing.downPaymentKzt != null ? int(listing.downPaymentKzt) : nul(),
      options:           arr(listing.options ?? []),
      photos:            arr(listing.photos ?? []),
      photoColor:        str(listing.photoColor),
      isHit:             bool(listing.isHit),
      isActive:          bool(listing.isActive),
      sellerComment:     listing.sellerComment ? str(listing.sellerComment) : nul(),
      createdAt:         str(listing.createdAt),
    },
  };
}

const LISTINGS = [
  // ── Старые объявления (kolesa-0 … kolesa-9) с обновлёнными названиями ──
  {
    id: 'kolesa-0', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/215677355',
    title: 'Mercedes-Benz E 240 2005', brand: 'Mercedes-Benz', model: 'E 240', year: 2005,
    priceKzt: 5600000, city: 'Астана', region: 'Акмолинская область',
    generation: '2002–2006, W211/S211', bodyType: 'Седан', engineLiters: 2.6,
    fuelType: 'бензин', mileageKm: 300000, gearbox: 'Автомат', drive: 'Задний привод',
    steeringWheel: 'left', color: 'белый металлик', customsClearedKz: true, condition: 'used',
    monthlyPaymentKzt: 151715, downPaymentKzt: 1400000,
    options: ['Литые диски','Тонировка','Люк','Линзованная оптика','Дневные ходовые огни','Противотуманки','Кожа','CD','Сигнализация','Автозапуск','Полный электропакет','Климат-контроль','Круиз-контроль','Мультируль','Подогрев сидений','Память сидений','Память руля','Парктроники','Датчик дождя'],
    photos: kp('7ed55067-f1a3-4cc0-bb49-a16e099af2c3', '7e', 8),
    photoColor: '#1A1A1A', isHit: true, isActive: true,
    sellerComment: 'Автомобиль в отличном состоянии. Полное обслуживание у официального дилера. Все опции работают. Торг при осмотре.',
    createdAt: new Date(Date.now() - 1000*60*60*24*3).toISOString(),
  },
  {
    id: 'kolesa-1', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/216622294',
    title: 'Kia Rio 2022', brand: 'Kia', model: 'Rio', year: 2022,
    priceKzt: 7100000, city: 'Астана', region: 'Акмолинская область',
    generation: '2020–н.в., 4 поколение рестайлинг', bodyType: 'Седан', engineLiters: 1.6,
    fuelType: 'бензин', mileageKm: 86000, gearbox: 'Автомат', drive: 'Передний привод',
    steeringWheel: 'left', color: 'белый металлик', customsClearedKz: true, condition: 'used',
    monthlyPaymentKzt: 192030, downPaymentKzt: 1775000,
    options: ['Литые диски','Хрустальная оптика','Противотуманки','Обогрев зеркал','Велюр','Аудиосистема','Круиз-контроль','Навигационная система','Мультируль','Подогрев руля','Подогрев сидений','Подогрев задних сидений','Парктроники','Камера заднего вида','Климат-контроль'],
    photos: kp('d1ca3f90-5bcf-4eac-ba27-a1826ff06e23', 'd1', 8),
    photoColor: '#05141F', isHit: true, isActive: true,
    sellerComment: 'Продаю в связи с покупкой нового автомобиля. Один владелец, не бит, не крашен. Все ТО пройдены у официального дилера.',
    createdAt: new Date(Date.now() - 1000*60*60*24*1).toISOString(),
  },
  {
    id: 'kolesa-2', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/216622734',
    title: 'Hyundai Accent 2011', brand: 'Hyundai', model: 'Accent', year: 2011,
    priceKzt: 3800000, city: 'Астана', region: 'Акмолинская область',
    generation: '2010–2017, 4 поколение (RB/RC)', bodyType: 'Седан', engineLiters: 1.4,
    fuelType: 'бензин', mileageKm: 230000, gearbox: 'Автомат', drive: 'Передний привод',
    steeringWheel: 'left', color: 'серый металлик', customsClearedKz: true, condition: 'used',
    monthlyPaymentKzt: 102800, downPaymentKzt: 950000,
    options: ['Литые диски','Хрустальная оптика','Велюр','Аудиосистема','Сигнализация','Автозапуск','Круиз-контроль','Подогрев руля','Подогрев сидений','Камера заднего вида','Кондиционер'],
    photos: kp('4ee2c4fb-f3ad-4024-a978-a18271e0f893', '4e', 6),
    photoColor: '#002C5F', isHit: false, isActive: true,
    sellerComment: 'Хороший вариант для города. Экономичный, надёжный автомобиль.',
    createdAt: new Date(Date.now() - 1000*60*60*24*2).toISOString(),
  },
  {
    id: 'kolesa-3', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/216623510',
    title: 'BMW 520 1991', brand: 'BMW', model: '520', year: 1991,
    priceKzt: 4000000, city: 'Астана', region: 'Акмолинская область',
    generation: '1988–1996, E34', bodyType: 'Седан', engineLiters: 2.0,
    fuelType: 'бензин', mileageKm: 268900, gearbox: 'Механика', drive: 'Задний привод',
    steeringWheel: 'left', color: 'чёрный металлик', customsClearedKz: true, condition: 'used',
    monthlyPaymentKzt: 108200, downPaymentKzt: 1000000,
    options: ['Литые диски','Люк','Кожа'],
    photos: kp('0f287766-ff3c-4b32-a91c-a1827545f172', '0f', 8),
    photoColor: '#0E1628', isHit: false, isActive: true,
    sellerComment: 'Классика BMW. Хорошее техническое состояние. Возможен торг.',
    createdAt: new Date(Date.now() - 1000*60*60*24*5).toISOString(),
  },
  {
    id: 'kolesa-4', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/216624500',
    title: 'Hyundai Accent 2021', brand: 'Hyundai', model: 'Accent', year: 2021,
    priceKzt: 8900000, city: 'Астана', region: 'Акмолинская область',
    generation: '2017–н.в., 6 поколение (HC)', bodyType: 'Седан', engineLiters: 1.6,
    fuelType: 'бензин', mileageKm: 45000, gearbox: 'Автомат', drive: 'Передний привод',
    steeringWheel: 'left', color: 'серебристый металлик', customsClearedKz: true, condition: 'used',
    monthlyPaymentKzt: 241000, downPaymentKzt: 2225000,
    options: ['Литые диски','Хрустальная оптика','Противотуманки','Обогрев зеркал','Велюр','Аудиосистема','Мультируль','Подогрев руля','Подогрев сидений','Парктроники','Камера заднего вида','Климат-контроль','Android Auto / CarPlay'],
    photos: kp('3c1ad3c5-6925-4635-9153-a1827cb03a63', '3c', 9),
    photoColor: '#002C5F', isHit: true, isActive: true,
    sellerComment: 'Один владелец. Все ТО у официального дилера. Не бит, не крашен. Полная комплектация.',
    createdAt: new Date(Date.now() - 1000*60*60*24*1).toISOString(),
  },
  {
    id: 'kolesa-5', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/216625508',
    title: 'Toyota Land Cruiser 2005', brand: 'Toyota', model: 'Land Cruiser', year: 2005,
    priceKzt: 7500000, city: 'Астана', region: 'Акмолинская область',
    generation: '1984–2007, J70', bodyType: 'Внедорожник', engineLiters: 4.2,
    fuelType: 'дизель', mileageKm: 443305, gearbox: 'Механика', drive: 'Полный привод',
    steeringWheel: 'left', color: 'бронза металлик', customsClearedKz: true, condition: 'used',
    monthlyPaymentKzt: 202900, downPaymentKzt: 1875000,
    options: ['Литые диски','Фаркоп','Хрустальная оптика','Кожа','Аудиосистема','Подогрев сидений','Камера заднего вида'],
    photos: kp('9509b01c-b4d4-4625-a976-a1827eb9ce5a', '95', 8),
    photoColor: '#EB0A1E', isHit: true, isActive: true,
    sellerComment: 'Легендарный внедорожник. Отличная проходимость. Состояние соответствует году.',
    createdAt: new Date(Date.now() - 1000*60*60*24*4).toISOString(),
  },
  {
    id: 'kolesa-6', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/216628365',
    title: 'Mitsubishi Pajero 2007', brand: 'Mitsubishi', model: 'Pajero', year: 2007,
    priceKzt: 7600000, city: 'Астана', region: 'Акмолинская область',
    generation: '2006–2011, 4 поколение', bodyType: 'Внедорожник', engineLiters: 3.0,
    fuelType: 'бензин', mileageKm: 335000, gearbox: 'Автомат', drive: 'Полный привод',
    steeringWheel: 'left', color: 'чёрный металлик', customsClearedKz: true, condition: 'used',
    monthlyPaymentKzt: 205600, downPaymentKzt: 1900000,
    options: ['Литые диски','Хрустальная оптика','Кожа','Дерево','Аудиосистема','Кондиционер','Сигнализация','Автозапуск','Круиз-контроль','Подогрев сидений','Память сидений','Камера заднего вида'],
    photos: kp('321e242e-03cb-4424-b3ef-a1828b494619', '32', 8),
    photoColor: '#C20021', isHit: false, isActive: true,
    sellerComment: 'Надёжный полноприводный внедорожник. Обслуживался регулярно.',
    createdAt: new Date(Date.now() - 1000*60*60*24*6).toISOString(),
  },
  {
    id: 'kolesa-7', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/216629188',
    title: 'Mercedes-Benz ML 350 2007', brand: 'Mercedes-Benz', model: 'ML 350', year: 2007,
    priceKzt: 5200000, city: 'Астана', region: 'Акмолинская область',
    generation: '2005–2008, W164', bodyType: 'Внедорожник', engineLiters: 3.5,
    fuelType: 'бензин', mileageKm: 457000, gearbox: 'Автомат', drive: 'Полный привод',
    steeringWheel: 'left', color: 'серебристый металлик', customsClearedKz: true, condition: 'used',
    monthlyPaymentKzt: 140700, downPaymentKzt: 1300000,
    options: ['Литые диски','Фаркоп','Комбинированный салон','Аудиосистема','Климат-контроль','Круиз-контроль','Мультируль','Камера заднего вида'],
    photos: kp('5a68a126-3806-4e03-b722-a1828eead621', '5a', 8),
    photoColor: '#1A1A1A', isHit: false, isActive: true,
    sellerComment: 'Представительский внедорожник. Полный привод. Все опции в рабочем состоянии.',
    createdAt: new Date(Date.now() - 1000*60*60*24*7).toISOString(),
  },
  {
    id: 'kolesa-8', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/216630442',
    title: 'Nissan Pathfinder 2015', brand: 'Nissan', model: 'Pathfinder', year: 2015,
    priceKzt: 10000000, city: 'Астана', region: 'Акмолинская область',
    generation: '2013–2017, R52', bodyType: 'Внедорожник', engineLiters: 3.5,
    fuelType: 'бензин', mileageKm: 200000, gearbox: 'Вариатор', drive: 'Полный привод',
    steeringWheel: 'left', color: 'чёрный металлик', customsClearedKz: true, condition: 'used',
    monthlyPaymentKzt: 270500, downPaymentKzt: 2500000,
    options: ['Литые диски','Люк','Панорамная крыша','Рейлинги','Хрустальная оптика','Противотуманки','Обогрев зеркал','Кожа','Аудиосистема','Климат-контроль','Сигнализация','Автозапуск','Бесключевой доступ','Полный электропакет','Круиз-контроль','Навигационная система','Мультируль','Подогрев сидений','Подогрев задних сидений','Вентиляция сидений','Память сидений','Парктроники','Камера заднего вида','Датчик давления в шинах'],
    photos: kp('ae6cbbd7-ce0e-4410-a65f-a182948a91ae', 'ae', 10),
    photoColor: '#C3002F', isHit: true, isActive: true,
    sellerComment: 'Топовая комплектация. Семейный автомобиль в отличном состоянии.',
    createdAt: new Date(Date.now() - 1000*60*60*24*2).toISOString(),
  },
  {
    id: 'kolesa-9', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/216631046',
    title: 'Nissan Teana 2011', brand: 'Nissan', model: 'Teana', year: 2011,
    priceKzt: 4500000, city: 'Астана', region: 'Акмолинская область',
    generation: '2008–2014, J32', bodyType: 'Седан', engineLiters: 2.5,
    fuelType: 'бензин', mileageKm: 235000, gearbox: 'Вариатор', drive: 'Передний привод',
    steeringWheel: 'right', color: 'серый металлик', customsClearedKz: true, condition: 'used',
    monthlyPaymentKzt: 121800, downPaymentKzt: 1125000,
    options: ['Литые диски','Линзованная оптика','Кожа','Дерево','Аудиосистема','Сигнализация','Полный электропакет','Круиз-контроль','Подогрев сидений','Память сидений','Климат-контроль'],
    photos: kp('4a9174bc-afcf-4dde-8d03-a1829754185c', '4a', 7),
    photoColor: '#C3002F', isHit: false, isActive: true,
    sellerComment: 'Японская сборка. Правый руль. Хорошее состояние для своего года.',
    createdAt: new Date(Date.now() - 1000*60*60*24*8).toISOString(),
  },

  // ── Новые объявления (kolesa-10 … kolesa-17) ──
  {
    id: 'kolesa-10', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/217260068',
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
    id: 'kolesa-11', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/219880154',
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
    id: 'kolesa-12', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/219880124',
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
    id: 'kolesa-13', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/219880029',
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
    id: 'kolesa-14', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/219879906',
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
    id: 'kolesa-15', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/219879991',
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
    id: 'kolesa-16', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/219880158',
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
    id: 'kolesa-17', source: 'kolesa', sourceUrl: 'https://kolesa.kz/a/show/219279437',
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

async function uploadListing(listing) {
  const url = `${BASE}/listings/${listing.id}?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toDoc(listing)),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

async function main() {
  console.log(`Загружаем ${LISTINGS.length} объявлений в Firestore...\n`);
  for (const listing of LISTINGS) {
    process.stdout.write(`  ${listing.id}  ${listing.title}... `);
    try {
      await uploadListing(listing);
      console.log('✓');
    } catch (e) {
      console.log('✗', e.message);
    }
  }
  console.log('\nГотово!');
}

main();