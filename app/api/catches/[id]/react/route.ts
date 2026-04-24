import { NextRequest, NextResponse } from 'next/server';
import { getDb, CATCHES_COLLECTION } from '@/lib/firebase-server';
import { REACTION_EMOJIS } from '@/lib/fishing-data';
import type { Reactions } from '@/lib/fishing-data';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body.' }, { status: 400 });
  }

  const { emoji, userId } = body as { emoji?: unknown; userId?: unknown };

  if (typeof emoji !== 'string' || !REACTION_EMOJIS.includes(emoji as keyof Reactions)) {
    return NextResponse.json({ error: 'Invalid emoji.' }, { status: 400 });
  }
  if (typeof userId !== 'string' || !userId) {
    return NextResponse.json({ error: 'Missing userId.' }, { status: 400 });
  }

  try {
    const db = getDb();
    const ref = db.collection(CATCHES_COLLECTION).doc(id);

    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    const data = snap.data() ?? {};
    const reactedBy: Record<string, string> = data.reactedBy ?? {};
    const prevEmoji = reactedBy[userId] as keyof Reactions | undefined;

    if (prevEmoji === emoji) {
      // Cofnięcie tej samej reakcji
      await ref.update({
        [`reactions.${emoji}`]: FieldValue.increment(-1),
        [`reactedBy.${userId}`]: FieldValue.delete(),
      });
      return NextResponse.json({ action: 'removed', emoji });
    }

    const update: Record<string, unknown> = {
      [`reactions.${emoji}`]: FieldValue.increment(1),
      [`reactedBy.${userId}`]: emoji,
    };

    if (prevEmoji) {
      update[`reactions.${prevEmoji}`] = FieldValue.increment(-1);
    }

    await ref.update(update);
    return NextResponse.json({ action: prevEmoji ? 'changed' : 'added', emoji, prev: prevEmoji ?? null });
  } catch (err) {
    console.error('[react POST]', err);
    return NextResponse.json({ error: 'Failed to save reaction.' }, { status: 502 });
  }
}
