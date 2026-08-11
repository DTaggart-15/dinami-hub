# Dinami Hub

Bilingual one-page portfolio hub for Dina Mi: editorial hero, AI tools ticker, project folders, internal project dialogs, and direct contacts. The site is a static Vite application with Russian as the default language and English as the saved alternate language.

## Local development

Requirements: Node.js 22.12 or newer and npm.

```powershell
npm.cmd install
npm.cmd run dev
```

The development server prints its local URL. Production commands:

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run preview
npm.cmd run test:e2e
npm.cmd run test:a11y
npm.cmd run check:security
npm.cmd run check:links
```

Playwright browsers are installed once with:

```powershell
npx.cmd playwright install chromium firefox webkit
```

## Add or update a project

Projects live in `src/content/projects.js`. Keep the array order equal to the visual folder order. Every project record requires:

- `id`: unique lowercase slug;
- `action`: `external`, `dialog`, or `gallery`;
- `status`: a key present in both `siteCopy.ru.status` and `siteCopy.en.status`;
- `href`: an HTTPS URL for `external`, otherwise `null`;
- `tags`: exactly three short labels;
- `media`: an array of safe local descriptors;
- `copy.ru` and `copy.en`: matching objects with `type`, `title`, and `description`; internal projects can also use `detail`.

External projects render as links. `dialog` and `gallery` projects open inside the site.

To add local media, copy the file into `public/media/`, then add a descriptor:

```js
{
  type: 'image',
  src: '/media/example.webp',
  alt: { ru: 'Описание изображения', en: 'Image description' }
}
```

Videos use `type: 'video'` and a local `/media/...` path. Remote media, autoplay, inline HTML, and executable URLs are intentionally rejected.

## Edit translations and contacts

Shared interface copy lives in `src/content/site.js`. Russian and English must keep identical keys; `tests/content.test.js` enforces parity.

Contacts live in `src/content/contacts.js`. Approved values are:

- Telegram: <https://t.me/DinaStam>
- Email: <mailto:didinamit.1@gmail.com>
- X: <https://x.com/0xDinami>
- Discord: `0xDinami`

Approved live projects:

- Follower Forecast: <https://follower-count.vercel.app/>
- English Portfolio: <https://dinami-portfolio.vercel.app/>

## Security rules

This is a public repository. Never commit passwords, tokens, `.env` files, private keys, service-account exports, or analytics credentials. The app has no backend, forms, cookies, or user tracking. Public URLs pass through an HTTPS/mailto allowlist, and visible dynamic content is written with `textContent`.

Before every public push, run:

```powershell
npm.cmd run check:security
npm.cmd run check:security -- --history
npm.cmd audit --omit=dev --audit-level=high
```

## Vercel release flow

1. Push a verified branch to GitHub.
2. Create a Vercel preview deployment and test RU/EN, all project folders, dialogs, contacts, desktop/mobile layouts, browser console, and response headers.
3. Run a production PageSpeed/Lighthouse check against the HTTPS preview, then promote only a passing preview.
4. If the production URL is not `https://dinami-hub.vercel.app/`, update the canonical URL plus Open Graph/Twitter image origins in `index.html`, rebuild, retest, commit, and deploy again.

The deployment header policy is defined in `vercel.json`; CI gates are defined in `.github/workflows/ci.yml`.
