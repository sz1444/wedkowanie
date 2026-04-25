import { NextRequest, NextResponse } from 'next/server';
import { getDb, CATCHES_COLLECTION } from '@/lib/firebase-server';

const USERS_COLLECTION = 'artifacts/fishrank-universal/public/data/users';

export async function GET(req: NextRequest) {
  // Optional: ?admin=1&uid=<uid> — verified server-side against roles
  const url = req.nextUrl;
  const requestingUid = url.searchParams.get('uid') ?? null;
  const adminMode = url.searchParams.get('admin') === '1';

  try {
    const db = getDb();

    // Verify admin claim server-side when admin mode requested
    let isAdmin = false;
    if (adminMode && requestingUid) {
      const userDoc = await db.collection(USERS_COLLECTION).doc(requestingUid).get();
      if (userDoc.exists) {
        const d = userDoc.data() as { role?: string; roles?: string[] };
        const roles = d.roles ?? (d.role ? [d.role] : []);
        isAdmin = roles.includes('admin');
      }
    }

    const snap = await db.collection(CATCHES_COLLECTION).get();
    const allCatches = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Non-admins only see approved catches + their own pending
    const catches = isAdmin
      ? allCatches
      : allCatches.filter((c) => {
          const catch_ = c as { status?: string; userId?: string };
          if (catch_.status === 'approved') return true;
          if (catch_.status === 'pending' && requestingUid && catch_.userId === requestingUid) return true;
          // Legacy catches without status field — treat as approved
          if (!catch_.status) return true;
          return false;
        });

    const uids = [...new Set(catches.map((c) => (c as { userId?: string }).userId).filter(Boolean))] as string[];
    const nickMap: Record<string, string> = {};
    const bonusXpMap: Record<string, number> = {};
    const rolesByUid: Record<string, string[]> = {};
    if (uids.length > 0) {
      const userDocs = await Promise.all(uids.map((uid) => db.collection(USERS_COLLECTION).doc(uid).get()));
      for (const doc of userDocs) {
        if (doc.exists) {
          const data = doc.data() as { nick?: string; bonusXp?: number; role?: string; roles?: string[] };
          if (data.nick) nickMap[doc.id] = data.nick;
          if (data.bonusXp) bonusXpMap[doc.id] = data.bonusXp;
          rolesByUid[doc.id] = data.roles ?? (data.role ? [data.role] : []);
        }
      }
    }

    const enriched = catches.map((c) => {
      const catch_ = c as { userId?: string; autor?: string };
      const liveNick = catch_.userId ? nickMap[catch_.userId] : undefined;
      return { ...c, autor: liveNick ?? catch_.autor ?? 'Angler' };
    });

    const xpByUid: Record<string, number> = {};
    for (const c of catches) {
      const catch_ = c as { userId?: string; xp?: number; status?: string; aiVerified?: boolean };
      const counted = catch_.status === 'approved' || (!catch_.status && catch_.aiVerified === true);
      if (counted && catch_.userId) {
        xpByUid[catch_.userId] = (xpByUid[catch_.userId] ?? 0) + (catch_.xp ?? 0);
      }
    }
    for (const [uid, bonus] of Object.entries(bonusXpMap)) {
      xpByUid[uid] = (xpByUid[uid] ?? 0) + bonus;
    }

    return NextResponse.json({ catches: enriched, xpByUid, rolesByUid });
  } catch (err) {
    console.error('[catches GET]', err);
    return NextResponse.json({ error: 'Failed to fetch catches.' }, { status: 502 });
  }
}

function hammingDistance(a: string, b: string): number {
  if (a.length !== b.length || a.length === 0) return Infinity;
  let dist = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) dist++;
  return dist;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { ryba, waga, dlugoscCm, userId, autor, photo, photoHash } = body as Record<string, unknown>;

  if (typeof ryba !== 'string' || typeof userId !== 'string' || typeof autor !== 'string') {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const wagaNum = waga != null ? parseFloat(String(waga)) : NaN;
  const dlugoscNum = dlugoscCm != null ? parseFloat(String(dlugoscCm)) : NaN;
  const hasWaga = !isNaN(wagaNum) && wagaNum > 0 && wagaNum <= 300;
  const hasDlugosc = !isNaN(dlugoscNum) && dlugoscNum > 0 && dlugoscNum <= 500;

  if (!hasWaga && !hasDlugosc) {
    return NextResponse.json({ error: 'Podaj wagę (kg) lub długość (cm).' }, { status: 400 });
  }

  try {
    const db = getDb();

    // Duplicate photo detection
    if (typeof photoHash === 'string' && photoHash.length === 64) {
      const userCatches = await db.collection(CATCHES_COLLECTION).where('userId', '==', userId).select('photoHash').get();
      for (const doc of userCatches.docs) {
        const existingHash = (doc.data() as { photoHash?: string }).photoHash;
        if (existingHash && hammingDistance(photoHash, existingHash) <= 10) {
          return NextResponse.json({ error: 'To zdjęcie zostało już użyte w poprzednim połowie.' }, { status: 409 });
        }
      }
    }

    const ref = await db.collection(CATCHES_COLLECTION).add({
      ryba,
      ...(hasWaga ? { waga: wagaNum } : {}),
      ...(hasDlugosc ? { dlugoscCm: dlugoscNum } : {}),
      userId,
      autor,
      data: Date.now(),
      status: 'pending',
      medal: null,
      xp: 0,
      aiVerified: false,
      isPublic: true,
      ...(typeof photo === 'string' && photo ? { photo } : {}),
      ...(typeof photoHash === 'string' && photoHash.length === 64 ? { photoHash } : {}),
      reactions: { '🔥': 0, '👏': 0, '😮': 0, '🎣': 0, '😂': 0 },
    });

    return NextResponse.json({ id: ref.id, status: 'pending' }, { status: 201 });
  } catch (err) {
    console.error('[catches POST]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'unknown' }, { status: 502 });
  }
}
