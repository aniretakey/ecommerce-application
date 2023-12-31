import BaseComponent from '@utils/baseComponent';
import { CatalogFilters } from '../../components/filters/CatalogFilters';
import { getCart, getCategories, getProductsSearch } from '@utils/apiRequests';
import { ProductProjection } from '@commercetools/platform-sdk';
import placeholder from '@assets/logo.png';
import { CatalogCard } from '@pages/catalog/catalogCardTemplate';
import { CatalogPagination } from './CatalogPagination';
import { CATALOG_CARDS_NUM } from '@customTypes/enums';
import { FilterItem } from '../../components/filters/filterItem';
import { Search } from './search';
import { CatalogNav } from './CatalogNav';
import { safeQuerySelector } from '@utils/safeQuerySelector';

export class CatalogView {
  public catalogWrapper = new BaseComponent({
    tagName: 'div',
    classNames: ['flex', 'flex-col', 'justify-between', 'items-center', 'gap-4'],
  });
  private filterOptionsWrapper = new BaseComponent({
    tagName: 'div',
    classNames: ['flex', 'max-sm:flex-col', 'max-sm:items-center'],
  });
  private filtersContainer: CatalogFilters;
  private catalogCardsWrap = new BaseComponent({
    tagName: 'div',
    classNames: ['catalog__cards-wrap', 'justify-items-center'],
  });
  private categoryData: Record<string, string> = {};
  private cardItems: CatalogCard[] = [];
  private pagination: CatalogPagination;
  private resultFilters: string[] = [];
  private search: Search;
  private catalogNav: CatalogNav;
  private cartProductId: string[] = [];

  constructor() {
    this.setCartItems();
    this.search = new Search();
    this.filtersContainer = new CatalogFilters();
    this.catalogNav = new CatalogNav();
    this.pagination = new CatalogPagination(this.updateCatalogPage.bind(this));
    this.filterOptionsWrapper.appendChildren([
      this.catalogNav.categoriesContainer,
      this.filtersContainer.filtersContainer,
    ]);
    this.catalogWrapper.appendChildren([
      this.search.searchField,
      this.filterOptionsWrapper,
      this.catalogNav.breadcrumb,
      this.catalogCardsWrap,
      this.pagination.pagContainer,
    ]);
    this.updateCatalogPage();
    this.filtersContainer.applyFilterBtn.addListener('click', () => {
      this.applyFilters();
    });
    this.search.searchBtn.addListener('click', () => {
      this.pagination.currentPage = 1;
      this.pagination.maxPage = 2;
      this.pagination.total = CATALOG_CARDS_NUM;
      this.updateCatalogPage();
    });
    this.catalogNav.catalogNavigation.addListener('click', (e) => {
      this.catalogNav.categoryClickHandler(e) && this.applyFilters();
    });
    this.catalogNav.breadcrumb.addListener('click', (e) => {
      this.catalogNav.breadcrumbClickHandler(e) && this.applyFilters();
    });
  }

  private applyFilters(): void {
    const activeFilters = this.filtersContainer.activeFilters;
    const brand: string[] = [];
    const color: string[] = [];
    const material: string[] = [];
    Object.values(activeFilters).forEach(({ filter, value }) => {
      const val = `"${value}"`;
      switch (filter) {
        case 'Brand':
          brand.push(val);
          break;
        case 'Material':
          material.push(val);
          break;
        case 'Color':
          color.push(val);
          break;
      }
    });
    this.resultFilters = [];
    this.pagination.currentPage = 1;
    this.pagination.maxPage = 2;
    this.pagination.total = CATALOG_CARDS_NUM;
    this.createFilterString('variants.attributes.Color', color, this.resultFilters);
    this.createFilterString('variants.attributes.Material', material, this.resultFilters);
    this.createFilterString('variants.attributes.Brand', brand, this.resultFilters);
    this.createPriceFilterString(this.resultFilters);
    this.catalogNav.currentCategoryId &&
      this.createFilterString('categories.id', [`subtree("${this.catalogNav.currentCategoryId}")`], this.resultFilters);
    this.updateCatalogPage();
  }

  private createFilterString(predicat: string, arr: string[], result: string[] = []): string[] {
    if (arr.length > 0) {
      result.push(`${predicat}:${arr.join(',')}`);
    }
    return result;
  }

