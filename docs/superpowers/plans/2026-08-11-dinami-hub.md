# DinaMi Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, verify, publish, and deploy a lightweight bilingual Editorial Workspace portfolio hub for Dina Mi.

**Architecture:** A static Vite site ships semantic Russian HTML first and progressively enhances language switching, data-driven project folders, native dialogs, gallery behavior, and clipboard actions with small JavaScript modules. All content and media remain local, Vercel supplies strict response headers, and Vitest plus Playwright enforce content, security, accessibility, and responsive behavior.

**Tech Stack:** Node.js 24, Vite, vanilla ES modules, semantic HTML, CSS, Fontsource (`Newsreader`, `Inter`), Vitest with jsdom, Playwright with axe-core, Lighthouse CI, GitHub, Vercel.

## Global Constraints

- Node.js must be `>=22.12.0`; the current workstation has `v24.16.0`.
- Use `npm.cmd` and `npx.cmd` in local PowerShell commands because `npm.ps1` is blocked by the workstation execution policy.
- Keep the site static: no CMS, backend, database, authentication, contact form, analytics, cookies, X API, WebGL, or third-party CDN.
- Russian is the first-visit language; only `ru` and `en` are supported; persist a valid choice under `dinami-hub-language` in `localStorage`.
- Preserve the approved Editorial Workspace design, warm bone/graphite/lavender palette, editorial photo notes, AI ticker, and paper-folder project metaphor.
- Use `Newsreader` for editorial headings and `Inter` for interface text; bundle both locally.
- Do not AI-edit the portrait. Reuse the approved local Dina assets from the existing English portfolio.
- Ticker order is exactly `ChatGPT · Codex · Groq · Kling · Sora · SeaDream · Perplexity · Qwen · Kimi · Gemini`.
- Project order is exactly Follower Forecast, English Portfolio, AI Content OS, Creative Lab.
- Contacts are Telegram `https://t.me/DinaStam`, email `mailto:didinamit.1@gmail.com`, X `https://x.com/0xDinami`, and copyable Discord handle `0xDinami`.
- Never insert content with `innerHTML`, inline event handlers, `eval`, or `Function`; use safe DOM APIs and `textContent`.
- Keep CSP free of `unsafe-inline`, `unsafe-eval`, and wildcard sources.
- Use TDD for every behavior: observe the focused test fail, implement the minimum, then rerun focused and broader checks.
- End every task with `git diff --check`, fresh relevant verification, a diff review, and one focused commit.

## File Map

- `package.json`, `package-lock.json` — pinned dependencies and all verification scripts.
- `vite.config.js` — static Vite build configuration.
- `vitest.config.js`, `tests/setup.js` — jsdom unit-test environment and browser API shims.
- `playwright.config.js` — local preview server plus desktop/mobile browser projects.
- `vercel.json` — output configuration, immutable asset caching, and security headers.
- `lighthouserc.json` — production-like Lighthouse thresholds.
- `index.html` — semantic Russian-first document, SEO shell, skip link, header, hero, work and contact mount points.
- `src/main.js` — imports fonts/styles and starts the app.
- `src/app.js` — composes language, ticker, projects, dialogs, contacts, and metadata.
- `src/content/site.js` — localized site copy and default metadata.
- `src/content/projects.js` — localized project records and media descriptors.
- `src/content/contacts.js` — immutable public contact records.
- `src/lib/dom.js` — safe element builder that writes text with `textContent`.
- `src/lib/urls.js` — allowlisted URL validation.
- `src/lib/language.js` — language read, persistence, and DOM translation.
- `src/lib/metadata.js` — title, description, Open Graph, and Twitter metadata updates.
- `src/components/ticker.js` — two-sequence accessible marquee.
- `src/components/project-grid.js` — semantic folder links/buttons generated from project data.
- `src/components/project-dialog.js` — accessible details/gallery dialog with focus restoration.
- `src/components/contact-links.js` — external links and Discord clipboard behavior.
- `src/styles/tokens.css`, `base.css`, `layout.css`, `components.css`, `motion.css` — focused design layers.
- `public/media/*` — optimized local portrait, content output, future creative media, favicon, and Open Graph image.
- `tests/*.test.js` — content, language, URL, dialog, clipboard, metadata, foundation, and security unit tests.
- `tests/e2e/*.spec.js` — interaction, accessibility, responsive, and reduced-motion browser checks.
- `scripts/check-external-links.mjs` — bounded validation of the two live project URLs and public contact URLs.
- `scripts/check-security.mjs` — tracked-file secret scan and dangerous-source-pattern scan.
- `.github/workflows/ci.yml` — reproducible install, audit, unit, build, and Chromium browser checks.
- `README.md` — editing projects/media, local verification, security, and deployment runbook.

---

### Task 1: Secure Vite Foundation

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `vite.config.js`
- Create: `vitest.config.js`
- Create: `playwright.config.js`
- Create: `vercel.json`
- Create: `lighthouserc.json`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/styles/tokens.css`
- Create: `src/styles/base.css`
- Create: `tests/foundation.test.js`
- Create: `tests/security-config.test.js`
- Create: `tests/setup.js`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: approved design specification only.
- Produces: `npm.cmd run test`, `build`, `test:e2e`, `check:security`, `check:links`, and `lhci` scripts; a buildable static entry point; Vercel security-header contract.

- [ ] **Step 1: Bootstrap npm and pin the required packages**

Run:

```powershell
npm.cmd init -y
npm.cmd install --save-exact @fontsource-variable/newsreader @fontsource/inter
npm.cmd install --save-dev --save-exact vite vitest jsdom @playwright/test @axe-core/playwright @lhci/cli
```

Then preserve the installed dependency objects and set metadata/scripts without rewriting them:

```powershell
npm.cmd pkg set name=dinami-hub version=0.1.0 type=module
npm.cmd pkg set private=true --json
npm.cmd pkg set engines.node=">=22.12.0"
npm.cmd pkg set scripts.dev="vite" scripts.build="vite build" scripts.preview="vite preview --host 127.0.0.1"
npm.cmd pkg set scripts.test="vitest run" scripts.test:watch="vitest" scripts.test:e2e="playwright test"
npm.cmd pkg set scripts.test:a11y="playwright test tests/e2e/accessibility.spec.js"
npm.cmd pkg set scripts.check:security="node scripts/check-security.mjs" scripts.check:links="node scripts/check-external-links.mjs"
npm.cmd pkg set scripts.lhci="lhci autorun"
```

Keep the exact dependency versions written by `npm.cmd install --save-exact` and commit `package-lock.json`.

- [ ] **Step 2: Write failing foundation and header tests**

```js
// tests/foundation.test.js
import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

