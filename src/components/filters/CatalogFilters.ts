import BaseComponent from '@utils/baseComponent';
import { FilterItem } from './filterItem';
import { ActiveFilterBadge } from './activeFilterItem';
import { filterClasses } from '@utils/componentsClasses';
import { ActiveFilters } from '@customTypes/types';
import { getProductsSearch } from '@utils/apiRequests';
import { ProductProjection } from '@commercetools/platform-sdk';

export class CatalogFilters {
  public applyFilterBtn: BaseComponent<'button'>;
  public filtersContainer: BaseComponent<'div'>;
  public filters: BaseComponent<'div'>;
  public activeFiltersContainer: BaseComponent<'div'>;
  public activeFilters: ActiveFilters = {};
  private resetFiltersBtn: BaseComponent<'div'>;

  constructor() {
    this.filtersContainer = new BaseComponent({ tagName: 'div', classNames: ['max-lg:w-1/2'] });
    this.filters = new BaseComponent({
      tagName: 'div',
      classNames: filterClasses,
    });
    this.activeFiltersContainer = new BaseComponent({
      tagName: 'div',
      classNames: ['active-filters', 'w-full', 'px-1', 'flex', 'flex-wrap', 'gap-2.5', 'justify-center'],
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
    this.filtersContainer.appendChildren([this.filters, this.activeFiltersContainer]);
  }

  private appendFilters(): void {
    getProductsSearch(0, 100, [], 'price asc')
      .then((data) => {
        const results = data.body.results;
        const minPriceVal = this.getPrice(results, true);
        const maxPriceVal = this.getPrice(results, false);
        this.appendNewRangeFilter('Price', ['from', 'to'], minPriceVal, maxPriceVal);

        const attributes = this.getAttributes(results);
        Object.entries(attributes).forEach(([key, val]) => {
          this.appendNewCheckBoxFilter(key, val);
        });

        this.addSorting('Sort', ['Price: Low to High', 'Price: High to Low', 'Name: A-Z', 'Name: Z-A']);

        this.filters.appendChildren([this.applyFilterBtn]);
      })
      .catch(console.log);
  }

  private getPrice(results: ProductProjection[], isGetMin = true): number {
    const productIndex = isGetMin ? 0 : results.length - 1;
    const priceProduct = results[productIndex];
    const allPrices = priceProduct?.masterVariant.prices ?? [];
    let price = isGetMin ? Infinity : -Infinity;
    let discount = isGetMin ? Infinity : -Infinity;
    if (allPrices.length) {
      price = allPrices[0]?.value.centAmount ?? price;
      discount = allPrices[0]?.discounted?.value.centAmount ?? discount;
    }
    const priceVal = (isGetMin ? Math.min(price, discount) : Math.max(price, discount)) / 100;
    return priceVal;
  }

  private getAttributes(results: ProductProjection[]): Record<string, string[]> {
    const attrs: Record<string, string[]> = {};
    results.forEach((res) => {
      const attributes = res.masterVariant.attributes ?? [];
      attributes.forEach(({ name, value }) => {
        attrs[name] = [...new Set((attrs[name] ?? []).concat(`${value}`))];
      });
    });
    return attrs;
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

  private appendNewRangeFilter(name: string, filterOptions: string[] = [], minVal: number, maxVal: number): this {
    const newFilterCategory = new FilterItem(name, filterOptions);
    newFilterCategory.addDropDownRange([minVal, maxVal]);
    const priceRangeValues: Record<string, string> = { from: `${minVal}`, to: `${maxVal}` };
    const priceRangeStr = '';
    Object.entries(newFilterCategory.getRangeInputs()).forEach(([option, input]) => {
      input.addListener('change', (e) => {
        this.setNewActiveRangeFilter(e, name, option, priceRangeValues, priceRangeStr, minVal, maxVal);
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
    priceRangeValues: Record<string, string>,
    priceRangeStr = '',
    minVal: number,
    maxVal: number,
  ): void {
    const { target } = e;
    if (target instanceof HTMLInputElement) {
      this.addResetBtn();
      priceRangeValues = this.filterRangeValuesValidation(minVal, maxVal, priceRangeValues, target, option);

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
