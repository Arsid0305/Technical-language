# Техническое задание

> Для начинающего программиста. Версия 1.0.

---

## 1. Назначение системы

Автоматизированная система мониторинга акций Wildberries, расчёта промо-цен и формирования шаблонов загрузки.

**Стек:** Python 3.11, Google Sheets API (gspread), WB REST API, Telegram Bot API, GitHub Actions.

**Режим работы:** Cron-задача, запускается один раз в сутки в 06:00 (UTC+3).

---

## 2. Переменные окружения

Все секреты хранятся в **GitHub Secrets** (Settings → Secrets → Actions). В коде секреты читаются через `os.environ`.

```
WB_TOKEN              — API-токен Wildberries (тип: Personal)
GOOGLE_CREDENTIALS    — JSON сервисного аккаунта Google (кодированный в base64)
SPREADSHEET_ID        — ID таблицы Google Sheets (из URL таблицы)
TELEGRAM_TOKEN        — Токен Telegram-бота (от @BotFather)
TELEGRAM_CHAT_ID      — Ваш Telegram chat ID (получить через @userinfobot)
WB_COMMISSION         — Комиссия WB для категории (например: 0.15)
LOGISTICS_COST        — Стоимость логистики WB в рублях (например: 100)
```

---

## 3. Структура проекта

```
wb-promo-automation/
├── .github/
│   └── workflows/
│       └── daily_run.yml          # GitHub Actions — расписание
├── src/
│   ├── __init__.py
│   ├── wb_client.py               # Модуль 1: WB API
│   ├── sheets_client.py           # Модуль 2: Google Sheets
│   ├── snapshot.py                # Модуль 3: Снимки и события
│   ├── calculator.py              # Модуль 4: Расчёт цен
│   ├── validator.py               # Модуль 5: Валидация
│   ├── template_generator.py      # Модуль 6: Excel-шаблон
│   └── notifier.py                # Модуль 7: Telegram
├── main.py                        # Оркестратор
├── config.py                      # Настройки из env
├── requirements.txt               # Библиотеки
└── README.md
```

---

## 4. Модуль 1: `wb_client.py`

Отвечает за все HTTP-запросы к WB API. **Только запросы — никакой бизнес-логики.**

### WB API endpoints

#### Акции (хост: `https://dp-calendar-api.wildberries.ru`)

```
GET /api/v1/calendar/promotions
    Параметры: startDateTime, endDateTime (ISO 8601)
    Возвращает: список акций [id, name, startDateTime, endDateTime, type, status]

GET /api/v1/calendar/promotions/details
    Параметры: promotionIDs (через запятую)
    Возвращает: детальная информация + массив ranging (условия буста в поиске)

GET /api/v1/calendar/promotions/nomenclatures
    Параметры: promotionID (один ID)
    Возвращает: [{nmID, inAction, price, planPrice, discount, planDiscount}]
    ВАЖНО: Для автоакций может вернуть пустой список — это нормальное поведение API.
```

#### Цены (хост: `https://discounts-prices-api.wildberries.ru`)

```
POST /api/v2/list/goods/filter
    Тело: {"filterNmIds": [nmID1, nmID2, ...]}
    Возвращает: [{nmID, vendorCode, discount, sizes: [{price, discountedPrice}]}]

GET /api/v2/quarantine/goods
    Возвращает: список товаров в карантине цен

POST /api/v2/upload/task              ← ЭТАП 2, пока не реализовывать
    Тело: {"data": [{"nmID": 123, "price": 1500, "discount": 20}]}
```

### Требования к реализации

- Авторизация: заголовок `Authorization: {WB_TOKEN}` (без Bearer)
- **Rate limit:** максимум 10 запросов за 6 секунд. Добавить паузу `time.sleep(0.7)` между запросами.
- **Retry при 429:** ждать 10 секунд, повторить до 3 раз.
- **При ошибках 5xx:** логировать ошибку, вернуть пустой список (не падать).
- Все запросы через `requests.Session`.

### Интерфейс класса

