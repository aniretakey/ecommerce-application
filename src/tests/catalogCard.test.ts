import { CatalogCard } from '@pages/catalog/catalogCardTemplate';

jest.mock('../utils/apiRequests', () => ({
  addProductInCart: jest.fn().mockResolvedValue({}),
  createCart: jest.fn().mockResolvedValue({}),
  getCart: jest.fn().mockResolvedValue({}),
}));

// eslint-disable-next-line max-lines-per-function
describe('CatalogCard', () => {
  const card = new CatalogCard();

  it('setPhotoAttr should remove classes for preload cards and set src & alt attributes', () => {
    const src = 'photo.png';
    const alt = 'this is photo';
    const loadingClasses = ['loading', 'loading-spinner', 'loading-lg', 'm-auto'];
    card.setPhotoAttr(src, alt);
    loadingClasses.forEach((clas) => {
      expect(card.photo.getNode().classList.contains(clas)).toBe(false);
    });
    expect(card.photo.getNode().alt).toBe(alt);
    expect(card.photo.getNode().getAttribute('src')).toBe(src);
  });

  it('setCategories should add categories', () => {
    const categories = ['category 1', 'category 2', 'category 3'];

    card.setCategories(categories);
    const catBadges = card.categories.getNode().querySelectorAll<HTMLParagraphElement>('p.badge');

    expect(catBadges.length).toBe(categories.length);

    catBadges.forEach((badge, i) => {
      expect(badge.textContent).toBe(categories[i]);
    });
  });

  // eslint-disable-next-line max-lines-per-function
  describe('displayPrice should add price and discount', () => {
    const price = 100000;
    const discount = 50000;
    const disablePriceClasses = ['line-through', 'opacity-50'];

    card.displayPrice(price, discount);

    it('should set textcontent to price', () => {
      expect(card.price.getNode().textContent).toBe(`₽${price / 100}`);
    });

    it('should set textcontent to discount if discount was presented', () => {
      expect(card.discount.getNode().textContent).toBe(`₽${discount / 100}`);
    });

    it('should add classes to price if discount was presented', () => {
      disablePriceClasses.forEach((clas) => {
        expect(card.price.getNode().classList.contains(clas)).toBe(true);
      });
    });

    it('should add sale badge if discount was presented', () => {
      const saleBadge = card.name.getNode().querySelector<HTMLDivElement>('div.badge');

      expect(saleBadge).not.toBeNull();
      expect(saleBadge?.textContent).toBe('Sale');
    });

    it('should add price and discount to priceContainer', () => {
      const price = card.priceContainer.getNode().querySelector<HTMLParagraphElement>('p.price');
      const discount = card.priceContainer.getNode().querySelector<HTMLParagraphElement>('p.discount');

      expect(price).not.toBeNull();
      expect(discount).not.toBeNull();
    });
  });

  it('setProductName should set name textcontent', () => {
    const name = 'Super product name';
    card.setProductName(name);
    expect(card.name.getNode().textContent).toBe(name);
  });

  it('setProductName should set card id & add navigation attrs to infoButton', () => {
    const id = 'Super product id';
    card.addCardId(id);
    expect(card.card.getNode().id).toBe(id);
    expect(card.infoButton.getNode().getAttribute('href')).toBe(`/#/product-page/${id}`);
    expect(card.infoButton.getNode().hasAttribute('data-navigo')).toBe(true);
  });

  it('buildItem should add photo, infoButton and cardBody to card', () => {
    card.buildItem();
    const photo = card.card.getNode().querySelector<HTMLImageElement>('img');
    const infoButton = card.card.getNode().querySelector<HTMLLinkElement>('a.btn');
    const cardBody = card.card.getNode().querySelector<HTMLDivElement>('.card-body');
    expect(photo).not.toBeNull();
    expect(infoButton).not.toBeNull();
    expect(cardBody).not.toBeNull();
  });

  it('setProductDescription should set description textcontent', () => {
    const description = 'Super product description';
    card.setProductDescription(description);
    expect(card.description.getNode().textContent).toBe(description);
  });
});
afterAll(() => {
  jest.resetAllMocks();
});
