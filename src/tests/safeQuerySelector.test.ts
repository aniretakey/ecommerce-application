import { safeQuerySelector } from '@utils/safeQuerySelector';

describe('safeQuerySelector tests', () => {
  let parentElement: HTMLDivElement;

  beforeEach(() => {
    parentElement = document.createElement('div');
    parentElement.innerHTML = `
      <div class="target-element" id="target"></div>
    `;
  });

  it('should find and return element', () => {
    const targetElement = safeQuerySelector('.target-element', parentElement);
    expect(targetElement.id).toBe('target');
  });

  it('should return the correct type of element', () => {
    const targetElement = safeQuerySelector<HTMLDivElement>('.target-element', parentElement);
    expect(targetElement instanceof HTMLDivElement).toBe(true);
  });

  it('should throw an error when element is not found', () => {
    expect(() => safeQuerySelector('.non-existent', parentElement)).toThrowError('Element not found');
    parentElement.innerHTML = '';
    expect(() => safeQuerySelector('.target-element', parentElement)).toThrowError('Element not found');
  });
});