```python
class WBClient:
    def __init__(self, token: str): ...

    def get_promotions(self, start_date: date, end_date: date) -> list[dict]:
        """Список акций за период."""

    def get_promo_nomenclatures(self, promo_id: int) -> list[dict]:
        """Товары акции с planPrice. Может вернуть [] для автоакций."""

    def get_current_prices(self, nm_ids: list[int]) -> list[dict]:
        """Текущие цены и скидки по списку nmID."""

    def get_quarantine_goods(self) -> list[dict]:
        """Товары в карантине цен."""
```

---

## 5. Модуль 2: `sheets_client.py`

Чтение и запись данных в Google Sheets через библиотеку `gspread`.

### Подключение Google Sheets API

1. Google Cloud Console → создать проект
2. Включить Google Sheets API
3. Создать сервисный аккаунт → скачать JSON-ключ
4. Поделиться таблицей с email сервисного аккаунта (роль: Редактор)
5. JSON-ключ закодировать в base64 → добавить в `GOOGLE_CREDENTIALS`

### Интерфейс класса

```python
class SheetsClient:
    def __init__(self, credentials_b64: str, spreadsheet_id: str): ...

    def get_unit_economics(self) -> list[dict]:
        """Читает лист unit_economics. Возвращает только строки где isActive=TRUE."""

    def get_last_snapshot(self) -> list[dict]:
        """Читает строки из current_snapshot с максимальной датой (последний снимок)."""

    def write_snapshot(self, rows: list[dict]) -> None:
        """Добавляет строки в current_snapshot (не заменяет, а дописывает)."""

    def write_calculated_prices(self, rows: list[dict]) -> None:
        """Полностью перезаписывает лист calculated_prices."""

    def append_event(self, event: dict) -> None:
        """Добавляет строку в event_log."""

    def get_setting(self, key: str) -> str:
        """Читает значение из листа settings по ключу."""

    def update_setting(self, key: str, value: str) -> None:
        """Обновляет значение в листе settings."""
```

---

## 6. Модуль 3: `snapshot.py`

Строит снимок текущего состояния и сравнивает с предыдущим для нахождения событий.

### Интерфейс

```python
def build_snapshot(
    promotions: list[dict],
    nomenclatures_by_promo_id: dict[int, list[dict]],
    current_prices: list[dict]
) -> list[dict]:
    """Строит новый снимок из данных WB API."""


def detect_events(
    old_snapshot: list[dict],
    new_snapshot: list[dict],
    days_before_alert: int = 3
) -> list[dict]:
    """
    Сравнивает два снимка. Возвращает список событий.

    Типы событий:
    - NEW_PROMO      : promoID есть в новом снимке, нет в старом
    - PROMO_ENDING   : дата окончания акции через <= days_before_alert дней
    - PROMO_ENDED    : promoID был в старом снимке, нет в новом
    - SKU_DROPPED    : nmID был inAction=True, стал inAction=False
    - AUTO_PROMO_DETECTED : цена упала более чем на 10% без нашего действия

    Возвращает:
    [
        {
            "eventType": "NEW_PROMO",
            "promoID": 12345,
            "promoName": "Летние скидки",
            "promoStartDate": "2025-07-01",
            "promoEndDate": "2025-07-15",
            "affectedNmIDs": [111, 222, 333]
        },
        ...
    ]
    """
```

---

## 7. Модуль 4: `calculator.py`

Рассчитывает промо-цену на основе unit-экономики.

### Формула расчёта

```
total_cost = costPrice + packagingCost + deliveryToWB + logistics_cost

min_allowed_price = total_cost / (1 - wb_commission) / (1 - min_margin_percent / 100)

Расчёт итоговой цены:
  если planPrice >= min_allowed_price → calculated_price = planPrice  (статус: OK)
  если planPrice < min_allowed_price  → calculated_price = min_allowed_price  (статус: WARNING)
  если planPrice < total_cost         → BLOCK: "Цена ниже себестоимости"

Скидка рассчитывается от текущей базовой цены:
  discount = round((1 - calculated_price / current_price) * 100)
```

### Интерфейс

