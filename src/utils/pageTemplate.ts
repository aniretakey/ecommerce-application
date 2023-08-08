export default abstract class Page {
  protected container: HTMLElement;

  constructor(id: string) {
    this.container = document.createElement('div');
    this.container.id = id;
  }

  protected createHeaderTitle(text: string): HTMLElement {
    const title = document.createElement('h1');
    title.innerText = text;
    return title;
  }

  public render(): HTMLElement {
    return this.container;
  }
}
