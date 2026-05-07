# Структура Google Sheets (WB Promotions)

> Главный принцип: Excel = **интерфейс для принятия решений**, не хранилище логики.
> Каждый лист = **один слой**. Никаких ссылок между листами в хаотичном порядке.

---

## Общие правила (обязательно)

| Правило | Почему важно |
|---------|---------------|
| Одна строка = один SKU | Иначе Python не сможет читать данные |
| Нет merged cells | Мешают автоматизации |
| Единые названия полей | Проще миграция на Python позже |
| RAW-данные не редактируются руками | Никогда |
| Одна формула = одна задача | Не `=ЕСЛИ(A1="";B2*C3/(D4-E5)+...` |
| Нет ссылок `='Лист7'!G1482` | Только именованные диапазоны + VLOOKUP |

**Стандарт имён полей** (одинаковые на всех листах):
```
nmID | vendorCode | promoID | promoName | currentPrice | planPrice |
promoStart | promoEnd | margin | floorPrice | targetPrice | status
```

---

## Лист 1: `RAW_WB`

> Данные прямо из WB API. **Руками не трогать никогда.**
> Заполняет Python-скрипт.

| Поле | Тип | Источник |
|-------|-----|----------|
| nmID | число | WB API |
| vendorCode | текст | WB API |
| promoID | число | WB API |
| promoName | текст | WB API |
| promoStart | дата | WB API |
| promoEnd | дата | WB API |
| promoType | текст | WB API (`regular` / `auto`) |
| currentPrice | число | WB API |
| currentDiscount | число | WB API |
| planPrice | число | WB API (может быть пустым для автоакций) |
| planDiscount | число | WB API |
| inAction | TRUE/FALSE | WB API |
| fetchedAt | дата+время | Скрипт |

---

## Лист 2: `NORMALIZED`

> Приведение данных к единому виду.
> **Только VLOOKUP/XLOOKUP из RAW_WB.** Никаких ручных вводов.

| Поле | Откуда |
|-------|--------|
| nmID | RAW_WB |
| vendorCode | RAW_WB |
| promoID | RAW_WB |
| promoName | RAW_WB |
| promoStart | RAW_WB |
| promoEnd | RAW_WB |
| daysLeft | Формула: `=promoEnd - TODAY()` |
| currentPrice | RAW_WB |
| planPrice | RAW_WB |
| isAutoPromo | Формула: `=promoType="auto"` |

---

## Лист 3: `UNIT_ECONOMICS`

> **Заполняет продавец.** Обновлять при изменении себестоимости или тарифов WB.
> Только расчёты. Никаких сведений о конкретных акциях.

| Поле | Тип | Кто заполняет |
|-------|-----|----------------|
| nmID | число | Продавец |
| vendorCode | текст | Продавец |
| productName | текст | Продавец |
| isActive | TRUE/FALSE | Продавец |
| costPrice | число | Продавец |
| packagingCost | число | Продавец |
| deliveryToWB | число | Продавец |
| wbCommission | число | Продавец (0.15 = 15%) |
| logisticsCost | число | Продавец (актуальный тариф WB) |
| minMarginPercent | число | Продавец |
| totalCost | формула | `=costPrice+packagingCost+deliveryToWB+logisticsCost` |
| floorPrice | формула | `=totalCost/(1-wbCommission)/(1-minMarginPercent/100)` |

> **floorPrice** = минимально допустимая цена продажи. Ниже — убыток.

---

## Лист 4: `PROMO_SELECTION`

> Вы **вручную** выбираете: участвует товар в акции или нет.
> Скрипт читает столбец `selected` и включает только отмеченные товары в EXPORT.

| Поле | Кто заполняет | Описание |
|-------|----------------|----------|
| nmID | Скрипт | Из NORMALIZED |
| vendorCode | Скрипт | Для удобства |
| productName | Скрипт | Для удобства |
| promoName | Скрипт | Название акции |
| promoEnd | Скрипт | Дата окончания |
| planPrice | Скрипт | Что хочет WB |
| floorPrice | Скрипт | VLOOKUP из UNIT_ECONOMICS |
| targetPrice | Скрипт | `=MAX(planPrice, floorPrice)` |
| marginAtTarget | Скрипт | Расчётная маржа % |
| **selected** | **Вы** | **TRUE/FALSE — участвует в акции?** |
| notes | Вы | Любые комментарии |

---

## Лист 5: `VALIDATION`

> Автоматические проверки. **Ваш финальный фильтр** перед експортом.
> Если status = BLOCKED — товар не попадает в EXPORT.

| Поле | Описание |
|-------|----------|
| nmID | Копия из PROMO_SELECTION |
| targetPrice | Копия |
| V001_priceNotEmpty | `=targetPrice>0` |
| V002_aboveFloor | `=targetPrice>=floorPrice` |
| V003_noQuarantine | `=targetPrice>=currentPrice/3` |
| V004_marginPositive | `=marginAtTarget>=0` |
| V005_marginWarning | `=marginAtTarget>=minMarginPercent` |
| V006_discountLimit | `=discount<=95` |
| **status** | `=ЕСЛИ(НЕ(V001)*НЕ(V002)*НЕ(V003)*Не(V004)*НЕ(V006);"BLOCKED";ЕСЛИ(НЕ(V005);"WARNING";"OK"))` |
| blockReason | Причина блокировки |

**Коды статусов:**
- `OK` — зелёный фон
- `WARNING` — жёлтый фон (маржа ниже желаемой, но выше нуля)
- `BLOCKED` — красный фон, в EXPORT не попадает

---

## Лист 6: `EXPORT`

> Готовый шаблон для загрузки на WB.
> **Независим от остальных листов.** Только товары со статусом OK или WARNING и где selected=TRUE.

| Поле | Описание |
|-------|----------|
| nmID | Артикул WB |
| targetPrice | Итоговая цена |
| discount | Скидка % |

> Именно этот лист Python-скрипт преобразует в `.xlsx` и отправляет в Telegram.

---

## Лист 7: `EVENT_LOG`

> Журнал. Не редактировать. Заполняет скрипт.

| Поле | Описание |
|-------|----------|
| timestamp | Дата и время |
| eventType | NEW_PROMO / PROMO_ENDING / PRICE_BLOCKED / AUTO_PROMO_DETECTED / API_ERROR |
| nmID | Артикул |
| promoName | Название акции |
| description | Описание |

---

## Поток данных через листы

```
WB API → RAW_WB          (только запись, нет чтения)
          ↓
       NORMALIZED          (VLOOKUP из RAW_WB, нормализация)
          ↓
    UNIT_ECONOMICS         (ваша себестоимость, расчёт floorPrice)
          ↓
   PROMO_SELECTION         (вы выбираете selected=TRUE/FALSE)
          ↓
      VALIDATION           (автопроверка: OK / WARNING / BLOCKED)
          ↓
        EXPORT             (только OK+WARNING+selected → nmID|price|discount)
          ↓
  Python → .xlsx → Telegram → вы → вручная загрузка на WB
```
