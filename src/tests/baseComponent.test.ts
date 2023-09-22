import BaseComponent from '../utils/baseComponent';
// eslint-disable-next-line max-lines-per-function
describe('BaseComponent tests', () => {
  let parentNode: HTMLElement;

  beforeEach(() => {
    parentNode = document.createElement('div');
    document.body.appendChild(parentNode);
  });

  afterEach(() => {
    parentNode.remove();
  });

  it('should create an element with the provided tag name', () => {
    const tagName = 'input';
    const component = new BaseComponent({ tagName });
    expect(component.getNode().tagName).toBe(tagName.toUpperCase());
    expect(component.getNode() instanceof HTMLInputElement).toBe(true);
  });

  it('should add classes to created element', () => {
    const tagName = 'div';
    const classNames = ['class1', 'class2'];
    const component = new BaseComponent({ tagName, classNames });

    expect(component.getNode().className).toBe(classNames.join(' '));
    const newClasses = ['class3', 'class4'];
    component.addClass(newClasses);
    expect(component.getNode().className).toBe([...classNames, ...newClasses].join(' '));
  });

  it('should set textContent', () => {
    const tagName = 'p';
    const textContent = 'text';
    const component = new BaseComponent({ tagName, textContent });

    expect(component.getNode().textContent).toBe(textContent);
    const newTextContent = 'new text';
    component.setTextContent(newTextContent);
    expect(component.getNode().textContent).not.toBe(textContent);
    expect(component.getNode().textContent).toBe(newTextContent);
  });

  it('should set attributes', () => {
    const tagName = 'input';
    const component = new BaseComponent({ tagName, attributes: { type: 'text' } });
    expect(component.getNode().type).toBe('text');
    component.setAttributes({ id: 'componentId', 'data-test': 'test' });
    expect(component.getNode().type).toBe('text');
    expect(component.getNode().getAttribute('id')).toBe('componentId');
    expect(component.getNode().getAttribute('data-test')).toBe('test');
  });

  it('should append children', () => {
    const childComponent = new BaseComponent({ tagName: 'div' });
    const component = new BaseComponent({ tagName: 'div', parentNode });
    component.append(childComponent);
    expect(component.getNode().contains(childComponent.getNode())).toBe(true);

    const child1 = new BaseComponent({ tagName: 'div' });
    const child2 = new BaseComponent({ tagName: 'div' });

    component.appendChildren([child1, child2]);
    expect(component.getNode().contains(childComponent.getNode())).toBe(true);
    expect(component.getNode().contains(child1.getNode())).toBe(true);
    expect(component.getNode().contains(child2.getNode())).toBe(true);
  });

  it('should remove component', () => {
    const component = new BaseComponent({ tagName: 'div', parentNode });
    expect(parentNode.contains(component.getNode())).toBe(true);
    component.destroy();
    expect(parentNode.contains(component.getNode())).toBe(false);
  });

  it('should clear inner HTML', () => {
    const component = new BaseComponent({ tagName: 'div', textContent: 'test' });
    component.append(new BaseComponent({ tagName: 'p' }));
    expect(component.getNode().innerHTML).not.toBe('');
    component.clearInnerHTML();
    expect(component.getNode().innerHTML).toBe('');
  });
});
