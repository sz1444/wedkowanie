# Zasady Projektu: Next.js & Token Optimization

## Kontekst Technologiczny
- **Framework:** Next.js (App Router)
- **Język:** TypeScript (Strict Mode)
- **Stylizacja:** Tailwind CSS
- **Komponenty:** Radix UI / Shadcn UI

## Architektura i Tokeny
- **Limit 150 linii:** Bezwzględny limit na plik .tsx/.ts. Przekroczenie = refaktoryzacja i podział.
- **SVG:** Zakaz inline <svg>. Tylko `/public` lub dedykowane komponenty w `@/components/icons`.
- **Logic Separation:** Logika biznesowa wyłącznie w `@/lib` lub Server Actions `@/actions`. `page.tsx` służy tylko do kompozycji.
- **Zero "Barrel Files":** Importuj bezpośrednio z pliku, nie z `index.ts`.

## Wytyczne Kodowania
- **Zasada DRY:** Maksymalna reużywalność, by nie powielać kodu w kontekście.
- **Zwięzłość:** Usuwaj martwy kod i nadmiarowe komentarze. Kod ma być czytelny przez strukturę, nie opisy.
- **Typowanie:** Unikaj `any`. Precyzyjne typy pomagają AI unikać halucynacji.

## Workflow Agenta
1. **Analiza:** Przed edycją sprawdź rozmiar pliku. Jeśli ma >150 linii, Twoim pierwszym zadaniem jest podział.
2. **Planowanie:** Przed kodowaniem przedstaw plan zmian w punktach. Czekaj na moją akceptację (zatwierdzenie planu).
3. **Weryfikacja:** Po zmianach uruchom linter, aby upewnić się, że kod jest czysty.

## Komendy Projektowe
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Dev:** `npm run dev`