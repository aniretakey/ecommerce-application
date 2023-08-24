import BaseComponent from '@utils/baseComponent';

export class CatalogFilters {
  public filters: BaseComponent<'div'>;

  constructor() {
    this.filters = new BaseComponent({
      tagName: 'div',
      classNames: ['filters', 'w-full', 'h-10', 'border'],
      textContent: 'filters',
    });
  }
}
