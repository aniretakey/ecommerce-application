import BaseComponent from '@utils/baseComponent';

export default function createSlider(imgLinks: string[]): BaseComponent<'div'> {
  const sliderContainer = new BaseComponent({
    tagName: 'div',
    classNames: ['carousel-wrapper'],
  });

  sliderContainer.append(createSliderImgs(imgLinks));
  sliderContainer.append(createSliderBtns(imgLinks));
  return sliderContainer;
}

function createSliderImgs(imgLinks: string[]): BaseComponent<'div'> {
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

function createSliderBtns(imgLinks: string[]): BaseComponent<'div'> {
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
      },
    });
    if (i === 0) {
      btn.getNode().classList.add('bg-accent');
    }
    carouselBtns.append(btn);
    btn.addListener('click', (e) => {
      e.preventDefault();
      document.querySelector(`#${`item${i}`}`)?.scrollIntoView({ behavior: 'smooth' });
      document.querySelectorAll('.btn-carousel')?.forEach((el) => el.classList.remove('bg-accent'));
      btn.getNode().classList.add('bg-accent');
    });
  }
  return carouselBtns;
}
