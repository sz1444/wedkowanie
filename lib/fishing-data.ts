export const LISTA_RYB = [
  'Szczupak', 'Sandacz', 'Sum', 'Okoń',
  'Boleń', 'Węgorz', 'Miętus', 'Karp', 'Leszcz', 'Lin',
  'Płoć', 'Wzdręga', 'Karaś złocisty', 'Karaś srebrzysty', 'Amur biały',
  'Tołpyga', 'Krąp', 'Ukleja', 'Certa', 'Jaź', 'Kleń', 'Pstrąg potokowy',
  'Pstrąg tęczowy', 'Lipień', 'Głowacica', 'Brzana',
  'Świnka', 'Kiełb', 'Jazgarz', 'Słonecznica', 'Różanka',
];

export const OKRESY_OCHRONNE = [
  { nazwa: 'Szczupak', start: '01-01', koniec: '04-30' },
  { nazwa: 'Sandacz', start: '01-01', koniec: '05-31' },
  { nazwa: 'Boleń', start: '01-01', koniec: '04-30' },
  { nazwa: 'Sum', start: '01-01', koniec: '05-31' },
  { nazwa: 'Brzana', start: '01-01', koniec: '06-30' },
  { nazwa: 'Głowacica', start: '03-01', koniec: '05-31' },
  { nazwa: 'Pstrąg potokowy', start: '09-01', koniec: '12-31' },
  { nazwa: 'Lipień', start: '01-01', koniec: '04-30' },
  { nazwa: 'Certa', start: '01-01', koniec: '05-31' },
];

export const BAZA_WIEDZY = [
  { nazwa: 'Szczupak', idealTemp: [8, 18] as [number, number], activity: 95, porada: 'Agresywne brania na płytkiej wodzie. Użyj jerków lub dużych twisterów przy szuwarach.' },
  { nazwa: 'Sandacz', idealTemp: [12, 22] as [number, number], activity: 80, porada: 'Szukaj go na stokach i twardym dnie wieczorem — jaskrawe gumy w opadzie.' },
  { nazwa: 'Sum', idealTemp: [18, 26] as [number, number], activity: 70, porada: 'Aktywny przy dnie w głębokich rynnach. Gruba klokotka lub martwa rybka.' },
  { nazwa: 'Boleń', idealTemp: [10, 20] as [number, number], activity: 85, porada: 'Atakuje drobnicę przy powierzchni. Prowadź szybko błystkę talerzową!' },
  { nazwa: 'Karp', idealTemp: [14, 25] as [number, number], activity: 90, porada: 'Idealna pora na Metodę. Słodkie aromaty i kulki boilies królują.' },
  { nazwa: 'Okoń', idealTemp: [10, 24] as [number, number], activity: 88, porada: 'Bierze praktycznie wszędzie na małe gumy. Szukaj ławic przy dnie.' },
  { nazwa: 'Lin', idealTemp: [16, 24] as [number, number], activity: 82, porada: 'Szukaj w oczkach między grążelami. Bądź cicho — chleb lub robak przy dnie.' },
  { nazwa: 'Leszcz', idealTemp: [12, 22] as [number, number], activity: 75, porada: 'Spokojna woda, czerwony robak lub kukurydza to podstawa.' },
  { nazwa: 'Pstrąg potokowy', idealTemp: [6, 16] as [number, number], activity: 78, porada: 'Zimna, natleniona woda. Błystka obrotowa lub nimfa przy dnie.' },
  { nazwa: 'Pstrąg tęczowy', idealTemp: [8, 18] as [number, number], activity: 76, porada: 'Szybszy i silniejszy niż potokowy. Agresywnie bierze na błystki obrotowe.' },
  { nazwa: 'Głowacica', idealTemp: [8, 16] as [number, number], activity: 65, porada: 'Rzeki górskie i podgórskie. Duże woblery i pirki w wartkim nurcie.' },
  { nazwa: 'Lipień', idealTemp: [6, 14] as [number, number], activity: 72, porada: 'Suche muchy i nimfy w nurcie — klasyczny fly fishing. Akceptuje małe woblery.' },
  { nazwa: 'Węgorz', idealTemp: [16, 24] as [number, number], activity: 68, porada: 'Aktywny po zmroku przy dnie. Dżdżownica lub martwa rybka w rynnach i norach.' },
  { nazwa: 'Płoć', idealTemp: [10, 22] as [number, number], activity: 85, porada: 'Wszechobecna i chętna. Robak, kukurydza lub chleb w każdej wodzie.' },
  { nazwa: 'Kleń', idealTemp: [12, 20] as [number, number], activity: 80, porada: 'Wszechstronny. Bierze na muchy, błystki i małe woblery w nurcie.' },
  { nazwa: 'Jaź', idealTemp: [12, 20] as [number, number], activity: 78, porada: 'Aktywny o zmierzchu przy powierzchni. Błystki talerzowe i pływające muchy.' },
];

