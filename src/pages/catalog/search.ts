import BaseComponent from '@utils/baseComponent';

const searchBtnClasses = [
  'btn-primary',
  'text-white',
  'absolute',
  'right-2.5',
  'bottom-2.5',
  'font-medium',
  'rounded-lg',
  'text-sm',
  'px-4',
  'py-2',
];
const searchInputClasses = [
  'block',
  'w-full',
  'p-4',
  'pl-10',
  'text-sm',
  'text-gray-900',
  'border',
  'border-gray-300',
  'rounded-lg',
  'bg-gray-50',
  'focus:outline-none',
  'focus:border-primary',
];
const searchIconSvg = `
<svg class="absolute inset-4 pointer-events-none w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
</svg>`;
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
