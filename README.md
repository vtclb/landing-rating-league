# LASERTAG Ranking League landing concept

Окремий локальний landing-reference для рейтингових ігор з лазертагу.

## Запуск

Варіант без dev server:

```powershell
Start-Process .\index.html
```

Варіант з локальним сервером:

```powershell
npm run serve
```

Після цього відкрити:

```text
http://127.0.0.1:8080/
```

## Перевірка

```powershell
npm run build
```

`build` не створює bundle, бо прототип статичний. Команда перевіряє наявність файлів і ключового контенту сторінки.

## Screenshots

Якщо поруч є локальні Playwright-залежності з `landing-varta-school-v2`, скріншоти можна перезняти командою:

```powershell
node scripts/capture-screenshots.mjs
```

## Файли

- `index.html` — структура сторінки і SEO meta.
- `styles.css` — вся візуальна система, responsive, motion і reduced-motion.
- `script.js` — легка поява секцій при скролі.
- `screenshots/` — місце для перевірочних скріншотів.

## Примітка

Це статичний прототип. Він не змінює наявні папки бойових лендингів і не потребує встановлення залежностей.
