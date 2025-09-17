# Kaelsi AI (AIAA)


## Оглавление
- Введение и стек
- Быстрый старт
- Скрипты (package.json)
- Capacitor: зачем и как используется
- Архитектура и директории
- Ключевые модули
- Сборка Android (debug/release)
- Траблшутинг и частые ошибки

## Введение и стек
Проект — Next.js 15 (App Router), React 19, TypeScript, TailwindCSS. Для мобильной обёртки используется Capacitor 7: он упаковывает экспортированный статический билд Next.js в Android-приложение. Глобальное состояние — Redux Toolkit + redux‑persist. Локализация — i18next. Графика/анимации — PIXI

Основные зависимости:
- next 15, react 19, typescript 5
- @reduxjs/toolkit, react-redux, redux-persist
- tailwindcss, radix‑ui, lucide‑react
- i18next, react‑i18next
- pixi.js, @pixi/*, pixi‑viewport
- Capacitor (@capacitor/core, @capacitor/android, плагины: device, push-notifications, @capgo/capacitor-social-login)
- cordova-plugin-purchase (IAP) — через `window.CdvPurchase`

## Быстрый старт
1) Установить Node.js LTS, pnpm/npm (любой менеджер пакетов) и Android Studio (для Android сборок).
2) Установить зависимости:
```bash
npm i
```
3) Создать .env с параметрами OAuth (если нужен Google Login в нативе):
```bash
NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID=ваш_google_client_id
NEXT_PUBLIC_API_URL = api url
```
4) Запуск веб‑версии (http://localhost:3000):
```bash
npm run dev
```

## Скрипты (package.json)
- `dev`: запуск Next в dev‑режиме.
- `build`: сборка Next (статическая, т.к. в `next.config.mjs` задано `output: 'export'`).
- `start`: запуск собранного Next (для Node‑сервера; в проекте основная цель — экспорт для Capacitor).
- `lint`: линтер Next (disabled on build — см. конфиг).
- `build:android`: `next build` → `npx cap sync` → переход в папку `android`. Подготовка нативного проекта после экспорта.
- `build:android:bundle`: как выше + сборка Android App Bundle (`./gradlew bundleRelease`).
- `build:android:release`: как выше + сборка APK (`./gradlew assembleRelease`).

Примечание: `cap sync` копирует содержимое `out/` (статический экспорт Next) в нативный проект. Папка `out` задаётся в `capacitor.config.ts` (`webDir: 'out'`).

## Capacitor: зачем и как используется
- **Зачем**: упаковать web‑приложение (Next export) в нативную оболочку, получить доступ к нативным API (девайс, push‑нотификации, социальный логин, биллинг через Cordova plugin).
- **Как**: 
  - Сначала `next build` (создаёт `out/` через `output: 'export'`).
  - Затем `npx cap sync` — синхронизирует web‑ресурсы и плагины в `android/` проект.
  - Сборка/запуск нативного приложения через Gradle/Android Studio.
- **Особенности конфигурации** (`capacitor.config.ts`):
  - `appId`, `appName`, `webDir: 'out'`
  - `server.androidScheme: 'file'` — важно для локальной загрузки экспортированных страниц
  - Плагин `CapgoSocialLogin` (Google) использует `NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID` и redirect на `http://localhost:3000/successfully-login` (см. `REDIRECT_URL`).

## Архитектура и директории
Важные директории верхнего уровня:
- `app/` — маршруты и страницы Next.js (App Router)
  - Примеры: `app/page.tsx`, `app/tarot/page.tsx`, `app/natal-chart/page.tsx`, `app/destiny-matrix/page.tsx`, `app/one-plus-one/page.tsx`, `app/auth/page.tsx`, `app/successfully-login/page.tsx`
  - Глобальные файлы: `app/layout.tsx`, `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx`
- `components/` — UI‑компоненты и фичи по доменам
  - `components/ui/*` — атомарные UI (кнопки, инпуты, селекты, иконки, тосты)
  - `components/sections/*` — крупные секции страниц (natal‑chart, tarot‑page, settings и т.д.)
  - `components/modals/*` — модальные окна (auth, settings, card info)
  - `components/layouts/*` — контейнеры/карточные лэйауты
  - `components/header`, `components/navigation`, `components/main`, `components/container`
  - `components/subcription/*` — paywall/подписка
- `providers/` — React‑провайдеры на уровне приложения
  - `auth-provider`, `analytics-provider`, `i18n-provider`, `notify-provider`, `redux-provider`, `websocket-provider`, `animation-provider`, `error-provider`
- `store/` — Redux Toolkit
  - `slices/*` — слайсы: `auth`, `user`, `ui`, `tarot`, `astro`, `purchase`
  - `selectors/*` — селекторы по доменам
  - `hooks.ts`, `index.ts`, `helpers.ts`
- `hooks/` — кастомные хуки (авторизация, астрология, покупка, локаль, таймзона и др.)
- `lib/` — сервисы, типы, утилиты
  - `lib/services/*` — интеграции (analytics, astro‑api, purchase, social auth, pixi и др.)
  - `lib/types/*` — общие типы
  - `lib/utils/*` — очереди, валидация, локалсторадж, debounce и прочее
  - `lib/i18n/*` — конфиг локализации и словари `en.json`, `ru.json`, `uk.json`
- `public/` и `assets/` — статические ресурсы, изображения, анимации, карты таро
- `styles/` — глобальные стили, оптимизации (`globals.css`, `optimizations.css`)
- `android/` — сгенерированный проект Android (Capacitor)

## Ключевые модули
- Локализация: `lib/i18n/index.ts`, словари в `lib/i18n/locales/*.json`.
- Покупки (IAP): `lib/services/purchase.ts`
  - Обёртка над `window.CdvPurchase` (cordova‑plugin‑purchase)
  - На web `initialize()` бросит ошибку, если нет нативной среды: `WRONG_PLATFORM`/`UNHANDLED_ERROR`
  - Методы: `initialize`, `registerProducts`, `getProducts`, `purchaseProduct`, `restorePurchases`
- Социальная авторизация (Android): `lib/services/capacitor-game-auth.ts` и плагин `@capgo/capacitor-social-login` (см. `capacitor.config.ts`)
- Графика/таро: компоненты в `components/sections/tarot-page/*` и `components/ui/card/*`, данные карт в `components/ui/card/cards-data.ts`
- Redux слайсы: `store/slices/*` (например, `store/slices/purchase` для статуса подписки)
- Провайдеры: подключаются в `providers/index.tsx` и далее в `app/layout.tsx`

## Сборка Android (debug/release)
1) Собрать web и синхронизировать Capacitor:
```bash
npm run build:android
```
2) Открыть проект в Android Studio: `android/`.
3) Debug‑запуск на эмулятор/девайс — через Android Studio.
4) Release APK:
```bash
npm run build:android:release
```
5) Release AAB (для Play Console):
```bash
npm run build:android:bundle
```

Важно:
- Перед `cap sync` должен существовать свежий экспорт `out/` (команда `build` делает это автоматически).
- В `next.config.mjs` включён `output: 'export'`, `images.unoptimized: true`, отключены проверка ESLint/TS на билде — это ускоряет CI, но требует дисциплины при разработке.

## Траблшутинг и частые ошибки
- Пустой экран в Android:
  - Проверь `webDir: 'out'` и что `npm run build` действительно создал `out/`.
  - Проверь, что после правок запускался `npx cap sync` (входит в скрипты `build:android:*`).
- Ошибка IAP `WRONG_PLATFORM`/`UNHANDLED_ERROR`:
  - `lib/services/purchase.ts` ожидает `window.CdvPurchase`, доступный только в нативе. На web — заглушки/грейсфул‑фоллбек.
  - Для Android нужен установленный `cordova-plugin-purchase` (подтягивается через sync) и корректная настройка биллинга в Play Console.
- Соц. логин Google (Android):
  - Проверь `NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID` и `REDIRECT_URL` в `capacitor.config.ts`.
  - SHA‑подписи и OAuth‑клиенты должны совпадать с приложением в Google Cloud.
- Изображения/статика:
  - `images.unoptimized: true` + статический экспорт → используйте относительные пути и `public/`.
- Пуш‑уведомления:
  - На Android требуют конфигурации Firebase/FCM и разрешений. Проверь плагин `@capacitor/push-notifications`.

## Полезные входные точки кода
- Провайдеры приложения: `providers/index.tsx`
- Глобальная разметка/стили: `app/layout.tsx`, `styles/globals.css`, `tailwind.config.ts`
- Redux store: `store/index.ts`, слайсы в `store/slices/*`
- Локализация: `lib/i18n/index.ts`, словари `lib/i18n/locales/*.json`
- IAP: `lib/services/purchase.ts`
- Навигация/хедер/контейнеры: `components/{navigation,header,container}`
- Крупные секции страниц: `components/sections/*`

## Релизный чек‑лист (Android)
- Обновить версии и иконки/сплэш в `android/app/src/main/res/*`
- Проверить `versionCode`/`versionName` в `android/app/build.gradle`
- Выполнить `npm run build:android:bundle`
- Подписать AAB и загрузить в Play Console