```python
def calculate_promo_price(
    unit_econ: dict,
    plan_price: float,
    current_price: float,
    wb_commission: float,
    logistics_cost: float
) -> dict:
    """
    Возвращает:
    {
        "minAllowedPrice": 1200.0,
        "calculatedPromoPrice": 1500.0,
        "calculatedDiscount": 20,
        "marginPercent": 18.5,
        "status": "OK" | "WARNING" | "BLOCKED",
        "blockReason": None | "строка с причиной"
    }
    """
```

---

## 8. Модуль 5: `validator.py`

Финальная проверка перед включением товара в шаблон.

### Правила валидации

| ID | Проверка | Тип | Сообщение |
|----|----------|:---:|-----------|
| V001 | Цена не пустая и > 0 | BLOCK | Цена не рассчитана |
| V002 | calculatedPrice ≥ minAllowedPrice | BLOCK | Цена {price} руб. ниже минимально допустимой {minAllowedPrice} руб. |
| V003 | calculatedPrice ≥ currentPrice / 3 | BLOCK | Риск карантина WB: цена снижается более чем в 3 раза |
| V004 | marginPercent ≥ 0 | BLOCK | Маржа отрицательная: продажа в убыток |
| V005 | marginPercent ≥ minMarginPercent | WARNING | Маржа {actual}% ниже желаемых {desired}% |
| V006 | discount ≤ 95 | BLOCK | Скидка {discount}% превышает допустимые 95% |

### Интерфейс

```python
def validate(calculated: dict, unit_econ: dict, current_price: float) -> dict:
    """
    Принимает результат calculator.calculate_promo_price().
    Возвращает тот же dict с обновлёнными полями status и blockReason.
    Если найден BLOCK — статус BLOCKED, остальные правила не проверяются.
    Если найден WARNING (нет BLOCK) — статус WARNING.
    """
```

---

## 9. Модуль 6: `template_generator.py`

Формирует Excel-файл для ручной загрузки на Wildberries.

### Формат выходного файла

Лист «Цены» (стандартный формат WB для загрузки цен):

| Артикул WB (nmID) | Цена | Скидка % |
|-------------------|------|----------|
| 123456789 | 1500 | 20 |

В файл включаются только товары со статусом **OK** и **WARNING**.
Товары со статусом **BLOCKED** не включаются.

### Имя файла

Формат: `YYYY-MM-DD_[название_акции]_цены.xlsx`
Пример: `2025-07-01_Летние_скидки_цены.xlsx`

### Интерфейс

```python
def generate_wb_template(
    prices: list[dict],
    promo_name: str,
    promo_date: str
) -> bytes:
    """Возвращает Excel-файл как bytes для отправки в Telegram."""
```

---

## 10. Модуль 7: `notifier.py`

Отправка уведомлений и файлов в Telegram.

### Типы сообщений

#### Ежедневная сводка
```
📊 Сводка акций WB — 15 июля 2025

✅ Новых акций: 2
⚠️ Заканчивается (3 дня): 1 — «Летние скидки»
🔴 Нет следующей акции для 3 товаров
🚫 Заблокировано по цене: 1 товар

📎 Готово шаблонов для загрузки: 2
```

#### Новая акция (с прикреплённым Excel-файлом)
```
🆕 Новая акция: «Летние скидки»
Начало: 16 июля | Конец: 31 июля

Товаров в акции: 12
  ✅ Готово к загрузке: 11
  🚫 Заблокировано: 1
     → Арт. 123456789 (Крем для рук): цена ниже минимальной

📎 Прикреплён шаблон. Проверьте и загрузите на WB.
```

#### Акция заканчивается
```
⚠️ Акция заканчивается через 3 дня
«Летние скидки» → 31 июля 2025
Товаров в акции: 12

✅ Следующая акция: «Август-фест» начинается 1 августа
```

```
⚠️ Акция заканчивается через 3 дня
«Летние скидки» → 31 июля 2025
Товаров в акции: 12

🔴 ВНИМАНИЕ: следующей акции не найдено!
Товары выпадут из промо. Проверьте акции в ЛК WB.
```

#### Заблокированный товар
```
🚫 Товар не включён в шаблон
Артикул: 123456789
Товар: Крем для рук 50мл
Причина: Цена 800 руб. ниже минимально допустимой 1 200 руб.

Что сделать: обновите себестоимость в таблице unit_economics.
```

