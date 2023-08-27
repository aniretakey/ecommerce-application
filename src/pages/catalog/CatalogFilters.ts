import BaseComponent from '@utils/baseComponent';
import { FilterItem } from './filterItem';
import { activeFilterBadge } from './activeFulterItem';
const categories = [
  'Vases',
  'Desks',
  'Coffee tables',
  'Sofas',
  'Shelves',
  'Pillows',
  'Outdoor chairs',
  'Drawers',
  'Chairs',
  'Bedside tables',
  'Beds',
  'Armchairs',
  'Outdoor',
  'Living room',
  'Office',
  'Bedroom',
  'decor',
  'furniture',
];
const colors = [
  'beige',
  'black',
  'blue',
  'brown',
  'dark brown',
  'dark grey',
  'grey',
  'light brown',
  'light-blue',
  'olive',
  'pink',
  'red',
  'turquoise',
  'white',
  'yellow',
];
const materials = [
  'ceramics',
  'cotton',
  'faux-rattan',
  'jacquard',
  'leather',
  'MDF',
  'particleboard',
  'plaster',
  'polyester',
  'rattan',
  'velour',
  'velvet',
  'wood',
];
const brands = [
  'Artful Creations',
  'Bohemian Bliss',
  'Classic Comfort',
  'LuxoCouch',
  'RegalRest',
  'RoyaLounge',
  'Rustic Roots',
  'Serene Spaces',
  'Sofanaissance',
  'VelvetyHaven',
];

export type ActiveFilters = Record<
  string,
  {
    element: HTMLInputElement;
    filter: string;
    value: string;
  }
>;

export class CatalogFilters {
  public filters: BaseComponent<'ul'>;
  public activeFiltersContainer: BaseComponent<'div'>;
  public activeFilters: ActiveFilters = {};
  private resetFiltersBtn: BaseComponent<'div'>;
  public applyFilterBtn: BaseComponent<'button'>;
  constructor() {
    this.filters = new BaseComponent({
      tagName: 'ul',
      classNames: ['filters', 'w-full', 'border', 'z-10', 'menu', 'menu-horizontal', 'px-1', 'justify-between'],
    });
    this.activeFiltersContainer = new BaseComponent({
      tagName: 'div',
      classNames: ['active-filters', 'w-full', 'border', 'px-1'],
    });
    this.addNewCheckBoxFilter('Category', categories)
      .addNewRangeFilter('Price')
      .addNewCheckBoxFilter('Color', colors)
      .addNewCheckBoxFilter('Material', materials)
      .addNewCheckBoxFilter('Brand', brands);

    this.applyFilterBtn = new BaseComponent({
      tagName: 'button',
      classNames: ['btn', 'btn-primary'],
      textContent: `apply`,
    });

    this.filters.append(this.applyFilterBtn);
    this.resetFiltersBtn = new BaseComponent({
      tagName: 'div',
      classNames: ['badge', 'badge-accent'],
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
    //this.activeFiltersContainer.append(this.resetFiltersBtn);
  }

  private setNewActiveFilter(event: Event, activeFiltersContainer: BaseComponent<'div'>): void {
    const { target } = event;
    if (target instanceof HTMLInputElement) {
      if (target.checked) {
        //   activeFiltersContainer.append(new activeFilterBadge(target.value, target.id, this.activeFilters).badge);
        activeFiltersContainer.append(this.resetFiltersBtn);
        this.resetFiltersBtn
          .getNode()
          .before(new activeFilterBadge(target.value, target.id, this.activeFilters).badge.getNode());

        this.activeFilters[target.id] = {
          element: target,
          filter: target.name,
          value: target.value,
        };
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
      console.log(this.activeFilters);
    }
  }
  private addNewCheckBoxFilter(name: string, filterOptions: string[] = []): this {
    const newFilterCategory = new FilterItem(name, filterOptions);
    newFilterCategory.addDropDownCheckBoxList();

    newFilterCategory.filterItem.getNode().addEventListener('click', (event) => {
      this.setNewActiveFilter(event, this.activeFiltersContainer);
    });
    this.filters.append(newFilterCategory.filterItem);

    return this;
  }

  private addNewRangeFilter(name: string, filterOptions: string[] = []): this {
    const newFilterCategory = new FilterItem(name, filterOptions);
    newFilterCategory.addDropDownRange();
    console.log(newFilterCategory.filterItem);
    const priceRangeValues: Record<string, string> = { from: '0', to: '74000' };
    let priceRangeStr = '';
    Object.entries(newFilterCategory.getRangeInputs()).forEach(([option, input]) => {
      input.addListener('change', (e) => {
        const { target } = e;
        if (target instanceof HTMLInputElement) {
          console.log(target.getAttribute('value'), target.value);
          priceRangeValues[option] = `${option} ${input.getNode().value}`;
          priceRangeStr = `${name} ${priceRangeValues.from} ${priceRangeValues.to}`;
          console.log(priceRangeStr);
          const badge = document.querySelector<HTMLDivElement>(`.badge[data-id="${name}-badge"]`);
          if (badge) {
            badge.remove();
          }
          const newBadge = new activeFilterBadge(
            name,
            `${name}-badge`,
            this.activeFilters,
            priceRangeStr,
          ).badge.getNode();
          this.activeFilters[target.id] = {
            element: target,
            filter: target.name,
            value: target.value,
          };
          this.activeFiltersContainer.getNode().prepend(newBadge);
        }
      });
    });
    this.filters.append(newFilterCategory.filterItem);
    return this;
  }

  private setNewActiveFilterPrice(event: Event, activeFiltersContainer: BaseComponent<'div'>): void {
    const { target } = event;
    if (target instanceof HTMLInputElement) {
      if (target.checked) {
        //   activeFiltersContainer.append(new activeFilterBadge(target.value, target.id, this.activeFilters).badge);
        activeFiltersContainer.append(this.resetFiltersBtn);
        this.resetFiltersBtn
          .getNode()
          .before(new activeFilterBadge(target.value, target.id, this.activeFilters).badge.getNode());

        this.activeFilters[target.id] = {
          element: target,
          filter: target.name,
          value: target.value,
        };
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
      console.log(this.activeFilters);
    }
  }
}
