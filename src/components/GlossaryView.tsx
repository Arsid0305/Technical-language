import { useState, useMemo, useRef } from 'react'
import { Search, Loader2, Plus, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { WordDetailSheet } from '@/components/WordDetailSheet'
import { lookupWord } from '@/lib/wordService'
import type { GlossaryEntry } from '@/hooks/useProgress'

interface GlossaryViewProps {
  glossary: Record<string, GlossaryEntry>
  onAddWord: (word: string, entry: GlossaryEntry) => void
}

export function GlossaryView({ glossary, onAddWord }: GlossaryViewProps) {
  const [query, setQuery] = useState('')
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<GlossaryEntry | null>(null)
  const [isNewWord, setIsNewWord] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const entries = useMemo(() => {
    const q = query.toLowerCase().trim()
    return Object.entries(glossary)
      .filter(([word, { translation, explanation }]) =>
        !q || word.includes(q) || translation.toLowerCase().includes(q) || (explanation ?? '').toLowerCase().includes(q)
      )
      .sort(([a], [b]) => a.localeCompare(b))
  }, [glossary, query])

  const grouped = useMemo(() => {
    const map: Record<string, [string, GlossaryEntry][]> = {}
    for (const [word, entry] of entries) {
      const letter = word[0].toUpperCase()
      if (!map[letter]) map[letter] = []
      map[letter].push([word, entry])
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
  }, [entries])

  const total = Object.keys(glossary).length
  const noResults = query.trim().length > 1 && entries.length === 0

  function openWord(word: string, entry: GlossaryEntry, asNew = false) {
    setSelectedWord(word)
    setSelectedEntry(entry)
    setIsNewWord(asNew)
  }

  async function handleAiSearch() {
    const word = query.trim()
    if (!word) return
    setAiLoading(true)
    setAiError(null)
    try {
      const result = await lookupWord(word)
      openWord(result.word, {
        translation: result.translation,
        explanation: result.explanation,
        example: result.example,
      }, true)
    } catch {
      setAiError('Не удалось найти. Проверьте соединение.')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-reading text-2xl font-semibold text-foreground">Словарь</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {total === 0
            ? 'Слова появятся после первого урока'
            : `${total} ${wordForm(total)} в словаре`}
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          className="pl-9 pr-4"
          placeholder="Поиск слова..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setAiError(null) }}
          onKeyDown={(e) => { if (e.key === 'Enter' && noResults) handleAiSearch() }}
        />
      </div>

      {noResults && (
        <div className="text-center space-y-3 py-4">
          <p className="text-sm text-muted-foreground">
            «{query}» нет в вашем словаре
          </p>
          {aiError && <p className="text-xs text-destructive">{aiError}</p>}
          <Button
            onClick={handleAiSearch}
            disabled={aiLoading}
            variant="default"
            className="gap-2"
          >
            {aiLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Sparkles className="w-4 h-4" />}
            {aiLoading ? 'Ищу...' : 'Найти через AI'}
          </Button>
        </div>
      )}

      {!noResults && query.trim().length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground"
          disabled={aiLoading}
          onClick={handleAiSearch}
        >
          {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          Спросить AI про «{query}»
        </Button>
      )}

      <div className="space-y-6">
        {grouped.map(([letter, words]) => (
          <div key={letter}>
            <div className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2 pb-1 border-b border-border">
              {letter}
            </div>
            <div className="divide-y divide-border">
              {words.map(([word, entry]) => (
                <button
                  key={word}
                  className="w-full text-left py-3 px-1 hover:bg-muted/50 rounded-lg transition-colors -mx-1"
                  onClick={() => openWord(word, entry)}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-reading font-semibold text-foreground">{word}</span>
                    <span className="text-sm text-primary font-medium text-right shrink-0">{entry.translation}</span>
                  </div>
                  {entry.explanation && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{entry.explanation}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {total === 0 && !query && (
        <div className="text-center py-12 space-y-2">
          <p className="text-muted-foreground text-sm">Пройдите первый урок — слова появятся здесь</p>
          <p className="text-xs text-muted-foreground/60">Или найдите любое слово через поиск</p>
        </div>
      )}

      <WordDetailSheet
        word={selectedWord}
        entry={selectedEntry}
        onClose={() => { setSelectedWord(null); setSelectedEntry(null); setIsNewWord(false) }}
        onAdd={isNewWord ? (w, e) => { onAddWord(w, e); setQuery('') } : undefined}
      />
    </div>
  )
}

function wordForm(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'слово'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'слова'
  return 'слов'
}
