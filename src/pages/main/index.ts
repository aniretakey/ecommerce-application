import BaseComponent from '@utils/baseComponent';
import './main.css';
import wideImg from '@assets/img/main/main-page-wide.png';
import { renderProductsCarousel } from './carousel';
import productsMakingImg2 from '@assets/img/main/furniture-making1.png';
import productsMakingImg1 from '@assets/img/main/furniture-making2.png';

export default class Main {
  public main: BaseComponent<'main'>;

  constructor() {
    this.main = new BaseComponent({
      tagName: 'main',
      classNames: ['main'],
      attributes: {
        id: 'main',
      },
      parentNode: document.body,
      textContent: '',
    });
  }

  private createMainSection(): void {
    const mainSection = new BaseComponent({
      tagName: 'section',
      classNames: ['main-section'],
      parentNode: this.main.getNode(),
    });

    const mainTitle = new BaseComponent({
      tagName: 'h2',
      classNames: ['main-title'],
      textContent: `Discover Furniture With High Quality Wood`,
    });

    const mainDescription = new BaseComponent({
      tagName: 'p',
      classNames: ['description', 'main__description'],
      textContent:
        'At the heart of our products concept is its configurability and individuality. The right material is more than just a prerequisite of a quality design piece. It’s your chance to imbue a design with personality and style.',
    });

    const mainWideImg = new BaseComponent({
      tagName: 'img',
      classNames: ['main__wide-img'],
    });
    mainWideImg.getNode().src = `${wideImg}`;
    mainSection.append(mainTitle);
    mainSection.append(mainDescription);
    mainSection.append(mainWideImg);
  }

  private createPopularProductsSection(): void {
    const productsSection = new BaseComponent({
      tagName: 'section',
      classNames: ['popular-products'],
      parentNode: this.main.getNode(),
    });

    const productsTitle = new BaseComponent({
      tagName: 'h2',
      classNames: ['popular-products__title'],
      textContent: `Our popular products`,
    });

    const productsDescription = new BaseComponent({
      tagName: 'p',
      classNames: ['description', 'popular-products__description'],
      textContent: `Create a unique look to fit your lifestyle`,
    });

    productsSection.append(productsTitle);
    productsSection.append(productsDescription);

    const productsCarousel = new BaseComponent({
      tagName: 'div',
      classNames: ['carousel', 'carousel-center', 'rounded-box'],
      parentNode: productsSection.getNode(),
    });

    productsCarousel.getNode().innerHTML = renderProductsCarousel();
  }

  private createProductsMakingSection(): void {
    const productsCreatingSection = new BaseComponent({
      tagName: 'section',
      classNames: ['products-creating'],
      parentNode: this.main.getNode(),
    });

    const block1 = this.createBlockOne();
    const block2 = this.createBlockTwo();

    productsCreatingSection.append(block1);
    productsCreatingSection.append(block2);
  }

  private createBlockOne(): BaseComponent<'div'> {
    const block1 = new BaseComponent({
      tagName: 'div',
      classNames: ['products-creating__block'],
    });

    const productsCreatingTitle = new BaseComponent({
      tagName: 'h2',
      classNames: ['products-creating__title'],
      textContent: `Crafted by talented makers and with high quality material`,
    });

    const productsCreatingDescription = new BaseComponent({
      tagName: 'p',
      classNames: ['description', 'products-creating__description'],
      textContent: `Our custom wood furniture made by the most talented makers in the world. Each product is handmade by us. We'd love to hear your ideas. Let's get into it!`,
    });

    block1.append(productsCreatingTitle);
    block1.append(productsCreatingDescription);

    const img1 = new BaseComponent({
      tagName: 'img',
      classNames: ['products-creating__img'],
      parentNode: block1.getNode(),
    });

    img1.getNode().src = `${productsMakingImg1}`;
    return block1;
  }

  private createBlockTwo(): BaseComponent<'div'> {
    const block2 = new BaseComponent({
      tagName: 'div',
      classNames: ['products-creating__block'],
    });
    const productsCreatingTags = new BaseComponent({
      tagName: 'div',
      classNames: ['products-creating__tags'],
      parentNode: block2.getNode(),
    });
    const productsCreatingTag1 = new BaseComponent({
      tagName: 'p',
      classNames: ['products-creating__tag'],
      parentNode: productsCreatingTags.getNode(),
    });
    const productsCreatingTag2 = new BaseComponent({
      tagName: 'p',
      classNames: ['products-creating__tag'],
      parentNode: productsCreatingTags.getNode(),
    });
    const productsCreatingTag3 = new BaseComponent({
      tagName: 'p',
      classNames: ['products-creating__tag'],
      parentNode: productsCreatingTags.getNode(),
    });

    productsCreatingTag1.getNode().innerHTML = `<b class="products-creating__num">20+</b>Years Experience`;
    productsCreatingTag2.getNode().innerHTML = `<b class="products-creating__num">483</b>Happy Clients`;
    productsCreatingTag3.getNode().innerHTML = `<b class="products-creating__num">150+</b>Project Finished`;

    const img2 = new BaseComponent({
      tagName: 'img',
      classNames: ['products-creating__img'],
      parentNode: block2.getNode(),
    });

    img2.getNode().src = `${productsMakingImg2}`;
    return block2;
  }

  public render(): void {
    this.createMainSection();
    this.createPopularProductsSection();
    this.createProductsMakingSection();
  }
}
