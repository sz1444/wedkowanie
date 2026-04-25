export type FishRankColor = {
  bg: string;
  text: string;
  border: string;
  progressBar: string;
};

export type FishRank = {
  level: number;
  title: string;
  minXp: number;
  description: string;
  color: FishRankColor;
};

export const FISH_RANKS: FishRank[] = [
  { level: 1,  title: 'Obserwator',   minXp: 0,       description: 'Dopiero zaczynasz interesować się tym gatunkiem.',           color: { bg: 'bg-slate-100',    text: 'text-slate-500',   border: 'border-slate-200',   progressBar: 'bg-slate-400'    } },
  { level: 2,  title: 'Nowicjusz',    minXp: 200,     description: 'Masz już za sobą pierwsze udane hole.',                      color: { bg: 'bg-sky-50',       text: 'text-sky-600',     border: 'border-sky-200',     progressBar: 'bg-sky-400'      } },
  { level: 3,  title: 'Adept',        minXp: 600,     description: 'Rozumiesz podstawy żerowania i doboru przynęty.',            color: { bg: 'bg-teal-50',      text: 'text-teal-600',    border: 'border-teal-200',    progressBar: 'bg-teal-400'     } },
  { level: 4,  title: 'Łowca',        minXp: 2000,    description: 'Regularnie wyciągasz ten gatunek z wody.',                   color: { bg: 'bg-emerald-50',   text: 'text-emerald-700', border: 'border-emerald-200', progressBar: 'bg-emerald-500'  } },
  { level: 5,  title: 'Tropiciel',    minXp: 8500,    description: 'Potrafisz samodzielnie znaleźć rybę na nowym łowisku.',      color: { bg: 'bg-lime-50',      text: 'text-lime-700',    border: 'border-lime-200',    progressBar: 'bg-lime-500'     } },
  { level: 6,  title: 'Specjalista',  minXp: 17000,   description: 'Twoja skuteczność jest wysoka nawet w trudnych warunkach.',  color: { bg: 'bg-violet-50',    text: 'text-violet-600',  border: 'border-violet-200',  progressBar: 'bg-violet-500'   } },
  { level: 7,  title: 'Ekspert',      minXp: 40000,   description: 'Masz na koncie przynajmniej jeden medalowy okaz (fotka).',   color: { bg: 'bg-purple-50',    text: 'text-purple-700',  border: 'border-purple-200',  progressBar: 'bg-purple-500'   } },
  { level: 8,  title: 'Weteran',      minXp: 70000,   description: 'Poświęciłeś setki godzin na ten konkretny gatunek.',        color: { bg: 'bg-orange-50',    text: 'text-orange-600',  border: 'border-orange-200',  progressBar: 'bg-orange-500'   } },
  { level: 9,  title: 'Mistrz',       minXp: 200000,  description: 'Jesteś lokalnym autorytetem, a Twoje rady są bezcenne.',    color: { bg: 'bg-amber-50',     text: 'text-amber-600',   border: 'border-amber-300',   progressBar: 'bg-amber-500'    } },
  { level: 10, title: 'Żywa Legenda', minXp: 600000,  description: 'Status osiągalny tylko przez najbardziej wytrwałych.',      color: { bg: 'bg-yellow-50',    text: 'text-yellow-600',  border: 'border-yellow-400',  progressBar: 'bg-yellow-400'   } },
];

// Odmiana nazw ryb przez dopełniacz (Adept + czego?) i biernik (Łowca + czego?)
const FISH_GENITIVE: Record<string, string> = {
  'Szczupak':          'Szczupaka',
  'Sandacz':           'Sandacza',
  'Sum':               'Suma',
  'Okoń':              'Okonia',
  'Boleń':             'Bolenia',
  'Węgorz':            'Węgorza',
  'Miętus':            'Miętusa',
  'Karp':              'Karpia',
  'Leszcz':            'Leszcza',
  'Lin':               'Lina',
  'Płoć':              'Płoci',
  'Wzdręga':           'Wzdręgi',
  'Karaś złocisty':    'Karasia Złocistego',
  'Karaś srebrzysty':  'Karasia Srebrzystego',
  'Amur':              'Amura',
  'Tołpyga':           'Tołpygi',
  'Krąp':              'Krąpia',
  'Ukleja':            'Uklejki',
  'Certa':             'Certy',
  'Jaź':               'Jazia',
  'Kleń':              'Klenia',
  'Pstrąg potokowy':   'Pstrąga Potokowego',
  'Pstrąg tęczowy':    'Pstrąga Tęczowego',
  'Lipień':            'Lipienia',
  'Głowacica':         'Głowacicy',
  'Brzana':            'Brzany',
  'Świnka':            'Świnki',
  'Kiełb':             'Kiełbia',
  'Jazgarz':           'Jazgarza',
  'Słonecznica':       'Słonecznicy',
  'Różanka':           'Różanki',
};

export function getFishRankTitle(title: string, ryba: string): string {
  const genitive = FISH_GENITIVE[ryba] ?? ryba;
  return `${title} ${genitive}`;
}

export function getFishRank(xp: number): FishRank {
  let rank = FISH_RANKS[0];
  for (const r of FISH_RANKS) {
    if (xp >= r.minXp) rank = r;
  }
  return rank;
}

export function getFishRankProgress(xp: number): {
  rank: FishRank;
  next: FishRank | null;
  currentXp: number;
  nextXp: number;
  progress: number;
} {
  const rank = getFishRank(xp);
  const nextRank = FISH_RANKS.find((r) => r.level === rank.level + 1) ?? null;
  const currentXp = xp - rank.minXp;
  const nextXp = nextRank ? nextRank.minXp - rank.minXp : 0;
  const progress = nextRank ? Math.min(100, Math.round((currentXp / nextXp) * 100)) : 100;
  return { rank, next: nextRank, currentXp, nextXp, progress };
}

export function getFishXpFromCatches(ryba: string, catches: { ryba: string; xp?: number; aiVerified?: boolean }[]): number {
  return catches
    .filter((c) => c.ryba === ryba && c.aiVerified === true)
    .reduce((sum, c) => sum + (c.xp ?? 0), 0);
}

export function getAllFishRanksSorted(catches: { ryba: string; xp?: number; aiVerified?: boolean }[]): { rank: FishRank; ryba: string }[] {
  const species = [...new Set(catches.filter((c) => c.aiVerified).map((c) => c.ryba))];
  return species
    .map((ryba) => ({ rank: getFishRank(getFishXpFromCatches(ryba, catches)), ryba }))
    .sort((a, b) => b.rank.level - a.rank.level || getFishXpFromCatches(b.ryba, catches) - getFishXpFromCatches(a.ryba, catches));
}

export function getBestFishRank(catches: { ryba: string; xp?: number; aiVerified?: boolean }[]): { rank: FishRank; ryba: string } | null {
  const species = [...new Set(catches.filter((c) => c.aiVerified).map((c) => c.ryba))];
  if (species.length === 0) return null;
  let best: { rank: FishRank; ryba: string } | null = null;
  for (const ryba of species) {
    const xp = getFishXpFromCatches(ryba, catches);
    const rank = getFishRank(xp);
    if (!best || rank.level > best.rank.level || (rank.level === best.rank.level && xp > getFishXpFromCatches(best.ryba, catches))) {
      best = { rank, ryba };
    }
  }
  return best;
}
