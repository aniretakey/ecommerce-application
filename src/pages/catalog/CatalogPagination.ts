import BaseComponent from '@utils/baseComponent';

export class CatalogPagination {
  public pagContainer: BaseComponent<'div'>;
  public prevBtn: BaseComponent<'button'>;
  public pageInfoBtn: BaseComponent<'button'>;
  public nextBtn: BaseComponent<'button'>;
  constructor() {
    this.pagContainer = new BaseComponent({ tagName: 'div', classNames: ['join'] });
    this.prevBtn = new BaseComponent({
      tagName: 'button',
      classNames: ['join-item', 'btn'],
      textContent: '«',
      attributes: { disabled: '' },
    });
    this.pageInfoBtn = new BaseComponent({
      tagName: 'button',
      classNames: ['join-item', 'btn', 'bg-primary', 'text-white', 'pointer-events-none'],
      textContent: 'Page 1',
    });
    this.nextBtn = new BaseComponent({ tagName: 'button', classNames: ['join-item', 'btn'], textContent: '»' });
    this.pagContainer.appendChildren([this.prevBtn, this.pageInfoBtn, this.nextBtn]);
  }
}
