import BaseComponent from '@utils/baseComponent';
import { FilterItem } from './filterItem';
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
export class CatalogFilters {
  public filters: BaseComponent<'ul'>;

  constructor() {
    this.filters = new BaseComponent({
      tagName: 'ul',
      classNames: ['filters', 'w-full', 'border', 'z-10', 'menu', 'menu-horizontal', 'px-1', 'justify-between'],
    });

    this.addNewFilter('Category', categories)
      .addNewFilter('Color', colors)
      .addNewFilter('Material', materials)
      .addNewFilter('Brand', brands);
  }

  private addNewFilter(name: string, filterOptions: string[] = []): this {
    this.filters.append(new FilterItem(name, filterOptions).filterItem);
    return this;
  }
}
