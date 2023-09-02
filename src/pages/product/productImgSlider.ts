import BaseComponent from '@utils/baseComponent';

export class ProductImgSlider {
  public currentImageId: number;
  private sliderContainer = new BaseComponent({
    tagName: 'div',
    classNames: ['carousel-wrapper'],
  });

  constructor(optionName?: string, currentImageId = 0) {
    optionName && this.sliderContainer.addClass([`carousel-wrapper-${optionName}`]);
    this.currentImageId = currentImageId;
  }

  public createSlider(imgLinks: string[]): BaseComponent<'div'> {
    this.sliderContainer.append(this.createSliderImgs(imgLinks));
    this.sliderContainer.append(this.createSliderBtns(imgLinks));
    return this.sliderContainer;
  }

  private createSliderImgs(imgLinks: string[]): BaseComponent<'div'> {
    const carousel = new BaseComponent({
      tagName: 'div',
      classNames: ['carousel'],
    });

    for (let i = 0; i < imgLinks.length; i++) {
      const imgBlock = new BaseComponent({
        tagName: 'div',
        classNames: ['carousel-item', 'w-full'],
        attributes: {
          id: `item${i}`,
        },
      });
      const img = new BaseComponent({
        tagName: 'img',
        classNames: ['carousel-img', 'w-full'],
        attributes: {
          src: `${imgLinks[i]}`,
          id: `img${i}`,
        },
      });
      imgBlock.append(img);
      carousel.append(imgBlock);
    }
    return carousel;
  }

  private createSliderBtns(imgLinks: string[]): BaseComponent<'div'> {
    const carouselBtns = new BaseComponent({
      tagName: 'div',
      classNames: ['carousel-btns', 'flex', 'justify-center', 'py-2', 'gap-2'],
    });

    for (let i = 0; i < imgLinks.length; i++) {
      const btn = new BaseComponent({
        tagName: 'button',
        classNames: ['btn-carousel', 'btn', 'btn-xs', 'opacity-70'],
        attributes: {
          href: `#${`item${i}`}`,
          id: `btn-carousel-${i}`,
        },
      });
      if (i === 0) {
        btn.getNode().classList.add('bg-accent');
      }
      carouselBtns.append(btn);
      btn.addListener('click', (e) => {
        e.preventDefault();
        this.currentImageId = i;
        this.setCurrentImage();
      });
    }
    return carouselBtns;
  }

  public setCurrentImage(): void {
    console.log(this.sliderContainer.getNode().querySelector(`#item${this.currentImageId}`));

    this.sliderContainer.getNode().querySelector(`#item${this.currentImageId}`)?.scrollIntoView({ behavior: 'smooth' });
    this.sliderContainer
      .getNode()
      .querySelectorAll('.btn-carousel')
      ?.forEach((el) => el.classList.remove('bg-accent'));
    this.sliderContainer.getNode().querySelector(`#btn-carousel-${this.currentImageId}`)?.classList.add('bg-accent');
  }
}
