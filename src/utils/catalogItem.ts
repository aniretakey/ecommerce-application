import BaseComponent from './baseComponent';

export class CatalogItem {
  public card: BaseComponent<'div'>;
  private photo: BaseComponent<'img'>;
  private category: BaseComponent<'p'>;
  private name: BaseComponent<'h5'>;
  private description: BaseComponent<'p'>;
  private price: BaseComponent<'p'>;
  private discount: BaseComponent<'p'>;

  constructor(imgSrc: string, category: string, name: string, description: string, price = 0, discount?: number) {
    this.card = new BaseComponent({
      tagName: 'div',
      classNames: ['card', 'w-80', 'bg-base-100', 'shadow-xl'],
    });
    this.photo = new BaseComponent({ tagName: 'img', classNames: ['object-cover', 'h-52'] });
    this.setPhotoAttr(imgSrc, name);
    this.category = new BaseComponent({ tagName: 'p' });
    this.setCategory(category);
    this.name = new BaseComponent({ tagName: 'h5', classNames: ['card-title'] });
    this.name.setTextContent(name);
    this.description = new BaseComponent({ tagName: 'p' });
    this.description.setTextContent(description);
    this.price = new BaseComponent({ tagName: 'p' });
    this.discount = new BaseComponent({ tagName: 'p' });
    this.displayPrice(price, discount);
    this.buildItem();
  }

  private setPhotoAttr(src: string, alt: string): this {
    this.photo.setAttributes({ src, alt });
    return this;
  }

  private setCategory(category: string): this {
    this.category.setTextContent(category);
    return this;
  }

  private displayPrice(price: number, discount?: number): this {
    this.price.setTextContent(`${price}`);
    if (discount) {
      this.price.addClass(['line-through']);
      this.discount.setTextContent(`${discount}`);
      /* const saleBaidge = */ new BaseComponent({
        tagName: 'div',
        classNames: ['badge', 'badge-secondary'],
        parentNode: this.name.getNode(),
        textContent: 'Sale',
      });
    }
    return this;
  }

  private buildItem(): this {
    this.card.appendChildren([this.photo, this.category, this.name, this.description, this.price, this.discount]);
    return this;
  }
}
