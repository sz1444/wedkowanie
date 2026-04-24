import { NextRequest, NextResponse } from 'next/server';
import { getDb, CATCHES_COLLECTION } from '@/lib/firebase-server';
import { getMedalForCatch, getXpForCatch } from '@/lib/fishing-data';

const USERS_COLLECTION = 'artifacts/fishrank-universal/public/data/users';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body.' }, { status: 400 });
  }

  const { adminUid, action } = body as Record<string, unknown>;

  if (typeof adminUid !== 'string') {
    return NextResponse.json({ error: 'adminUid required.' }, { status: 400 });
  }

  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ error: 'action must be approve or reject.' }, { status: 400 });
  }

  const db = getDb();

  // Verify admin role server-side
  const adminDoc = await db.collection(USERS_COLLECTION).doc(adminUid).get();
  if (!adminDoc.exists) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }
  const adminData = adminDoc.data() as { role?: string; roles?: string[] };
  const adminRoles = adminData.roles ?? (adminData.role ? [adminData.role] : []);
  if (!adminRoles.includes('admin')) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const { id } = await params;
  const catchRef = db.collection(CATCHES_COLLECTION).doc(id);
  const catchDoc = await catchRef.get();

  if (!catchDoc.exists) {
    return NextResponse.json({ error: 'Catch not found.' }, { status: 404 });
  }

  if (action === 'reject') {
    await catchRef.update({ status: 'rejected', reviewedBy: adminUid, reviewedAt: Date.now() });
    return NextResponse.json({ status: 'rejected' });
  }

  // Approve: calculate medal and XP now
  const data = catchDoc.data() as { ryba?: string; waga?: number };
  const ryba = data.ryba ?? '';
  const waga = data.waga ?? 0;
  const medal = getMedalForCatch(ryba, waga);
  const xp = getXpForCatch(ryba, waga);

  await catchRef.update({
    status: 'approved',
    aiVerified: true,
    medal,
    xp,
    reviewedBy: adminUid,
    reviewedAt: Date.now(),
  });

  return NextResponse.json({ status: 'approved', medal, xp });
}
