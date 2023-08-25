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
  }
>;

export class CatalogFilters {
  public filters: BaseComponent<'ul'>;
  public activeFiltersContainer: BaseComponent<'div'>;
  private activeFilters: ActiveFilters = {};
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

    const applyFilterBtn = new BaseComponent({
      tagName: 'button',
      classNames: ['btn', 'btn-primary'],
      textContent: `apply`,
    });

    this.filters.append(applyFilterBtn);
  }
  private setNewActiveFilter(event: Event, activeFiltersContainer: BaseComponent<'div'>): void {
    const { target } = event;
    if (target instanceof HTMLInputElement) {
      if (target.checked) {
        activeFiltersContainer.append(new activeFilterBadge(target.value, target.id, this.activeFilters).badge);
        this.activeFilters[target.id] = {
          element: target,
          filter: target.value,
        };
      } else {
        const badge = document.querySelector<HTMLDivElement>(`.badge[data-id="${target.id}"]`);
        if (badge) {
          badge.remove();
          delete this.activeFilters[target.id];
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
    this.filters.append(new FilterItem(name, filterOptions).addDropDownRange().filterItem);
    return this;
  }
}