  private createPriceFilterString(result: string[] = []): string[] {
    const minPriceInput = document.querySelector<HTMLInputElement>('#price-from');
    const maxPriceInput = document.querySelector<HTMLInputElement>('#price-to');
    if (minPriceInput && maxPriceInput) {
      const minPrice = Math.max(0, +minPriceInput.value * 100);
      const maxPrice = Math.min(7400000, +maxPriceInput.value * 100);
      const priceString = `variants.price.centAmount:range (${minPrice} to ${maxPrice})`;
      result.push(priceString);
    }
    return result;
  }
  private updateCatalogPage(): void {
    this.cardItems = [];
    this.drawCardLoaders();
    this.drawCatalogCards((this.pagination.currentPage - 1) * CATALOG_CARDS_NUM, CATALOG_CARDS_NUM);
    this.pagination.pageInfoBtn.setTextContent(`Page ${this.pagination.currentPage}`);
  }

  private drawCardLoaders(): void {
    if (this.pagination.currentPage === 1) {
      this.pagination.prevBtn.getNode().disabled = true;
    }
    const cardNumber = 6;
    this.catalogCardsWrap.clearInnerHTML();
    for (let i = 0; i < cardNumber; i++) {
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
    getProductsSearch(
      offset,
      limit,
      this.resultFilters,
      FilterItem.getSortVal(),
      this.search.searchInput.getNode().value,
    )
      .then(async (data) => {
        this.pagination.total = data.body.total ?? 0;
        this.pagination.maxPage = Math.ceil((data.body.total ?? 1) / CATALOG_CARDS_NUM);
        const cardNumber = Math.min(6, this.pagination.total - (this.pagination.currentPage - 1) * CATALOG_CARDS_NUM);
        if (this.pagination.currentPage >= this.pagination.maxPage || cardNumber < CATALOG_CARDS_NUM) {
          this.pagination.nextBtn.getNode().disabled = true;
        } else {
          this.pagination.nextBtn.getNode().disabled = false;
        }
        await this.getCategoryNames();
        const results = data.body.results;
        this.createCardItems(results, this.categoryData);
      })
      .catch(console.log);
  }

  private createCardItems(results: ProductProjection[], categoryNames: Record<string, string>): void {
    if (results.length >= 1) {
      results.forEach((product, index) => {
        const id = product.id;
        const categories: string[] = product.categories.map((data) => categoryNames[data.id] ?? '');
        const name = product.name.ru ?? '';
        const description = product.description?.ru ?? '';
        const prices = product.masterVariant.prices ?? [];
        const productKey = product.masterVariant.key?.slice(0, -2) ?? '';
        let price = 0;
        let discount: number | undefined;
        if (prices.length) {
          price = prices[0]?.value.centAmount ?? 0;
          discount = prices[0]?.discounted?.value.centAmount;
        }
        const images = product.masterVariant.images ?? [];
        let imgSrc = '';
        imgSrc = images[0]?.url ?? `${placeholder}`;
        this.cardItems[index]
          ?.setProductName(name)
          .setProductDescription(description)
          .setPhotoAttr(imgSrc, name)
          .setCategories(categories)
          .displayPrice(price, discount)
          .addCardId(productKey);
        const cardElement = this.cardItems[index]?.card;
        if (cardElement) {
          const buttonToCard = safeQuerySelector<HTMLButtonElement>('.btn_add-to-cart', cardElement.getNode());
          buttonToCard.setAttribute('productId', id);
          this.cartProductId.includes(id) && buttonToCard.classList.remove('btn_add-cart__active');
          this.cartProductId.includes(id) && buttonToCard.classList.add('btn_add-cart__disabled');
        }
      });
    }
    if (results.length < this.cardItems.length) {
      this.cardItems.slice(results.length).forEach((el) => {
        el.card.destroy();
      });
    }
  }

  private setCartItems(): void {
    const cartId = localStorage.getItem('comforto-cart-id');
    if (cartId) {
      getCart(cartId)
        .then((data) => {
          this.cartProductId = data.body.lineItems.map((item) => item.productId);
          console.log(this.cartProductId);
        })
        .catch(console.log);
    }
  }
}
