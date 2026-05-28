import { useEffect, useState, useCallback } from 'react';
import { Plus, Check } from 'lucide-react';

interface TranslationPopupProps {
  vocabulary: { word: string; translation: string }[];
  onAddToGlossary?: (words: { word: string; translation: string }[]) => void;
}

interface PopupState {
  visible: boolean;
  text: string;
  translation: string;
  x: number;
  y: number;
}

// Simple dictionary for common words
const commonTranslations: Record<string, string> = {
  'the': 'определённый артикль',
  'a': 'неопределённый артикль',
  'an': 'неопределённый артикль',
  'is': 'есть, является',
  'are': 'есть, являются',
  'was': 'был, была',
  'were': 'были',
  'be': 'быть',
  'been': 'был (причастие)',
  'being': 'будучи',
  'have': 'иметь',
  'has': 'имеет',
  'had': 'имел',
  'do': 'делать',
  'does': 'делает',
  'did': 'делал',
  'will': 'будет (будущее время)',
  'would': 'бы (условное)',
  'could': 'мог бы',
  'should': 'должен бы',
  'might': 'мог бы (возможность)',
  'must': 'должен',
  'can': 'могу, может',
  'not': 'не',
  'no': 'нет',
  'yes': 'да',
  'and': 'и',
  'or': 'или',
  'but': 'но',
  'if': 'если',
  'then': 'тогда, затем',
  'else': 'иначе',
  'when': 'когда',
  'where': 'где',
  'what': 'что',
  'which': 'который',
  'who': 'кто',
  'how': 'как',
  'why': 'почему',
  'this': 'это, этот',
  'that': 'тот, что',
  'these': 'эти',
  'those': 'те',
  'it': 'это, оно',
  'they': 'они',
  'we': 'мы',
  'you': 'ты, вы',
  'I': 'я',
  'he': 'он',
  'she': 'она',
  'in': 'в',
  'on': 'на',
  'at': 'в, у',
  'to': 'к, в (направление)',
  'from': 'от, из',
  'with': 'с',
  'by': 'путём, от',
  'for': 'для, за',
  'of': 'из, (родительный падеж)',
  'about': 'о, около',
  'into': 'в (внутрь)',
  'through': 'через',
  'after': 'после',
  'before': 'до, перед',
  'between': 'между',
  'under': 'под',
  'over': 'над, через',
  'each': 'каждый',
  'every': 'каждый, всякий',
  'some': 'некоторые, какие-то',
  'any': 'любой, какой-либо',
  'all': 'все, всё',
  'most': 'большинство, наиболее',
  'other': 'другой',
  'only': 'только',
  'also': 'также',
  'just': 'просто, только что',
  'more': 'больше, более',
  'less': 'меньше, менее',
  'very': 'очень',
  'so': 'так, поэтому',
  'too': 'тоже, слишком',
  'as': 'как, в качестве',
  'than': 'чем (сравнение)',
  'because': 'потому что',
  'however': 'однако',
  'although': 'хотя',
  'while': 'пока, в то время как',
  'since': 'с тех пор, поскольку',
  'until': 'до тех пор пока',
  'unless': 'если не',
  'instead': 'вместо',
  'perhaps': 'возможно',
  'maybe': 'может быть',
  'probably': 'вероятно',
  'actually': 'на самом деле',
  'really': 'действительно',
  'always': 'всегда',
  'never': 'никогда',
  'often': 'часто',
  'sometimes': 'иногда',
  'usually': 'обычно',
  'again': 'снова',
  'still': 'всё ещё',
  'already': 'уже',
  'yet': 'ещё (в вопросах/отрицаниях)',
  'now': 'сейчас',
  'here': 'здесь',
  'there': 'там',
  'first': 'первый, сначала',
  'last': 'последний',
  'next': 'следующий',
  'new': 'новый',
  'old': 'старый',
  'good': 'хороший',
  'bad': 'плохой',
  'same': 'тот же, такой же',
  'different': 'разный, отличающийся',
  'small': 'маленький',
  'large': 'большой',
  'long': 'длинный, долгий',
  'short': 'короткий',
  'high': 'высокий',
  'low': 'низкий',
  'right': 'правильный, правый',
  'wrong': 'неправильный',
  'true': 'правда, истинный',
  'false': 'ложь, ложный',
  'possible': 'возможный',
  'impossible': 'невозможный',
  'important': 'важный',
  'necessary': 'необходимый',
  'available': 'доступный',
  'specific': 'конкретный, определённый',
  'clear': 'ясный, чёткий',
  'simple': 'простой',
  'complex': 'сложный',
  'common': 'общий, распространённый',
  'useful': 'полезный',
  'best': 'лучший',
  'better': 'лучше',
  'such': 'такой',
  'own': 'собственный',
  'make': 'делать, создавать',
  'get': 'получить, стать',
  'take': 'взять, занять',
  'give': 'дать',
  'use': 'использовать',
  'find': 'найти',
  'know': 'знать',
  'think': 'думать',
  'see': 'видеть',
  'come': 'прийти',
  'go': 'идти',
  'want': 'хотеть',
  'need': 'нуждаться',
  'try': 'пытаться',
  'work': 'работать',
  'call': 'звонить, называть',
  'help': 'помогать',
  'keep': 'держать, сохранять',
  'let': 'позволять',
  'start': 'начинать',
  'end': 'заканчивать, конец',
  'show': 'показывать',
  'tell': 'сказать, рассказать',
  'ask': 'спрашивать',
  'run': 'бежать, запускать',
  'read': 'читать',
  'write': 'писать',
  'return': 'возвращать, вернуть',
  'contains': 'содержит',
  'value': 'значение',
  'function': 'функция',
  'system': 'система',
  'error': 'ошибка',
  'code': 'код',
  'data': 'данные',
  'file': 'файл',
  'process': 'процесс, обрабатывать',
  'example': 'пример',
  'result': 'результат',
  'output': 'вывод, выход',
  'input': 'ввод, вход',
  'request': 'запрос',
  'response': 'ответ',
  'message': 'сообщение',
  'user': 'пользователь',
  'something': 'что-то',
  'anything': 'что-нибудь',
  'nothing': 'ничего',
  'everything': 'всё',
  'someone': 'кто-то',
  'anyone': 'кто-нибудь',
  'words': 'слова',
  'word': 'слово',
  'way': 'способ, путь',
  'like': 'как, нравиться',
  'even': 'даже',
  'both': 'оба',
  'either': 'либо, любой из двух',
  'neither': 'ни тот, ни другой',
  'another': 'другой, ещё один',
};

