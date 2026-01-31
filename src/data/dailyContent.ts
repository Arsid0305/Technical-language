export interface DailyText {
  id: string;
  day: number;
  focus: string;
  focusRu: string;
  title: string;
  content: string;
  vocabulary: { word: string; translation: string }[];
}

export interface Task {
  id: string;
  type: 'meaning' | 'reflection';
  question: string;
  questionRu?: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
  explanationRu?: string;
}

export interface DailyLesson {
  text: DailyText;
  tasks: Task[];
  extraPractice: Task[];
  consolidation: Task[];
}

export const dailyLessons: DailyLesson[] = [
  {
    text: {
      id: 'day-1',
      day: 1,
      focus: 'Today, just read. Notice what the system does — not every word.',
      focusRu: 'Сегодня просто читай. Замечай, что система делает — не каждое слово.',
      title: 'Understanding How AI Systems Process Requests',
      content: `When you send a message to an AI system, something interesting happens behind the scenes. The system doesn't understand your words the way a human would. Instead, it breaks your input into smaller pieces called tokens.

A token might be a word, part of a word, or even a single character. The sentence "Hello, how are you?" becomes approximately six tokens. This tokenization process is the first step in how the system processes what you write.

After tokenization, the system calculates probabilities. For each position in its response, it considers thousands of possible next tokens. It doesn't "think" about what to say — it predicts what token is most likely to come next, based on patterns it learned during training.

This is why AI systems can sometimes produce unexpected results. If your input is ambiguous, the system might predict a different continuation than you intended. The system has no memory of previous conversations unless that context is explicitly provided in the current request.

When the system generates a response, it does so one token at a time. Each new token influences what comes next. This is called autoregressive generation. The process continues until the system produces a special "end" token, or reaches a maximum length limit.

Understanding this process helps you write better prompts. Clear, specific inputs lead to more predictable outputs. The system performs best when given unambiguous context and explicit instructions about what you need.`,
      vocabulary: [
        { word: 'behind the scenes', translation: 'за кулисами, незаметно' },
        { word: 'token', translation: 'токен (единица текста)' },
        { word: 'tokenization', translation: 'токенизация (разбиение на части)' },
        { word: 'probability', translation: 'вероятность' },
        { word: 'ambiguous', translation: 'неоднозначный' },
        { word: 'autoregressive', translation: 'авторегрессивный (зависящий от предыдущего)' },
        { word: 'explicit', translation: 'явный, чёткий' },
        { word: 'prompt', translation: 'запрос, промпт' },
      ],
    },
    tasks: [
      {
        id: 't1-1',
        type: 'meaning',
        question: 'What is the first thing the system does with your message?',
        options: [
          'Understands it like a human',
          'Breaks it into tokens',
          'Translates it to another language',
          'Saves it to memory',
        ],
        correctIndex: 1,
        explanation: 'The system breaks input into tokens first — small pieces like words or parts of words.',
        explanationRu: 'Система сначала разбивает ввод на токены — маленькие части вроде слов или частей слов.',
      },
      {
        id: 't1-2',
        type: 'meaning',
        question: 'Why might the system give unexpected results?',
        options: [
          'It is broken',
          'Your input might be ambiguous',
          'It is too slow',
          'The internet connection is bad',
        ],
        correctIndex: 1,
        explanation: 'Ambiguous input can lead to different predictions than what you intended.',
        explanationRu: 'Неоднозначный ввод может привести к предсказаниям, отличным от того, что вы имели в виду.',
      },
      {
        id: 't1-3',
        type: 'meaning',
        question: 'Does the AI system remember your previous conversations?',
        options: [
          'Yes, always',
          'Only if context is provided in the current request',
          'It remembers everything forever',
          'Only for 24 hours',
        ],
        correctIndex: 1,
        explanation: 'The system has no memory unless context is explicitly provided in the current request.',
        explanationRu: 'У системы нет памяти, если контекст явно не предоставлен в текущем запросе.',
      },
      {
        id: 't1-4',
        type: 'reflection',
        question: 'Своими словами: что значит "autoregressive generation"? (можно по-русски)',
        questionRu: 'Что значит "autoregressive generation"?',
      },
    ],
    extraPractice: [
      {
        id: 'e1-1',
        type: 'meaning',
        question: 'What does "token" mean in this context?',
        options: [
          'A coin',
          'A piece of text (word or part of word)',
          'A password',
          'A file type',
        ],
        correctIndex: 1,
        explanationRu: 'Токен — это единица текста: слово, часть слова или символ.',
      },
      {
        id: 'e1-2',
        type: 'meaning',
        question: 'How many tokens approximately does "Hello, how are you?" become?',
        options: ['Two', 'Four', 'Six', 'Ten'],
        correctIndex: 2,
        explanationRu: 'Примерно шесть токенов, как упоминается в тексте.',
      },
      {
        id: 'e1-3',
        type: 'meaning',
        question: 'What helps you get better results from the AI?',
        options: [
          'Writing very long messages',
          'Using clear, specific inputs',
          'Using only one word',
          'Asking the same question many times',
        ],
        correctIndex: 1,
        explanationRu: 'Чёткие и конкретные запросы дают более предсказуемые результаты.',
      },
      {
        id: 'e1-4',
        type: 'meaning',
        question: 'When does the system stop generating a response?',
        options: [
          'After exactly 100 words',
          'When it produces an "end" token or reaches max length',
          'When you close the browser',
          'After 10 seconds',
        ],
        correctIndex: 1,
        explanationRu: 'Генерация останавливается при специальном токене "конец" или по достижении лимита.',
      },
      {
        id: 'e1-5',
        type: 'meaning',
        question: 'What does "behind the scenes" mean?',
        options: [
          'In front of you',
          'Happening invisibly, in the background',
          'Very slowly',
          'With sound effects',
        ],
        correctIndex: 1,
        explanationRu: '"Behind the scenes" = за кулисами, незаметно.',
      },
      {
        id: 'e1-6',
        type: 'meaning',
        question: 'The system "predicts" the next token. What does this mean?',
        options: [
          'It knows the future',
          'It calculates what is most likely to come next',
          'It reads your mind',
          'It copies from the internet',
        ],
        correctIndex: 1,
        explanationRu: 'Предсказывает = вычисляет, какой токен скорее всего будет следующим.',
      },
      {
        id: 'e1-7',
        type: 'meaning',
        question: 'What is "explicit" information?',
        options: [
          'Hidden information',
          'Clear, directly stated information',
          'Wrong information',
          'Old information',
        ],
        correctIndex: 1,
        explanationRu: 'Explicit = явный, чётко указанный, прямой.',
      },
      {
        id: 'e1-8',
        type: 'meaning',
        question: 'If input is "ambiguous", it is...',
        options: [
          'Very clear',
          'Can be understood in different ways',
          'Too short',
          'In the wrong language',
        ],
        correctIndex: 1,
        explanationRu: 'Ambiguous = неоднозначный, можно понять по-разному.',
      },
    ],
    consolidation: [
      {
        id: 'c1-1',
        type: 'meaning',
        question: 'Main idea: the AI system works by...',
        options: [
          'Understanding meaning like humans',
          'Predicting tokens based on patterns',
          'Searching the internet',
        ],
        correctIndex: 1,
        explanationRu: 'Главное: система предсказывает токены на основе паттернов.',
      },
      {
        id: 'c1-2',
        type: 'meaning',
        question: 'To get better results, you should...',
        options: [
          'Write longer messages',
          'Be clear and specific',
          'Use more emojis',
        ],
        correctIndex: 1,
        explanationRu: 'Для лучших результатов — пишите чётко и конкретно.',
      },
      {
        id: 'c1-3',
        type: 'meaning',
        question: 'The system generates responses...',
        options: [
          'All at once',
          'One token at a time',
          'In random order',
        ],
        correctIndex: 1,
        explanationRu: 'Ответ генерируется по одному токену за раз.',
      },
    ],
  },
  {
    text: {
      id: 'day-2',
      day: 2,
      focus: 'Notice the difference between what a function returns and what it does.',
      focusRu: 'Замечай разницу между тем, что функция возвращает, и тем, что она делает.',
      title: 'Return Values and Side Effects in Code',
      content: `In programming, functions do two kinds of things: they can return a value, and they can have side effects. Understanding this difference is fundamental to reading code effectively.

A return value is what a function gives back to whoever called it. When you write const result = calculateSum(5, 3), the function calculateSum returns the number 8, and that value gets stored in the variable result. The return value is the direct output of the function.

Side effects are different. A side effect is anything a function does that affects the world outside itself. Printing to the console is a side effect. Saving data to a database is a side effect. Modifying a global variable is a side effect. These actions happen, but they are not the return value.

Some functions have only return values and no side effects. These are called pure functions. The function Math.sqrt(16) returns 4, and that is all it does. It does not change anything else in your program or in the outside world.

Other functions have side effects but no meaningful return value. The function console.log("Hello") prints text to the console, but what it returns is undefined — essentially nothing useful. The purpose of this function is its side effect, not its return value.

Many real-world functions do both. A function might save data to a database (side effect) and also return a success indicator (return value). When reading such code, you need to pay attention to both aspects.

Why does this matter? When you debug code, knowing whether a problem is in the return value or in a side effect helps you find the bug faster. When you write tests, you test return values differently than you test side effects.`,
      vocabulary: [
        { word: 'return value', translation: 'возвращаемое значение' },
        { word: 'side effect', translation: 'побочный эффект' },
        { word: 'pure function', translation: 'чистая функция (без побочных эффектов)' },
        { word: 'fundamental', translation: 'фундаментальный, основной' },
        { word: 'undefined', translation: 'undefined (неопределённый)' },
        { word: 'debug', translation: 'отлаживать, искать ошибки' },
        { word: 'indicator', translation: 'индикатор, показатель' },
      ],
    },
    tasks: [
      {
        id: 't2-1',
        type: 'meaning',
        question: 'What is a return value?',
        options: [
          'What a function prints to console',
          'What a function gives back to its caller',
          'The name of the function',
          'The code inside the function',
        ],
        correctIndex: 1,
        explanation: 'A return value is what the function gives back — like how calculateSum(5,3) gives back 8.',
        explanationRu: 'Возвращаемое значение — это то, что функция отдаёт обратно вызвавшему её коду.',
      },
      {
        id: 't2-2',
        type: 'meaning',
        question: 'Which of these is a side effect?',
        options: [
          'Returning a number',
          'Saving data to a database',
          'Calculating a sum',
          'Storing a value in a variable inside the function',
        ],
        correctIndex: 1,
        explanation: 'Saving to a database affects the outside world — that is a side effect.',
        explanationRu: 'Сохранение в базу данных влияет на внешний мир — это побочный эффект.',
      },
      {
        id: 't2-3',
        type: 'meaning',
        question: 'What is a pure function?',
        options: [
          'A function with many side effects',
          'A function with only return value, no side effects',
          'A function that never returns anything',
          'A function written in clean code',
        ],
        correctIndex: 1,
        explanation: 'Pure functions only return values — they do not change anything outside themselves.',
        explanationRu: 'Чистые функции только возвращают значения — не меняют ничего снаружи.',
      },
      {
        id: 't2-4',
        type: 'reflection',
        question: 'console.log("Hello") — что возвращает эта функция и для чего она нужна? (можно по-русски)',
        questionRu: 'Что возвращает console.log() и зачем она нужна?',
      },
    ],
    extraPractice: [
      {
        id: 'e2-1',
        type: 'meaning',
        question: 'console.log() returns...',
        options: ['The text it prints', 'undefined', 'true', 'An error'],
        correctIndex: 1,
        explanationRu: 'console.log() возвращает undefined — её цель в побочном эффекте (печати).',
      },
      {
        id: 'e2-2',
        type: 'meaning',
        question: 'Math.sqrt(16) is an example of...',
        options: ['A side effect', 'A pure function', 'A database operation', 'An error'],
        correctIndex: 1,
        explanationRu: 'Math.sqrt() — чистая функция: только возвращает значение, ничего не меняет.',
      },
      {
        id: 'e2-3',
        type: 'meaning',
        question: 'Why is understanding return values vs side effects useful?',
        options: [
          'It makes code run faster',
          'It helps you debug and test code',
          'It makes functions shorter',
          'It is not useful',
        ],
        correctIndex: 1,
        explanationRu: 'Понимание этой разницы помогает отлаживать и тестировать код.',
      },
      {
        id: 'e2-4',
        type: 'meaning',
        question: '"Modifying a global variable" is...',
        options: ['A return value', 'A side effect', 'A pure function', 'An error'],
        correctIndex: 1,
        explanationRu: 'Изменение глобальной переменной — побочный эффект.',
      },
      {
        id: 'e2-5',
        type: 'meaning',
        question: 'What does "fundamental" mean?',
        options: ['Optional', 'Basic and essential', 'Complicated', 'Fast'],
        correctIndex: 1,
        explanationRu: 'Fundamental = фундаментальный, основной, базовый.',
      },
      {
        id: 'e2-6',
        type: 'meaning',
        question: 'A function that saves data AND returns success indicator...',
        options: [
          'Has only return value',
          'Has only side effects',
          'Has both return value and side effects',
          'Is impossible',
        ],
        correctIndex: 2,
        explanationRu: 'Такая функция имеет и возвращаемое значение, и побочный эффект.',
      },
      {
        id: 'e2-7',
        type: 'meaning',
        question: '"Debug" means...',
        options: ['Write new code', 'Find and fix errors', 'Delete code', 'Run code faster'],
        correctIndex: 1,
        explanationRu: 'Debug = отлаживать, искать и исправлять ошибки.',
      },
      {
        id: 'e2-8',
        type: 'meaning',
        question: 'Printing to console affects...',
        options: [
          'Only the function itself',
          'The outside world (visible output)',
          'Nothing',
          'Only variables',
        ],
        correctIndex: 1,
        explanationRu: 'Печать в консоль влияет на внешний мир — это видимый вывод.',
      },
    ],
    consolidation: [
      {
        id: 'c2-1',
        type: 'meaning',
        question: 'Return value is what a function...',
        options: ['Prints', 'Gives back to its caller', 'Changes outside'],
        correctIndex: 1,
        explanationRu: 'Возвращаемое значение — то, что функция отдаёт обратно.',
      },
      {
        id: 'c2-2',
        type: 'meaning',
        question: 'Side effect is...',
        options: [
          'The value a function returns',
          'Something that affects the outside world',
          'The function name',
        ],
        correctIndex: 1,
        explanationRu: 'Побочный эффект — действие, влияющее на внешний мир.',
      },
      {
        id: 'c2-3',
        type: 'meaning',
        question: 'Pure function has...',
        options: [
          'Many side effects',
          'Only return value, no side effects',
          'No return value',
        ],
        correctIndex: 1,
        explanationRu: 'Чистая функция — только возвращает значение, без побочных эффектов.',
      },
    ],
  },
  {
    text: {
      id: 'day-3',
      day: 3,
      focus: 'Pay attention to what happens when something goes wrong.',
      focusRu: 'Обрати внимание на то, что происходит, когда что-то идёт не так.',
      title: 'Error Handling: Try, Catch, and Recovery',
      content: `Every program eventually encounters situations it cannot handle normally. A file might not exist. A network request might fail. A user might enter invalid data. How your code responds to these situations is called error handling.

In many languages, errors are handled using try-catch blocks. The try block contains code that might fail. The catch block contains code that runs if something goes wrong. This separation keeps your error-handling logic organized and predictable.

Consider this pattern: you try to read a file. If the file exists, everything proceeds normally. If the file does not exist, the system throws an error. Your catch block catches that error and decides what to do — perhaps show a message to the user, or create the file, or use default data instead.

The key insight is that errors are not always bad. They are information. An error tells you exactly what went wrong and often where. A well-designed system uses errors as signals to make decisions, not just as problems to hide.

Some errors are recoverable. If a network request fails, you might retry it. If a file is missing, you might create it. The catch block gives you a chance to recover gracefully instead of crashing.

Other errors are fatal. If your configuration file is corrupted, the program might not be able to continue at all. In these cases, the best response is often to log the error clearly and exit cleanly, so the user knows what happened.

Good error messages describe what went wrong, why it matters, and what can be done about it. "Error: File not found" is less helpful than "Error: Configuration file config.json not found. Please ensure the file exists in the project root directory."

When reading code, pay attention to what errors can occur and how they are handled. This tells you a lot about how robust the system is.`,
      vocabulary: [
        { word: 'error handling', translation: 'обработка ошибок' },
        { word: 'try-catch', translation: 'try-catch (блок для перехвата ошибок)' },
        { word: 'throw', translation: 'выбросить (ошибку)' },
        { word: 'recoverable', translation: 'восстанавливаемый' },
        { word: 'fatal', translation: 'фатальный, критический' },
        { word: 'gracefully', translation: 'корректно, без краха' },
        { word: 'robust', translation: 'надёжный, устойчивый' },
        { word: 'corrupted', translation: 'повреждённый' },
      ],
    },
    tasks: [
      {
        id: 't3-1',
        type: 'meaning',
        question: 'What is the purpose of a catch block?',
        options: [
          'To run code that might fail',
          'To handle what happens when an error occurs',
          'To prevent any errors from happening',
          'To speed up the program',
        ],
        correctIndex: 1,
        explanation: 'The catch block handles the situation when something in the try block fails.',
        explanationRu: 'Блок catch обрабатывает ситуацию, когда что-то в try не удалось.',
      },
      {
        id: 't3-2',
        type: 'meaning',
        question: 'According to the text, errors are...',
        options: [
          'Always bad',
          'Information about what went wrong',
          'Impossible to handle',
          'Only for beginners',
        ],
        correctIndex: 1,
        explanation: 'Errors are information — they tell you what went wrong and where.',
        explanationRu: 'Ошибки — это информация о том, что пошло не так и где.',
      },
      {
        id: 't3-3',
        type: 'meaning',
        question: 'What is a "recoverable" error?',
        options: [
          'An error you cannot fix',
          'An error where the program can try again or use an alternative',
          'An error in the catch block',
          'An error that crashes the system',
        ],
        correctIndex: 1,
        explanation: 'Recoverable errors allow the program to retry or use alternatives.',
        explanationRu: 'Восстанавливаемые ошибки позволяют повторить попытку или использовать альтернативу.',
      },
      {
        id: 't3-4',
        type: 'reflection',
        question: 'Что значит обработать ошибку "gracefully"? (можно по-русски)',
        questionRu: 'Что значит "gracefully" в контексте обработки ошибок?',
      },
    ],
    extraPractice: [
      {
        id: 'e3-1',
        type: 'meaning',
        question: 'The try block contains...',
        options: [
          'Error handling code',
          'Code that might fail',
          'User messages',
          'Configuration settings',
        ],
        correctIndex: 1,
        explanationRu: 'В try блоке — код, который может не сработать.',
      },
      {
        id: 'e3-2',
        type: 'meaning',
        question: '"Throw" in error handling means...',
        options: [
          'Delete the error',
          'Generate/raise an error',
          'Catch the error',
          'Ignore the error',
        ],
        correctIndex: 1,
        explanationRu: 'Throw = выбросить, сгенерировать ошибку.',
      },
      {
        id: 'e3-3',
        type: 'meaning',
        question: 'A "fatal" error is...',
        options: [
          'Easy to recover from',
          'One where the program cannot continue',
          'Not important',
          'Always hidden from users',
        ],
        correctIndex: 1,
        explanationRu: 'Фатальная ошибка — программа не может продолжить работу.',
      },
      {
        id: 'e3-4',
        type: 'meaning',
        question: 'What makes a good error message?',
        options: [
          'Being as short as possible',
          'Explaining what went wrong and what to do',
          'Using technical jargon',
          'Hiding the real problem',
        ],
        correctIndex: 1,
        explanationRu: 'Хорошее сообщение объясняет проблему и что делать.',
      },
      {
        id: 'e3-5',
        type: 'meaning',
        question: '"Robust" system means...',
        options: [
          'Fast system',
          'Reliable, handles problems well',
          'Simple system',
          'Expensive system',
        ],
        correctIndex: 1,
        explanationRu: 'Robust = надёжный, хорошо справляется с проблемами.',
      },
      {
        id: 'e3-6',
        type: 'meaning',
        question: 'If a configuration file is "corrupted", it is...',
        options: ['Working perfectly', 'Damaged or broken', 'Too large', 'Missing'],
        correctIndex: 1,
        explanationRu: 'Corrupted = повреждённый, испорченный.',
      },
      {
        id: 'e3-7',
        type: 'meaning',
        question: 'When a network request fails, a good response might be...',
        options: [
          'Crash immediately',
          'Retry the request',
          'Delete all data',
          'Ignore it completely',
        ],
        correctIndex: 1,
        explanationRu: 'При ошибке сети разумно повторить запрос.',
      },
      {
        id: 'e3-8',
        type: 'meaning',
        question: 'Error handling keeps your logic...',
        options: ['Hidden', 'Organized and predictable', 'Slower', 'More complex'],
        correctIndex: 1,
        explanationRu: 'Обработка ошибок делает логику организованной и предсказуемой.',
      },
    ],
    consolidation: [
      {
        id: 'c3-1',
        type: 'meaning',
        question: 'try block = code that might fail. catch block = ...',
        options: ['Code that always works', 'What to do when error happens', 'Main program logic'],
        correctIndex: 1,
        explanationRu: 'catch = что делать при ошибке.',
      },
      {
        id: 'c3-2',
        type: 'meaning',
        question: 'Errors are not just problems, they are...',
        options: ['Useless', 'Information to make decisions', 'Always fatal'],
        correctIndex: 1,
        explanationRu: 'Ошибки — это информация для принятия решений.',
      },
      {
        id: 'c3-3',
        type: 'meaning',
        question: 'Good error handling helps the system be more...',
        options: ['Confusing', 'Robust (reliable)', 'Slow'],
        correctIndex: 1,
        explanationRu: 'Хорошая обработка ошибок делает систему надёжнее.',
      },
    ],
  },
  {
    text: {
      id: 'day-4',
      day: 4,
      focus: 'Notice how async operations wait — and what happens while waiting.',
      focusRu: 'Замечай, как асинхронные операции ждут — и что происходит в это время.',
      title: 'Asynchronous Operations and Promises',
      content: `Most programs need to do things that take time. Loading data from a server, reading a file, or waiting for user input — these operations do not complete instantly. How a program handles this waiting time is called asynchronous programming.

In synchronous code, each line runs only after the previous line finishes. If line 5 takes 10 seconds, line 6 waits. The program is blocked. This is simple to understand, but it creates problems. If your program is waiting for data from a slow server, nothing else can happen.

Asynchronous code works differently. When the program starts a slow operation, it does not stop and wait. Instead, it continues to the next line. Later, when the operation finishes, the program handles the result. This allows the program to stay responsive.

In JavaScript, Promises are a common way to handle asynchronous operations. A Promise represents a value that might not exist yet. It can be in one of three states: pending (still waiting), fulfilled (operation succeeded), or rejected (operation failed).

When you write fetch("/api/data"), the function returns a Promise immediately. It does not return the data — the data is not available yet. Instead, you use .then() to specify what should happen when the data arrives: fetch("/api/data").then(data => process(data)).

The async/await syntax makes this easier to read. Instead of chaining .then() calls, you write await fetch("/api/data"). The word await pauses execution until the Promise resolves. But it only pauses that function — other parts of your program can still run.

Understanding async behavior helps you avoid common bugs. If you forget await, your code runs before the data is ready. If you do not handle rejected Promises, errors disappear silently.`,
      vocabulary: [
        { word: 'asynchronous', translation: 'асинхронный (не блокирующий)' },
        { word: 'synchronous', translation: 'синхронный (последовательный)' },
        { word: 'blocked', translation: 'заблокирован' },
        { word: 'responsive', translation: 'отзывчивый, реагирующий' },
        { word: 'Promise', translation: 'промис (обещание результата)' },
        { word: 'pending', translation: 'ожидающий' },
        { word: 'fulfilled', translation: 'выполненный, успешный' },
        { word: 'rejected', translation: 'отклонённый, с ошибкой' },
        { word: 'await', translation: 'ждать (результата)' },
      ],
    },
    tasks: [
      {
        id: 't4-1',
        type: 'meaning',
        question: 'What is the problem with synchronous code that waits for slow operations?',
        options: [
          'It uses too much memory',
          'Nothing else can happen while waiting — the program is blocked',
          'It is too fast',
          'It cannot handle errors',
        ],
        correctIndex: 1,
        explanation: 'In sync code, the whole program stops and waits. Nothing else runs.',
        explanationRu: 'В синхронном коде вся программа останавливается и ждёт.',
      },
      {
        id: 't4-2',
        type: 'meaning',
        question: 'What does a Promise represent?',
        options: [
          'An error that happened',
          'A value that might not exist yet',
          'A completed operation',
          'A function to call',
        ],
        correctIndex: 1,
        explanation: 'A Promise represents a value that will be available in the future.',
        explanationRu: 'Промис представляет значение, которое будет доступно в будущем.',
      },
      {
        id: 't4-3',
        type: 'meaning',
        question: 'What are the three states of a Promise?',
        options: [
          'Start, middle, end',
          'Pending, fulfilled, rejected',
          'Loading, success, error',
          'Try, catch, finally',
        ],
        correctIndex: 1,
        explanation: 'Pending (waiting), fulfilled (success), rejected (error).',
        explanationRu: 'Pending (ждёт), fulfilled (успех), rejected (ошибка).',
      },
      {
        id: 't4-4',
        type: 'reflection',
        question: 'Почему важно не забывать await при работе с асинхронными функциями? (можно по-русски)',
        questionRu: 'Что произойдёт, если забыть await?',
      },
    ],
    extraPractice: [
      {
        id: 'e4-1',
        type: 'meaning',
        question: 'fetch("/api/data") returns...',
        options: ['The data immediately', 'A Promise', 'An error', 'Nothing'],
        correctIndex: 1,
        explanationRu: 'fetch() возвращает промис, не сами данные.',
      },
      {
        id: 'e4-2',
        type: 'meaning',
        question: '"Responsive" program means...',
        options: [
          'A program that shows responses',
          'A program that stays reactive, not frozen',
          'A program that is very fast',
          'A program with good design',
        ],
        correctIndex: 1,
        explanationRu: 'Responsive = отзывчивый, не зависает.',
      },
      {
        id: 'e4-3',
        type: 'meaning',
        question: '.then() is used to...',
        options: [
          'Cancel a Promise',
          'Specify what happens when Promise resolves',
          'Create a new Promise',
          'Handle only errors',
        ],
        correctIndex: 1,
        explanationRu: '.then() указывает, что делать когда промис выполнится.',
      },
      {
        id: 'e4-4',
        type: 'meaning',
        question: 'await pauses...',
        options: [
          'The entire program',
          'Only that function, other code can run',
          'All Promises',
          'Nothing',
        ],
        correctIndex: 1,
        explanationRu: 'await приостанавливает только эту функцию, остальное работает.',
      },
      {
        id: 'e4-5',
        type: 'meaning',
        question: 'If you forget await, your code...',
        options: [
          'Works normally',
          'Runs before data is ready',
          'Throws an error immediately',
          'Waits longer',
        ],
        correctIndex: 1,
        explanationRu: 'Без await код продолжит выполняться до того, как данные готовы.',
      },
      {
        id: 'e4-6',
        type: 'meaning',
        question: 'A "pending" Promise is...',
        options: ['Completed successfully', 'Still waiting for result', 'Failed', 'Cancelled'],
        correctIndex: 1,
        explanationRu: 'Pending = ещё ждёт результата.',
      },
      {
        id: 'e4-7',
        type: 'meaning',
        question: 'Async programming helps with...',
        options: [
          'Making code shorter',
          'Operations that take time (network, files)',
          'Fixing syntax errors',
          'Writing comments',
        ],
        correctIndex: 1,
        explanationRu: 'Async помогает с операциями, которые требуют времени.',
      },
      {
        id: 'e4-8',
        type: 'meaning',
        question: '"Rejected" Promise means...',
        options: ['Still loading', 'Completed successfully', 'Failed with error', 'Was cancelled by user'],
        correctIndex: 2,
        explanationRu: 'Rejected = завершился с ошибкой.',
      },
    ],
    consolidation: [
      {
        id: 'c4-1',
        type: 'meaning',
        question: 'Async code allows the program to...',
        options: ['Stop completely', 'Continue while waiting for slow operations', 'Run faster'],
        correctIndex: 1,
        explanationRu: 'Асинхронный код позволяет продолжать работу во время ожидания.',
      },
      {
        id: 'c4-2',
        type: 'meaning',
        question: 'A Promise that succeeded is in state...',
        options: ['Pending', 'Fulfilled', 'Rejected'],
        correctIndex: 1,
        explanationRu: 'Успешный промис в состоянии fulfilled.',
      },
      {
        id: 'c4-3',
        type: 'meaning',
        question: 'await only pauses...',
        options: ['Everything', 'That specific function', 'All network requests'],
        correctIndex: 1,
        explanationRu: 'await приостанавливает только конкретную функцию.',
      },
    ],
  },
  {
    text: {
      id: 'day-5',
      day: 5,
      focus: 'Notice how data travels between systems — requests go out, responses come back.',
      focusRu: 'Замечай, как данные путешествуют между системами — запросы уходят, ответы возвращаются.',
      title: 'APIs and HTTP Requests',
      content: `When your application needs data from another system — like weather information, user profiles, or payment processing — it communicates through an API. API stands for Application Programming Interface. It is a defined way for programs to talk to each other.

The most common type is a REST API, which uses HTTP requests. HTTP is the same protocol your browser uses to load websites. When you type a URL in your browser, you are making an HTTP GET request.

There are several HTTP methods. GET retrieves data without changing anything. POST sends new data to create something. PUT updates existing data completely. PATCH updates part of existing data. DELETE removes data. These methods tell the server what you want to do.

A typical API request has several parts. The URL specifies which resource you want: /api/users/123 might mean "the user with ID 123". Headers contain metadata like authentication tokens. The body (for POST, PUT, PATCH) contains the actual data you are sending.

The server responds with a status code. 200 means success. 201 means something was created. 400 means you sent bad data. 401 means you are not authenticated. 404 means the resource was not found. 500 means the server had an internal error.

When you build with AI tools, you often connect to APIs — payment systems, email services, databases. Understanding this request-response pattern helps you describe what you need. You can say "make a POST request to create a user" instead of "somehow save the user".`,
      vocabulary: [
        { word: 'API', translation: 'интерфейс программирования (способ общения программ)' },
        { word: 'REST', translation: 'REST (архитектурный стиль API)' },
        { word: 'HTTP', translation: 'HTTP (протокол передачи данных)' },
        { word: 'GET', translation: 'GET (получить данные)' },
        { word: 'POST', translation: 'POST (отправить новые данные)' },
        { word: 'status code', translation: 'код статуса (200, 404 и т.д.)' },
        { word: 'endpoint', translation: 'эндпоинт (адрес API)' },
        { word: 'authentication', translation: 'аутентификация (проверка личности)' },
      ],
    },
    tasks: [
      {
        id: 't5-1',
        type: 'meaning',
        question: 'What is an API?',
        options: [
          'A type of database',
          'A way for programs to communicate with each other',
          'A programming language',
          'A design pattern',
        ],
        correctIndex: 1,
        explanationRu: 'API — это способ для программ общаться друг с другом.',
      },
      {
        id: 't5-2',
        type: 'meaning',
        question: 'Which HTTP method retrieves data without changing anything?',
        options: ['POST', 'DELETE', 'GET', 'PUT'],
        correctIndex: 2,
        explanationRu: 'GET получает данные, не изменяя ничего на сервере.',
      },
      {
        id: 't5-3',
        type: 'meaning',
        question: 'What does status code 404 mean?',
        options: ['Success', 'Created', 'Resource not found', 'Server error'],
        correctIndex: 2,
        explanationRu: '404 означает "ресурс не найден".',
      },
      {
        id: 't5-4',
        type: 'reflection',
        question: 'Когда бы ты использовал POST вместо GET? (можно по-русски)',
        questionRu: 'В чём разница между GET и POST?',
      },
    ],
    extraPractice: [
      {
        id: 'e5-1',
        type: 'meaning',
        question: 'POST is used to...',
        options: ['Get data', 'Create new data', 'Delete data', 'Read data'],
        correctIndex: 1,
        explanationRu: 'POST отправляет новые данные для создания чего-то.',
      },
      {
        id: 'e5-2',
        type: 'meaning',
        question: 'Status code 200 means...',
        options: ['Error', 'Not found', 'Success', 'Unauthorized'],
        correctIndex: 2,
        explanationRu: '200 = успех, всё прошло хорошо.',
      },
      {
        id: 'e5-3',
        type: 'meaning',
        question: 'Headers contain...',
        options: ['The main data', 'Metadata like auth tokens', 'Error messages', 'URLs only'],
        correctIndex: 1,
        explanationRu: 'Заголовки содержат метаданные, например токены авторизации.',
      },
      {
        id: 'e5-4',
        type: 'meaning',
        question: '401 status code means...',
        options: ['Success', 'Not authenticated', 'Not found', 'Server error'],
        correctIndex: 1,
        explanationRu: '401 = не авторизован, нужно войти в систему.',
      },
      {
        id: 'e5-5',
        type: 'meaning',
        question: 'DELETE method is used to...',
        options: ['Create data', 'Read data', 'Remove data', 'Update data'],
        correctIndex: 2,
        explanationRu: 'DELETE удаляет данные.',
      },
      {
        id: 'e5-6',
        type: 'meaning',
        question: '/api/users/123 is an example of...',
        options: ['A function', 'An endpoint URL', 'A variable', 'An error'],
        correctIndex: 1,
        explanationRu: 'Это URL эндпоинта — адрес конкретного ресурса.',
      },
    ],
    consolidation: [
      {
        id: 'c5-1',
        type: 'meaning',
        question: 'APIs allow programs to...',
        options: ['Run faster', 'Communicate with each other', 'Use less memory'],
        correctIndex: 1,
        explanationRu: 'API позволяют программам общаться друг с другом.',
      },
      {
        id: 'c5-2',
        type: 'meaning',
        question: 'To create new data, use HTTP method...',
        options: ['GET', 'POST', 'DELETE'],
        correctIndex: 1,
        explanationRu: 'POST создаёт новые данные.',
      },
      {
        id: 'c5-3',
        type: 'meaning',
        question: '500 status code indicates...',
        options: ['Client error', 'Success', 'Server error'],
        correctIndex: 2,
        explanationRu: '500 = ошибка на сервере.',
      },
    ],
  },
  {
    text: {
      id: 'day-6',
      day: 6,
      focus: 'Notice how data is structured — objects have properties, arrays have items.',
      focusRu: 'Замечай структуру данных — у объектов есть свойства, у массивов — элементы.',
      title: 'JSON and Data Structures',
      content: `When systems exchange data, they need a common format both can understand. JSON — JavaScript Object Notation — has become the standard. Almost every API you work with sends and receives JSON.

JSON has simple rules. Data is organized in key-value pairs: { "name": "Alice", "age": 30 }. Keys are always strings in quotes. Values can be strings, numbers, booleans (true/false), null, arrays, or other objects.

Arrays hold ordered lists: ["apple", "banana", "cherry"]. Each item has a position called an index, starting from 0. So "apple" is at index 0, "banana" at index 1.

Objects and arrays can be nested. A user object might contain an array of orders, and each order is an object with its own properties. This creates a tree-like structure: { "user": { "name": "Alice", "orders": [{ "id": 1, "total": 99.99 }] } }.

When you access nested data, you chain property names: user.orders[0].total gives you 99.99. This is called "drilling down" into the structure.

Understanding JSON helps you work with AI tools. When you describe data, you can say "an array of user objects, each with name and email properties" — and the AI knows exactly what structure to create. When debugging, you can identify if the problem is in how data is structured or how it is being accessed.`,
      vocabulary: [
        { word: 'JSON', translation: 'JSON (формат данных)' },
        { word: 'key-value pair', translation: 'пара ключ-значение' },
        { word: 'array', translation: 'массив (список элементов)' },
        { word: 'object', translation: 'объект (набор свойств)' },
        { word: 'index', translation: 'индекс (позиция в массиве)' },
        { word: 'nested', translation: 'вложенный' },
        { word: 'property', translation: 'свойство' },
        { word: 'boolean', translation: 'булево значение (true/false)' },
      ],
    },
    tasks: [
      {
        id: 't6-1',
        type: 'meaning',
        question: 'What is JSON used for?',
        options: [
          'Styling websites',
          'Exchanging data between systems',
          'Running code faster',
          'Creating animations',
        ],
        correctIndex: 1,
        explanationRu: 'JSON — формат для обмена данными между системами.',
      },
      {
        id: 't6-2',
        type: 'meaning',
        question: 'In an array ["a", "b", "c"], what is the index of "a"?',
        options: ['1', '0', '2', '-1'],
        correctIndex: 1,
        explanationRu: 'Индексы начинаются с 0, поэтому "a" на позиции 0.',
      },
      {
        id: 't6-3',
        type: 'meaning',
        question: 'What can be a value in JSON?',
        options: [
          'Only strings',
          'Strings, numbers, booleans, null, arrays, objects',
          'Only numbers',
          'Only objects',
        ],
        correctIndex: 1,
        explanationRu: 'Значения могут быть строками, числами, булевыми, null, массивами, объектами.',
      },
      {
        id: 't6-4',
        type: 'reflection',
        question: 'Как бы ты описал структуру данных для списка товаров в магазине? (можно по-русски)',
        questionRu: 'Какие свойства были бы у объекта товара?',
      },
    ],
    extraPractice: [
      {
        id: 'e6-1',
        type: 'meaning',
        question: '{ "name": "Bob" } — "name" is called...',
        options: ['A value', 'A key', 'An index', 'An array'],
        correctIndex: 1,
        explanationRu: '"name" — это ключ в паре ключ-значение.',
      },
      {
        id: 'e6-2',
        type: 'meaning',
        question: 'Nested data means...',
        options: ['Flat structure', 'Data inside other data', 'Deleted data', 'Hidden data'],
        correctIndex: 1,
        explanationRu: 'Вложенные данные — данные внутри других данных.',
      },
      {
        id: 'e6-3',
        type: 'meaning',
        question: 'user.orders[0] accesses...',
        options: ['All orders', 'First order', 'Last order', 'User name'],
        correctIndex: 1,
        explanationRu: '[0] — первый элемент массива orders.',
      },
      {
        id: 'e6-4',
        type: 'meaning',
        question: 'Boolean values are...',
        options: ['Numbers only', 'true or false', 'Text strings', 'Arrays'],
        correctIndex: 1,
        explanationRu: 'Булевы значения: true или false.',
      },
      {
        id: 'e6-5',
        type: 'meaning',
        question: 'null in JSON means...',
        options: ['Zero', 'Empty string', 'No value / nothing', 'Error'],
        correctIndex: 2,
        explanationRu: 'null означает отсутствие значения.',
      },
      {
        id: 'e6-6',
        type: 'meaning',
        question: 'Keys in JSON must be...',
        options: ['Numbers', 'Strings in quotes', 'Any type', 'Arrays'],
        correctIndex: 1,
        explanationRu: 'Ключи в JSON всегда строки в кавычках.',
      },
    ],
    consolidation: [
      {
        id: 'c6-1',
        type: 'meaning',
        question: 'JSON organizes data as...',
        options: ['Random text', 'Key-value pairs', 'Only numbers'],
        correctIndex: 1,
        explanationRu: 'JSON организует данные как пары ключ-значение.',
      },
      {
        id: 'c6-2',
        type: 'meaning',
        question: 'Array indexes start from...',
        options: ['1', '0', '-1'],
        correctIndex: 1,
        explanationRu: 'Индексы массива начинаются с 0.',
      },
      {
        id: 'c6-3',
        type: 'meaning',
        question: 'To access nested data, you...',
        options: ['Use random keys', 'Chain property names', 'Delete the parent'],
        correctIndex: 1,
        explanationRu: 'Для доступа к вложенным данным цепочка: obj.prop.subprop.',
      },
    ],
  },
  {
    text: {
      id: 'day-7',
      day: 7,
      focus: 'Notice how interfaces are built from smaller pieces — components.',
      focusRu: 'Замечай, как интерфейсы строятся из маленьких частей — компонентов.',
      title: 'Components and Props in React',
      content: `Modern web applications are built from components. A component is a reusable piece of interface — a button, a card, a navigation menu, a form. Instead of writing one giant page, you compose many small components together.

Think of components like LEGO blocks. A Header component, a ProductCard component, a Footer component. You can combine them: a page uses Header at the top, several ProductCards in the middle, and Footer at the bottom. Each component handles its own piece.

Components receive data through props (short for properties). When you write <UserCard name="Alice" role="Admin" />, you are passing two props: name and role. Inside the UserCard component, it can use these values to display "Alice" and "Admin".

Props flow in one direction: from parent to child. The page component passes props to UserCard. UserCard cannot pass props back up. This one-way flow makes the data easier to track and debug.

When a component needs to display a list of items, it often maps over an array. If you have an array of users, you might write users.map(user => <UserCard name={user.name} />). This creates one UserCard for each user in the array.

Understanding components helps you communicate with AI tools. You can say "create a ProductCard component that takes price and title as props" — and the AI knows exactly what to build. You can say "the Header should use the Logo component" — and the AI understands the composition.`,
      vocabulary: [
        { word: 'component', translation: 'компонент (часть интерфейса)' },
        { word: 'props', translation: 'пропсы (данные для компонента)' },
        { word: 'reusable', translation: 'переиспользуемый' },
        { word: 'compose', translation: 'компоновать, собирать' },
        { word: 'parent', translation: 'родитель (внешний компонент)' },
        { word: 'child', translation: 'дочерний (вложенный компонент)' },
        { word: 'map', translation: 'map (преобразование массива)' },
        { word: 'render', translation: 'рендерить (отображать)' },
      ],
    },
    tasks: [
      {
        id: 't7-1',
        type: 'meaning',
        question: 'What is a component?',
        options: [
          'A database table',
          'A reusable piece of interface',
          'A type of variable',
          'An API endpoint',
        ],
        correctIndex: 1,
        explanationRu: 'Компонент — переиспользуемая часть интерфейса.',
      },
      {
        id: 't7-2',
        type: 'meaning',
        question: 'Props are used to...',
        options: [
          'Style components',
          'Pass data to components',
          'Delete components',
          'Create databases',
        ],
        correctIndex: 1,
        explanationRu: 'Пропсы передают данные в компоненты.',
      },
      {
        id: 't7-3',
        type: 'meaning',
        question: 'Props flow...',
        options: [
          'Both directions',
          'From child to parent',
          'From parent to child',
          'Randomly',
        ],
        correctIndex: 2,
        explanationRu: 'Пропсы текут в одном направлении: от родителя к ребёнку.',
      },
      {
        id: 't7-4',
        type: 'reflection',
        question: 'Какие компоненты ты бы выделил на странице интернет-магазина? (можно по-русски)',
        questionRu: 'Назови 3-4 возможных компонента.',
      },
    ],
    extraPractice: [
      {
        id: 'e7-1',
        type: 'meaning',
        question: '<Button label="Click" /> — "label" is...',
        options: ['A component', 'A prop', 'A function', 'An array'],
        correctIndex: 1,
        explanationRu: '"label" — это проп, переданный компоненту Button.',
      },
      {
        id: 'e7-2',
        type: 'meaning',
        question: 'Components are like...',
        options: ['Complete apps', 'LEGO blocks you combine', 'Databases', 'Servers'],
        correctIndex: 1,
        explanationRu: 'Компоненты как блоки LEGO — комбинируются вместе.',
      },
      {
        id: 'e7-3',
        type: 'meaning',
        question: 'users.map(u => <Card />) creates...',
        options: ['One Card', 'One Card per user', 'No Cards', 'An error'],
        correctIndex: 1,
        explanationRu: 'map создаёт один Card для каждого пользователя.',
      },
      {
        id: 'e7-4',
        type: 'meaning',
        question: 'Reusable means...',
        options: ['Used once', 'Can be used many times', 'Deleted', 'Hidden'],
        correctIndex: 1,
        explanationRu: 'Reusable = можно использовать много раз.',
      },
      {
        id: 'e7-5',
        type: 'meaning',
        question: 'The parent component...',
        options: ['Receives props', 'Passes props down', 'Cannot have children', 'Is always small'],
        correctIndex: 1,
        explanationRu: 'Родитель передаёт пропсы дочерним компонентам.',
      },
      {
        id: 'e7-6',
        type: 'meaning',
        question: 'Render means...',
        options: ['Delete', 'Display on screen', 'Hide', 'Debug'],
        correctIndex: 1,
        explanationRu: 'Render = отобразить на экране.',
      },
    ],
    consolidation: [
      {
        id: 'c7-1',
        type: 'meaning',
        question: 'Components help you...',
        options: ['Write more code', 'Build reusable interface pieces', 'Slow down the app'],
        correctIndex: 1,
        explanationRu: 'Компоненты помогают создавать переиспользуемые части.',
      },
      {
        id: 'c7-2',
        type: 'meaning',
        question: 'Props pass data from...',
        options: ['Child to parent', 'Parent to child', 'Sibling to sibling'],
        correctIndex: 1,
        explanationRu: 'Пропсы идут от родителя к ребёнку.',
      },
      {
        id: 'c7-3',
        type: 'meaning',
        question: '.map() is used to...',
        options: ['Delete items', 'Create component for each item', 'Sort items'],
        correctIndex: 1,
        explanationRu: 'map создаёт компонент для каждого элемента массива.',
      },
    ],
  },
  {
    text: {
      id: 'day-8',
      day: 8,
      focus: 'Notice the difference between data that changes and data that stays the same.',
      focusRu: 'Замечай разницу между данными, которые меняются, и теми, что остаются неизменными.',
      title: 'State Management in React',
      content: `Components need to remember things. A counter needs to know its current number. A form needs to track what the user typed. A shopping cart needs to store selected items. This remembered data is called state.

State is different from props. Props come from outside and the component cannot change them. State lives inside the component and can change over time. When state changes, the component re-renders — it updates what is shown on screen.

In React, useState is the basic way to create state. You write const [count, setCount] = useState(0). This gives you two things: the current value (count) and a function to update it (setCount). When you call setCount(5), the component re-renders with count equal to 5.

Never modify state directly. Writing count = 5 will not work — React will not know the value changed. Always use the setter function: setCount(5). This tells React to update and re-render.

State can hold any type of data: numbers, strings, booleans, arrays, objects. For complex data like a list of todos, you might have const [todos, setTodos] = useState([]).

Understanding state helps you communicate clearly. You can say "when the user clicks, update the isOpen state to true" or "store the form data in state". These are precise instructions that AI tools can implement correctly.`,
      vocabulary: [
        { word: 'state', translation: 'состояние (изменяемые данные)' },
        { word: 'useState', translation: 'useState (хук для состояния)' },
        { word: 're-render', translation: 'перерисовка компонента' },
        { word: 'setter function', translation: 'функция-сеттер (для изменения)' },
        { word: 'initial value', translation: 'начальное значение' },
        { word: 'hook', translation: 'хук (функция React)' },
        { word: 'update', translation: 'обновить' },
        { word: 'track', translation: 'отслеживать' },
      ],
    },
    tasks: [
      {
        id: 't8-1',
        type: 'meaning',
        question: 'What is state in React?',
        options: [
          'Data that never changes',
          'Data the component remembers and can change',
          'Styling information',
          'API responses only',
        ],
        correctIndex: 1,
        explanationRu: 'Состояние — данные, которые компонент помнит и может менять.',
      },
      {
        id: 't8-2',
        type: 'meaning',
        question: 'When state changes, the component...',
        options: ['Stops working', 'Re-renders', 'Deletes itself', 'Does nothing'],
        correctIndex: 1,
        explanationRu: 'При изменении состояния компонент перерисовывается.',
      },
      {
        id: 't8-3',
        type: 'meaning',
        question: 'To change state correctly, you must...',
        options: [
          'Modify the variable directly',
          'Use the setter function',
          'Delete and recreate it',
          'Refresh the page',
        ],
        correctIndex: 1,
        explanationRu: 'Нужно использовать функцию-сеттер для изменения состояния.',
      },
      {
        id: 't8-4',
        type: 'reflection',
        question: 'Какие данные в форме регистрации нужно хранить в state? (можно по-русски)',
        questionRu: 'Что должно меняться при заполнении формы?',
      },
    ],
    extraPractice: [
      {
        id: 'e8-1',
        type: 'meaning',
        question: 'const [x, setX] = useState(0) — setX is...',
        options: ['The value', 'The setter function', 'The component', 'An error'],
        correctIndex: 1,
        explanationRu: 'setX — функция для изменения значения x.',
      },
      {
        id: 'e8-2',
        type: 'meaning',
        question: 'Props vs State: props are...',
        options: ['Changeable by component', 'Passed from outside, read-only', 'Always empty', 'Hidden'],
        correctIndex: 1,
        explanationRu: 'Пропсы приходят снаружи и компонент их не меняет.',
      },
      {
        id: 'e8-3',
        type: 'meaning',
        question: 'useState(0) — 0 is the...',
        options: ['Maximum value', 'Initial value', 'Final value', 'Error code'],
        correctIndex: 1,
        explanationRu: '0 — начальное значение состояния.',
      },
      {
        id: 'e8-4',
        type: 'meaning',
        question: 'Why not write count = 5 directly?',
        options: ['It is too slow', 'React will not know it changed', 'It is correct', 'It crashes'],
        correctIndex: 1,
        explanationRu: 'React не узнает об изменении без сеттера.',
      },
      {
        id: 'e8-5',
        type: 'meaning',
        question: 'State can hold...',
        options: ['Only numbers', 'Only strings', 'Any type of data', 'Only objects'],
        correctIndex: 2,
        explanationRu: 'Состояние может хранить любой тип данных.',
      },
      {
        id: 'e8-6',
        type: 'meaning',
        question: 'A hook is...',
        options: ['A CSS property', 'A special React function', 'A database', 'An API'],
        correctIndex: 1,
        explanationRu: 'Хук — специальная функция React (например useState).',
      },
    ],
    consolidation: [
      {
        id: 'c8-1',
        type: 'meaning',
        question: 'State is different from props because...',
        options: ['It cannot be used', 'It can change over time', 'It is always a string'],
        correctIndex: 1,
        explanationRu: 'Состояние может меняться, пропсы — нет.',
      },
      {
        id: 'c8-2',
        type: 'meaning',
        question: 'useState returns...',
        options: ['Only the value', 'Value and setter function', 'Only the setter'],
        correctIndex: 1,
        explanationRu: 'useState возвращает значение и функцию для его изменения.',
      },
      {
        id: 'c8-3',
        type: 'meaning',
        question: 'When state changes, React...',
        options: ['Does nothing', 'Re-renders the component', 'Deletes the state'],
        correctIndex: 1,
        explanationRu: 'При изменении состояния React перерисовывает компонент.',
      },
    ],
  },
  {
    text: {
      id: 'day-9',
      day: 9,
      focus: 'Notice the four basic operations: create, read, update, delete.',
      focusRu: 'Замечай четыре базовые операции: создать, прочитать, обновить, удалить.',
      title: 'Database Basics and CRUD',
      content: `Applications need to store data permanently. When you close a website, the data should not disappear. This is where databases come in. A database stores data in organized structures, usually tables.

A table has rows and columns. Each column has a name and a type: "name" might be text, "age" might be a number, "created_at" might be a timestamp. Each row is one record — one user, one product, one order.

Almost all data operations fall into four categories: CRUD. Create adds new data. Read retrieves existing data. Update modifies existing data. Delete removes data. Understanding these four operations covers most of what you do with databases.

In SQL syntax: INSERT creates new rows. SELECT reads data. UPDATE modifies existing rows. DELETE removes rows. When building with AI tools, you often say things like "add a button that creates a new task" or "show a list that reads all users from the database".

Tables often relate to each other. A user table and an orders table are connected: each order belongs to a user. This relationship is tracked through foreign keys — the orders table has a user_id column that references the user.

When describing database needs to AI, be specific about structure. "A products table with name, price, and category_id" is clear. "Store product info somehow" is vague. The clearer your description, the better the result.`,
      vocabulary: [
        { word: 'database', translation: 'база данных' },
        { word: 'table', translation: 'таблица (в базе данных)' },
        { word: 'CRUD', translation: 'CRUD (Create, Read, Update, Delete)' },
        { word: 'row', translation: 'строка (запись в таблице)' },
        { word: 'column', translation: 'столбец (поле в таблице)' },
        { word: 'foreign key', translation: 'внешний ключ (связь таблиц)' },
        { word: 'query', translation: 'запрос к базе данных' },
        { word: 'record', translation: 'запись (одна строка данных)' },
      ],
    },
    tasks: [
      {
        id: 't9-1',
        type: 'meaning',
        question: 'What does CRUD stand for?',
        options: [
          'Code, Run, Update, Debug',
          'Create, Read, Update, Delete',
          'Connect, Receive, Use, Disconnect',
          'Copy, Restore, Undo, Download',
        ],
        correctIndex: 1,
        explanationRu: 'CRUD: Create, Read, Update, Delete — четыре базовые операции.',
      },
      {
        id: 't9-2',
        type: 'meaning',
        question: 'A row in a database table represents...',
        options: ['A column name', 'One record (e.g., one user)', 'The table name', 'A relationship'],
        correctIndex: 1,
        explanationRu: 'Строка — это одна запись, например один пользователь.',
      },
      {
        id: 't9-3',
        type: 'meaning',
        question: 'Foreign keys are used to...',
        options: ['Delete data', 'Connect related tables', 'Create backups', 'Speed up queries'],
        correctIndex: 1,
        explanationRu: 'Внешние ключи связывают таблицы друг с другом.',
      },
      {
        id: 't9-4',
        type: 'reflection',
        question: 'Какие таблицы нужны для интернет-магазина? (можно по-русски)',
        questionRu: 'Назови 2-3 таблицы и их связи.',
      },
    ],
    extraPractice: [
      {
        id: 'e9-1',
        type: 'meaning',
        question: 'SELECT is used to...',
        options: ['Create data', 'Read data', 'Delete data', 'Update data'],
        correctIndex: 1,
        explanationRu: 'SELECT читает данные из таблицы.',
      },
      {
        id: 'e9-2',
        type: 'meaning',
        question: 'INSERT is the SQL for...',
        options: ['Reading', 'Updating', 'Creating', 'Deleting'],
        correctIndex: 2,
        explanationRu: 'INSERT создаёт новые записи.',
      },
      {
        id: 'e9-3',
        type: 'meaning',
        question: 'A column defines...',
        options: ['One record', 'A type of data (name, age, etc.)', 'The whole table', 'Relationships'],
        correctIndex: 1,
        explanationRu: 'Столбец определяет тип данных: имя, возраст и т.д.',
      },
      {
        id: 'e9-4',
        type: 'meaning',
        question: 'user_id in orders table is a...',
        options: ['Primary key', 'Foreign key', 'Table name', 'Query'],
        correctIndex: 1,
        explanationRu: 'user_id — внешний ключ, связывающий с таблицей users.',
      },
      {
        id: 'e9-5',
        type: 'meaning',
        question: 'Databases store data...',
        options: ['Temporarily', 'Permanently', 'Only in browser', 'Only for 1 hour'],
        correctIndex: 1,
        explanationRu: 'Базы данных хранят данные постоянно.',
      },
      {
        id: 'e9-6',
        type: 'meaning',
        question: 'DELETE removes...',
        options: ['The whole database', 'Specified rows', 'Column names', 'Table structure'],
        correctIndex: 1,
        explanationRu: 'DELETE удаляет указанные строки.',
      },
    ],
    consolidation: [
      {
        id: 'c9-1',
        type: 'meaning',
        question: 'CRUD covers...',
        options: ['Styling', 'All basic data operations', 'Only reading data'],
        correctIndex: 1,
        explanationRu: 'CRUD покрывает все базовые операции с данными.',
      },
      {
        id: 'c9-2',
        type: 'meaning',
        question: 'Tables are connected through...',
        options: ['CSS', 'Foreign keys', 'Random links'],
        correctIndex: 1,
        explanationRu: 'Таблицы связываются через внешние ключи.',
      },
      {
        id: 'c9-3',
        type: 'meaning',
        question: 'Each row in a table is...',
        options: ['A column', 'One record', 'A query'],
        correctIndex: 1,
        explanationRu: 'Каждая строка — одна запись данных.',
      },
    ],
  },
  {
    text: {
      id: 'day-10',
      day: 10,
      focus: 'Notice who the user is — and what they are allowed to do.',
      focusRu: 'Замечай, кто пользователь — и что ему разрешено делать.',
      title: 'Authentication and Authorization',
      content: `When users sign up or log in, two things happen: authentication and authorization. These sound similar but are different concepts. Understanding both is essential for building secure applications.

Authentication answers "Who are you?" It is the process of verifying identity. When you enter email and password, the system checks if they match a real account. If yes, you are authenticated — the system knows who you are.

Authorization answers "What can you do?" After knowing who you are, the system checks what you are allowed to access. An admin can delete users. A regular user cannot. A user can edit their own profile but not other people's profiles.

The most common flow works like this: User logs in with email and password. Server verifies credentials and creates a session or token. This token is sent with every subsequent request. Server checks the token to know who is making the request.

Tokens often use a format called JWT — JSON Web Token. It contains encoded information about the user and an expiration time. The server can verify the token is valid without checking a database every time.

Protected routes are pages that require authentication. If you try to access /dashboard without being logged in, the app redirects you to /login. After logging in, you are redirected back to /dashboard.

When building with AI tools, specify auth requirements clearly: "only logged-in users can see this page" or "only admins can access this button". Clear requirements lead to secure implementations.`,
      vocabulary: [
        { word: 'authentication', translation: 'аутентификация (кто ты?)' },
        { word: 'authorization', translation: 'авторизация (что тебе можно?)' },
        { word: 'credentials', translation: 'учётные данные (логин/пароль)' },
        { word: 'session', translation: 'сессия (период авторизации)' },
        { word: 'token', translation: 'токен (ключ доступа)' },
        { word: 'JWT', translation: 'JWT (формат токена)' },
        { word: 'protected route', translation: 'защищённый маршрут' },
        { word: 'redirect', translation: 'перенаправление' },
      ],
    },
    tasks: [
      {
        id: 't10-1',
        type: 'meaning',
        question: 'Authentication answers the question...',
        options: ['What can you do?', 'Who are you?', 'Where are you?', 'When did you join?'],
        correctIndex: 1,
        explanationRu: 'Аутентификация отвечает на вопрос "Кто ты?"',
      },
      {
        id: 't10-2',
        type: 'meaning',
        question: 'Authorization answers the question...',
        options: ['Who are you?', 'What can you do?', 'What is your password?', 'When to log out?'],
        correctIndex: 1,
        explanationRu: 'Авторизация отвечает на вопрос "Что тебе можно делать?"',
      },
      {
        id: 't10-3',
        type: 'meaning',
        question: 'A token is used to...',
        options: ['Style the page', 'Identify the user in requests', 'Create database', 'Delete files'],
        correctIndex: 1,
        explanationRu: 'Токен идентифицирует пользователя в запросах.',
      },
      {
        id: 't10-4',
        type: 'reflection',
        question: 'Какие страницы приложения должны быть защищены (protected)? (можно по-русски)',
        questionRu: 'Приведи примеры защищённых страниц.',
      },
    ],
    extraPractice: [
      {
        id: 'e10-1',
        type: 'meaning',
        question: 'Credentials are...',
        options: ['Page titles', 'Login information (email, password)', 'Error messages', 'Styles'],
        correctIndex: 1,
        explanationRu: 'Credentials — учётные данные для входа.',
      },
      {
        id: 'e10-2',
        type: 'meaning',
        question: 'JWT stands for...',
        options: ['Java Web Tool', 'JSON Web Token', 'JavaScript Widget Type', 'Just Wait Time'],
        correctIndex: 1,
        explanationRu: 'JWT = JSON Web Token.',
      },
      {
        id: 'e10-3',
        type: 'meaning',
        question: 'Protected routes require...',
        options: ['Special styling', 'User to be logged in', 'Admin permission always', 'No database'],
        correctIndex: 1,
        explanationRu: 'Защищённые маршруты требуют входа в систему.',
      },
      {
        id: 'e10-4',
        type: 'meaning',
        question: 'Session means...',
        options: ['A page', 'Period when user is authenticated', 'A database table', 'A file type'],
        correctIndex: 1,
        explanationRu: 'Сессия — период, когда пользователь авторизован.',
      },
      {
        id: 'e10-5',
        type: 'meaning',
        question: 'Redirect means...',
        options: ['Delete page', 'Send user to another page', 'Refresh data', 'Close browser'],
        correctIndex: 1,
        explanationRu: 'Redirect = перенаправить на другую страницу.',
      },
      {
        id: 'e10-6',
        type: 'meaning',
        question: 'Admin vs regular user is a matter of...',
        options: ['Authentication', 'Authorization', 'Styling', 'Speed'],
        correctIndex: 1,
        explanationRu: 'Разница между админом и обычным пользователем — авторизация.',
      },
    ],
    consolidation: [
      {
        id: 'c10-1',
        type: 'meaning',
        question: 'Authentication = who you are. Authorization = ...',
        options: ['Where you are', 'What you can do', 'When you joined'],
        correctIndex: 1,
        explanationRu: 'Аутентификация — кто ты, авторизация — что тебе можно.',
      },
      {
        id: 'c10-2',
        type: 'meaning',
        question: 'Tokens help the server...',
        options: ['Style pages', 'Know who is making requests', 'Delete users'],
        correctIndex: 1,
        explanationRu: 'Токены помогают серверу узнать, кто делает запрос.',
      },
      {
        id: 'c10-3',
        type: 'meaning',
        question: 'If not logged in, protected route...',
        options: ['Shows error', 'Redirects to login', 'Deletes data'],
        correctIndex: 1,
        explanationRu: 'Без входа защищённый маршрут перенаправляет на логин.',
      },
    ],
  },
  {
    text: {
      id: 'day-11',
      day: 11,
      focus: 'Notice how URLs map to different screens — that is routing.',
      focusRu: 'Замечай, как URL соответствуют разным экранам — это роутинг.',
      title: 'Routing and Navigation',
      content: `In a single-page application, routing determines which component displays based on the URL. When you go to /products, you see the products page. When you go to /about, you see the about page. The URL changes, but the whole page does not reload — only the relevant component updates.

Routes are defined as mappings: path "/products" → ProductsPage component, path "/about" → AboutPage component. A router library like React Router handles matching the current URL to the right component.

Dynamic routes use parameters. The path /products/:id means "products slash any ID". If you visit /products/42, the router matches this route and provides 42 as the id parameter. The component can then fetch and display product 42.

Navigation happens through links or programmatic navigation. A <Link to="/products"> component creates a clickable link. Programmatic navigation like navigate("/products") changes the URL from code — useful after form submission or when conditions are met.

Nested routes create layout hierarchies. A /dashboard route might have nested routes /dashboard/settings and /dashboard/profile. The dashboard layout stays visible while the nested content changes.

When working with AI tools, describe routes clearly: "create a /users/:id page that shows user details" or "add navigation links in the header to Home, Products, and About pages". Clear route descriptions lead to correct navigation structure.`,
      vocabulary: [
        { word: 'routing', translation: 'роутинг (маршрутизация)' },
        { word: 'route', translation: 'маршрут (путь)' },
        { word: 'URL', translation: 'URL (адрес страницы)' },
        { word: 'parameter', translation: 'параметр (:id в URL)' },
        { word: 'Link', translation: 'Link (компонент ссылки)' },
        { word: 'navigate', translation: 'навигация (переход)' },
        { word: 'nested routes', translation: 'вложенные маршруты' },
        { word: 'single-page app', translation: 'одностраничное приложение' },
      ],
    },
    tasks: [
      {
        id: 't11-1',
        type: 'meaning',
        question: 'Routing determines...',
        options: [
          'Database structure',
          'Which component shows based on URL',
          'API response format',
          'Color scheme',
        ],
        correctIndex: 1,
        explanationRu: 'Роутинг определяет, какой компонент показывать по URL.',
      },
      {
        id: 't11-2',
        type: 'meaning',
        question: 'In /products/:id, what is :id?',
        options: ['A fixed path', 'A dynamic parameter', 'An error', 'A component name'],
        correctIndex: 1,
        explanationRu: ':id — динамический параметр, может быть любым значением.',
      },
      {
        id: 't11-3',
        type: 'meaning',
        question: 'In a single-page app, when URL changes...',
        options: [
          'Whole page reloads',
          'Only the relevant component updates',
          'Nothing happens',
          'User logs out',
        ],
        correctIndex: 1,
        explanationRu: 'В SPA обновляется только нужный компонент, без перезагрузки.',
      },
      {
        id: 't11-4',
        type: 'reflection',
        question: 'Какие маршруты нужны для блога? (можно по-русски)',
        questionRu: 'Опиши 3-4 страницы и их URL.',
      },
    ],
    extraPractice: [
      {
        id: 'e11-1',
        type: 'meaning',
        question: '<Link to="/about"> creates...',
        options: ['A button', 'A clickable link', 'A form', 'An image'],
        correctIndex: 1,
        explanationRu: 'Link создаёт кликабельную ссылку.',
      },
      {
        id: 'e11-2',
        type: 'meaning',
        question: 'navigate("/home") is...',
        options: ['Declarative link', 'Programmatic navigation', 'A CSS rule', 'A database query'],
        correctIndex: 1,
        explanationRu: 'navigate() — программный переход на страницу.',
      },
      {
        id: 'e11-3',
        type: 'meaning',
        question: 'Nested routes are useful for...',
        options: ['Deleting pages', 'Layout hierarchies', 'Database design', 'Authentication only'],
        correctIndex: 1,
        explanationRu: 'Вложенные маршруты создают иерархию layouts.',
      },
      {
        id: 'e11-4',
        type: 'meaning',
        question: '/products/42 matches route /products/:id with id =',
        options: ['products', '42', ':id', 'undefined'],
        correctIndex: 1,
        explanationRu: 'Параметр id будет равен 42.',
      },
      {
        id: 'e11-5',
        type: 'meaning',
        question: 'React Router is...',
        options: ['A database', 'A routing library', 'A CSS framework', 'An API'],
        correctIndex: 1,
        explanationRu: 'React Router — библиотека для роутинга.',
      },
      {
        id: 'e11-6',
        type: 'meaning',
        question: 'Single-page app means...',
        options: ['Only one page ever', 'Page updates without full reload', 'No navigation', 'No URLs'],
        correctIndex: 1,
        explanationRu: 'SPA — страница обновляется без полной перезагрузки.',
      },
    ],
    consolidation: [
      {
        id: 'c11-1',
        type: 'meaning',
        question: 'URL path maps to...',
        options: ['Database table', 'A component to display', 'An API endpoint'],
        correctIndex: 1,
        explanationRu: 'URL path соответствует компоненту для отображения.',
      },
      {
        id: 'c11-2',
        type: 'meaning',
        question: ':id in a route is...',
        options: ['Fixed text', 'A dynamic parameter', 'An error'],
        correctIndex: 1,
        explanationRu: ':id — динамический параметр.',
      },
      {
        id: 'c11-3',
        type: 'meaning',
        question: 'Link component creates...',
        options: ['Navigation without reload', 'Full page reload', 'API request'],
        correctIndex: 0,
        explanationRu: 'Link создаёт навигацию без перезагрузки страницы.',
      },
    ],
  },
  {
    text: {
      id: 'day-12',
      day: 12,
      focus: 'Notice how visual properties are expressed — spacing, colors, layout.',
      focusRu: 'Замечай, как выражаются визуальные свойства — отступы, цвета, раскладка.',
      title: 'Styling with CSS and Tailwind',
      content: `Every element on a webpage has visual properties: colors, sizes, spacing, fonts, borders, shadows. CSS (Cascading Style Sheets) is the language that defines these properties. Understanding basic CSS concepts helps you communicate design intent.

The box model is fundamental. Every element is a box with content, padding, border, and margin. Padding is space inside the border. Margin is space outside the border. When you say "add more spacing between cards", you mean increase the margin.

Flexbox and Grid are layout systems. Flexbox arranges items in a row or column: display: flex, flex-direction: row. Grid creates two-dimensional layouts with rows and columns. When describing layouts, terms like "center the items" or "space them evenly" refer to flexbox properties.

Tailwind CSS is a utility-first framework. Instead of writing CSS files, you add classes directly to elements: <div className="p-4 bg-blue-500 text-white">. p-4 means padding level 4, bg-blue-500 is background color, text-white is text color. This is very common in AI-built apps.

Responsive design makes layouts work on different screen sizes. Classes like md:flex-row mean "on medium screens and larger, use row direction". Mobile-first means you design for small screens first, then add rules for larger screens.

When requesting styles from AI, be specific: "center the content horizontally and vertically", "add 16px padding", "make it rounded with a shadow", "on mobile, stack items vertically". Visual vocabulary leads to precise results.`,
      vocabulary: [
        { word: 'CSS', translation: 'CSS (язык стилей)' },
        { word: 'padding', translation: 'padding (внутренний отступ)' },
        { word: 'margin', translation: 'margin (внешний отступ)' },
        { word: 'flexbox', translation: 'flexbox (система раскладки)' },
        { word: 'grid', translation: 'grid (сетка)' },
        { word: 'Tailwind', translation: 'Tailwind (CSS-фреймворк)' },
        { word: 'responsive', translation: 'адаптивный (под разные экраны)' },
        { word: 'utility class', translation: 'утилитарный класс (p-4, bg-blue)' },
      ],
    },
    tasks: [
      {
        id: 't12-1',
        type: 'meaning',
        question: 'What is padding?',
        options: [
          'Space outside the element',
          'Space inside the element, between content and border',
          'The element width',
          'The text color',
        ],
        correctIndex: 1,
        explanationRu: 'Padding — пространство внутри элемента, между контентом и границей.',
      },
      {
        id: 't12-2',
        type: 'meaning',
        question: 'Tailwind CSS uses...',
        options: [
          'Separate CSS files only',
          'Utility classes directly on elements',
          'No classes at all',
          'Only JavaScript',
        ],
        correctIndex: 1,
        explanationRu: 'Tailwind использует утилитарные классы прямо на элементах.',
      },
      {
        id: 't12-3',
        type: 'meaning',
        question: 'Flexbox is used for...',
        options: ['Database queries', 'Arranging items in rows/columns', 'Authentication', 'API calls'],
        correctIndex: 1,
        explanationRu: 'Flexbox раскладывает элементы в строки или колонки.',
      },
      {
        id: 't12-4',
        type: 'reflection',
        question: 'Как бы ты описал стиль карточки товара? (можно по-русски)',
        questionRu: 'Какие визуальные свойства важны?',
      },
    ],
    extraPractice: [
      {
        id: 'e12-1',
        type: 'meaning',
        question: 'Margin is...',
        options: ['Inside the element', 'Outside the element', 'The text size', 'The border color'],
        correctIndex: 1,
        explanationRu: 'Margin — внешний отступ, снаружи элемента.',
      },
      {
        id: 'e12-2',
        type: 'meaning',
        question: 'p-4 in Tailwind means...',
        options: ['Font size 4', 'Padding level 4', 'Paragraph 4', 'Position 4'],
        correctIndex: 1,
        explanationRu: 'p-4 означает padding уровня 4.',
      },
      {
        id: 'e12-3',
        type: 'meaning',
        question: 'bg-blue-500 sets...',
        options: ['Text color', 'Background color', 'Border color', 'Shadow'],
        correctIndex: 1,
        explanationRu: 'bg- устанавливает цвет фона.',
      },
      {
        id: 'e12-4',
        type: 'meaning',
        question: 'md:flex-row means...',
        options: ['Always row', 'Row on medium screens and larger', 'Row on mobile', 'Vertical always'],
        correctIndex: 1,
        explanationRu: 'md: — на средних экранах и больше.',
      },
      {
        id: 'e12-5',
        type: 'meaning',
        question: 'The box model includes...',
        options: ['Only content', 'Content, padding, border, margin', 'Only colors', 'Only size'],
        correctIndex: 1,
        explanationRu: 'Box model: content, padding, border, margin.',
      },
      {
        id: 'e12-6',
        type: 'meaning',
        question: 'Responsive design means...',
        options: ['Fast response', 'Works on different screen sizes', 'Uses only CSS', 'No JavaScript'],
        correctIndex: 1,
        explanationRu: 'Responsive = работает на разных размерах экрана.',
      },
    ],
    consolidation: [
      {
        id: 'c12-1',
        type: 'meaning',
        question: 'Padding is inside, margin is...',
        options: ['Also inside', 'Outside', 'The same thing'],
        correctIndex: 1,
        explanationRu: 'Padding внутри, margin снаружи.',
      },
      {
        id: 'c12-2',
        type: 'meaning',
        question: 'Tailwind uses classes like p-4 which are...',
        options: ['Custom CSS files', 'Utility classes', 'JavaScript functions'],
        correctIndex: 1,
        explanationRu: 'Tailwind использует утилитарные классы.',
      },
      {
        id: 'c12-3',
        type: 'meaning',
        question: 'Flexbox helps with...',
        options: ['Database design', 'Layout arrangement', 'Authentication'],
        correctIndex: 1,
        explanationRu: 'Flexbox помогает с раскладкой элементов.',
      },
    ],
  },
  {
    text: {
      id: 'day-13',
      day: 13,
      focus: 'Notice where to look when something goes wrong — console, network, code.',
      focusRu: 'Замечай, где искать при ошибках — консоль, сеть, код.',
      title: 'Debugging Strategies',
      content: `When code does not work as expected, debugging is the process of finding and fixing the problem. Good debugging is a skill that saves hours of frustration. The key is knowing where to look and what information to gather.

The browser console is your first stop. Errors appear there with messages and line numbers. A TypeError means you tried to do something with the wrong type of value. A ReferenceError means you used a variable that does not exist. Read the error message carefully — it often tells you exactly what went wrong.

The network tab shows all HTTP requests. If data is not loading, check if the request was sent. Look at the status code: 200 is success, 4xx is client error (your request was wrong), 5xx is server error. Click on a request to see headers, payload, and response.

console.log() is the simplest debugging tool. Add it to see what values variables have at different points: console.log("user data:", user). This helps you find where values become undefined or wrong.

React DevTools shows component hierarchy and state. You can inspect what props each component received and what its current state is. This is essential for debugging React applications.

When describing bugs to AI, be specific: "clicking the submit button does nothing, console shows 'Cannot read property email of undefined'". Include what you expected, what actually happened, and any error messages. Clear bug reports lead to faster fixes.`,
      vocabulary: [
        { word: 'debugging', translation: 'отладка (поиск ошибок)' },
        { word: 'console', translation: 'консоль (окно ошибок)' },
        { word: 'TypeError', translation: 'TypeError (ошибка типа)' },
        { word: 'ReferenceError', translation: 'ReferenceError (переменная не найдена)' },
        { word: 'network tab', translation: 'вкладка Network (сетевые запросы)' },
        { word: 'console.log', translation: 'console.log (вывод в консоль)' },
        { word: 'DevTools', translation: 'DevTools (инструменты разработчика)' },
        { word: 'undefined', translation: 'undefined (нет значения)' },
      ],
    },
    tasks: [
      {
        id: 't13-1',
        type: 'meaning',
        question: 'Where do JavaScript errors appear?',
        options: ['In the URL', 'In the browser console', 'In the HTML', 'Nowhere'],
        correctIndex: 1,
        explanationRu: 'Ошибки JavaScript отображаются в консоли браузера.',
      },
      {
        id: 't13-2',
        type: 'meaning',
        question: 'TypeError usually means...',
        options: [
          'Typing too fast',
          'Using wrong type of value',
          'Network error',
          'Missing file',
        ],
        correctIndex: 1,
        explanationRu: 'TypeError — попытка использовать значение неправильного типа.',
      },
      {
        id: 't13-3',
        type: 'meaning',
        question: 'The Network tab shows...',
        options: ['CSS styles', 'HTTP requests and responses', 'Component tree', 'Memory usage'],
        correctIndex: 1,
        explanationRu: 'Network tab показывает HTTP запросы и ответы.',
      },
      {
        id: 't13-4',
        type: 'reflection',
        question: 'Что бы ты проверил, если данные не загружаются? (можно по-русски)',
        questionRu: 'Какие шаги отладки предпримешь?',
      },
    ],
    extraPractice: [
      {
        id: 'e13-1',
        type: 'meaning',
        question: 'console.log() is used to...',
        options: ['Create variables', 'Print values for debugging', 'Style elements', 'Make API calls'],
        correctIndex: 1,
        explanationRu: 'console.log() выводит значения для отладки.',
      },
      {
        id: 'e13-2',
        type: 'meaning',
        question: 'ReferenceError means...',
        options: ['Wrong type', 'Variable does not exist', 'Network failed', 'Syntax error'],
        correctIndex: 1,
        explanationRu: 'ReferenceError — переменная не существует.',
      },
      {
        id: 'e13-3',
        type: 'meaning',
        question: '404 status code in Network tab means...',
        options: ['Success', 'Not found', 'Server error', 'Created'],
        correctIndex: 1,
        explanationRu: '404 — ресурс не найден.',
      },
      {
        id: 'e13-4',
        type: 'meaning',
        question: 'React DevTools shows...',
        options: ['CSS only', 'Component tree and state', 'Database tables', 'Server logs'],
        correctIndex: 1,
        explanationRu: 'React DevTools показывает дерево компонентов и состояние.',
      },
      {
        id: 'e13-5',
        type: 'meaning',
        question: 'undefined means...',
        options: ['Zero', 'Empty string', 'No value assigned', 'Error'],
        correctIndex: 2,
        explanationRu: 'undefined — значение не присвоено.',
      },
      {
        id: 'e13-6',
        type: 'meaning',
        question: '5xx errors are...',
        options: ['Client errors', 'Server errors', 'Success codes', 'Redirects'],
        correctIndex: 1,
        explanationRu: '5xx — ошибки на стороне сервера.',
      },
    ],
    consolidation: [
      {
        id: 'c13-1',
        type: 'meaning',
        question: 'First place to check for errors is...',
        options: ['The URL bar', 'Browser console', 'Database'],
        correctIndex: 1,
        explanationRu: 'Первое место для проверки ошибок — консоль браузера.',
      },
      {
        id: 'c13-2',
        type: 'meaning',
        question: 'Network tab helps debug...',
        options: ['CSS problems', 'API and data loading issues', 'Spelling errors'],
        correctIndex: 1,
        explanationRu: 'Network tab помогает отлаживать API и загрузку данных.',
      },
      {
        id: 'c13-3',
        type: 'meaning',
        question: 'Good bug report includes...',
        options: ['Only "it broke"', 'Expected vs actual + error messages', 'Just the URL'],
        correctIndex: 1,
        explanationRu: 'Хороший отчёт: ожидаемое, фактическое, сообщения об ошибках.',
      },
    ],
  },
  {
    text: {
      id: 'day-14',
      day: 14,
      focus: 'Notice how you describe what you want — clarity leads to better results.',
      focusRu: 'Замечай, как ты описываешь желаемое — ясность ведёт к лучшим результатам.',
      title: 'Effective Prompting for AI Development',
      content: `Working with AI development tools is a conversation. The quality of what you get depends significantly on how you describe what you want. This is called prompting. Good prompting is a learnable skill.

Start with context. Before asking for changes, describe the current state: "I have a products page that shows a list of products. Each product has a name, price, and image." Context helps the AI understand what already exists.

Be specific about outcomes. "Make it better" is vague. "Add a search bar that filters products by name as the user types" is specific. Include details: where should it appear, what should happen, what data should it use.

Use technical terms you have learned. "Create a ProductCard component that takes title, price, and imageUrl as props" is much clearer than "make a thing that shows product info". The vocabulary from this course gives you precise words.

Break large requests into steps. Instead of "build an e-commerce site", start with "create a header with logo and navigation links". Then "add a products grid on the home page". Then "create a product detail page". Small steps are easier to verify and correct.

When something is wrong, describe the problem clearly. "When I click Add to Cart, nothing happens. Console shows 'undefined is not a function'. The button should add the item to the cart state." This tells the AI what happened, what you saw, and what you expected.

Iterate and refine. If the first result is not quite right, explain what to change: "The spacing is too tight, add more padding between cards". Each interaction teaches you how to communicate more effectively with AI tools.`,
      vocabulary: [
        { word: 'prompting', translation: 'промптинг (составление запросов)' },
        { word: 'context', translation: 'контекст (текущее состояние)' },
        { word: 'specific', translation: 'конкретный, точный' },
        { word: 'vague', translation: 'расплывчатый, неясный' },
        { word: 'iterate', translation: 'итерировать (повторять с улучшениями)' },
        { word: 'refine', translation: 'уточнять, улучшать' },
        { word: 'outcome', translation: 'результат' },
        { word: 'verify', translation: 'проверять' },
      ],
    },
    tasks: [
      {
        id: 't14-1',
        type: 'meaning',
        question: 'Good prompts should be...',
        options: ['As short as possible', 'Specific and clear', 'Very technical only', 'Vague to allow creativity'],
        correctIndex: 1,
        explanationRu: 'Хорошие промпты должны быть конкретными и ясными.',
      },
      {
        id: 't14-2',
        type: 'meaning',
        question: 'Why provide context before asking for changes?',
        options: [
          'To make the prompt longer',
          'So AI understands what already exists',
          'It is not important',
          'To confuse the AI',
        ],
        correctIndex: 1,
        explanationRu: 'Контекст помогает AI понять, что уже существует.',
      },
      {
        id: 't14-3',
        type: 'meaning',
        question: 'Breaking large requests into steps helps because...',
        options: [
          'It is slower',
          'Each step is easier to verify and correct',
          'AI prefers long requests',
          'It uses more credits',
        ],
        correctIndex: 1,
        explanationRu: 'Маленькие шаги легче проверять и исправлять.',
      },
      {
        id: 't14-4',
        type: 'reflection',
        question: 'Как бы ты описал AI задачу "добавить корзину товаров"? (можно по-русски)',
        questionRu: 'Напиши пример хорошего промпта.',
      },
    ],
    extraPractice: [
      {
        id: 'e14-1',
        type: 'meaning',
        question: '"Make it better" is an example of...',
        options: ['Specific prompt', 'Vague prompt', 'Technical prompt', 'Perfect prompt'],
        correctIndex: 1,
        explanationRu: '"Make it better" — расплывчатый, неясный промпт.',
      },
      {
        id: 'e14-2',
        type: 'meaning',
        question: 'Iterate means...',
        options: ['Do once and stop', 'Repeat and improve', 'Delete everything', 'Ignore feedback'],
        correctIndex: 1,
        explanationRu: 'Iterate = повторять с улучшениями.',
      },
      {
        id: 'e14-3',
        type: 'meaning',
        question: 'Using technical terms helps because...',
        options: ['They sound impressive', 'AI understands precisely what you mean', 'They are shorter', 'Not helpful'],
        correctIndex: 1,
        explanationRu: 'Технические термины помогают AI понять точно, что вы имеете в виду.',
      },
      {
        id: 'e14-4',
        type: 'meaning',
        question: 'When describing a bug, include...',
        options: ['Only that it is broken', 'What happened, what you expected, error messages', 'Only the error', 'Nothing'],
        correctIndex: 1,
        explanationRu: 'Описание бага: что случилось, что ожидали, ошибки.',
      },
      {
        id: 'e14-5',
        type: 'meaning',
        question: 'Refine means...',
        options: ['Start over', 'Make small improvements', 'Delete', 'Ignore'],
        correctIndex: 1,
        explanationRu: 'Refine = уточнять, улучшать.',
      },
      {
        id: 'e14-6',
        type: 'meaning',
        question: 'Context in a prompt is...',
        options: ['Not needed', 'Description of current state', 'Error messages only', 'CSS styles'],
        correctIndex: 1,
        explanationRu: 'Контекст — описание текущего состояния.',
      },
    ],
    consolidation: [
      {
        id: 'c14-1',
        type: 'meaning',
        question: 'Effective prompts are...',
        options: ['Vague and short', 'Specific and clear', 'As technical as possible'],
        correctIndex: 1,
        explanationRu: 'Эффективные промпты — конкретные и ясные.',
      },
      {
        id: 'c14-2',
        type: 'meaning',
        question: 'Large tasks should be...',
        options: ['Done in one request', 'Broken into smaller steps', 'Avoided'],
        correctIndex: 1,
        explanationRu: 'Большие задачи лучше разбивать на шаги.',
      },
      {
        id: 'c14-3',
        type: 'meaning',
        question: 'Technical vocabulary helps you...',
        options: ['Confuse the AI', 'Communicate precisely', 'Write less'],
        correctIndex: 1,
        explanationRu: 'Техническая лексика помогает общаться точно.',
      },
    ],
  },
];

export function getDailyLesson(day: number): DailyLesson | undefined {
  return dailyLessons.find((lesson) => lesson.text.day === day);
}

export function getTotalDays(): number {
  return dailyLessons.length;
}