export type Medal = 'bronze' | 'silver' | 'gold';

export type FishKategoria = 'drapieznik' | 'biala' | 'karpiowate' | 'lososiowate' | 'rzeczne';

export type FishDexEntry = {
  nazwa: string;
  icon: string;
  color: string;
  opis: string;
  progSrebro: number;
  progZloto: number;
  xpPerKg: number;
  progSrebroCm: number;
  progZlotoCm: number;
  xpPerCm: number;
  rzadkosc: 'common' | 'uncommon' | 'rare' | 'legendary';
  kategoria: FishKategoria;
};

export const FISH_DEX: FishDexEntry[] = [
  { nazwa: 'Szczupak',         icon: 'szczupak.jpeg',         color: '#16a34a', opis: 'Drapieżnik numer jeden polskich wód. Kły i błyskawiczne ataki przy szuwarach.',                          progSrebro: 5,    progZloto: 10,   xpPerKg: 700,  progSrebroCm: 70,  progZlotoCm: 100, xpPerCm: 35,  rzadkosc: 'uncommon',  kategoria: 'drapieznik'  },
  { nazwa: 'Sandacz',          icon: 'sandacz.jpeg',          color: '#2563eb', opis: 'Nocny łowca preferujący twarde dno. Mięso najsmaczniejsze ze słodkowodnych.',                           progSrebro: 4,    progZloto: 8,    xpPerKg: 700,  progSrebroCm: 60,  progZlotoCm: 80,  xpPerCm: 40,  rzadkosc: 'rare',      kategoria: 'drapieznik'  },
  { nazwa: 'Sum',              icon: 'sum.jpeg',              color: '#7c3aed', opis: 'Największy drapieżnik słodkowodny Europy. Poluje nocą przy dnie głębokich rynien.',                      progSrebro: 20,   progZloto: 50,   xpPerKg: 200,  progSrebroCm: 130, progZlotoCm: 200, xpPerCm: 10,  rzadkosc: 'legendary', kategoria: 'drapieznik'  },
  { nazwa: 'Okoń',             icon: 'okon.jpg',              color: '#dc2626', opis: 'Zawzięty i barwny. Uderza stadnie, świetny na spinning lekki i małe gumy.',                             progSrebro: 0.5,  progZloto: 1,    xpPerKg: 500,  progSrebroCm: 25,  progZlotoCm: 35,  xpPerCm: 15,  rzadkosc: 'common',    kategoria: 'drapieznik'  },
  { nazwa: 'Boleń',            icon: 'bolen.jpeg',            color: '#0891b2', opis: 'Jedyny drapieżny karpiowaty. Goniący przy powierzchni, błyskawiczny jak strzała.',                      progSrebro: 2,    progZloto: 4,    xpPerKg: 800,  progSrebroCm: 45,  progZlotoCm: 65,  xpPerCm: 45,  rzadkosc: 'rare',      kategoria: 'drapieznik'  },
  { nazwa: 'Węgorz',           icon: 'wegorz.jpeg',           color: '#57534e', opis: 'Tajemniczy wędrowiec. Wędruje na tarło aż na Morze Sargassowe. Gatunek krytycznie zagrożony.',           progSrebro: 1,    progZloto: 2.5,  xpPerKg: 1000, progSrebroCm: 55,  progZlotoCm: 80,  xpPerCm: 60,  rzadkosc: 'legendary', kategoria: 'rzeczne'     },
  { nazwa: 'Miętus',           icon: 'mietus.jpeg',           color: '#6366f1', opis: 'Jedyny słodkowodny przedstawiciel dorszowatych w Polsce. Aktywny zimą, pod lodem.',                     progSrebro: 0.5,  progZloto: 1.5,  xpPerKg: 600,  progSrebroCm: 30,  progZlotoCm: 45,  xpPerCm: 35,  rzadkosc: 'uncommon',  kategoria: 'rzeczne'     },
  { nazwa: 'Karp',             icon: 'karp.jpeg',             color: '#b45309', opis: 'Legenda karpiowań. Walczący i inteligentny — wymaga precyzji i cierpliwości.',                          progSrebro: 8,    progZloto: 15,   xpPerKg: 150,  progSrebroCm: 55,  progZlotoCm: 75,  xpPerCm: 8,   rzadkosc: 'uncommon',  kategoria: 'karpiowate'  },
  { nazwa: 'Leszcz',           icon: 'leszcz.jpeg',           color: '#ca8a04', opis: 'Spokojny karpiowaty głębokich stanowisk. Wymaga cierpliwości i delikatnego sprzętu.',                   progSrebro: 1.5,  progZloto: 3,    xpPerKg: 350,  progSrebroCm: 35,  progZlotoCm: 50,  xpPerCm: 20,  rzadkosc: 'common',    kategoria: 'biala'       },
  { nazwa: 'Lin',              icon: 'lin.jpeg',              color: '#65a30d', opis: 'Cichy mieszkaniec roślinnych zatok. Złota łuska, lecznicze śluzy.',                                     progSrebro: 1,    progZloto: 2,    xpPerKg: 500,  progSrebroCm: 35,  progZlotoCm: 50,  xpPerCm: 28,  rzadkosc: 'common',    kategoria: 'karpiowate'  },
  { nazwa: 'Płoć',             icon: 'ploc.jpeg',             color: '#ef4444', opis: 'Najpopularniejsza ryba polskich wód. Srebrna łuska, czerwone oczy — nieodłączna towarzyszka wędkarzy.',  progSrebro: 0.3,  progZloto: 0.8,  xpPerKg: 400,  progSrebroCm: 22,  progZlotoCm: 32,  xpPerCm: 22,  rzadkosc: 'common',    kategoria: 'biala'       },
  { nazwa: 'Wzdręga',          icon: 'wzdrega.jpeg',          color: '#f97316', opis: 'Siostra płoci z czerwonymi płetwami. Lubi spokojne, zarośnięte wody.',                                  progSrebro: 0.2,  progZloto: 0.5,  xpPerKg: 400,  progSrebroCm: 18,  progZlotoCm: 26,  xpPerCm: 22,  rzadkosc: 'common',    kategoria: 'biala'       },
  { nazwa: 'Karaś złocisty',   icon: 'karas-zlocisty.jpeg',   color: '#d97706', opis: 'Złoty pancernik polskich stawów. Przeżyje tam, gdzie inne ryby giną.',                                  progSrebro: 0.5,  progZloto: 1.2,  xpPerKg: 350,  progSrebroCm: 22,  progZlotoCm: 32,  xpPerCm: 20,  rzadkosc: 'common',    kategoria: 'karpiowate'  },
  { nazwa: 'Karaś srebrzysty', icon: 'karas-srebrzysty.jpeg', color: '#94a3b8', opis: 'Inwazyjny krewniak karasia złocistego. Bardzo wytrzymały, rośnie szybko.',                              progSrebro: 0.5,  progZloto: 1.5,  xpPerKg: 350,  progSrebroCm: 22,  progZlotoCm: 35,  xpPerCm: 20,  rzadkosc: 'common',    kategoria: 'karpiowate'  },
  { nazwa: 'Amur',             icon: 'amur.jpeg',             color: '#22c55e', opis: 'Azjatycki gigant karpiowatych. Żywi się roślinnością, osiąga imponujące rozmiary.',                     progSrebro: 5,    progZloto: 12,   xpPerKg: 180,  progSrebroCm: 65,  progZlotoCm: 90,  xpPerCm: 10,  rzadkosc: 'uncommon',  kategoria: 'karpiowate'  },
  { nazwa: 'Tołpyga',          icon: 'tolpyga.jpeg',          color: '#06b6d4', opis: 'Filtruje plankton z wody. Azjatycki gigant, który może ważyć ponad 40 kg.',                             progSrebro: 5,    progZloto: 15,   xpPerKg: 180,  progSrebroCm: 70,  progZlotoCm: 100, xpPerCm: 10,  rzadkosc: 'uncommon',  kategoria: 'karpiowate'  },
  { nazwa: 'Krąp',             icon: 'krap.jpeg',             color: '#a16207', opis: 'Mały, wysoki karpiowaty z charakterystyczną czerwoną barwą płetw. Towarzyszy leszczowi.',               progSrebro: 0.2,  progZloto: 0.5,  xpPerKg: 400,  progSrebroCm: 18,  progZlotoCm: 26,  xpPerCm: 22,  rzadkosc: 'common',    kategoria: 'karpiowate'  },
  { nazwa: 'Ukleja',           icon: 'ukleja.jpeg',           color: '#38bdf8', opis: 'Mała, błyszcząca rybka powierzchniowa. Ławice uklejek przyciągają większe drapieżniki.',               progSrebro: 0.05, progZloto: 0.12, xpPerKg: 700,  progSrebroCm: 12,  progZlotoCm: 18,  xpPerCm: 40,  rzadkosc: 'common',    kategoria: 'biala'       },
  { nazwa: 'Certa',            icon: 'certa.jpeg',            color: '#475569', opis: 'Wędrująca ryba rzek przymorskich. Coraz rzadsza, wymaga czystych rzek z dnem żwirowym.',                progSrebro: 0.8,  progZloto: 2,    xpPerKg: 1000, progSrebroCm: 35,  progZlotoCm: 50,  xpPerCm: 55,  rzadkosc: 'rare',      kategoria: 'rzeczne'     },
  { nazwa: 'Jaź',              icon: 'jaz.jpeg',              color: '#fbbf24', opis: 'Złociste łuski i czerwone oczy. Drapieżny o zmierzchu, łowi owady z powierzchni.',                     progSrebro: 0.8,  progZloto: 2,    xpPerKg: 500,  progSrebroCm: 30,  progZlotoCm: 45,  xpPerCm: 28,  rzadkosc: 'uncommon',  kategoria: 'rzeczne'     },
  { nazwa: 'Kleń',             icon: 'klen.jpeg',             color: '#84cc16', opis: 'Wszechstronny łowca rzek. Bierze na muchy, błystki i kawałki chleba.',                                 progSrebro: 0.8,  progZloto: 2,    xpPerKg: 500,  progSrebroCm: 30,  progZlotoCm: 45,  xpPerCm: 28,  rzadkosc: 'uncommon',  kategoria: 'rzeczne'     },
  { nazwa: 'Pstrąg potokowy',  icon: 'pstrag-potokowy.jpeg',  color: '#0d9488', opis: 'Ryba czystych górskich strumieni. Symbol nietkniętej natury i czystych wód.',                          progSrebro: 0.5,  progZloto: 1.5,  xpPerKg: 800,  progSrebroCm: 28,  progZlotoCm: 42,  xpPerCm: 45,  rzadkosc: 'uncommon',  kategoria: 'lososiowate' },
  { nazwa: 'Pstrąg tęczowy',   icon: 'pstrag-teczowy.jpeg',  color: '#a855f7', opis: 'Kolorowy przybysz z Ameryki Północnej. Szybko rośnie, intensywnie walczy.',                            progSrebro: 0.8,  progZloto: 2,    xpPerKg: 800,  progSrebroCm: 32,  progZlotoCm: 50,  xpPerCm: 45,  rzadkosc: 'uncommon',  kategoria: 'lososiowate' },
  { nazwa: 'Lipień',           icon: 'lipien.jpeg',           color: '#8b5cf6', opis: 'Królowa górnych rzek. Chorągiewkowa płetwa grzbietowa, lśniące łuski, muchy na powierzchni.',          progSrebro: 0.5,  progZloto: 1.5,  xpPerKg: 1000, progSrebroCm: 28,  progZlotoCm: 42,  xpPerCm: 55,  rzadkosc: 'rare',      kategoria: 'lososiowate' },
  { nazwa: 'Głowacica',        icon: 'glowacica.jpeg',        color: '#9333ea', opis: 'Królowa podgórskich rzek. Chroniona, rzadka, imponująca. Największa ryba łososiowatych w Polsce.',     progSrebro: 5,    progZloto: 10,   xpPerKg: 1500, progSrebroCm: 80,  progZlotoCm: 120, xpPerCm: 85,  rzadkosc: 'legendary', kategoria: 'lososiowate' },
  { nazwa: 'Brzana',           icon: 'brzana.jpeg',           color: '#f59e0b', opis: 'Ryba wartkich rzek z kamienistym dnem. Silna i szybka — dostarcza emocji na spławik i grunt.',        progSrebro: 1.5,  progZloto: 4,    xpPerKg: 600,  progSrebroCm: 40,  progZlotoCm: 60,  xpPerCm: 33,  rzadkosc: 'uncommon',  kategoria: 'rzeczne'     },
  { nazwa: 'Świnka',           icon: 'swinka.jpeg',           color: '#78716c', opis: 'Charakterystyczny pysk skierowany ku dołowi. Skrobie glony z kamieni, żyje w czystych rzekach.',      progSrebro: 0.3,  progZloto: 0.8,  xpPerKg: 500,  progSrebroCm: 22,  progZlotoCm: 32,  xpPerCm: 28,  rzadkosc: 'uncommon',  kategoria: 'rzeczne'     },
  { nazwa: 'Kiełb',            icon: 'kielb.jpeg',            color: '#a8a29e', opis: 'Mały, ale hardy. Żyje przy dnie w czystych, wartkich wodach. Wskaźnik czystości rzeki.',               progSrebro: 0.05, progZloto: 0.15, xpPerKg: 600,  progSrebroCm: 10,  progZlotoCm: 16,  xpPerCm: 35,  rzadkosc: 'common',    kategoria: 'rzeczne'     },
  { nazwa: 'Jazgarz',          icon: 'jazgarz.jpeg',          color: '#f43f5e', opis: 'Miniaturowy okoń z kolcami na pokrywach skrzelowych. Łapczywy, agresywny, wszechobecny.',              progSrebro: 0.05, progZloto: 0.15, xpPerKg: 600,  progSrebroCm: 10,  progZlotoCm: 16,  xpPerCm: 35,  rzadkosc: 'common',    kategoria: 'drapieznik'  },
  { nazwa: 'Słonecznica',      icon: 'slonecznica.jpeg',      color: '#fb923c', opis: 'Kolorowy przybysz z Ameryki. Mała i piękna — lubi ciepłe, zarośnięte zatoki.',                        progSrebro: 0.05, progZloto: 0.1,  xpPerKg: 700,  progSrebroCm: 10,  progZlotoCm: 15,  xpPerCm: 40,  rzadkosc: 'uncommon',  kategoria: 'karpiowate'  },
  { nazwa: 'Różanka',          icon: 'rozanka.jpeg',          color: '#ec4899', opis: 'Najmniejsza polska ryba objęta ochroną. Składa jaja w płaszczu małży — cud natury.',                   progSrebro: 0.01, progZloto: 0.03, xpPerKg: 5000, progSrebroCm: 4,   progZlotoCm: 7,   xpPerCm: 280, rzadkosc: 'rare',      kategoria: 'rzeczne'     },
];