### Интерфейс

```python
class Notifier:
    def __init__(self, token: str, chat_id: str): ...

    def send_daily_summary(self, stats: dict) -> None: ...
    def send_new_promo_alert(self, promo: dict, template_bytes: bytes, stats: dict) -> None: ...
    def send_promo_ending_alert(self, promo: dict, next_promo: dict | None) -> None: ...
    def send_blocked_price_alert(self, nm_id: int, product_name: str, reason: str) -> None: ...
    def send_api_error_alert(self, error: str) -> None: ...
```

---

## 11. Файл запуска `main.py`

```python
from datetime import date, timedelta
from src.wb_client import WBClient
from src.sheets_client import SheetsClient
from src.snapshot import build_snapshot, detect_events
from src.calculator import calculate_promo_price
from src.validator import validate
from src.template_generator import generate_wb_template
from src.notifier import Notifier
import config

def run():
    wb = WBClient(token=config.WB_TOKEN)
    sheets = SheetsClient(config.GOOGLE_CREDENTIALS, config.SPREADSHEET_ID)
    bot = Notifier(config.TELEGRAM_TOKEN, config.TELEGRAM_CHAT_ID)

    # --- Сбор данных ---
    unit_economics = sheets.get_unit_economics()
    last_snapshot = sheets.get_last_snapshot()
    active_nm_ids = [s["nmID"] for s in unit_economics]

    today = date.today()
    promotions = wb.get_promotions(today, today + timedelta(days=30))
    current_prices = wb.get_current_prices(active_nm_ids)

    nomenclatures_by_promo = {}
    for promo in promotions:
        noms = wb.get_promo_nomenclatures(promo["id"])
        if noms:
            nomenclatures_by_promo[promo["id"]] = noms

    # --- Снимок и события ---
    new_snapshot = build_snapshot(promotions, nomenclatures_by_promo, current_prices)
    events = detect_events(last_snapshot, new_snapshot, config.DAYS_BEFORE_ALERT)

    # --- Обработка новых акций ---
    all_calculated = []
    for event in [e for e in events if e["eventType"] == "NEW_PROMO"]:
        promo_noms = nomenclatures_by_promo.get(event["promoID"], [])
        calculated = []

        for nom in promo_noms:
            sku = next((s for s in unit_economics if s["nmID"] == nom["nmID"]), None)
            if not sku:
                continue

            result = calculate_promo_price(
                unit_econ=sku,
                plan_price=nom["planPrice"],
                current_price=nom["price"],
                wb_commission=config.WB_COMMISSION,
                logistics_cost=config.LOGISTICS_COST
            )
            validated = validate(result, sku, nom["price"])
            row = {**nom, **sku, **validated, "promoName": event["promoName"],
                   "promoEndDate": event["promoEndDate"]}
            calculated.append(row)

            if validated["status"] == "BLOCKED":
                bot.send_blocked_price_alert(nom["nmID"], sku["productName"], validated["blockReason"])

        ok_rows = [r for r in calculated if r["status"] != "BLOCKED"]
        template = generate_wb_template(ok_rows, event["promoName"], event["promoStartDate"])
        bot.send_new_promo_alert(event, template, {
            "total": len(calculated), "ok": len(ok_rows), "blocked": len(calculated) - len(ok_rows)
        })
        all_calculated.extend(calculated)
        sheets.append_event({"eventType": "NEW_PROMO", "promoID": event["promoID"],
                              "promoName": event["promoName"], "description": f"Товаров: {len(calculated)}"})

    # --- Обработка заканчивающихся акций ---
    for event in [e for e in events if e["eventType"] == "PROMO_ENDING"]:
        next_promo = next(
            (p for p in promotions
             if p["startDateTime"][:10] >= event["promoEndDate"]
             and p["id"] != event["promoID"]),
            None
        )
        bot.send_promo_ending_alert(event, next_promo)
        sheets.append_event(event)

    # --- Сохранение результатов ---
    sheets.write_snapshot(new_snapshot)
    if all_calculated:
        sheets.write_calculated_prices(all_calculated)
    sheets.update_setting("last_run_date", today.isoformat())

    # --- Ежедневная сводка ---
    bot.send_daily_summary({
        "new_promos": len([e for e in events if e["eventType"] == "NEW_PROMO"]),
        "ending_promos": len([e for e in events if e["eventType"] == "PROMO_ENDING"]),
        "blocked_prices": len([r for r in all_calculated if r["status"] == "BLOCKED"])
    })


if __name__ == "__main__":
    run()
```