describe('project foundation', () => {
  it('keeps a semantic Russian-first no-JS shell', async () => {
    const html = await read('index.html')
    expect(html).toContain('<html lang="ru">')
    expect(html).toContain('id="main-content"')
    expect(html).toContain('Превращаю идеи в работающие системы.')
    expect(html).toMatch(/<script type="module" src="\/src\/main\.js"><\/script>/)
    expect(html).not.toMatch(/<script(?![^>]*src=)[^>]*>/)
    expect(html).not.toMatch(/\son[a-z]+=/i)
  })
})
```

```js
// tests/security-config.test.js
import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'

describe('Vercel headers', () => {
  it('applies the approved security baseline to all paths', async () => {
    const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'))
    const headers = Object.fromEntries(config.headers[0].headers.map(({ key, value }) => [key, value]))
    expect(headers['Content-Security-Policy']).toContain("default-src 'none'")
    expect(headers['Content-Security-Policy']).toContain("frame-ancestors 'none'")
    expect(headers['Content-Security-Policy']).not.toContain('unsafe-inline')
    expect(headers['X-Content-Type-Options']).toBe('nosniff')
    expect(headers['X-Frame-Options']).toBe('DENY')
    expect(headers['Permissions-Policy']).toContain('camera=()')
  })
})
```

- [ ] **Step 3: Run the tests and confirm the missing foundation fails**

Run: `npm.cmd test -- tests/foundation.test.js tests/security-config.test.js`

Expected: FAIL because `index.html` and `vercel.json` do not yet satisfy the contract.

- [ ] **Step 4: Implement the minimal secure foundation**

```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({ build: { target: 'es2022' } })
```

```js
// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: { environment: 'jsdom', setupFiles: ['./tests/setup.js'] }
})
```

```js
// playwright.config.js
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  webServer: process.env.PLAYWRIGHT_TEST_BASE_URL ? undefined : {
    command: 'node ./node_modules/vite/bin/vite.js preview --host 127.0.0.1',
    port: 4173,
    reuseExistingServer: !process.env.CI
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } }
  ]
})
```

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "outputDirectory": "dist",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; media-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'; upgrade-insecure-requests" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=(), usb=()" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```

Create the Russian-first shell:

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dina Mi — AI Product Builder</title>
  </head>
  <body>
    <a class="skip-link" href="#main-content">Перейти к содержанию</a>
    <header class="site-header"><a href="#top">0xDINAMI</a></header>
    <main id="main-content">
      <section id="top" class="hero"><h1>Превращаю идеи в работающие системы.</h1></section>
      <section id="work" aria-labelledby="work-title">
        <h2 id="work-title">Избранные проекты</h2>
        <div id="project-grid"></div>
      </section>
      <div id="dialog-root"></div>
    </main>
    <footer id="contact">Dina Mi · 2026</footer>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

```js
// src/main.js
import '@fontsource-variable/newsreader/wght.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './styles/tokens.css'
import './styles/base.css'
```

```css
/* src/styles/base.css */
*, *::before, *::after { box-sizing: border-box; }
html { color: var(--ink); background: var(--paper); font-family: var(--font-ui); }
body { margin: 0; min-width: 20rem; }
a, button { color: inherit; }
img, video { display: block; max-width: 100%; }
```

Create `tests/setup.js` with deterministic native-dialog shims for jsdom:

```js
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal() { this.open = true }
}
if (!HTMLDialogElement.prototype.close) {
  HTMLDialogElement.prototype.close = function close() {
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
}
```

Create `lighthouserc.json` with local, non-uploading thresholds:

```json
{
  "ci": {
    "collect": { "staticDistDir": "./dist", "numberOfRuns": 1 },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    },
    "upload": { "target": "filesystem", "outputDir": ".lighthouseci" }
  }
}
```

Append `.lighthouseci/` and `artifacts/` to `.gitignore`.

- [ ] **Step 5: Run focused and build verification**

Run:

```powershell
npm.cmd test -- tests/foundation.test.js tests/security-config.test.js
npm.cmd run build
git diff --check
```

Expected: tests PASS; Vite creates `dist`; diff check is clean.

- [ ] **Step 6: Commit the foundation**

```powershell
git add .gitignore package.json package-lock.json vite.config.js vitest.config.js playwright.config.js vercel.json lighthouserc.json index.html src tests
git commit -m "chore: establish secure Vite foundation"
```

---

### Task 2: Typed Content Model and Safe URL Boundary

**Files:**
- Create: `src/content/site.js`
- Create: `src/content/projects.js`
- Create: `src/content/contacts.js`
- Create: `src/lib/dom.js`
- Create: `src/lib/urls.js`
- Create: `tests/content.test.js`
- Create: `tests/urls.test.js`

**Interfaces:**
- Consumes: native ES modules from Task 1.
- Produces: `siteCopy.ru|en`, `projects[]`, `contacts[]`, `h(tag, options, children)`, `safePublicUrl(value, allowedProtocols)`.

- [ ] **Step 1: Write failing schema and URL tests**

```js
// tests/content.test.js
import { describe, expect, it } from 'vitest'
import { projects } from '../src/content/projects.js'
import { siteCopy } from '../src/content/site.js'
import { contacts } from '../src/content/contacts.js'

describe('content contract', () => {
  it('ships the approved project order and complete bilingual copy', () => {
    expect(projects.map(project => project.id)).toEqual([
      'follower-forecast', 'english-portfolio', 'ai-content-os', 'creative-lab'
    ])
    for (const project of projects) {
      expect(project.copy.ru.title).toBeTruthy()
      expect(project.copy.en.title).toBeTruthy()
      expect(project.tags).toHaveLength(3)
    }
    expect(siteCopy.ru.hero.title).toBe('Превращаю идеи в работающие системы.')
    expect(siteCopy.en.hero.title).toBe('I turn ideas into working systems.')
  })

  it('contains only approved public contacts', () => {
    expect(contacts.map(contact => contact.value)).toEqual([
      'https://t.me/DinaStam',
      'mailto:didinamit.1@gmail.com',
      'https://x.com/0xDinami',
      '0xDinami'
    ])
  })
})
```

```js
// tests/urls.test.js
import { describe, expect, it } from 'vitest'
import { safePublicUrl } from '../src/lib/urls.js'

describe('safePublicUrl', () => {
  it.each(['javascript:alert(1)', 'data:text/html,bad', 'ftp://example.com'])('rejects %s', value => {
    expect(() => safePublicUrl(value)).toThrow('Unsupported public URL')
  })

  it.each(['https://example.com/', 'mailto:hello@example.com'])('allows %s', value => {
    expect(safePublicUrl(value)).toBe(value)
  })
})
```

