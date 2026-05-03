import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { BookMarked, Loader2, Trash2 } from 'lucide-react'
import { lookupWord } from '@/lib/wordService'
import type { GlossaryEntry } from '@/hooks/useProgress'

interface WordDetailSheetProps {
  word: string | null
  entry: GlossaryEntry | null
  onClose: () => void
  onAdd?: (word: string, entry: GlossaryEntry) => void
  onEnrich?: (word: string, entry: GlossaryEntry) => void
  onDelete?: (word: string) => void
}

export function WordDetailSheet({ word, entry, onClose, onAdd, onEnrich, onDelete }: WordDetailSheetProps) {
  const [enriched, setEnriched] = useState<GlossaryEntry | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!word || !entry) { setEnriched(null); return }
    const needsFetch = !entry.explanation && !entry.explanationRu
    if (!needsFetch) { setEnriched(null); return }

    setLoading(true)
    lookupWord(word)
      .then((result) => {
        const filled: GlossaryEntry = {
          ...entry,
          explanation: result.explanation,
          explanationRu: result.explanationRu,
          example: entry.example ?? result.example,
          exampleRu: entry.exampleRu ?? result.exampleRu,
        }
        setEnriched(filled)
        onEnrich?.(word, filled)
      })
      .catch(() => setEnriched(entry))
      .finally(() => setLoading(false))
  }, [word])

  if (!word || !entry) return null

  const display = enriched ?? entry

  function handleClose() {
    onClose()
    setEnriched(null)
  }

  return (
    <Dialog open={!!word} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent className="max-w-sm w-[92vw] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-reading text-xl font-semibold text-left">{word}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <p className="text-primary font-semibold text-base">{display.translation}</p>

          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Загружаем расшифровку...</span>
            </div>
          )}

          {!loading && (display.explanation || display.explanationRu) && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Расшифровка</p>
              {display.explanation && (
                <p className="text-sm text-foreground leading-relaxed">{display.explanation}</p>
              )}
              {display.explanationRu && (
                <p className="text-sm text-muted-foreground leading-relaxed italic">{display.explanationRu}</p>
              )}
            </div>
          )}

          {!loading && display.example && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Пример</p>
              <code className="block text-sm bg-muted rounded-lg px-3 py-2 font-mono text-foreground leading-relaxed">
                {display.example}
              </code>
              {display.exampleRu && (
                <p className="text-xs text-muted-foreground italic pl-1">{display.exampleRu}</p>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            {onAdd && (
              <Button className="flex-1" onClick={() => { onAdd(word, display); handleClose() }}>
                <BookMarked className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => { onDelete(word); handleClose() }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