export function TranslationPopup({ vocabulary, onAddToGlossary }: TranslationPopupProps) {
  const [popup, setPopup] = useState<PopupState>({
    visible: false,
    text: '',
    translation: '',
    x: 0,
    y: 0,
  });
  const [added, setAdded] = useState(false);

  const findTranslation = useCallback((text: string): string | null => {
    const normalizedText = text.toLowerCase().trim();
    
    // Check vocabulary first — exact match or whole-word boundary match
    const vocabMatch = vocabulary.find((v) => {
      const vw = v.word.toLowerCase()
      if (vw === normalizedText) return true
      const escaped = vw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      return new RegExp(`\\b${escaped}\\b`).test(normalizedText)
    })
    if (vocabMatch) return vocabMatch.translation;
    
    // Check common translations
    if (commonTranslations[normalizedText]) {
      return commonTranslations[normalizedText];
    }
    
    // Check without 's' (simple plural/verb form)
    if (normalizedText.endsWith('s') && commonTranslations[normalizedText.slice(0, -1)]) {
      return commonTranslations[normalizedText.slice(0, -1)] + ' (форма)';
    }
    
    // Check without 'ed' (past tense)
    if (normalizedText.endsWith('ed')) {
      const base = normalizedText.slice(0, -2);
      if (commonTranslations[base]) {
        return commonTranslations[base] + ' (прошедшее время)';
      }
      const baseD = normalizedText.slice(0, -1);
      if (commonTranslations[baseD]) {
        return commonTranslations[baseD] + ' (прошедшее время)';
      }
    }
    
    // Check without 'ing'
    if (normalizedText.endsWith('ing')) {
      const base = normalizedText.slice(0, -3);
      if (commonTranslations[base]) {
        return commonTranslations[base] + ' (-ing форма)';
      }
      const baseE = base + 'e';
      if (commonTranslations[baseE]) {
        return commonTranslations[baseE] + ' (-ing форма)';
      }
    }
    
    return null;
  }, [vocabulary]);

  useEffect(() => {
    const showPopupForSelection = () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();

      if (!selectedText || selectedText.length > 50 || selectedText.split(' ').length > 5) {
        setPopup((prev) => ({ ...prev, visible: false }));
        return;
      }

      const translation = findTranslation(selectedText);
      if (translation) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        if (rect) {
          setAdded(false);
          setPopup({
            visible: true,
            text: selectedText,
            translation,
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
          });
        }
      } else {
        setPopup((prev) => ({ ...prev, visible: false }));
      }
    };

    const handleMouseUp = () => showPopupForSelection();

    // On touch, selection finalises slightly after touchend fires
    const handleTouchEnd = () => setTimeout(showPopupForSelection, 100);

    const handleStart = () => setPopup((prev) => ({ ...prev, visible: false }));

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('mousedown', handleStart);
    document.addEventListener('touchstart', handleStart);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mousedown', handleStart);
      document.removeEventListener('touchstart', handleStart);
    };
  }, [findTranslation]);

  const handleAdd = () => {
    if (!onAddToGlossary) return;
    onAddToGlossary([{ word: popup.text, translation: popup.translation }]);
    setAdded(true);
    setTimeout(() => setPopup((prev) => ({ ...prev, visible: false })), 800);
  };

  if (!popup.visible) return null;

  return (
    <div
      className="fixed z-50 transform -translate-x-1/2 -translate-y-full animate-fade-in"
      style={{ left: popup.x, top: popup.y }}
    >
      <div className="bg-popover border border-border rounded-lg shadow-lg px-3 py-2 max-w-xs flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{popup.text}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{popup.translation}</p>
        </div>
        {onAddToGlossary && (
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleAdd}
            className="shrink-0 flex items-center justify-center w-7 h-7 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            title="Добавить в словарь"
          >
            {added ? <Check className="w-4 h-4 text-green-600" /> : <Plus className="w-4 h-4" />}
          </button>
        )}
      </div>
      <div
        className="w-2 h-2 bg-popover border-r border-b border-border transform rotate-45 mx-auto -mt-1"
      />
    </div>
  );
}
