# Exchange — Currency Converter

A dark glass currency converter built with React + Vite. It uses live rates from the free
[fawazahmed0/exchange-api](https://github.com/fawazahmed0/exchange-api). No API key is needed.

## Run it

```bash
npm install     # only the first time
npm run dev     # then open http://localhost:5173
```

`npm run build` creates a production version in the `dist/` folder.

## Deploy

Live site: https://jovingj24jan-png.github.io/currency-converter/

After changing the code, run:

```bash
npm run deploy
```

This builds the site and uploads it to the `gh-pages` branch, which GitHub Pages serves. It usually goes live within a minute.

## Where things are

| File | What it does |
| --- | --- |
| `src/services/currencyApi.js` | Talks to the API. Tries jsDelivr first, then the Cloudflare mirror. |
| `src/components/ExchangeCard.jsx` | The converter: amount, currencies, swap, Exchange button. |
| `src/components/CurrencySelect.jsx` | The searchable currency dropdown. |
| `src/components/CurrencyInput.jsx` | One "You send" / "You receive" box. |
| `src/components/RateInfo.jsx` | Rate, inverse rate and last-updated date. |
| `src/components/Header.jsx` | Logo, navigation and the mobile menu. |
| `src/utils/format.js` | Number formatting and amount validation. |
| `src/index.css` | All styles, including the mobile layout. |
