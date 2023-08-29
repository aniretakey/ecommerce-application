import BaseComponent from '@utils/baseComponent';
import { FilterItem } from './filterItem';
import { ActiveFilterBadge } from './activeFilterItem';
import { filterClasses } from '@utils/componentsClasses';
import { brands, colors, materials, prices, sortOptions } from './data';
import { ActiveFilters } from '@customTypes/types';

export class CatalogFilters {
  public applyFilterBtn: BaseComponent<'button'>;
  public filters: BaseComponent<'div'>;
  public activeFiltersContainer: BaseComponent<'div'>;
  public activeFilters: ActiveFilters = {};
  private resetFiltersBtn: BaseComponent<'div'>;

  constructor() {
    this.filters = new BaseComponent({
      tagName: 'div',
      classNames: filterClasses,
    });
    this.activeFiltersContainer = new BaseComponent({
      tagName: 'div',
      classNames: ['active-filters', 'w-full', 'px-1', 'flex', 'flex-wrap', 'gap-2.5'],
    });

    this.applyFilterBtn = new BaseComponent({
      tagName: 'button',
      classNames: ['btn', 'btn-sm', 'btn-primary', 'w-64'],
      textContent: `APPLY`,
    });

    this.resetFiltersBtn = new BaseComponent({
      tagName: 'div',
      classNames: ['badge', 'badge-accent', 'cursor-pointer'],
      textContent: 'Reset filters',
      attributes: { id: 'resetAllFiltersBtn' },
    });
    this.resetFiltersBtn.addListener('click', () => {
      Object.values(this.activeFilters).forEach(({ element }) => {
        element.checked = false;
        if (element.type === 'number') {
          element.value = element.getAttribute('value') ?? '0';
        }
      });
      this.activeFiltersContainer.clearInnerHTML();
      this.activeFilters = {};
    });
    this.appendFilters();
  }

  private appendFilters(): void {
    this.appendNewCheckBoxFilter('Category', ['add your categories'])
      .appendNewRangeFilter('Price', ['from', 'to'])
      .appendNewCheckBoxFilter('Color', colors)
      .appendNewCheckBoxFilter('Material', materials)
      .appendNewCheckBoxFilter('Brand', brands)
      .addSorting('Sort', sortOptions);
    this.filters.appendChildren([this.applyFilterBtn]);
  }

  private appendNewCheckBoxFilter(name: string, filterOptions: string[] = [], values = filterOptions): this {
    const newFilterCategory = new FilterItem(name, filterOptions);
    newFilterCategory.addDropDownCheckBoxList(values);
    newFilterCategory.filterItem.getNode().addEventListener('click', (event) => {
      this.setNewActiveFilter(event);
    });
    this.filters.append(newFilterCategory.filterItem);
    return this;
  }

  private appendNewRangeFilter(name: string, filterOptions: string[] = []): this {
    const newFilterCategory = new FilterItem(name, filterOptions);
    newFilterCategory.addDropDownRange(prices);
    const priceRangeValues: Record<string, string> = { from: '0', to: '74000' };
    const priceRangeStr = '';
    Object.entries(newFilterCategory.getRangeInputs()).forEach(([option, input]) => {
      input.addListener('change', (e) => {
        this.setNewActiveRangeFilter(e, name, option, priceRangeValues, priceRangeStr);
      });
    });
    this.filters.append(newFilterCategory.filterItem);
    return this;
  }

  private addSorting(name: string, filterOptions: string[] = []): this {
    const newFilterCategory = new FilterItem(name, filterOptions);
    newFilterCategory.addDropDownRadioList(['price asc', 'price desc', 'name.ru asc', 'name.ru desc']);
    this.filters.append(newFilterCategory.filterItem);
    return this;
  }

  private addResetBtn(): void {
    if (Object.keys(this.activeFilters).length === 0) {
      this.activeFiltersContainer.append(this.resetFiltersBtn);
    }
  }

  private setNewActiveFilter(event: Event): void {
    const { target } = event;
    if (target instanceof HTMLInputElement) {
      if (target.checked) {
        this.addResetBtn();
        const newBadge = new ActiveFilterBadge(
          target.getAttribute('data-optionName') ?? '',
          target.id,
          this.activeFilters,
        ).badge.getNode();

        this.resetFiltersBtn.getNode().before(newBadge);
        this.addActiveFilter(target);
      } else {
        const badge = document.querySelector<HTMLDivElement>(`.badge[data-id="${target.id}"]`);
        if (badge) {
          badge.remove();
          delete this.activeFilters[target.id];
        }
        if (Object.keys(this.activeFilters).length === 0) {
          this.resetFiltersBtn.destroy();
        }
      }
    }
  }

  private setNewActiveRangeFilter(
    e: Event,
    name: string,
    option: string,
    priceRangeValues: Record<string, string> = { from: '0', to: '74000' },
    priceRangeStr = '',
  ): void {
    const { target } = e;
    if (target instanceof HTMLInputElement) {
      this.addResetBtn();
      priceRangeValues = this.filterRangeValuesValidation(0, 74000, priceRangeValues, target, option);

      priceRangeStr = `${name} from ${priceRangeValues.from} to ${priceRangeValues.to}`;
      const badge = document.querySelector<HTMLDivElement>(`.badge[data-id="${name}-badge"]`);
      if (badge) {
        badge.remove();
      }
      const newBadge = new ActiveFilterBadge(name, `${name}-badge`, this.activeFilters, priceRangeStr).badge.getNode();
      this.activeFiltersContainer.getNode().prepend(newBadge);
      this.addActiveFilter(target);
    }
  }

  private filterRangeValuesValidation(
    minVal: number,
    maxVal: number,
    priceRangeValues: Record<string, string> = { from: `${minVal}`, to: `${maxVal}` },
    input: HTMLInputElement,
    option: string,
  ): Record<string, string> {
    priceRangeValues[option] = `${Math.max(minVal, Math.min(maxVal, +input.value))}`;

    if (priceRangeValues.from && priceRangeValues.to) {
      if (+priceRangeValues.from > +priceRangeValues.to) {
        priceRangeValues.from = `${Math.max(minVal, +priceRangeValues.from)}`;
        priceRangeValues.to = `${Math.min(maxVal, +priceRangeValues.from)}`;
        input.value = priceRangeValues[option] ?? `${minVal}`;
      }
      input.value = priceRangeValues[option] ?? `${minVal}`;
    }

    return priceRangeValues;
  }

  private addActiveFilter(target: HTMLInputElement): void {
    this.activeFilters[target.id] = {
      element: target,
      filter: target.name,
      value: target.value,
      optionName: target.textContent ?? '',
    };
  }
}
