export function safeQuerySelector<T extends HTMLElement>(
  selector: string,
  parentElement: DocumentFragment | Document | HTMLElement = document,
): T {
  const elem = parentElement.querySelector<T>(selector);

  if (!elem) {
    throw new Error('Element not found');
  }
  return elem;
}
