import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const PROJECT_ID = 'fish-4f88d';
const CLIENT_EMAIL = 'firebase-adminsdk-fbsvc@fish-4f88d.iam.gserviceaccount.com';
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDs0W1wO/o8hUpk
j33JL9F3Ua/Sso1O5xWR14UStCx+xCsufAEY2JeqNGvPfk/XFghW5CSXa7eMZ2JF
txTWC/We+q+zkueS9buj+EwoOL4mLXrBMEYadJcSH8juRnUaoG3EtuuK0E6atbje
oNl5HiFOStheUOLS95GBSww0dVjgBTcTvbS5HuJ/RIafYe3RvYFJzWjuDN5LctPS
gmwvnSfFuYWG17XvE7wMwBDXu0ZK7jWETyxDmPYc9MHUzosbJ++mjI7j0hzd8C12
jvhldtQaEc4VGV/KcU9TBayt/fQXzCrJIwcBmSdSdjUD3I0gk3qxGKPgQMcvjRNs
Nv868MunAgMBAAECggEAW9E5Fq5Sb5uYQ9P0h4fwNUxpGI5cxk5HKSP/9sf/hmjF
e0Dd5gW4C+hGMo09JF3o/tN2snSzlg7RZck9nV3GrgxxCfU3rt1yknjnAiM56jBw
6y0tyP0SQ5cqPuP3bEruNDpdqZTpHQe+9SY1G0YI0MOpDyxaPUR6WEBCK6ahvjzY
YOeQ/b4mkXqXKvaNE1ySGxyzet98AsaP53+06RvrdqEGvVwRZsJci5uDYNK0CrAG
UFJtIZHlWf6BpI844maaGB8LOA0u7APNJqjHm81e8i4qXGczemFgXO7KI2K0ijfs
0A1jt3fw46m/RTEyC87Jwd9z8FlJzg1X1Wy8gHJiCQKBgQD9zQtxUIjTT2ojS05F
SkPTtDzt+Eh/LC7WfmRpc9S3ZybOzyL2f905shgKx3dDNoomOWFuwVIdzVA98Eog
iP+errt09lGghE4bo0TzFY/9C8FMrZmyWHoXblJmpcPMcTrrVgVq3H0ijIisBpfi
siyU+cjrGKDUbr8BCCflPIqb6QKBgQDu3raOaeEeqSi/6W5WdE5i4GDGPpgoolHx
C+yErq/tAaREApmseFQAJ9PYTLRhKnbmYTjf9dYd7NvlXL+P3gMYJyw9t9aq1YSJ
yIzHpHN6qGeuuxw9HlW2zf6rPQ6OYssbrHXameRTXKcyhsq8bNT4hPWp3FoNNOMm
W1QM46/BDwKBgAb3hPPkWQ0r5eb4HzrpsfjyvqVtplfPV63NpGX8pv8t1rPgnb4U
fnch+2T4Wr6+lYY9Fv6aUe29gBFjMjW4bQPnGgA47r6wQxChJ7hghCZXF0RKk6iA
o0FXZu2oaTqIdSyWnOl1Cf5Ty0Cloa+4Yl7oiGpjr66FJ7sYhTfWtJtZAoGBAI7A
rp0BjbYDJgU6/ePQ8h+JNIyFT+3Iw+uoUpsgwqaDeqXiX/CAoMLPCn2TqaD//brE
k3bUtjeAHBJAkYLrDTJcBsaDnVjO7bxiDDAriY/eIMh9reygulzbUr0HajGRvQw2
zt/rZFalYo6Bm5tr9wLmguIWfAK0fqOnpN1nHNvlAoGAb/uwuYTrK5SJd3PGsFPs
TY0jAGDeZHZYJPVdaX85HRxJs3M/n5tRjt7QsEsIR/W6PefgZ7aApfOHA46LgqoW
HvNahFqjz8R9h3s5pZaHSgBewDeClVzKRQbmkExtocWedZz/2pwJ4rF4hHVnjFgu
KRaK5TKUirNmCliwAok2Dxo=
-----END PRIVATE KEY-----
`;

if (getApps().length === 0) {
  initializeApp({ credential: cert({ projectId: PROJECT_ID, clientEmail: CLIENT_EMAIL, privateKey: PRIVATE_KEY }) });
}
const db = getFirestore();
const COLLECTION = 'artifacts/fishrank-universal/public/data/catches';

// 10 fikcyjnych użytkowników
const USERS = [
  { uid: 'user_pawel',   autor: 'pawel_wedkarz' },
  { uid: 'user_marek',   autor: 'marek_spinningista' },
  { uid: 'user_tomek',   autor: 'tomek_karpiarz' },
  { uid: 'user_ania',    autor: 'ania_fly_fish' },
  { uid: 'user_krzysiek',autor: 'krzysiek_nad_wisla' },
  { uid: 'user_bartek',  autor: 'bartek_nocny_lowca' },
  { uid: 'user_kamil',   autor: 'kamil_mistrz_gumy' },
  { uid: 'user_darek',   autor: 'darek_od_suma' },
  { uid: 'user_zosia',   autor: 'zosia_woblery' },
  { uid: 'user_piotr',   autor: 'piotr_rzeki_gorskie' },
];

// Dane medali i XP per gatunek (uproszczone progi z fishing-data)
const FISH_CONFIG = {
  'Szczupak':        { progSrebro: 5,   progZloto: 10,  xpBraz: 150,  xpSrebro: 400,  xpZloto: 1000 },
  'Sandacz':         { progSrebro: 4,   progZloto: 8,   xpBraz: 200,  xpSrebro: 500,  xpZloto: 1200 },
  'Sum':             { progSrebro: 20,  progZloto: 50,  xpBraz: 300,  xpSrebro: 800,  xpZloto: 2000 },
  'Okoń':            { progSrebro: 0.5, progZloto: 1,   xpBraz: 50,   xpSrebro: 150,  xpZloto: 400  },
  'Karp':            { progSrebro: 8,   progZloto: 15,  xpBraz: 120,  xpSrebro: 350,  xpZloto: 900  },
  'Boleń':           { progSrebro: 2,   progZloto: 4,   xpBraz: 180,  xpSrebro: 450,  xpZloto: 1100 },
  'Leszcz':          { progSrebro: 1.5, progZloto: 3,   xpBraz: 60,   xpSrebro: 180,  xpZloto: 450  },
  'Lin':             { progSrebro: 1,   progZloto: 2,   xpBraz: 80,   xpSrebro: 220,  xpZloto: 550  },
  'Płoć':            { progSrebro: 0.3, progZloto: 0.8, xpBraz: 30,   xpSrebro: 90,   xpZloto: 250  },
  'Pstrąg potokowy': { progSrebro: 0.5, progZloto: 1.5, xpBraz: 160,  xpSrebro: 420,  xpZloto: 1050 },
  'Pstrąg tęczowy':  { progSrebro: 0.8, progZloto: 2,   xpBraz: 100,  xpSrebro: 280,  xpZloto: 700  },
  'Głowacica':       { progSrebro: 5,   progZloto: 10,  xpBraz: 400,  xpSrebro: 1000, xpZloto: 2500 },
  'Węgorz':          { progSrebro: 1,   progZloto: 2.5, xpBraz: 250,  xpSrebro: 650,  xpZloto: 1600 },
  'Jaź':             { progSrebro: 0.8, progZloto: 2,   xpBraz: 80,   xpSrebro: 220,  xpZloto: 560  },
  'Kleń':            { progSrebro: 0.8, progZloto: 2,   xpBraz: 70,   xpSrebro: 200,  xpZloto: 520  },
};

function getMedal(ryba, waga) {
  const cfg = FISH_CONFIG[ryba];
  if (!cfg) return 'bronze';
  if (waga >= cfg.progZloto) return 'gold';
  if (waga >= cfg.progSrebro) return 'silver';
  return 'bronze';
}

function getXp(ryba, medal) {
  const cfg = FISH_CONFIG[ryba];
  if (!cfg) return 50;
  if (medal === 'gold') return cfg.xpZloto;
  if (medal === 'silver') return cfg.xpSrebro;
  return cfg.xpBraz;
}

// 20 połowów — różnorodne gatunki, wagi, miejsca, użytkownicy, daty
const SEED_CATCHES = [
  { ryba: 'Szczupak',        waga: 8.4,  miejsce: 'Jezioro Śniardwy',       user: USERS[0], opis: 'Zaatakowała jerkbait tuż przy szuwarach, niesamowite uderzenie!', aiVerified: true,  isPublic: true,  daysAgo: 1  },
  { ryba: 'Sandacz',         waga: 5.2,  miejsce: 'Wisła — Włocławek',      user: USERS[1], opis: 'Wieczorny spinning, guma 14cm w kolorze chart. Piękna sztuka.',  aiVerified: true,  isPublic: true,  daysAgo: 2  },
  { ryba: 'Karp',            waga: 14.7, miejsce: 'Staw Lipowy — Bochnia',  user: USERS[2], opis: 'Metoda z kulką truskawkową, holowanie trwało 20 minut.',          aiVerified: true,  isPublic: true,  daysAgo: 3  },
  { ryba: 'Sum',             waga: 42.0, miejsce: 'San — Przemyśl',         user: USERS[7], opis: 'Nocna sesja z klokotką. Branie o 2:30, walka godzina!',            aiVerified: true,  isPublic: true,  daysAgo: 4  },
  { ryba: 'Pstrąg potokowy', waga: 1.8,  miejsce: 'Dunajec — Szczawnica',   user: USERS[3], opis: 'Nimfa złota #12 przy dnie. Ryba z puli pod wodospadem.',           aiVerified: false, isPublic: true,  daysAgo: 5  },
  { ryba: 'Boleń',           waga: 3.6,  miejsce: 'Bug — Siemiatycze',      user: USERS[4], opis: 'Szybkie prowadzenie błystki talerzowej. Eksplodował przy powierzchni!', aiVerified: false, isPublic: true,  daysAgo: 6  },
  { ryba: 'Leszcz',         waga: 2.8,  miejsce: 'Jezioro Niegocin',        user: USERS[5], opis: 'Spławikówka, czerwony robak. Cierpliwość popłaca.',                 aiVerified: false, isPublic: true,  daysAgo: 7  },
  { ryba: 'Lin',             waga: 1.9,  miejsce: 'Starorzecze Odry',       user: USERS[6], opis: 'Cichy poranek, chleb na haczyku nr 8. Złota łuska w słońcu.',      aiVerified: true,  isPublic: true,  daysAgo: 8  },
  { ryba: 'Głowacica',       waga: 7.3,  miejsce: 'Soła — Oświęcim',        user: USERS[9], opis: 'Duży wobbler w nurcie. Chroniona — złap i wypuść!',                aiVerified: true,  isPublic: true,  daysAgo: 9  },
  { ryba: 'Okoń',            waga: 0.9,  miejsce: 'Jezioro Mamry',          user: USERS[1], opis: 'Ławica okoni pod molo, mikroguma chartreuse.',                     aiVerified: false, isPublic: true,  daysAgo: 10 },
  { ryba: 'Szczupak',        waga: 12.1, miejsce: 'Jezioro Jeziorak',       user: USERS[8], opis: 'Złoty szczupak — duży jerk, agresywne prowadzenie. Majstersztyk!', aiVerified: true,  isPublic: true,  daysAgo: 11 },
  { ryba: 'Węgorz',          waga: 2.1,  miejsce: 'Kanał Augustowski',      user: USERS[4], opis: 'Nocna wyprawa z dżdżownicą. Węgorz walczył zawzięcie.',             aiVerified: false, isPublic: true,  daysAgo: 12 },
  { ryba: 'Pstrąg tęczowy',  waga: 1.5,  miejsce: 'Łososina — Nowy Sącz',  user: USERS[3], opis: 'Błystka obrotowa silver. Piękne barwy tęczowe.',                   aiVerified: true,  isPublic: true,  daysAgo: 13 },
  { ryba: 'Sandacz',         waga: 7.8,  miejsce: 'Zbiornik Solina',        user: USERS[0], opis: 'Rekord osobisty! Guma na jig-główce 21g, godz. 21:00.',             aiVerified: true,  isPublic: true,  daysAgo: 14 },
  { ryba: 'Płoć',            waga: 0.6,  miejsce: 'Wisła — Kraków',         user: USERS[2], opis: 'Klasyczna spławikówka pod mostem Dębnickim.',                      aiVerified: false, isPublic: true,  daysAgo: 15 },
  { ryba: 'Jaź',             waga: 1.7,  miejsce: 'Narew — Łomża',          user: USERS[5], opis: 'Mucha sucha przy powierzchni o zmierzchu. Złota łuska jarzyła.',    aiVerified: false, isPublic: false, daysAgo: 16 },
  { ryba: 'Karp',            waga: 9.5,  miejsce: 'Łowisko Karaś — Bytom', user: USERS[6], opis: 'Boilies truskawkowe 16mm, zanęta koktajlowa. Piękny grzbietowiec.', aiVerified: true,  isPublic: true,  daysAgo: 17 },
  { ryba: 'Kleń',            waga: 1.3,  miejsce: 'Raba — Myślenice',       user: USERS[9], opis: 'Małe woblery 4cm w nurcie. Kleń walczył jak szatan.',               aiVerified: false, isPublic: true,  daysAgo: 18 },
  { ryba: 'Boleń',           waga: 4.2,  miejsce: 'Wisła — Sandomierz',     user: USERS[7], opis: 'Błystka talerzowa Toby 20g, złoty kolor. Pościg przy powierzchni.', aiVerified: true,  isPublic: true,  daysAgo: 19 },
  { ryba: 'Sum',             waga: 18.5, miejsce: 'Odra — Szczecin',        user: USERS[8], opis: 'Martwa rybka w rynnie 8m głębokości. Sum bronił swojej nory.',       aiVerified: false, isPublic: true,  daysAgo: 20 },
];

async function seed() {
  const batch = db.batch();

  for (const c of SEED_CATCHES) {
    const medal = getMedal(c.ryba, c.waga);
    const xp = getXp(c.ryba, medal);
    const data = Date.now() - c.daysAgo * 24 * 60 * 60 * 1000;

    const ref = db.collection(COLLECTION).doc();
    batch.set(ref, {
      ryba: c.ryba,
      waga: c.waga,
      miejsce: c.miejsce,
      userId: c.user.uid,
      autor: c.user.autor,
      opis: c.opis,
      data,
      medal,
      xp,
      aiVerified: c.aiVerified,
      isPublic: c.isPublic,
      reactions: { '🔥': 0, '👏': 0, '😮': 0, '🎣': 0, '😂': 0 },
    });
  }

  await batch.commit();
  console.log(`✓ Dodano ${SEED_CATCHES.length} połowów od ${USERS.length} użytkowników.`);
}

seed().catch((err) => { console.error(err); process.exit(1); });