- [ ] **Step 2: Run focused tests and confirm missing modules fail**

Run: `npm.cmd test -- tests/content.test.js tests/urls.test.js`

Expected: FAIL with module-not-found errors.

- [ ] **Step 3: Implement immutable content records**

```js
// src/content/contacts.js
export const contacts = Object.freeze([
  { id: 'telegram', kind: 'link', value: 'https://t.me/DinaStam' },
  { id: 'email', kind: 'link', value: 'mailto:didinamit.1@gmail.com' },
  { id: 'x', kind: 'link', value: 'https://x.com/0xDinami' },
  { id: 'discord', kind: 'copy', value: '0xDinami' }
])
```

```js
// src/content/projects.js
export const projects = Object.freeze([
  {
    id: 'follower-forecast', action: 'external', status: 'live',
    href: 'https://follower-count.vercel.app/', tags: ['Product', 'Web', 'AI build'], media: [],
    copy: {
      ru: { type: 'Web product', title: 'Follower Forecast', description: 'Живой счётчик подписчиков X и прогноз роста к концу года.' },
      en: { type: 'Web product', title: 'Follower Forecast', description: 'A live X follower count and year-end growth forecast.' }
    }
  },
  {
    id: 'english-portfolio', action: 'external', status: 'live',
    href: 'https://dinami-portfolio.vercel.app/', tags: ['Story', 'Design', 'Web'], media: [],
    copy: {
      ru: { type: 'Portfolio', title: 'English Portfolio', description: 'История перехода от промышленного инженера к независимому AI product builder.' },
      en: { type: 'Portfolio', title: 'English Portfolio', description: 'My transition from industrial engineer to independent AI product builder.' }
    }
  },
  {
    id: 'ai-content-os', action: 'dialog', status: 'inWork', href: null,
    tags: ['Agents', 'Workflow', 'QA'], media: [{ type: 'image', src: '/media/content-factory-output.png', alt: { ru: 'Результат AI Content OS', en: 'AI Content OS output' } }],
    copy: {
      ru: { type: 'Agentic system', title: 'AI Content OS', description: 'Контент-завод со сценариями, генерацией и проверками качества.', detail: 'Проектирую стадии, управляю агентами и проверяю результат перед выпуском.' },
      en: { type: 'Agentic system', title: 'AI Content OS', description: 'A content factory with scripting, generation, and quality gates.', detail: 'I design the stages, direct agents, and review output before release.' }
    }
  },
  {
    id: 'creative-lab', action: 'gallery', status: 'ongoing', href: null,
    tags: ['Video', 'Image', 'Research'], media: [],
    copy: {
      ru: { type: 'Experiments', title: 'Creative Lab', description: 'Видео, изображения, промпт-системы и генеративные эксперименты.', detail: 'Галерея пополняется без изменения интерфейса сайта.' },
      en: { type: 'Experiments', title: 'Creative Lab', description: 'Video, image, prompt systems, and generative experiments.', detail: 'The gallery grows without changing the site interface.' }
    }
  }
])
```

Implement the complete `siteCopy` object with identical keys:

```js
// src/content/site.js
export const siteCopy = Object.freeze({
  ru: {
    meta: { title: 'Dina Mi — AI Product Builder', description: 'Цифровые продукты, агентные процессы и визуальные эксперименты Dina Mi.' },
    nav: { about: 'Обо мне', work: 'Проекты', contact: 'Контакты' },
    hero: {
      eyebrow: 'Independent AI product builder',
      title: 'Превращаю идеи в работающие системы.',
      description: 'Инженер по мышлению, независимый AI-билдер по практике. Проектирую цифровые продукты, агентные процессы и визуальные эксперименты.'
    },
    notes: {
      heading: 'Полезные системы, созданные с AI.',
      product: 'Продуктовое направление · От идеи к рабочему инструменту',
      agents: 'Агентные процессы · Этапы, проверки, итерации',
      visual: 'Визуальные эксперименты · Изображение, видео, движение'
    },
    tools: { label: 'AI-инструменты' },
    work: { eyebrow: 'Рабочее пространство', title: 'Избранные проекты', description: 'Готовые продукты, системы в работе и творческие эксперименты.' },
    status: { live: 'Работает', inWork: 'В работе', ongoing: 'Пополняется' },
    actions: { open: 'Открыть проект', view: 'Посмотреть', close: 'Закрыть', copy: 'Скопировать', copied: 'Скопировано' },
    dialog: { empty: 'Материалы пополняются.', manualCopy: 'Скопируйте handle вручную: 0xDinami' },
    contact: { eyebrow: 'Контакты', title: 'Давайте сделаем что-то полезное.', description: 'Открыта к AI-продуктам, автоматизации и визуальным экспериментам.' },
    footer: { back: 'Наверх' }
  },
  en: {
    meta: { title: 'Dina Mi — AI Product Builder', description: 'Digital products, agentic workflows, and visual experiments by Dina Mi.' },
    nav: { about: 'About', work: 'Work', contact: 'Contact' },
    hero: {
      eyebrow: 'Independent AI product builder',
      title: 'I turn ideas into working systems.',
      description: 'Engineer by mindset, independent AI builder by practice. I design digital products, agentic workflows, and visual experiments.'
    },
    notes: {
      heading: 'Useful systems, built with AI.',
      product: 'Product direction · From idea to working tool',
      agents: 'Agent workflows · Stages, gates, iteration',
      visual: 'Visual experiments · Image, video, motion'
    },
    tools: { label: 'AI tools' },
    work: { eyebrow: 'Workspace', title: 'Selected work', description: 'Live products, systems in progress, and creative experiments.' },
    status: { live: 'Live', inWork: 'In work', ongoing: 'Ongoing' },
    actions: { open: 'Open project', view: 'View details', close: 'Close', copy: 'Copy', copied: 'Copied' },
    dialog: { empty: 'Materials are being curated.', manualCopy: 'Copy the handle manually: 0xDinami' },
    contact: { eyebrow: 'Contact', title: 'Let’s build something useful.', description: 'Open to AI products, automation, and visual experiments.' },
    footer: { back: 'Back to top' }
  }
})
```

- [ ] **Step 4: Implement safe DOM and URL helpers**

```js
// src/lib/urls.js
export function safePublicUrl(value, allowedProtocols = ['https:', 'mailto:']) {
  const url = new URL(value)
  if (!allowedProtocols.includes(url.protocol)) throw new TypeError('Unsupported public URL')
  return url.href
}
```