export type XpTier = {
  label: string;
  minXp: number;
  gradient: string;
  borderColor: string;
  bgClass: string;
  textClass: string;
  animated?: boolean;
};

export const XP_TIERS: XpTier[] = [
  {
    label: 'Wędkarz',
    minXp: 500,
    gradient: 'linear-gradient(90deg, #333, #000)',
    borderColor: 'border-slate-100',
    bgClass: 'bg-white',
    textClass: 'text-gray-800',
  },
  {
    label: 'Znawca',
    minXp: 2000,
    gradient: 'linear-gradient(90deg, #38bdf8, #0284c7)',
    borderColor: 'border-blue-300',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-600',
  },
  {
    label: 'Ekspert',
    minXp: 5000,
    gradient: 'linear-gradient(90deg, #c084fc, #9333ea)',
    borderColor: 'border-purple-300',
    bgClass: 'bg-purple-50',
    textClass: 'text-purple-600',
  },
  {
    label: 'Mistrz',
    minXp: 10000,
    gradient: 'linear-gradient(90deg, #fbbf24, #f59e0b, #ef4444, #f59e0b, #fbbf24)',
    borderColor: 'border-yellow-400',
    bgClass: 'bg-yellow-50',
    textClass: 'text-yellow-600',
    animated: true,
  },
  {
    label: 'Legenda',
    minXp: 25000,
    gradient: 'linear-gradient(90deg, #f43f5e, #ec4899, #a855f7, #6366f1, #38bdf8, #a855f7, #f43f5e)',
    borderColor: 'border-pink-400',
    bgClass: 'bg-pink-50',
    textClass: 'text-pink-600',
    animated: true,
  },
];

