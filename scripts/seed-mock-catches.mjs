import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');

// Parse .env.local manually
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => {
      const idx = l.indexOf('=');
      const key = l.slice(0, idx).trim();
      const raw = l.slice(idx + 1).trim();
      // strip surrounding quotes if present
      const value = raw.startsWith('"') && raw.endsWith('"') ? raw.slice(1, -1) : raw;
      return [key, value];
    })
);

const TARGET_EMAIL = 'arkadiuszwierzbicki1@wp.pl';
const APP_ID = env.NEXT_PUBLIC_APP_ID ?? 'fishrank-universal';
const CATCHES_COLLECTION = `artifacts/${APP_ID}/public/data/catches`;

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const auth = getAuth();
const db = getFirestore();

// 20 ryb z fish-ranks — po jednym połowie per ranga (Lv1–Lv10) + reszta Lv1
// xpPerKg z fishing-data.ts
const FISH_DEX = [
  { nazwa: 'Szczupak',          xpPerKg: 700  },
  { nazwa: 'Sandacz',           xpPerKg: 700  },
  { nazwa: 'Sum',               xpPerKg: 200  },
  { nazwa: 'Okoń',              xpPerKg: 500  },
  { nazwa: 'Boleń',             xpPerKg: 800  },
  { nazwa: 'Węgorz',            xpPerKg: 1000 },
  { nazwa: 'Miętus',            xpPerKg: 600  },
  { nazwa: 'Karp',              xpPerKg: 150  },
  { nazwa: 'Leszcz',            xpPerKg: 350  },
  { nazwa: 'Lin',               xpPerKg: 500  },
  { nazwa: 'Płoć',              xpPerKg: 400  },
  { nazwa: 'Wzdręga',           xpPerKg: 400  },
  { nazwa: 'Karaś złocisty',   xpPerKg: 350  },
  { nazwa: 'Karaś srebrzysty', xpPerKg: 350  },
  { nazwa: 'Amur',              xpPerKg: 180  },
  { nazwa: 'Tołpyga',          xpPerKg: 180  },
  { nazwa: 'Krąp',              xpPerKg: 400  },
  { nazwa: 'Ukleja',            xpPerKg: 700  },
  { nazwa: 'Certa',             xpPerKg: 1000 },
  { nazwa: 'Jaź',               xpPerKg: 500  },
];

// Progi rang (minXp per gatunek)
const FISH_RANKS = [
  { level: 1,  minXp: 0       },
  { level: 2,  minXp: 200     },
  { level: 3,  minXp: 600     },
  { level: 4,  minXp: 2000    },
  { level: 5,  minXp: 8500    },
  { level: 6,  minXp: 17000   },
  { level: 7,  minXp: 40000   },
  { level: 8,  minXp: 70000   },
  { level: 9,  minXp: 200000  },
  { level: 10, minXp: 600000  },
];

// Miejsca połowów
const MIEJSCA = ['Wisła - Warszawa', 'Jeziorko Czerniakowskie', 'Narew - Pułtusk', 'Bug - Małkinia', 'Zalew Zegrzyński'];

function getMedalForCatch(waga, progSrebro, progZloto) {
  if (waga >= progZloto) return 'gold';
  if (waga >= progSrebro) return 'silver';
  return 'bronze';
}

function randomDate(daysBack) {
  const now = Date.now();
  return now - Math.floor(Math.random() * daysBack * 24 * 60 * 60 * 1000);
}