```js
// src/lib/dom.js
export function h(tag, { className, text, attrs = {}, dataset = {} } = {}, children = []) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text !== undefined) node.textContent = text
  for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, String(value))
  for (const [name, value] of Object.entries(dataset)) node.dataset[name] = String(value)
  node.append(...children.filter(Boolean))
  return node
}
```

- [ ] **Step 5: Run focused and full unit tests**

Run:

```powershell
npm.cmd test -- tests/content.test.js tests/urls.test.js
npm.cmd test
git diff --check
```

Expected: all unit tests PASS.

- [ ] **Step 6: Commit content boundaries**

```powershell
git add src/content src/lib tests/content.test.js tests/urls.test.js
git commit -m "feat: define bilingual portfolio content"
```

---

### Task 3: Language Runtime, Hero, and AI Ticker

**Files:**
- Modify: `index.html`
- Modify: `src/main.js`
- Create: `src/app.js`
- Create: `src/lib/language.js`
- Create: `src/components/ticker.js`
- Create: `src/styles/layout.css`
- Create: `src/styles/components.css`
- Create: `src/styles/motion.css`
- Create: `tests/language.test.js`
- Create: `tests/ticker.test.js`

**Interfaces:**
- Consumes: `siteCopy`, `h()` from Task 2.
- Produces: `readLanguage(storage)`, `applyLanguage(document, language, copy)`, `createTicker(items)` and `createApp({ document, storage })`.

- [ ] **Step 1: Write failing language and ticker tests**

```js
// tests/language.test.js
import { beforeEach, describe, expect, it } from 'vitest'
import { applyLanguage, readLanguage, STORAGE_KEY } from '../src/lib/language.js'

describe('language runtime', () => {
  beforeEach(() => {
    localStorage.clear()
    document.body.innerHTML = '<h1 data-i18n="hero.title">Русский</h1>'
  })

  it('defaults invalid storage to Russian', () => {
    localStorage.setItem(STORAGE_KEY, 'de')
    expect(readLanguage(localStorage)).toBe('ru')
  })

  it('updates text and document language without HTML insertion', () => {
    applyLanguage(document, 'en', { hero: { title: 'I turn ideas into working systems.' } })
    expect(document.documentElement.lang).toBe('en')
    expect(document.querySelector('h1').textContent).toBe('I turn ideas into working systems.')
  })
})
```

```js
// tests/ticker.test.js
import { describe, expect, it } from 'vitest'
import { createTicker } from '../src/components/ticker.js'

it('renders two matching sequences with one hidden from assistive tech', () => {
  const ticker = createTicker(['ChatGPT', 'Codex'])
  const sequences = ticker.querySelectorAll('.tool-ticker__sequence')
  expect(sequences).toHaveLength(2)
  expect(sequences[1].getAttribute('aria-hidden')).toBe('true')
  expect(sequences[0].textContent).toBe(sequences[1].textContent)
})
```

- [ ] **Step 2: Run focused tests and observe failure**

Run: `npm.cmd test -- tests/language.test.js tests/ticker.test.js`

Expected: FAIL because the runtime/components do not exist.

- [ ] **Step 3: Implement language helpers**

```js
// src/lib/language.js
export const STORAGE_KEY = 'dinami-hub-language'
export const DEFAULT_LANGUAGE = 'ru'
const supported = new Set(['ru', 'en'])

export function readLanguage(storage) {
  try {
    const value = storage.getItem(STORAGE_KEY)
    return supported.has(value) ? value : DEFAULT_LANGUAGE
  } catch {
    return DEFAULT_LANGUAGE
  }
}

export function applyLanguage(doc, language, copy) {
  const next = supported.has(language) ? language : DEFAULT_LANGUAGE
  doc.documentElement.lang = next
  doc.querySelectorAll('[data-i18n]').forEach(node => {
    const value = node.dataset.i18n.split('.').reduce((item, key) => item?.[key], copy)
    if (typeof value === 'string') node.textContent = value
  })
  return next
}

export function persistLanguage(storage, language) {
  if (!supported.has(language)) return DEFAULT_LANGUAGE
  try { storage.setItem(STORAGE_KEY, language) } catch { /* readable fallback remains */ }
  return language
}
```

- [ ] **Step 4: Implement the semantic shell, editorial notes, and ticker**

Expand `index.html` with:

- `.site-header` containing `0xDINAMI`, three anchor links, Telegram/X links, and two actual `<button data-language>` controls;
- `.hero` with Russian-first eyebrow, title, description, contact row, portrait `<picture>`, and three `data-i18n="notes.*"` editorial notes;
- `#tool-ticker`, `#project-grid`, and `#dialog-root` mounts;
- `.contact-strip` and footer.

The approved hero markup must retain useful Russian content without JavaScript:

```html
<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="hero__copy">
    <p data-i18n="hero.eyebrow">Independent AI product builder</p>
    <h1 id="hero-title" data-i18n="hero.title">Превращаю идеи в работающие системы.</h1>
    <p data-i18n="hero.description">Инженер по мышлению, независимый AI-билдер по практике. Проектирую цифровые продукты, агентные процессы и визуальные эксперименты.</p>
  </div>
  <div class="hero__portrait">
    <picture><img src="/media/dina-hero.webp" alt="Dina Mi" width="960" height="1280"></picture>
    <div class="portrait-notes" aria-label="Направления работы">
      <p data-i18n="notes.product">Продуктовое направление · От идеи к рабочему инструменту</p>
      <p data-i18n="notes.agents">Агентные процессы · Этапы, проверки, итерации</p>
      <p data-i18n="notes.visual">Визуальные эксперименты · Изображение, видео, движение</p>
    </div>
  </div>
</section>
<div id="tool-ticker"></div>
```

```js
// src/components/ticker.js
import { h } from '../lib/dom.js'

export function createTicker(items) {
  const sequence = hidden => h('div', {
    className: 'tool-ticker__sequence', attrs: hidden ? { 'aria-hidden': 'true' } : {}
  }, items.map(item => h('span', { className: 'tool-ticker__item', text: item })))
  return h('div', { className: 'tool-ticker', attrs: { 'aria-label': 'AI tools' } }, [
    sequence(false), sequence(true)
  ])
}
```

`createApp()` must read stored language, apply copy, wire the two language buttons, preserve `window.scrollY`, replace the ticker mount once, and update `aria-pressed` on the buttons. `src/main.js` imports all five CSS files and calls `createApp({ document, storage: window.localStorage })`.

- [ ] **Step 5: Add the approved motion contract**