export function getXpTier(xp: number): XpTier {
  let tier = XP_TIERS[0];
  for (const t of XP_TIERS) {
    if (xp >= t.minXp) tier = t;
  }
  return tier;
}

export function getMedalForCatch(ryba: string, waga: number): Medal {
  const entry = FISH_DEX.find((f) => f.nazwa === ryba);
  if (!entry) return 'bronze';
  if (waga >= entry.progZloto) return 'gold';
  if (waga >= entry.progSrebro) return 'silver';
  return 'bronze';
}

export function getMedalForCatchCm(ryba: string, dlugoscCm: number): Medal {
  const entry = FISH_DEX.find((f) => f.nazwa === ryba);
  if (!entry) return 'bronze';
  if (dlugoscCm >= entry.progZlotoCm) return 'gold';
  if (dlugoscCm >= entry.progSrebroCm) return 'silver';
  return 'bronze';
}

export function getXpForCatch(ryba: string, waga: number): number {
  const entry = FISH_DEX.find((f) => f.nazwa === ryba);
  if (!entry) return Math.round(waga * 100);
  return Math.round(waga * entry.xpPerKg);
}

export function getXpForCatchCm(ryba: string, dlugoscCm: number): number {
  const entry = FISH_DEX.find((f) => f.nazwa === ryba);
  if (!entry) return Math.round(dlugoscCm * 10);
  return Math.round(dlugoscCm * entry.xpPerCm);
}

