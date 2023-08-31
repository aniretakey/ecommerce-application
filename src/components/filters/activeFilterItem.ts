import { ActiveFilters } from '@customTypes/types';
import BaseComponent from '@utils/baseComponent';

export class ActiveFilterBadge {
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
      this.removeBadgeHandler(name, id, activeFilters);
    });
  }

  private removeBadgeHandler(name: string, id: string, activeFilters: ActiveFilters): void {
    this.badge.destroy();
    const checkbox = document.querySelector<HTMLInputElement>(`#${id.trim().split(' ').join('-')}`);

    if (checkbox) {
      checkbox.checked = false;
      delete activeFilters[`${id.trim().split(' ').join('-')}`];
    } else {
      const from = activeFilters[`${name}-from`.toLowerCase()];
      if (from) {
        from.element.value = from.element.getAttribute('value') ?? '0';
      }
      const to = activeFilters[`${name}-to`.toLowerCase()];
      if (to) {
        to.element.value = to.element.getAttribute('value') ?? '0';
      }
      delete activeFilters[`${name}-from`.toLowerCase()];
      delete activeFilters[`${name}-to`.toLowerCase()];
    }
    const resetAllBtn = document.querySelector<HTMLDivElement>(`#resetAllFiltersBtn`);
    if (resetAllBtn && Object.keys(activeFilters).length === 0) {
      resetAllBtn.remove();
    }
  }
}