```css
/* src/styles/motion.css */
@keyframes ticker-scroll { to { transform: translateX(-100%); } }
.tool-ticker__sequence { animation: ticker-scroll 32s linear infinite; }
.tool-ticker:hover .tool-ticker__sequence { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; }
  .tool-ticker__sequence { animation: none !important; }
  .tool-ticker { overflow-x: auto; }
  .tool-ticker__sequence[aria-hidden="true"] { display: none; }
}
```

- [ ] **Step 6: Verify and commit the bilingual shell**

Run:

```powershell
npm.cmd test -- tests/language.test.js tests/ticker.test.js
npm.cmd test
npm.cmd run build
git diff --check
```

Expected: PASS; built HTML contains Russian fallback copy and no inline handler.

```powershell
git add index.html src tests/language.test.js tests/ticker.test.js
git commit -m "feat: add bilingual editorial shell"
```

---

### Task 4: Project Folders, Detail Dialog, and Gallery

**Files:**
- Create: `src/components/project-grid.js`
- Create: `src/components/project-dialog.js`
- Modify: `src/app.js`
- Modify: `src/styles/components.css`
- Create: `tests/project-grid.test.js`
- Create: `tests/project-dialog.test.js`

**Interfaces:**
- Consumes: `projects`, `safePublicUrl`, `h`, current-language getter.
- Produces: `createProjectGrid({ projects, language, copy, onOpen })` and `createProjectDialog({ getLanguage, getCopy })` returning `{ element, open, close }`.

- [ ] **Step 1: Write failing semantic project tests**

```js
// tests/project-grid.test.js
import { expect, it, vi } from 'vitest'
import { projects } from '../src/content/projects.js'
import { createProjectGrid } from '../src/components/project-grid.js'

it('uses links for live work and buttons for internal work', () => {
  const grid = createProjectGrid({ projects, language: 'ru', copy: { actions: { open: 'Открыть', view: 'Посмотреть' }, status: { live: 'Работает', inWork: 'В работе', ongoing: 'Пополняется' } }, onOpen: vi.fn() })
  const controls = [...grid.querySelectorAll('.project-folder__action')]
  expect(controls.map(control => control.tagName)).toEqual(['A', 'A', 'BUTTON', 'BUTTON'])
  expect(controls[0].rel).toContain('noopener')
  expect(controls[0].rel).toContain('noreferrer')
})
```

```js
// tests/project-dialog.test.js
import { expect, it } from 'vitest'
import { createProjectDialog } from '../src/components/project-dialog.js'

it('renders media safely and restores focus when closed', () => {
  const trigger = document.body.appendChild(document.createElement('button'))
  trigger.focus()
  const dialog = createProjectDialog({ getLanguage: () => 'ru', getCopy: () => ({ actions: { close: 'Закрыть' }, dialog: { empty: 'Материалы пополняются.' } }) })
  document.body.append(dialog.element)
  dialog.open({ copy: { ru: { title: 'Lab', detail: 'Detail' } }, media: [] }, trigger)
  expect(dialog.element.open).toBe(true)
  expect(dialog.element.textContent).toContain('Материалы пополняются.')
  dialog.close()
  expect(document.activeElement).toBe(trigger)
})
```

- [ ] **Step 2: Run focused tests and confirm failure**

Run: `npm.cmd test -- tests/project-grid.test.js tests/project-dialog.test.js`

Expected: FAIL with missing component modules.

- [ ] **Step 3: Implement semantic folder controls**

`createProjectGrid()` renders one `<article class="project-folder">` per project. For `external`, create `<a target="_blank" rel="noopener noreferrer">`; for `dialog` and `gallery`, create `<button type="button">` and call `onOpen(project, button)`. Write all labels/descriptions with `textContent`; never serialize a project into HTML.

```js
const action = project.action === 'external'
  ? h('a', { className: 'project-folder__action', text: copy.actions.open, attrs: {
      href: safePublicUrl(project.href), target: '_blank', rel: 'noopener noreferrer'
    } })
  : h('button', { className: 'project-folder__action', text: copy.actions.view, attrs: { type: 'button' } })
```

- [ ] **Step 4: Implement the native dialog/gallery controller**

Use one `<dialog class="project-dialog">` for both internal projects. `open(project, trigger)` clears children with `replaceChildren()`, appends title/detail/tags, and appends only allowlisted local media paths matching `^/media/[a-z0-9._/-]+$`. Images use `<img loading="lazy">`; videos use `<video controls preload="metadata">` and no autoplay. Escape/native cancel closes the dialog, and `close()` restores focus to the saved trigger.

- [ ] **Step 5: Wire rerendering to language changes**

In `createApp()`, keep `currentLanguage` in closure, recreate the grid on language changes, and make `getLanguage()` return the current value so an already-closed dialog opens with current copy. Do not recreate or reopen an active dialog during language switching; update its visible text in place.

- [ ] **Step 6: Verify and commit projects**

Run:

```powershell
npm.cmd test -- tests/project-grid.test.js tests/project-dialog.test.js
npm.cmd test
npm.cmd run build
git diff --check
```

```powershell
git add src/components src/app.js src/styles/components.css tests/project-grid.test.js tests/project-dialog.test.js
git commit -m "feat: add interactive project workspace"
```

---

### Task 5: Contacts, Clipboard Feedback, and Metadata

**Files:**
- Create: `src/components/contact-links.js`
- Create: `src/lib/metadata.js`
- Modify: `src/app.js`
- Modify: `index.html`
- Create: `tests/contact-links.test.js`
- Create: `tests/metadata.test.js`

**Interfaces:**
- Consumes: contacts, safe URL helper, current language/site copy.
- Produces: `createContactLinks({ contacts, language, copy, clipboard })`, `updateMetadata(doc, meta)`.

- [ ] **Step 1: Write failing clipboard and metadata tests**

```js
// tests/contact-links.test.js
import { expect, it, vi } from 'vitest'
import { createContactLinks } from '../src/components/contact-links.js'
import { contacts } from '../src/content/contacts.js'

it('copies the static Discord handle and announces success', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  const links = createContactLinks({ contacts, language: 'ru', copy: { copied: 'Скопировано', copy: 'Скопировать' }, clipboard: { writeText } })
  links.querySelector('[data-contact="discord"]').click()
  await Promise.resolve()
  expect(writeText).toHaveBeenCalledWith('0xDinami')
  expect(links.querySelector('[role="status"]').textContent).toBe('Скопировано')
})
```