export function getBestMedalForCatch(ryba: string, waga: number | undefined, dlugoscCm: number | undefined): Medal {
  const medalKg = waga != null && waga > 0 ? getMedalForCatch(ryba, waga) : 'bronze';
  const medalCm = dlugoscCm != null && dlugoscCm > 0 ? getMedalForCatchCm(ryba, dlugoscCm) : 'bronze';
  const order: Medal[] = ['bronze', 'silver', 'gold'];
  return order.indexOf(medalKg) >= order.indexOf(medalCm) ? medalKg : medalCm;
}

export function getTotalXpForCatch(ryba: string, waga: number | undefined, dlugoscCm: number | undefined): number {
  const xpKg = waga != null && waga > 0 ? getXpForCatch(ryba, waga) : 0;
  const xpCm = dlugoscCm != null && dlugoscCm > 0 ? getXpForCatchCm(ryba, dlugoscCm) : 0;
  return Math.max(xpKg, xpCm);
}

function xpForLevel(level: number): number {
  return Math.floor(500 * Math.pow(1.35, level - 1));
}

function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) total += xpForLevel(i);
  return total;
}

export function getLevelFromXp(xp: number): { level: number; currentXp: number; nextLevelXp: number; progress: number } {
  let level = 1;
  while (xp >= totalXpForLevel(level + 1)) level++;
  const levelStartXp = totalXpForLevel(level);
  const nextLevelXp = xpForLevel(level);
  const currentXp = xp - levelStartXp;
  const progress = Math.min(100, Math.round((currentXp / nextLevelXp) * 100));
  return { level, currentXp, nextLevelXp, progress };
}

