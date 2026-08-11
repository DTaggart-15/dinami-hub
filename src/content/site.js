const tools = Object.freeze([
  'ChatGPT',
  'Codex',
  'Groq',
  'Kling',
  'Sora',
  'SeaDream',
  'Perplexity',
  'Qwen',
  'Kimi',
  'Gemini',
]);

export const siteCopy = Object.freeze({
  ru: Object.freeze({
    meta: Object.freeze({
      title: 'Dina Mi — AI Product Builder',
      description: 'Цифровые продукты, агентные процессы и визуальные эксперименты Dina Mi.',
    }),
    nav: Object.freeze({ about: 'Обо мне', work: 'Проекты', contact: 'Контакты' }),
    hero: Object.freeze({
      eyebrow: 'Independent AI product builder',
      title: 'Превращаю идеи в работающие системы.',
      description: 'Инженер по мышлению, независимый AI-билдер по практике. Проектирую цифровые продукты, агентные процессы и визуальные эксперименты.',
    }),
    notes: Object.freeze({
      heading: 'Полезные системы, созданные с AI.',
      product: 'Продуктовое направление · От идеи к рабочему инструменту',
      agents: 'Агентные процессы · Этапы, проверки, итерации',
      visual: 'Визуальные эксперименты · Изображение, видео, движение',
    }),
    tools: Object.freeze({ label: 'AI-инструменты', items: tools }),
    work: Object.freeze({
      eyebrow: 'Рабочее пространство',
      title: 'Избранные проекты',
      description: 'Готовые продукты, системы в работе и творческие эксперименты.',
    }),
    status: Object.freeze({ live: 'Работает', inWork: 'В работе', ongoing: 'Пополняется' }),
    actions: Object.freeze({
      open: 'Открыть проект',
      view: 'Посмотреть',
      close: 'Закрыть',
      copy: 'Скопировать',
      copied: 'Скопировано',
    }),
    dialog: Object.freeze({
      empty: 'Материалы пополняются.',
      manualCopy: 'Скопируйте хэндл вручную: 0xDinami',
    }),
    contact: Object.freeze({
      eyebrow: 'Контакты',
      title: 'Давайте сделаем что-то полезное.',
      description: 'Открыта к AI-продуктам, автоматизации и визуальным экспериментам.',
    }),
    footer: Object.freeze({ back: 'Наверх' }),
  }),
  en: Object.freeze({
    meta: Object.freeze({
      title: 'Dina Mi — AI Product Builder',
      description: 'Digital products, agentic workflows, and visual experiments by Dina Mi.',
    }),
    nav: Object.freeze({ about: 'About', work: 'Work', contact: 'Contact' }),
    hero: Object.freeze({
      eyebrow: 'Independent AI product builder',
      title: 'I turn ideas into working systems.',
      description: 'Engineer by mindset, independent AI builder by practice. I design digital products, agentic workflows, and visual experiments.',
    }),
    notes: Object.freeze({
      heading: 'Useful systems, built with AI.',
      product: 'Product direction · From idea to working tool',
      agents: 'Agent workflows · Stages, gates, iteration',
      visual: 'Visual experiments · Image, video, motion',
    }),
    tools: Object.freeze({ label: 'AI tools', items: tools }),
    work: Object.freeze({
      eyebrow: 'Workspace',
      title: 'Selected work',
      description: 'Live products, systems in progress, and creative experiments.',
    }),
    status: Object.freeze({ live: 'Live', inWork: 'In work', ongoing: 'Ongoing' }),
    actions: Object.freeze({
      open: 'Open project',
      view: 'View details',
      close: 'Close',
      copy: 'Copy',
      copied: 'Copied',
    }),
    dialog: Object.freeze({
      empty: 'Materials are being curated.',
      manualCopy: 'Copy the handle manually: 0xDinami',
    }),
    contact: Object.freeze({
      eyebrow: 'Contact',
      title: 'Let’s build something useful.',
      description: 'Open to AI products, automation, and visual experiments.',
    }),
    footer: Object.freeze({ back: 'Back to top' }),
  }),
});
