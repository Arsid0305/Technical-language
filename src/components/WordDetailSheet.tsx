import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { BookMarked, X } from 'lucide-react'
import type { GlossaryEntry } from '@/hooks/useProgress'

interface WordDetailSheetProps {
  word: string | null
  entry: GlossaryEntry | null
  onClose: () => void
  onAdd?: (word: string, entry: GlossaryEntry) => void
}

export function WordDetailSheet({ word, entry, onClose, onAdd }: WordDetailSheetProps) {
  if (!word || !entry) return null

  return (
    <Dialog open={!!word} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-sm w-[92vw] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-reading text-xl font-semibold text-left">
            {word}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <p className="text-primary font-semibold text-base">{entry.translation}</p>

          {entry.explanation && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Расшифровка
              </p>
              <p className="text-sm text-foreground leading-relaxed">{entry.explanation}</p>
            </div>
          )}

          {entry.example && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Пример
              </p>
              <code className="block text-sm bg-muted rounded-lg px-3 py-2 font-mono text-foreground leading-relaxed">
                {entry.example}
              </code>
            </div>
          )}

          {onAdd && (
            <Button
              className="w-full mt-2"
              onClick={() => { onAdd(word, entry); onClose() }}
            >
              <BookMarked className="w-4 h-4 mr-2" />
              Добавить в словарь
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
