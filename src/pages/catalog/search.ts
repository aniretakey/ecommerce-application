import BaseComponent from '@utils/baseComponent';
import { searchBtnClasses, searchIconSvg, searchInputClasses } from '@utils/componentsClasses';

export class Search {
  public searchField: BaseComponent<'div'>;
  public searchInput: BaseComponent<'input'>;
  public searchBtn: BaseComponent<'button'>;

  constructor() {
    this.searchField = new BaseComponent({ tagName: 'div', classNames: ['relative', 'w-full'] });

    this.searchField.getNode().innerHTML = searchIconSvg;

    this.searchInput = new BaseComponent({
      tagName: 'input',
      attributes: { id: 'catalogSearchInput', type: 'search', placeholder: 'What are you looking for?' },
      classNames: searchInputClasses,
    });
    this.searchBtn = new BaseComponent({
      tagName: 'button',
      classNames: searchBtnClasses,
      textContent: 'Search',
    });
    this.searchField.appendChildren([this.searchInput, this.searchBtn]);
  }
}
