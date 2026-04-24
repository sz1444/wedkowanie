import { NextRequest, NextResponse } from 'next/server';
import { getDb, CATCHES_COLLECTION } from '@/lib/firebase-server';

const USERS_COLLECTION = 'artifacts/fishrank-universal/public/data/users';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const requestingUid = req.nextUrl.searchParams.get('uid');

  if (!requestingUid) {
    return NextResponse.json({ error: 'uid required.' }, { status: 400 });
  }

  const db = getDb();
  const catchRef = db.collection(CATCHES_COLLECTION).doc(id);
  const catchDoc = await catchRef.get();

  if (!catchDoc.exists) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }

  const catchData = catchDoc.data() as { userId?: string };

  // Allow if owner
  if (catchData.userId === requestingUid) {
    await catchRef.delete();
    return NextResponse.json({ deleted: true });
  }

  // Allow if admin
  const userDoc = await db.collection(USERS_COLLECTION).doc(requestingUid).get();
  if (userDoc.exists) {
    const userData = userDoc.data() as { role?: string; roles?: string[] };
    const roles = userData.roles ?? (userData.role ? [userData.role] : []);
    if (roles.includes('admin')) {
      await catchRef.delete();
      return NextResponse.json({ deleted: true });
    }
  }

  return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
}
