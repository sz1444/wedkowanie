import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-server';

const USERS_COLLECTION = 'artifacts/fishrank-universal/public/data/users';

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get('uid');
  if (!uid) return NextResponse.json({ error: 'uid required' }, { status: 400 });
  try {
    const db = getDb();
    const doc = await db.collection(USERS_COLLECTION).doc(uid).get();
    if (!doc.exists) return NextResponse.json({ nick: null, role: null, bonusXp: 0 });
    const data = doc.data() as { nick?: string; role?: string; roles?: string[]; bonusXp?: number };
    // support both legacy `role` string and new `roles` array
    const roles: string[] = data.roles ?? (data.role ? [data.role] : []);
    return NextResponse.json({ nick: data.nick ?? null, roles, bonusXp: data.bonusXp ?? 0 });
  } catch (err) {
    console.error('[user GET]', err);
    return NextResponse.json({ error: 'Failed to fetch user.' }, { status: 502 });
  }
}

export async function PATCH(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid body.' }, { status: 400 });
  }
  const { uid, nick } = body as Record<string, unknown>;
  if (typeof uid !== 'string' || typeof nick !== 'string') {
    return NextResponse.json({ error: 'uid and nick required.' }, { status: 400 });
  }
  const trimmed = nick.trim().slice(0, 30);
  if (trimmed.length < 3) {
    return NextResponse.json({ error: 'Nick musi mieć minimum 3 znaki.' }, { status: 400 });
  }
  if (!/^[a-zA-Z0-9_\-ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/.test(trimmed)) {
    return NextResponse.json({ error: 'Nick może zawierać tylko litery, cyfry, _ i -.' }, { status: 400 });
  }
  try {
    const db = getDb();
    await db.collection(USERS_COLLECTION).doc(uid).set({ nick: trimmed }, { merge: true });
    return NextResponse.json({ nick: trimmed });
  } catch (err) {
    console.error('[user PATCH]', err);
    return NextResponse.json({ error: 'Failed to save nick.' }, { status: 502 });
  }
}
