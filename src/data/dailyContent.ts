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
];

export function getDailyLesson(day: number): DailyLesson | undefined {
  return dailyLessons.find((lesson) => lesson.text.day === day);
}

export function getTotalDays(): number {
  return dailyLessons.length;
}
