const UNSAFE_ATTRIBUTE = /^(?:on|style$|srcdoc$)/i;

export function h(tag, { className, text, attrs = {}, dataset = {} } = {}, children = []) {
  const node = document.createElement(tag);

  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;

  for (const [name, value] of Object.entries(attrs)) {
    if (UNSAFE_ATTRIBUTE.test(name)) throw new TypeError(`Unsafe attribute: ${name}`);
    node.setAttribute(name, String(value));
  }

  for (const [name, value] of Object.entries(dataset)) {
    node.dataset[name] = String(value);
  }

  node.append(...children.filter(Boolean));
  return node;
}