```js
// tests/metadata.test.js
import { expect, it } from 'vitest'
import { updateMetadata } from '../src/lib/metadata.js'

it('synchronizes document and social metadata', () => {
  document.head.innerHTML = '<meta name="description"><meta property="og:title"><meta property="og:description"><meta name="twitter:title"><meta name="twitter:description">'
  updateMetadata(document, { title: 'Dina Mi', description: 'AI products' })
  expect(document.title).toBe('Dina Mi')
  expect(document.querySelector('meta[name="description"]').content).toBe('AI products')
  expect(document.querySelector('meta[property="og:title"]').content).toBe('Dina Mi')
})
```

- [ ] **Step 2: Confirm the focused tests fail**

Run: `npm.cmd test -- tests/contact-links.test.js tests/metadata.test.js`

Expected: FAIL because modules are missing.

- [ ] **Step 3: Implement links and clipboard fallback**

Render Telegram, email, and X as safe links. Render Discord as a button. Prefer `clipboard.writeText('0xDinami')`; if unavailable/rejected, keep `0xDinami` visibly selected in a read-only input and announce the localized manual-copy instruction. Use one `role="status" aria-live="polite"` node.

- [ ] **Step 4: Implement metadata updates**

```js
// src/lib/metadata.js
export function updateMetadata(doc, meta) {
  doc.title = meta.title
  const set = (selector, value) => {
    const node = doc.querySelector(selector)
    if (node) node.setAttribute('content', value)
  }
  set('meta[name="description"]', meta.description)
  set('meta[property="og:title"]', meta.title)
  set('meta[property="og:description"]', meta.description)
  set('meta[name="twitter:title"]', meta.title)
  set('meta[name="twitter:description"]', meta.description)
}
```

Add canonical, favicon, Open Graph image, Twitter card, and Russian default meta tags to `index.html`. Use `https://dinami-hub.vercel.app/` as the intended canonical; Task 9 replaces it with the actual returned production URL before final promotion if Vercel assigns a different URL.

- [ ] **Step 5: Wire contacts and metadata to initial render and language changes**

`createApp()` renders the same contacts in hero/header/footer as required, updates metadata after every language change, and keeps the copy-status announcement localized.

- [ ] **Step 6: Verify and commit contacts/SEO**

Run:

```powershell
npm.cmd test -- tests/contact-links.test.js tests/metadata.test.js
npm.cmd test
npm.cmd run build
git diff --check
```

```powershell
git add index.html src tests/contact-links.test.js tests/metadata.test.js
git commit -m "feat: add safe contacts and localized metadata"
```

---

### Task 6: Approved Assets and Responsive Editorial Styling

**Files:**
- Create: `public/media/dina-hero.webp`
- Create: `public/media/content-factory-output.png`
- Create: `public/favicon.png`
- Create: `public/og/dinami-hub.png`
- Modify: `index.html`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/base.css`
- Modify: `src/styles/layout.css`
- Modify: `src/styles/components.css`
- Create: `tests/e2e/responsive.spec.js`

**Interfaces:**
- Consumes: functional semantic page from Tasks 1–5 and approved local source assets.
- Produces: final Editorial Workspace desktop/mobile layout with editorial photo notes and 2×2/1-column folder grid.

- [ ] **Step 1: Write failing responsive browser assertions**

```js
// tests/e2e/responsive.spec.js
import { expect, test } from '@playwright/test'

