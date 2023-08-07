export default class BaseComponent {
  #node: HTMLElement;

  constructor({
    tagName = 'div',
    classNames = [],
    textContent = '',
    parentNode,
    attributes = {},
  }: {
    tagName: string;
    classNames?: string[];
    textContent?: string;
    parentNode?: HTMLElement;
    attributes?: Record<string, string>;
  }) {
    this.#node = document.createElement(tagName);
    if (classNames) {
      this.#node.classList.add(...classNames);
    }
    if (textContent) {
      this.#node.textContent = textContent;
    }
    if (attributes) {
      this.setAttributes(attributes);
    }
    if (parentNode) {
      parentNode.append(this.#node);
    }
  }

  public append(child: BaseComponent): void {
    this.#node.append(child.getNode());
  }

  public appendChildren(children: BaseComponent[]): void {
    children.forEach((el) => {
      this.append(el);
    });
  }

  public getNode(): HTMLElement {
    return this.#node;
  }

  public addClass(classNames: string[]): void {
    classNames.forEach((className) => {
      this.#node.classList.add(className);
    });
  }

  public setAttributes(attributes: Record<string, string>): void {
    Object.entries(attributes).forEach(([prop, value]) => this.#node.setAttribute(prop, value));
  }

  public addListener<T extends keyof HTMLElementEventMap>(
    eventName: T,
    callback: (event: HTMLElementEventMap[T]) => void,
  ): void {
    this.#node.addEventListener(eventName, callback);
  }

  public destroy(): void {
    this.#node.remove();
  }
}
