export function updateMetadata(doc, meta) {
  doc.title = meta.title;

  const setContent = (selector, value) => {
    doc.querySelector(selector)?.setAttribute('content', value);
  };

  setContent('meta[name="description"]', meta.description);
  setContent('meta[property="og:title"]', meta.title);
  setContent('meta[property="og:description"]', meta.description);
  setContent('meta[name="twitter:title"]', meta.title);
  setContent('meta[name="twitter:description"]', meta.description);
}
