import BaseComponent from '../../utils/baseComponent';

export class CatalogCard {
  public card: BaseComponent<'div'>;
  public categories: BaseComponent<'div'>;
  public cardBody: BaseComponent<'div'>;
  public photo: BaseComponent<'img'>;
  public priceContainer: BaseComponent<'div'>;
  public name: BaseComponent<'h5'>;
  public description: BaseComponent<'p'>;
  public price: BaseComponent<'p'>;
  public discount: BaseComponent<'p'>;

  constructor() {
    this.card = new BaseComponent({
      tagName: 'div',
      classNames: ['card', 'card-compact', 'w-80', 'bg-base-100', 'shadow-xl' /* , 'h-96' */],
    });
    this.photo = new BaseComponent({
      tagName: 'img',
      classNames: ['object-cover', 'h-52', 'loading', 'loading-spinner', 'loading-lg', 'm-auto'],
    });

    this.cardBody = new BaseComponent({ tagName: 'div', classNames: ['card-body'] });
    this.categories = new BaseComponent({ tagName: 'div', classNames: ['card-actions', 'justify-end'] });

    this.name = new BaseComponent({
      tagName: 'h5',
      classNames: ['card-title', 'text-start', 'm-0', 'justify-between', 'poduct-name'],
    });

    this.description = new BaseComponent({ tagName: 'p', classNames: ['description'] });

    this.priceContainer = new BaseComponent({ tagName: 'div', classNames: ['flex', 'justify-between'] });
    this.price = new BaseComponent({ tagName: 'p', classNames: ['price', 'text-primary'] });
    this.discount = new BaseComponent({ tagName: 'p', classNames: ['discount', 'text-accent', 'text-end'] });
    this.priceContainer.appendChildren([this.price, this.discount]);

    this.cardBody.appendChildren([this.name, this.description, this.priceContainer, this.categories]);
  }

  public setPhotoAttr(src: string, alt: string): this {
    this.photo.getNode().classList.remove('loading', 'loading-spinner', 'loading-lg', 'm-auto');
    this.photo.setAttributes({ src, alt });
    return this;
  }

  public setCategories(categories: string[] = []): this {
    categories.forEach((item) => {
      const category = new BaseComponent({
        tagName: 'p',
        classNames: [
          'badge',
          'badge-outline',
          'badge-md',
          'grow-0',
          'category-badge',
          'hover:text-white',
          'hover:bg-primary',
        ],
        textContent: item,
      });
      this.categories.append(category);
    });
    return this;
  }

  public displayPrice(price: number, discount?: number): this {
    this.price.setTextContent(`₽${price / 100}`);
    if (discount) {
      this.price.addClass(['line-through', 'opacity-50']);
      this.discount.setTextContent(`₽${discount / 100}`);
      new BaseComponent({
        tagName: 'div',
        classNames: ['badge', 'badge-accent', 'badge-lg'],
        parentNode: this.name.getNode(),
        textContent: 'Sale',
      });
    }
    this.priceContainer.appendChildren([this.price, this.discount]);
    return this;
  }

  public setProductName(name: string): this {
    this.name.setTextContent(name);
    return this;
  }
  public setProductDescription(description: string): this {
    this.description.setTextContent(description);
    return this;
  }
  public buildItem(): this {
    this.card.appendChildren([this.photo, this.cardBody]);
    return this;
  }
}