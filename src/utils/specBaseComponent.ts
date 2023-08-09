export default class SpecBaseComponent<K extends keyof HTMLElementTagNameMap> {
  #node: HTMLElementTagNameMap[K];

  constructor({
    tagName,
    classNames = [],
    textContent = '',
    parentNode,
    attributes = {},
  }: {
    tagName: K;
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

  public append(child: SpecBaseComponent<K>): void {
    this.#node.append(child.getNode());
  }

  public appendChildren(children: SpecBaseComponent<K>[]): void {
    children.forEach((el) => {
      this.append(el);
    });
  }

  public getNode(): HTMLElementTagNameMap[K] {
    return this.#node;
  }

  public clearInnerHTML(): void {
    this.#node.innerHTML = '';
  }

  public addClass(classNames: string[]): void {
    classNames.forEach((className) => {
      this.#node.classList.add(className);
    });
  }

  public setAttributes(attributes: Record<string, string>): void {
    Object.entries(attributes).forEach(([prop, value]) => this.#node.setAttribute(prop, value));
  }

  /*  public addListener<T extends keyof HTMLElementEventMap>(
    eventName: T,
    callback: (event: HTMLElementEventMap[T]) => void,
  ): void {
    this.#node.addEventListener(eventName, callback);
  } */

  public destroy(): void {
    this.#node.remove();
  }
}
