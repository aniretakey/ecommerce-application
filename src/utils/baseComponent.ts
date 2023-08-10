export default class BaseComponent<K extends keyof HTMLElementTagNameMap> {
  protected node: HTMLElementTagNameMap[K];

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
    this.node = document.createElement(tagName);
    if (classNames) {
      this.node.classList.add(...classNames);
    }
    if (textContent) {
      this.node.textContent = textContent;
    }
    if (attributes) {
      this.setAttributes(attributes);
    }
    if (parentNode) {
      parentNode.append(this.node);
    }
  }

  public append(child: BaseComponent<keyof HTMLElementTagNameMap>): void {
    this.node.append(child.getNode());
  }

  public appendChildren(children: BaseComponent<K>[]): void {
    children.forEach((el) => {
      this.append(el);
    });
  }

  public getNode(): HTMLElementTagNameMap[K] {
    return this.node;
  }

  public clearInnerHTML(): void {
    this.node.innerHTML = '';
  }

  public addClass(classNames: string[]): void {
    classNames.forEach((className) => {
      this.node.classList.add(className);
    });
  }

  public setAttributes(attributes: Record<string, string>): void {
    Object.entries(attributes).forEach(([prop, value]) => this.node.setAttribute(prop, value));
  }

  public addListener<T extends keyof HTMLElementEventMap>(
    eventName: T,
    callback: (event: Event) => void,
  ): BaseComponent<K> {
    this.node.addEventListener(eventName, callback);
    return this;
  }

  public removeListener<T extends keyof HTMLElementEventMap>(eventName: T, callback: (event: Event) => void): void {
    this.node.removeEventListener(eventName, callback);
  }

  public destroy(): void {
    this.node.remove();
  }
}