export const MEDAL_COLORS: Record<Medal, { bg: string; text: string; border: string; label: string; emoji: string }> = {
  bronze: {
    bg: 'bg-white',
    text: 'text-amber-700',
    border: 'border-slate-100',
    label: 'Brąz',
    emoji: '🥉',
  },
  silver: {
    bg: 'bg-white',
    text: 'text-slate-600',
    border: 'border-slate-100',
    label: 'Srebro',
    emoji: '🥈',
  },
  gold: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-slate-100',
    label: 'Złoto',
    emoji: '🥇',
  },
};

export const RARENESS_COLORS: Record<FishDexEntry['rzadkosc'], string> = {
  common: 'text-slate-400',
  uncommon: 'text-emerald-800',
  rare: 'text-blue-600',
  legendary: 'text-purple-600',
};

export const RARENESS_LABELS: Record<FishDexEntry['rzadkosc'], string> = {
  common: 'Pospolita',
  uncommon: 'Niepospolita',
  rare: 'Rzadka',
  legendary: 'Legendarna',
};

export function getAktywneOchronne() {
  const dzis = new Date();
  const mmdd = `${String(dzis.getMonth() + 1).padStart(2, '0')}-${String(dzis.getDate()).padStart(2, '0')}`;
  return OKRESY_OCHRONNE.filter((o) => mmdd >= o.start && mmdd <= o.koniec);
}

