import BaseComponent from '@utils/baseComponent';
import { CatalogFilters } from './CatalogFilters';
import { getCategories, getProducts } from '@utils/apiRequests';
import { Product } from '@commercetools/platform-sdk';
import placeholder from '@assets/logo.png';
import { CatalogCard } from '@pages/catalog/catalogCardTemplate';
import { CatalogPagination } from './CatalogPagination';
import { CATALOG_CARDS_NUM } from '@customTypes/enums';

export class CatalogView {
  public catalogWrapper: BaseComponent<'div'>;
  private filtersContainer: CatalogFilters;
  private catalogCardsWrap: BaseComponent<'div'>;
  private categoryData: Record<string, string> = {};
  private cardItems: CatalogCard[] = [];
  private currentPage = 1;
  //  private maxPage = 1;
  private pagination: CatalogPagination;
  private total = 6;
  constructor() {
    this.catalogWrapper = new BaseComponent({
      tagName: 'div',
    });
    this.catalogCardsWrap = new BaseComponent({
      tagName: 'div',
      classNames: ['catalog__cards-wrap', 'justify-items-center'],
    });
    this.pagination = new CatalogPagination();
    this.filtersContainer = new CatalogFilters();
    this.catalogWrapper.appendChildren([
      this.filtersContainer.filters,
      this.catalogCardsWrap,
      this.pagination.pagContainer,
    ]);
    this.draw();
    this.drawCatalogCards();

    this.pagination.nextBtn.addListener('click', () => {
      this.currentPage += 1;
      this.cardItems = [];
      this.draw();
      this.drawCatalogCards((this.currentPage - 1) * CATALOG_CARDS_NUM, CATALOG_CARDS_NUM);

      this.pagination.pageInfoBtn.setTextContent(`Page ${this.currentPage}`);
    });
    this.pagination.prevBtn.addListener('click', () => {
      this.currentPage -= 1;
      this.cardItems = [];
      this.draw();
      this.drawCatalogCards((this.currentPage - 1) * CATALOG_CARDS_NUM, CATALOG_CARDS_NUM);

      this.pagination.pageInfoBtn.setTextContent(`Page ${this.currentPage}`);
    });
  }

  private draw(): void {
    this.catalogCardsWrap.clearInnerHTML();
    console.log(this.total, this.currentPage);
    for (let i = 0; i < Math.min(6, this.total - (this.currentPage - 1) * CATALOG_CARDS_NUM); i++) {
      const newItem = new CatalogCard().buildItem();
      this.catalogCardsWrap.getNode().append(newItem.card.getNode());
      this.cardItems.push(newItem);
    }
  }

  private async getCategoryNames(): Promise<void> {
    await getCategories()
      .then((data) => {
        data.body.results.forEach((el) => {
          const {
            id = '',
            name: { ru: category = '' },
          } = el;
          this.categoryData[id] = category;
        });
      })
      .catch(console.log);
  }

  private drawCatalogCards(offset = 0, limit = CATALOG_CARDS_NUM): void {
    getProducts(offset, limit)
      .then(async (data) => {
        this.total = data.body.total ?? 0;
        //   this.maxPage = data.body.total ?? 1;
        console.log(data);
        await this.getCategoryNames();
        const results = data.body.results;
        this.createItems(results, this.categoryData);
      })
      .catch(console.log);
  }

  private createItems(results: Product[], categoryNames: Record<string, string>): void {
    if (results.length >= 1) {
      results.forEach((item, index) => {
        const product = item.masterData.current;
        const categories: string[] = item.masterData.current.categories.map((data) => categoryNames[data.id] ?? '');
        const name = product.name.ru ?? '';
        const description = product.description?.ru ?? '';
        const prices = product.masterVariant.prices ?? [];
        let price = 0;
        let discount: number | undefined;
        if (prices.length) {
          price = prices[0]?.value.centAmount ?? 0;
          discount = prices[0]?.discounted?.value.centAmount;
        }
        const images = product.masterVariant.images ?? [];
        let imgSrc = '';
        if (images.length) {
          imgSrc = images[0]?.url ?? `${placeholder}`;
        }

        this.cardItems[index]
          ?.setProductName(name)
          .setProductDescription(description)
          .setPhotoAttr(imgSrc, name)
          .setCategories(categories)
          .displayPrice(price, discount);
      });
    } //удаление лишних карточек
    if (results.length < this.cardItems.length) {
      this.cardItems.slice(results.length).forEach((el) => {
        el.card.destroy();
      });
    }
  }
}
