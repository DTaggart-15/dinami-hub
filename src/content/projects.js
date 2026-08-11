export const projects = Object.freeze([
  Object.freeze({
    id: 'follower-forecast',
    action: 'external',
    status: 'live',
    href: 'https://follower-count.vercel.app/',
    tags: Object.freeze(['Product', 'Web', 'AI build']),
    media: Object.freeze([]),
    copy: Object.freeze({
      ru: Object.freeze({
        type: 'Веб-продукт',
        title: 'Follower Forecast',
        description: 'Живой счётчик подписчиков X и прогноз роста к концу года.',
      }),
      en: Object.freeze({
        type: 'Web product',
        title: 'Follower Forecast',
        description: 'A live X follower count and year-end growth forecast.',
      }),
    }),
  }),
  Object.freeze({
    id: 'english-portfolio',
    action: 'external',
    status: 'live',
    href: 'https://dinami-portfolio.vercel.app/',
    tags: Object.freeze(['Story', 'Design', 'Web']),
    media: Object.freeze([]),
    copy: Object.freeze({
      ru: Object.freeze({
        type: 'Портфолио',
        title: 'English Portfolio',
        description: 'История перехода от промышленного инженера к независимому AI-продакт-билдеру.',
      }),
      en: Object.freeze({
        type: 'Portfolio',
        title: 'English Portfolio',
        description: 'My transition from industrial engineer to independent AI product builder.',
      }),
    }),
  }),
  Object.freeze({
    id: 'ai-content-os',
    action: 'dialog',
    status: 'inWork',
    href: null,
    tags: Object.freeze(['Agents', 'Workflow', 'QA']),
    media: Object.freeze([
      Object.freeze({
        type: 'image',
        src: '/media/content-factory-output.png',
        alt: Object.freeze({ ru: 'Результат AI Content OS', en: 'AI Content OS output' }),
      }),
    ]),
    copy: Object.freeze({
      ru: Object.freeze({
        type: 'Агентная система',
        title: 'AI Content OS',
        description: 'Контент-завод со сценариями, генерацией и проверками качества.',
        detail: 'Проектирую стадии, управляю агентами и проверяю результат перед выпуском.',
      }),
      en: Object.freeze({
        type: 'Agentic system',
        title: 'AI Content OS',
        description: 'A content factory with scripting, generation, and quality gates.',
        detail: 'I design the stages, direct agents, and review output before release.',
      }),
    }),
  }),
  Object.freeze({
    id: 'creative-lab',
    action: 'gallery',
    status: 'ongoing',
    href: null,
    tags: Object.freeze(['Video', 'Image', 'Research']),
    media: Object.freeze([]),
    copy: Object.freeze({
      ru: Object.freeze({
        type: 'Эксперименты',
        title: 'Creative Lab',
        description: 'Видео, изображения, промпт-системы и генеративные эксперименты.',
        detail: 'Галерея пополняется без изменения интерфейса сайта.',
      }),
      en: Object.freeze({
        type: 'Experiments',
        title: 'Creative Lab',
        description: 'Video, image, prompt systems, and generative experiments.',
        detail: 'The gallery grows without changing the site interface.',
      }),
    }),
  }),
]);