export function getFishingInfo() {
  const aktywneOchronne = getAktywneOchronne();
  const protectedNames = aktywneOchronne.map((o) => o.nazwa);
  const currentTemp = 17;
  const currentPressure = 1016;

  const activeSpecies = BAZA_WIEDZY
    .filter((f) => !protectedNames.includes(f.nazwa))
    .map((f) => {
      const avgTemp = (f.idealTemp[0] + f.idealTemp[1]) / 2;
      const tempDiff = Math.abs(currentTemp - avgTemp);
      const score = Math.max(0, f.activity - tempDiff * 3);
      return { ...f, finalScore: Math.round(score) };
    })
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, 5);

  return {
    temp: `${currentTemp}°C`,
    wiatr: '10 km/h',
    cisnienie: `${currentPressure} hPa`,
    activeSpecies,
    zakazy: aktywneOchronne,
  };
}

export type Reactions = {
  '🔥': number;
  '👏': number;
  '😮': number;
  '🎣': number;
  '😂': number;
};

export const REACTION_EMOJIS: (keyof Reactions)[] = ['🔥', '👏', '😮', '🎣', '😂'];

export type FishCatch = {
  id: string;
  ryba: string;
  waga?: number;
  dlugoscCm?: number;
  miejsce: string;
  userId: string;
  autor: string;
  data: number;
  photo?: string;
  opis?: string;
  reactions?: Reactions;
  reactedBy?: Record<string, keyof Reactions>;
  medal?: Medal;
  xp?: number;
  aiVerified?: boolean;
  isPublic?: boolean;
};
