import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ verified: false, reason: 'Weryfikacja AI niedostępna.' }, { status: 200 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body.' }, { status: 400 });
  }

  const { photo, ryba, waga } = body as Record<string, unknown>;

  if (typeof photo !== 'string' || !photo.startsWith('data:image/')) {
    return NextResponse.json({ error: 'Brak zdjęcia.' }, { status: 400 });
  }

  const [header, base64Data] = photo.split(',');
  const mimeMatch = header.match(/data:([^;]+);/);
  const mimeType = mimeMatch?.[1] ?? 'image/jpeg';

  const prompt = `Jesteś sędzią zawodów wędkarskich w Polsce. Twoim zadaniem jest weryfikacja autentyczności połowu.

Użytkownik deklaruje:
- Gatunek: ${ryba}
- Waga: ${waga} kg

Przeanalizuj zdjęcie i odpowiedz TYLKO w formacie JSON:
{
  "verified": true/false,
  "confidence": 0-100,
  "reason": "krótkie zdanie po polsku (max 20 słów)",
  "fishVisible": true/false,
  "scaleVisible": true/false,
  "manipulated": true/false,
  "manipulationReason": "krótkie zdanie po polsku lub null"
}

Zatwierdź (verified: true) TYLKO jeśli WSZYSTKIE warunki są spełnione:
1. Na zdjęciu widoczna jest prawdziwa, fizyczna ryba (nie grafika, nie zdjęcie ekranu, nie AI-generated)
2. Gatunek jest wiarygodny i odpowiada deklarowanemu
3. Waga jest realistyczna dla tego gatunku i rozmiaru widocznego na zdjęciu
4. Widoczna jest waga jako dowód pomiaru
5. Zdjęcie wygląda na autentyczne — brak śladów cyfrowej manipulacji

Ustaw manipulated: true jeśli zauważysz:
- Ryba wklejona cyfrowo na inne tło (niespójne oświetlenie, cienie, obramowanie)
- Artefakty edycji graficznej (Photoshop, AI inpainting)
- Zdjęcie innego zdjęcia lub ekranu (ramka ekranu, refleksy, pikselizacja)
- Waga wyglądająca na dodaną cyfrowo
- Obraz wygenerowany przez AI (nienaturalna tekstura skóry ryby, zbyt idealne tło)

Jeśli manipulated: true, ustaw verified: false.
Jeśli brak dowodu wagowego, ustaw verified: false.`;

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: base64Data } },
          ],
        }],
        generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 256 },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('[verify] Gemini error:', errText);
      return NextResponse.json({ verified: false, reason: 'Błąd weryfikacji AI.' }, { status: 200 });
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';

    let parsed: { verified?: boolean; confidence?: number; reason?: string; fishVisible?: boolean; scaleVisible?: boolean; manipulated?: boolean; manipulationReason?: string | null } = {};
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return NextResponse.json({ verified: false, reason: 'Nie udało się odczytać odpowiedzi AI.' }, { status: 200 });
    }

    const manipulated = parsed.manipulated === true;
    return NextResponse.json({
      verified: parsed.verified === true && !manipulated,
      confidence: parsed.confidence ?? 0,
      reason: manipulated
        ? (parsed.manipulationReason ?? 'Zdjęcie wygląda na zmanipulowane.')
        : (parsed.reason ?? ''),
      fishVisible: parsed.fishVisible ?? false,
      scaleVisible: parsed.scaleVisible ?? false,
      manipulated,
    });
  } catch (err) {
    console.error('[verify]', err);
    return NextResponse.json({ verified: false, reason: 'Błąd połączenia z AI.' }, { status: 200 });
  }
}
