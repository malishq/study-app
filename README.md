# Учёба — мини-приложение для @malishq_bot

Личное приложение внутри Telegram на чёрном основании с нежно-розовыми вставками: предметы, задания и тесты из СДО, сроки, оценки, баллы БРС из журнала оценок, материалы курсов, очередь загрузки работ и отчёты проверки. Данные собирает бот на Маке, приложение только показывает их и передаёт боту команды.

## Как это работает

1. `study-watch.py` раз в 30 минут читает СДО и сохраняет состояние в `~/.local/state/study-watch.json`.
2. `study-app-publish.py` собирает из состояния JSON для приложения, шифрует его (AES-256-CBC + HMAC-SHA256, ключ `APP_KEY` из `~/.config/study-tg.env`) и выкладывает вместе с собранным приложением в ветку `gh-pages` этого репозитория.
3. Приложение открывается из бота кнопкой «💗 Учёба» под клавиатурой: ссылка несёт ключ, приложение запоминает его в CloudStorage Telegram и расшифровывает данные в браузере.
4. Кнопки «Обновить из СДО», «Проверить и подгрузить», «Загрузить и отправить» отправляют боту команду через `sendData`, бот выполняет её и отвечает в чат.

Без ключа страница показывает только заставку: сами данные в репозитории зашифрованы.

## Запуск

```bash
npm install
npm run dev        # http://localhost:5173/study-app/?demo=1 — демо-данные
npm test
scripts/install.sh # сборка, копия в ~/.local/share/study-app/site и публикация
```

Первый раз после создания репозитория: `scripts/publish.sh` делает репозиторий публичным и включает GitHub Pages из ветки `gh-pages`.

Для проверки на реальных данных локально: `python3 ~/.claude/bin/study-app-publish.py --out public/data/state.json`, затем открыть `http://localhost:5173/study-app/?k=<APP_KEY>`.

## Стек

React 19, TypeScript, Vite, Tailwind CSS 4, GSAP, Telegram Mini Apps SDK; шрифт Manrope. Бот — `~/.claude/bin/study-bot.py` (python-stdlib, long polling).

## Экраны (демо-данные)

| Главная | Сроки | Предмет |
| --- | --- | --- |
| ![Главная](docs/screens/home.png) | ![Сроки](docs/screens/deadlines.png) | ![Предмет](docs/screens/subject.png) |

![В браузере на компьютере](docs/screens/desktop.png)
