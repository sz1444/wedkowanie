import { NextRequest, NextResponse } from 'next/server';

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI service not configured.' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { message } = body as { message?: unknown };

  if (typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
  }

  // Hard limit — zapobiega kosztownym/abuzywnym zapytaniom
  if (message.length > 1000) {
    return NextResponse.json({ error: 'Message too long.' }, { status: 400 });
  }

  const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: message }] }],
      systemInstruction: {
        parts: [{ text: 'Jesteś ekspertem wędkarskim FishRank. Odpowiadasz profesjonalnie, zwięźle i z pasją po polsku.' }],
      },
    }),
  });

  if (!geminiRes.ok) {
    return NextResponse.json({ error: 'AI service error.' }, { status: 502 });
  }

  const data = await geminiRes.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Problem z siecią znad wody.';

  return NextResponse.json({ text });
}