---

## 12. GitHub Actions: `.github/workflows/daily_run.yml`

```yaml
name: WB Promo Daily Check

on:
  schedule:
    - cron: '0 3 * * *'   # 06:00 Moscow time (UTC+3 = 03:00 UTC)
  workflow_dispatch:        # Ручной запуск через GitHub UI

jobs:
  run:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Python setup
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Run WB promo check
        env:
          WB_TOKEN: ${{ secrets.WB_TOKEN }}
          GOOGLE_CREDENTIALS: ${{ secrets.GOOGLE_CREDENTIALS }}
          SPREADSHEET_ID: ${{ secrets.SPREADSHEET_ID }}
          TELEGRAM_TOKEN: ${{ secrets.TELEGRAM_TOKEN }}
          TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
          WB_COMMISSION: ${{ secrets.WB_COMMISSION }}
          LOGISTICS_COST: ${{ secrets.LOGISTICS_COST }}
        run: python main.py
```

---

## 13. `requirements.txt`

```
requests==2.31.0
gspread==6.1.2
google-auth==2.29.0
openpyxl==3.1.2
python-telegram-bot==21.3
```

---

## 14. Требования к тестированию

Перед сдачей программист обязан проверить каждый из следующих сценариев:

| # | Тест | Ожидаемый результат |
|---|------|---------------------|
| 1 | Запуск скрипта вручную (`python main.py`) | Выполняется без ошибок, отчёт приходит в Telegram |
| 2 | Нет активных акций на WB | Скрипт завершается, сводка «Новых акций нет» |
| 3 | Есть новая акция | Создан Excel-файл, отправлен в Telegram |
| 4 | planPrice < minAllowedPrice | Товар заблокирован, уведомление с причиной, товара нет в Excel |
| 5 | planPrice в 4 раза ниже текущей цены | Товар заблокирован: «Риск карантина WB» |
| 6 | Акция заканчивается через 2 дня | Уведомление PROMO_ENDING отправлено |
| 7 | Нет следующей акции | Уведомление с пометкой «🔴 ВНИМАНИЕ: следующей акции нет» |
| 8 | Google Sheets обновился | Новые строки в current_snapshot, calculated_prices, event_log |
| 9 | Повторный запуск в тот же день | Не создаёт дубликаты в снимке |
| 10 | WB API вернул ошибку 500 | Скрипт не падает, в Telegram приходит уведомление об ошибке |
| 11 | Товар есть в акции, но нет в unit_economics | Товар молча пропускается, не блокирует работу |

---

## 15. Критерии приёмки MVP

- [ ] Скрипт запускается автоматически каждый день в 06:00
- [ ] При появлении новой акции приходит Telegram-сообщение с Excel-файлом
- [ ] За 3 дня до конца акции приходит предупреждение
- [ ] Если нет следующей акции — предупреждение с пометкой ВНИМАНИЕ
- [ ] Заблокированные товары не попадают в шаблон, о них отдельное уведомление
- [ ] Google Sheets обновляется: снимок + расчётные цены + лог событий
- [ ] При ошибке WB API система не падает, отправляет уведомление об ошибке
- [ ] Весь код хранится на GitHub с README-инструкцией по первичной настройке

---

## 16. Порядок сдачи работы

1. Код загружен на GitHub в репозиторий заказчика
2. Предоставлена инструкция по настройке (добавление секретов, доступ к таблице)
3. Совместный тест: программист запускает скрипт в присутствии заказчика
4. Заказчик проверяет все 11 тестовых сценариев
5. GitHub Actions работает автономно не менее 3 дней подряд
