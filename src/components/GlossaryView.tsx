import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { GlossaryEntry } from '@/hooks/useProgress';

interface GlossaryViewProps {
  glossary: Record<string, GlossaryEntry>;
}

export function GlossaryView({ glossary }: GlossaryViewProps) {
  const [query, setQuery] = useState('');

  const entries = useMemo(() => {
    const q = query.toLowerCase().trim();
    return Object.entries(glossary)
      .filter(([word, { translation, explanation }]) =>
        !q ||
        word.includes(q) ||
        translation.toLowerCase().includes(q) ||
        (explanation ?? '').toLowerCase().includes(q)
      )
      .sort(([a], [b]) => a.localeCompare(b));
  }, [glossary, query]);

  const grouped = useMemo(() => {
    const map: Record<string, [string, GlossaryEntry][]> = {};
    for (const [word, entry] of entries) {
      const letter = word[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push([word, entry]);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [entries]);

  const total = Object.keys(glossary).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-reading text-2xl font-semibold text-foreground">Словарь</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {total === 0
            ? 'Слова появятся после первого урока'
            : `${total} ${wordForm(total)} из пройденных уроков`}
        </p>
      </div>

      {total > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Поиск на английском или русском..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      {entries.length === 0 && query && (
        <p className="text-center text-muted-foreground py-8">Ничего не найдено</p>
      )}

      <div className="space-y-6">
        {grouped.map(([letter, words]) => (
          <div key={letter}>
            <div className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2 pb-1 border-b border-border">
              {letter}
            </div>
            <div className="space-y-4">
              {words.map(([word, { translation, explanation }]) => (
                <div key={word} className="space-y-0.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-reading font-semibold text-foreground">{word}</span>
                    <span className="text-sm text-primary font-medium text-right shrink-0">{translation}</span>
                  </div>
                  {explanation && (
                    <p className="text-sm text-muted-foreground leading-snug">{explanation}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function wordForm(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'слово';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'слова';
  return 'слов';
}
