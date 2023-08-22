import BaseComponent from './baseComponent';

export class CatalogItem {
  public card: BaseComponent<'div'>;
  public categories: BaseComponent<'div'>;
  public cardBody: BaseComponent<'div'>;
  private photo: BaseComponent<'img'>;
  private priceContainer: BaseComponent<'div'>;
  private name: BaseComponent<'h5'>;
  private description: BaseComponent<'p'>;
  private price: BaseComponent<'p'>;
  private discount: BaseComponent<'p'>;

  constructor(
    imgSrc: string,
    categories: string[] = [],
    name: string,
    description: string,
    price = 0,
    discount?: number,
  ) {
    this.card = new BaseComponent({
      tagName: 'div',
      classNames: ['card', 'card-compact', 'w-80', 'bg-base-100', 'shadow-xl'],
    });
    this.photo = new BaseComponent({ tagName: 'img', classNames: ['object-cover', 'h-52'] });
    this.setPhotoAttr(imgSrc, name);
    this.cardBody = new BaseComponent({ tagName: 'div', classNames: ['card-body'] });
    this.categories = new BaseComponent({ tagName: 'div', classNames: ['card-actions', 'justify-end'] });
    this.setCategories(categories);
    this.name = new BaseComponent({
      tagName: 'h5',
      classNames: ['card-title', 'text-start', 'm-0', 'justify-between'],
    });
    this.name.setTextContent(name);
    this.description = new BaseComponent({ tagName: 'p', classNames: ['description'] });
    this.description.setTextContent(description);
    this.priceContainer = new BaseComponent({ tagName: 'div', classNames: ['flex', 'justify-between'] });
    this.price = new BaseComponent({ tagName: 'p', classNames: ['price', 'text-primary'] });
    this.discount = new BaseComponent({ tagName: 'p', classNames: ['discount', 'text-accent', 'text-end'] });
    this.priceContainer.appendChildren([this.price, this.discount]);
    this.displayPrice(price, discount);
    this.cardBody.appendChildren([this.name, this.description, this.priceContainer, this.categories]);
    this.buildItem();
  }

  private setPhotoAttr(src: string, alt: string): this {
    this.photo.setAttributes({ src, alt });
    return this;
  }

  private setCategories(categories: string[] = []): this {
    categories.forEach((item) => {
      const category = new BaseComponent({
        tagName: 'p',
        classNames: ['badge', 'badge-outline', 'badge-md'],
        textContent: item,
      });
      this.categories.append(category);
    });
    return this;
  }

  private displayPrice(price: number, discount?: number): this {
    this.price.setTextContent(`₽${price / 100}`);
    if (discount) {
      this.price.addClass(['line-through', 'opacity-50']);
      this.discount.setTextContent(`₽${discount / 100}`);
      /* const saleBaidge = */ new BaseComponent({
        tagName: 'div',
        classNames: ['badge', 'badge-accent', 'badge-lg'],
        parentNode: this.name.getNode(),
        textContent: 'Sale',
      });
    }
    return this;
  }

  private buildItem(): this {
    this.card.appendChildren([this.photo, this.cardBody]);
    return this;
  }
}
