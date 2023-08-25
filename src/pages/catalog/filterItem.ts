import BaseComponent from '@utils/baseComponent';
import { activeFilterBadge } from './activeFulterItem';

export class FilterItem {
  public filterItem: BaseComponent<'li'>;
  private optionsList: BaseComponent<'ul'>;
  private filterName: string;
  private filterOptions: string[] = [];

  constructor(name: string, filterOptions: string[] = []) {
    this.filterName = name;
    this.filterOptions = filterOptions;
    this.filterItem = new BaseComponent({ tagName: 'li' });
    const details = new BaseComponent({ tagName: 'details', parentNode: this.filterItem.getNode() });
    const summary = new BaseComponent({ tagName: 'summary', textContent: this.filterName });

    this.optionsList = new BaseComponent({ tagName: 'ul', classNames: ['p-2', 'bg-base-100', 'w-max'] });

    details.appendChildren([summary, this.optionsList]);
  }

  public addDropDownCheckBoxList(activeFiltersContainer: BaseComponent<'div'>): this {
    this.filterOptions.forEach((option) => {
      const optionItem = new BaseComponent({ tagName: 'li' });
      const optionLable = new BaseComponent({
        tagName: 'label',
        attributes: { for: `${this.filterName}-${option.trim().split(' ').join('-')}`.toLowerCase() },
        textContent: option,
      });
      const optionInput = new BaseComponent({
        tagName: 'input',
        attributes: {
          id: `${this.filterName}-${option.trim().split(' ').join('-')}`.toLowerCase(),
          type: 'checkbox',
          name: this.filterName,
          value: option,
        },
      });
      optionLable.getNode().prepend(optionInput.getNode());
      optionItem.append(optionLable);
      this.optionsList.appendChildren([optionItem]);
    });
    this.filterItem.getNode().addEventListener('click', (event) => {
      this.setNewActiveFilter(event, activeFiltersContainer);
    });
    return this;
  }

  private setNewActiveFilter(event: Event, activeFiltersContainer: BaseComponent<'div'>): void {
    const { target } = event;
    if (target instanceof HTMLInputElement) {
      if (target.checked) {
        activeFiltersContainer.append(new activeFilterBadge(target.value, target.id).badge);
      } else {
        const badge = document.querySelector<HTMLDivElement>(`.badge[data-id="${target.id}"]`);
        if (badge) {
          badge.remove();
        }
      }
    }
  }

  public addDropDownRange(): this {
    ['from', 'to'].forEach((option) => {
      const optionItem = new BaseComponent({ tagName: 'li' });
      const optionLable = new BaseComponent({
        tagName: 'label',
        attributes: { for: `${this.filterName}-${option}`.toLowerCase() },
        textContent: option,
      });
      const optionInput = new BaseComponent({
        tagName: 'input',
        attributes: {
          id: `${this.filterName}-${option}`.toLowerCase(),
          type: 'number',
          name: this.filterName,
          value: '0',
          min: '0',
        },
      });
      const currency = new BaseComponent({
        tagName: 'span',
        textContent: '₽',
      });
      optionLable.appendChildren([optionInput, currency]);
      optionItem.append(optionLable);
      optionInput.addListener('click', () => {
        console.log(option);
      });

      this.optionsList.appendChildren([optionItem]);
    });
    return this;
  }
}
