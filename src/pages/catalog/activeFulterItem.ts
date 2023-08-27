import BaseComponent from '@utils/baseComponent';
import { ActiveFilters } from './CatalogFilters';

export class activeFilterBadge {
  public badge: BaseComponent<'div'>;
  constructor(name: string, id: string, activeFilters: ActiveFilters, text = name) {
    this.badge = new BaseComponent({
      tagName: 'div',
      classNames: ['badge'],
      textContent: text,
      attributes: { 'data-id': id },
    });
    const remove = new BaseComponent({
      tagName: 'div',
      classNames: ['leading-none', 'cursor-pointer'],
      parentNode: this.badge.getNode(),
    });
    remove.getNode().innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
    remove.addListener('click', () => {
      this.badge.destroy();
      const checkbox = document.querySelector<HTMLInputElement>(`#${id.trim().split(' ').join('-')}`);
      console.log(name, '!!!!', checkbox);
      if (checkbox) {
        checkbox.checked = false;
        delete activeFilters[`${id.trim().split(' ').join('-')}`];
        const resetAllBtn = document.querySelector<HTMLDivElement>(`#resetAllFiltersBtn`);
        if (resetAllBtn && Object.keys(activeFilters).length === 0) {
          resetAllBtn.remove();
        }
      }
    });
  }
}
