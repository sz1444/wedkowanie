<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# FishRank — Opis Biznesowy Aplikacji

## Czym jest FishRank?

FishRank to progresywna aplikacja webowa (PWA) dla wędkarzy — społecznościowy dziennik połowów z elementami grywalizacji. Użytkownicy rejestrują swoje połowy, zdobywają XP, medale i awansują w rankingach. Aplikacja działa offline i jest instalowalna na telefonie.

## Użytkownicy

Docelowi użytkownicy to polscy wędkarze, amatorzy i zaawansowani. Aplikacja jest w pełni po polsku. Konto tworzy się przez email + hasło (Firebase Auth). Każdy użytkownik ma publiczny nick (min. 3 znaki, tylko litery/cyfry/_ i -).

## Główne funkcje

### 1. Dodawanie połowu (`AddCatchTab`)
Użytkownik wybiera gatunek ryby, podaje wagę (kg) i/lub długość (cm), miejsce połowu, opcjonalnie opis i zdjęcie. Każdy połów przechodzi weryfikację AI — oznaczenie `aiVerified: true` odblokuje XP i zapis do rankingów.

### 2. Feed społecznościowy
Lista połowów wszystkich użytkowników (publicznych). Karty połowów (`CatchCard`) pokazują: nick autora, gatunek, wagę/długość, medal, XP, datę, zdjęcie i emoji-reakcje. Użytkownicy mogą reagować na połowy innych (🔥 👏 😮 🎣 😂).

### 3. FishDex (`FishDexTab`)
Encyklopedia 31 gatunków ryb polskich wód. Każdy gatunek ma: opis, zdjęcie, progi wagowe/długościowe dla medali (brąz/srebro/złoto), wartość XP/kg i XP/cm, rzadkość (common/uncommon/rare/legendary), kategorię (drapieznik/biala/karpiowate/lososiowate/rzeczne). Po kliknięciu gatunku — `SpeciesDetail` z rankingiem najlepszych połowów i rekordem.

### 4. Grywalizacja i rankingi

**XP i poziomy globalne:**
- Każdy zweryfikowany połów przyznaje XP obliczane z wagi LUB długości (wyższe z dwóch) zgodnie ze stawką gatunku.
- System poziomów z progresją wykładniczą (startuje od 500 XP, x1.35 za każdy kolejny poziom).
- Tytuły globalne: Wędkarz → Znawca → Ekspert → Mistrz → Legenda.

**Rangi gatunkowe (`FishRanks`):**
- Oddzielny system rang dla każdego gatunku (Obserwator → Nowicjusz → Adept → Łowca → Tropiciel → Specjalista → Ekspert → Weteran → Mistrz → Żywa Legenda).
- Ranga per gatunek opiera się na XP zebranym wyłącznie z połowów tego gatunku.

**Medale połowów:**
- Brąz: każdy połów.
- Srebro: przekroczenie progu wagowego/długościowego dla gatunku.
- Złoto: przekroczenie wyższego progu — imponujące okazy.

**Ranking XP (`XpRanking`):** lista użytkowników posortowana po łącznym XP.
**Ranking gatunkowy (`SpeciesRanking`):** najlepsze połowy w danym gatunku.
**Podium (`RankingPodium`):** top 3 użytkowników widoczne na głównym ekranie profilu.

### 5. Profil użytkownika (`ProfileTab`)
Statystyki: liczba połowów, najlepszy okaz (kg), miejsce w rankingu, łączne XP, poziom z paskiem postępu. Galeria własnych połowów (`ProfileGallery`). Rekordy gatunkowe. Najwyższe rangi gatunkowe użytkownika.

### 6. Asystent AI (`ai` tab)
Osobna zakładka z asystentem wędkarskim opartym na Claude. Zna bazę wiedzy gatunków, okresy ochronne i kontekst aplikacji.

### 7. Panel administratora (`AdminTab`)
Widoczny tylko dla użytkowników z rolą `admin`. Pozwala na ręczną weryfikację połowów, zarządzanie użytkownikami i przyznawanie bonusowego XP.

## System weryfikacji AI

Połowy oznaczone `aiVerified: true` są jedynym źródłem XP i danych rankingowych. Połowy niezweryfikowane są widoczne w feedzie, ale nie wpływają na rankingi. Weryfikacja odbywa się prawdopodobnie przez analizę zdjęcia przez AI (endpoint API).

## Okresy ochronne

Aplikacja zna polskie okresy ochronne dla 9 gatunków (np. Szczupak 1.01–30.04). Funkcja `getFishingInfo()` filtruje aktywne gatunki z uwzględnieniem ochrony i aktualnej temperatury wody.

## Stack techniczny

- **Frontend:** Next.js (App Router) + TypeScript Strict + Tailwind CSS
- **Baza danych i auth:** Firebase (Firestore + Firebase Auth)
- **PWA:** Service Worker (`/public/sw.js`), manifest, ikony
- **AI:** Claude (asystent + weryfikacja zdjęć)
- **Hosting:** Vercel (zakładane)

## Struktura kodu

```
app/             — Next.js routes (page.tsx, layout.tsx, API routes)
components/
  sections/      — Duże sekcje UI (zakładki, ekrany)
  ui/            — Małe komponenty wielokrotnego użytku
lib/             — Logika biznesowa, typy, Firebase, hooks
public/          — Zdjęcia ryb, ikony, SW
scripts/         — Seed skrypty do Firebase
```

## Ważne konwencje

- Limit 150 linii na plik `.tsx`/`.ts` — przy przekroczeniu wymagany podział.
- Brak barrel files (`index.ts`) — importy bezpośrednie z pliku.
- SVG tylko w `/public` lub `@/components/icons` — zakaz inline.
- Logika biznesowa wyłącznie w `@/lib` lub Server Actions `@/actions`.
- `page.tsx` służy tylko do kompozycji.
- Przed kodowaniem: plan → akceptacja → implementacja → lint.
