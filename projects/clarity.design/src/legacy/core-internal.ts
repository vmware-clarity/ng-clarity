export function focusable(element: Element) {
  return element.matches(
    [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'button:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'iframe',
      'object',
      'embed',
      '*[tabindex]', // -1 tabindex is a focusable element and needed for keyboard navigation
      '*[contenteditable=true]',
      '[role=button]:not([disabled])',
    ].join(',')
  );
}

export function focusElement(element: HTMLElement) {
  if (element && !focusable(element)) {
    element.setAttribute('tabindex', '-1');
    element.focus();
    element.addEventListener('blur', () => element.removeAttribute('tabindex'), { once: true });
  } else {
    element?.focus();
  }
}