async function main() {
  // Pobierz UID z Firebase Auth
  let uid;
  try {
    const userRecord = await auth.getUserByEmail(TARGET_EMAIL);
    uid = userRecord.uid;
    console.log(`✓ Znaleziono użytkownika: ${TARGET_EMAIL} → UID: ${uid}`);
  } catch (e) {
    console.error(`✗ Nie znaleziono użytkownika ${TARGET_EMAIL} w Firebase Auth:`, e.message);
    process.exit(1);
  }

  // Skasuj istniejące mocki tego usera (żeby uniknąć duplikatów)
  const existing = await db.collection(CATCHES_COLLECTION).where('userId', '==', uid).where('_mock', '==', true).get();
  if (!existing.empty) {
    const CHUNK = 100;
    for (let i = 0; i < existing.docs.length; i += CHUNK) {
      const batch = db.batch();
      existing.docs.slice(i, i + CHUNK).forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
    console.log(`✓ Usunięto ${existing.docs.length} starych mocków`);
  }

  const catches = [];

  // 10 ryb → rozłożone połowy by osiągnąć dokładną rangę (Lv1–Lv10)
  // Max 10 połowów per rybę, każdy z odpowiednią wagą dającą wymagane XP
  const MAX_CATCHES_PER_FISH = 10;
  for (let i = 0; i < 10; i++) {
    const fish = FISH_DEX[i];
    const targetLevel = i + 1;
    const targetRank = FISH_RANKS[targetLevel - 1];
    const targetXp = targetLevel === 1 ? 50 : Math.ceil(targetRank.minXp * 1.05);

    const catchCount = Math.min(MAX_CATCHES_PER_FISH, Math.max(1, targetLevel));
    const xpPerCatch = Math.ceil(targetXp / catchCount);
    const wagaPerCatch = Math.round((xpPerCatch / fish.xpPerKg) * 10) / 10 || 0.1;

    for (let j = 0; j < catchCount; j++) {
      const waga = wagaPerCatch;
      const xp = Math.round(waga * fish.xpPerKg);
      catches.push({
        ryba: fish.nazwa,
        waga,
        xp,
        userId: uid,
        autor: 'Arkadiusz',
        data: randomDate(365),
        aiVerified: true,
        status: 'approved',
        medal: getMedalForCatch(waga, 1, 3),
        miejsce: MIEJSCA[Math.floor(Math.random() * MIEJSCA.length)],
        isPublic: true,
        reactions: { '🔥': 0, '👏': 0, '😮': 0, '🎣': 0, '😂': 0 },
        _mock: true,
      });
    }
  }

  // Kolejne 10 ryb → po 1 połowie (Lv1, ~50 XP, żeby były odblokowane)
  for (let i = 10; i < 20; i++) {
    const fish = FISH_DEX[i];
    const waga = 0.5;
    const xp = Math.round(waga * fish.xpPerKg);
    catches.push({
      ryba: fish.nazwa,
      waga,
      xp,
      userId: uid,
      autor: 'Arkadiusz',
      data: randomDate(180),
      aiVerified: true,
      status: 'approved',
      medal: 'bronze',
      miejsce: MIEJSCA[Math.floor(Math.random() * MIEJSCA.length)],
      isPublic: true,
      reactions: { '🔥': 0, '👏': 0, '😮': 0, '🎣': 0, '😂': 0 },
      _mock: true,
    });
  }

  // Zapisz partiami (Firestore limit 500 na batch)
  const BATCH_SIZE = 400;
  for (let i = 0; i < catches.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const slice = catches.slice(i, i + BATCH_SIZE);
    for (const c of slice) {
      batch.set(db.collection(CATCHES_COLLECTION).doc(), c);
    }
    await batch.commit();
  }

  // Podsumowanie XP per gatunek
  const xpPerSpecies = {};
  for (const c of catches) {
    xpPerSpecies[c.ryba] = (xpPerSpecies[c.ryba] ?? 0) + c.xp;
  }

  console.log(`\n✓ Dodano ${catches.length} połowów\n`);
  console.log('XP per gatunek (progi rang):');
  for (const [ryba, xp] of Object.entries(xpPerSpecies).sort((a, b) => b[1] - a[1])) {
    const rank = FISH_RANKS.slice().reverse().find((r) => xp >= r.minXp);
    console.log(`  ${ryba.padEnd(22)} ${String(xp).padStart(8)} XP → Lv ${rank.level}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