for (const width of [360, 390, 768, 1280, 1440]) {
  test(`fits ${width}px without horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(1)
  })
}

test('uses editorial photo notes on desktop and compact notes on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')
  await expect(page.locator('.portrait-notes')).toBeVisible()
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('.portrait-notes')).toHaveCSS('position', 'static')
})
```

- [ ] **Step 2: Build once and confirm responsive tests expose unfinished layout**

Run:

```powershell
npm.cmd run build
npx.cmd playwright install chromium
npx.cmd playwright test tests/e2e/responsive.spec.js --project=chromium
```

Expected: at least the editorial-note positioning assertion FAILS.

- [ ] **Step 3: Copy the approved assets without touching their source project**

```powershell
New-Item -ItemType Directory -Force -Path public\media,public\og | Out-Null
Copy-Item -LiteralPath 'D:\CODEX\portfolio CT\.worktrees\dinami-portfolio\public\images\dina-hero.webp' -Destination 'public\media\dina-hero.webp'
Copy-Item -LiteralPath 'D:\CODEX\portfolio CT\.worktrees\dinami-portfolio\public\images\content-factory-output.png' -Destination 'public\media\content-factory-output.png'
Copy-Item -LiteralPath 'D:\CODEX\portfolio CT\.worktrees\dinami-portfolio\public\favicon.png' -Destination 'public\favicon.png'
Copy-Item -LiteralPath 'D:\CODEX\portfolio CT\.worktrees\dinami-portfolio\public\og\dinami-og.png' -Destination 'public\og\dinami-hub.png'
```

Inspect all four copied assets directly before use. The Creative Lab production record intentionally starts with `media: []`; the dialog shows the approved localized curation message until Dina adds real creative files.

- [ ] **Step 4: Implement exact design tokens and desktop structure**

```css
/* src/styles/tokens.css */
:root {
  --paper: #f2f1ed; --ink: #171717; --surface: #fbfaf7; --line: #c7c5be;
  --lavender: #dcd5f4; --lavender-deep: #7864b8; --dark: #191919;
  --font-display: "Newsreader Variable", Georgia, serif;
  --font-ui: "Inter", Arial, sans-serif;
  --page-max: 90rem; --gutter: clamp(1rem, 3vw, 2.625rem);
  --section-space: clamp(4rem, 9vw, 7rem); --focus: #5b43a1;
}
```

Desktop requirements:

- header is a three-column row with 44px minimum controls;
- hero is a `.92fr 1.08fr` split with minimum height 34rem;
- hero title uses `clamp(3.6rem, 6vw, 6.4rem)` and maximum 11 characters per visual line;
- portrait uses `object-position: 66% 34%` and a neutral bone background;
- the three selected editorial notes occupy the free left area of the portrait with thin rules and never overlap the face/body;
- ticker is a full-width divider row;
- project workspace uses a dotted-paper background and a two-column folder grid;
- only the English Portfolio folder receives the lavender surface;
- contact strip uses the approved dark background.

- [ ] **Step 5: Implement mobile/tablet behavior**

At `max-width: 56rem`, stack hero copy above portrait, move notes into a normal-flow three-row list beneath the image, make folders one column, hide center header anchors behind a compact menu, keep all controls at least 44px, and avoid fixed heights. At `max-width: 30rem`, reduce the title and folder padding but keep 15px minimum body text.

- [ ] **Step 6: Render and visually inspect desktop/mobile screenshots**

Run the preview and capture both target sizes:

```powershell
npm.cmd run build
npx.cmd playwright test tests/e2e/responsive.spec.js --project=chromium
$previewOut = Join-Path (Get-Location) 'artifacts\preview.out.log'
$previewErr = Join-Path (Get-Location) 'artifacts\preview.err.log'
New-Item -ItemType Directory -Force -Path 'artifacts' | Out-Null
$preview = Start-Process -FilePath 'node' -ArgumentList @('node_modules/vite/bin/vite.js','preview','--host','127.0.0.1') -WindowStyle Hidden -RedirectStandardOutput $previewOut -RedirectStandardError $previewErr -PassThru
try {
  Start-Sleep -Seconds 2
  npx.cmd playwright screenshot --viewport-size="1440,1024" http://127.0.0.1:4173 artifacts\desktop.png
  npx.cmd playwright screenshot --viewport-size="390,844" http://127.0.0.1:4173 artifacts\mobile.png
} finally {
  if (Get-Process -Id $preview.Id -ErrorAction SilentlyContinue) { Stop-Process -Id $preview.Id }
}
```

Inspect both PNGs directly; compare them with the approved Editorial Workspace mock and photo treatment B. Iterate CSS until the portrait has no accidental dead zone, the notes are readable, and the site does not resemble a crypto project.

- [ ] **Step 7: Verify and commit visual implementation**

Run:

```powershell
npm.cmd test
npm.cmd run build
npx.cmd playwright test tests/e2e/responsive.spec.js --project=chromium
git diff --check
```

```powershell
git add public index.html src/styles tests/e2e/responsive.spec.js
git commit -m "feat: implement editorial workspace design"
```

---

### Task 7: End-to-End Interaction and Accessibility Gate

**Files:**
- Create: `tests/e2e/portfolio.spec.js`
- Create: `tests/e2e/accessibility.spec.js`
- Modify: `index.html`
- Modify: `src/app.js`
- Modify: `src/components/project-dialog.js`
- Modify: `src/styles/base.css`
- Modify: `src/styles/motion.css`

**Interfaces:**
- Consumes: finished user-facing UI.
- Produces: browser-backed proof for languages, links, dialogs, clipboard, keyboard, accessibility, and reduced motion.

- [ ] **Step 1: Write failing end-to-end scenarios**

```js
// tests/e2e/portfolio.spec.js
import { expect, test } from '@playwright/test'

test('starts in Russian and remembers English without scrolling', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
  await page.locator('#work').scrollIntoViewIfNeeded()
  const before = await page.evaluate(() => scrollY)
  await page.getByRole('button', { name: 'EN' }).click()
  expect(Math.abs((await page.evaluate(() => scrollY)) - before)).toBeLessThan(2)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('opens live work safely and internal work in a dialog', async ({ page }) => {
  await page.goto('/')
  const live = page.getByRole('link', { name: /Follower Forecast/i })
  await expect(live).toHaveAttribute('target', '_blank')
  await expect(live).toHaveAttribute('rel', /noopener/)
  await page.getByRole('button', { name: /AI Content OS/i }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
})
```

```js
// tests/e2e/accessibility.spec.js
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('has no automatically detectable WCAG A/AA violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  expect(results.violations).toEqual([])
})

test('disables ticker animation for reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.tool-ticker__sequence').first()).toHaveCSS('animation-name', 'none')
})
```

- [ ] **Step 2: Run Chromium scenarios and record the first failure**

Run: `npx.cmd playwright test tests/e2e/portfolio.spec.js tests/e2e/accessibility.spec.js --project=chromium`

Expected: FAIL until all accessible names, focus restoration, and reduced-motion styles meet the assertions.

- [ ] **Step 3: Implement the exact accessibility corrections**

Ensure:

- skip link becomes visible on focus and targets `#main-content`;
- every language and menu button has a unique accessible name and `aria-pressed`/`aria-expanded` state;
- folder buttons include project names in accessible labels;
- dialog has `aria-labelledby`, a visible close button, native Escape behavior, focus restoration, and no focusable background while open;
- all `:focus-visible` outlines are 3px with 2px offset;
- decorative symbols and duplicate ticker sequence are `aria-hidden`;
- portrait/media alt text changes with language only when its meaning changes;
- status cannot be conveyed by color alone.

- [ ] **Step 4: Run the cross-browser interaction ladder**

Run:

```powershell
npm.cmd run build
npx.cmd playwright install chromium firefox webkit
npx.cmd playwright test tests/e2e/portfolio.spec.js tests/e2e/accessibility.spec.js
git diff --check
```

Expected: all configured browser projects PASS.

- [ ] **Step 5: Commit accessibility behavior**

```powershell
git add index.html src tests/e2e
git commit -m "test: enforce accessible portfolio behavior"
```

---

### Task 8: Security Audit, External-Link Check, and CI

**Files:**
- Create: `scripts/check-security.mjs`
- Create: `scripts/check-external-links.mjs`
- Create: `tests/security-source.test.js`
- Create: `.github/workflows/ci.yml`
- Modify: `package.json`

**Interfaces:**
- Consumes: tracked source, approved URL list, package lock, build/test scripts.
- Produces: deterministic `check:security`, bounded `check:links`, and GitHub CI gates.

- [ ] **Step 1: Write a failing dangerous-pattern test**

```js
// tests/security-source.test.js
import { readFile } from 'node:fs/promises'
import { glob } from 'node:fs/promises'
import { expect, it } from 'vitest'

it('contains no unsafe DOM or dynamic-code APIs', async () => {
  const files = []
  for await (const file of glob('src/**/*.js')) files.push(file)
  const source = (await Promise.all(files.map(file => readFile(file, 'utf8')))).join('\n')
  expect(source).not.toMatch(/\.innerHTML\s*=/)
  expect(source).not.toMatch(/\beval\s*\(/)
  expect(source).not.toMatch(/\bnew\s+Function\b/)
})
```

- [ ] **Step 2: Run the security test before scripts exist**

Run: `npm.cmd test -- tests/security-source.test.js`

Expected: the source assertion passes or identifies an unsafe call; `npm.cmd run check:security` still FAILS because the script is absent.

- [ ] **Step 3: Implement the security scanner**

`scripts/check-security.mjs` must enumerate tracked files with `git ls-files -z` and skip binary media. Secret-like patterns are scanned across every tracked text file. Dangerous DOM/dynamic-code patterns are scanned only in `src/**/*.js` and `index.html`; CSP unsafe-directive checks are scanned only in `vercel.json`, so the scanner does not flag security documentation or its own test fixtures. Fail on:

- filenames `.env`, `.npmrc`, private keys, or credential exports;
- token-shaped patterns for GitHub, Vercel, OpenAI, Google, and generic `*_API_KEY=` values;
- `.innerHTML =`, `eval(`, `new Function`, inline `onclick=`, or CSP values containing `unsafe-inline`/`unsafe-eval`.

It must print only filename and rule identifier, never the matched secret-like text.

When invoked with `--history`, it must enumerate `git rev-list --all`, list each commit tree, scan text blobs with the same secret rules, and print only abbreviated commit SHA, filename, and rule identifier. It must never print a matched line or blob content.

- [ ] **Step 4: Implement the bounded external-link checker**

Check exactly these URLs with a 10-second timeout and no credentials:

```js
export const checkedUrls = [
  'https://follower-count.vercel.app/',
  'https://dinami-portfolio.vercel.app/',
  'https://t.me/DinaStam',
  'https://x.com/0xDinami'
]
```

Accept 200–399. Try `HEAD`, fall back to `GET` for 405/403, and treat a final 401/403 as reachable-with-warning because some social services block automated clients. Use `redirect: 'follow'`, fail on 404/410/5xx/network timeout, and report URL plus status without response bodies.

- [ ] **Step 5: Add GitHub CI**

```yaml
# .github/workflows/ci.yml
name: ci
on:
  push:
    branches: [main]
  pull_request:
jobs:
  verify:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm audit --omit=dev --audit-level=high
      - run: npm run check:security
      - run: npm test
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test --project=chromium
```

- [ ] **Step 6: Run the complete local security gate**

Run:

```powershell
npm.cmd run check:security
npm.cmd audit --omit=dev --audit-level=high
npm.cmd test
npm.cmd run build
npm.cmd run check:links
git diff --check
```

Expected: all commands PASS; network failures are reported separately from HTTP failures and retried only once.

- [ ] **Step 7: Commit security and CI**

```powershell
git add package.json package-lock.json scripts tests/security-source.test.js .github/workflows/ci.yml
git commit -m "ci: add security and verification gates"
```

---

### Task 9: Documentation, Full Verification, GitHub, and Vercel

**Files:**
- Create: `README.md`
- Modify: `index.html` only if the actual production URL differs from `https://dinami-hub.vercel.app/`
- Modify: `src/content/site.js` only if the actual production URL differs.

**Interfaces:**
- Consumes: fully verified local main branch and authenticated GitHub/Vercel accounts.
- Produces: public `DTaggart-15/dinami-hub`, preview evidence, final Vercel production URL, production security/header/Lighthouse evidence.

- [ ] **Step 1: Write the durable maintenance runbook**

`README.md` must document:

- `npm.cmd install`, `dev`, `test`, `build`, `test:e2e`, `check:security`, `check:links`, and `lhci`;
- the exact `projects.js` fields required for a new folder;
- copying a local image/video into `public/media/` and adding a safe `/media/...` descriptor;
- Russian/English copy parity;
- no secrets in this public repository;
- Vercel preview-before-production flow;
- the approved contact and project URLs.

- [ ] **Step 2: Run the full fresh local verification ladder**

Run in this exact order:

```powershell
npm.cmd ci
npm.cmd run check:security
npm.cmd audit --omit=dev --audit-level=high
npm.cmd test
npm.cmd run build
npx.cmd playwright test
npm.cmd run check:links
npm.cmd run lhci
git diff --check
git status --short --branch
```

Expected: every check PASS, no untracked generated report is staged, and only the intended README/canonical edits remain.

- [ ] **Step 3: Inspect the diff and commit the runbook**

```powershell
git diff --stat
git diff
git add README.md
git commit -m "docs: add portfolio maintenance runbook"
git status --short --branch
```

Expected: clean `main`.

- [ ] **Step 4: Scan the full Git history before the first public push**

Run the scanner in history mode:

```powershell
npm.cmd run check:security -- --history
```

Expected: a zero exit code and no findings. If anything matches, stop; do not rewrite public history blindly. Identify whether it is documentation/example text or a real secret and resolve before continuing.

- [ ] **Step 5: Authenticate and create the approved public GitHub repository**

Run these external-write commands only after the user/account authorization prompts succeed:

```powershell
gh auth status
gh repo create DTaggart-15/dinami-hub --public --source=. --remote=origin --push --description "Bilingual AI product builder portfolio hub"
git remote -v
git ls-remote --heads origin main
```

Expected: `origin` is `https://github.com/DTaggart-15/dinami-hub.git` (or the equivalent SSH URL), and remote `main` matches local HEAD.

- [ ] **Step 6: Link Vercel and create a preview deployment**

The workstation does not have a global Vercel CLI, so use the ephemeral official CLI:

```powershell
npx.cmd --yes vercel@latest link --yes
npx.cmd --yes vercel@latest --yes
```

Capture the printed preview URL. Open it and verify Russian default, `RU/EN`, all four folders, dialog/gallery, contacts, responsive 1440/390 layouts, console, and Network security headers. Do not promote a preview with failed checks.

- [ ] **Step 7: Create and verify production**

Run and capture the exact returned URL:

```powershell
$productionUrl = ((npx.cmd --yes vercel@latest --prod --yes) | Select-Object -Last 1).Trim()
$productionUrl
```

If the returned production URL differs from `https://dinami-hub.vercel.app/`, replace the canonical, `og:url`, and absolute Open Graph image origin with the exact returned URL, rerun all focused metadata/build/security tests, commit `fix: use production site URL`, push, and deploy production again.

Verify headers without printing response bodies:

```powershell
$headers = (Invoke-WebRequest -Method Head -Uri $productionUrl -UseBasicParsing).Headers
$headers['Content-Security-Policy']
$headers['Strict-Transport-Security']
$headers['X-Content-Type-Options']
$headers['X-Frame-Options']
$headers['Referrer-Policy']
$headers['Permissions-Policy']
```

Expected: CSP is present and contains no unsafe directives; HSTS is present from Vercel; `nosniff`, `DENY`, referrer policy, and permissions policy match the spec.

- [ ] **Step 8: Run final production checks and record evidence**

Run Lighthouse against the exact production URL and require at least 90 in Performance, Accessibility, Best Practices, and SEO:

```powershell
npx.cmd lhci collect --url=$productionUrl --numberOfRuns=1
npx.cmd lhci assert
```

Run one Playwright smoke with `$env:PLAYWRIGHT_TEST_BASE_URL=$productionUrl` and a config branch that skips `webServer` when this variable is present, confirm external URLs, then verify:

```powershell
git status --short --branch
git log -10 --oneline --decorate
git ls-remote --heads origin main
```

Expected: local/remote main match, worktree is clean, production smoke passes, and the final handoff reports the GitHub and Vercel URLs plus exact verification commands/results.
