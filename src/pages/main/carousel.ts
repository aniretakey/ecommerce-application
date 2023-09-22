import carouselImg1 from '@assets/img/main/carousel1.jpg';
import carouselImg2 from '@assets/img/main/carousel2.jpg';
import carouselImg3 from '@assets/img/main/carousel3.jpg';
import carouselImg4 from '@assets/img/main/carousel4.jpg';
import carouselImg5 from '@assets/img/main/carousel5.jpg';
import carouselImg6 from '@assets/img/main/carousel6.jpg';
import carouselImg7 from '@assets/img/main/carousel7.jpg';

export function renderProductsCarousel(): string {
  return `<div class="carousel-item carousel-item-main">
        <img src=${carouselImg1} alt="Photo of furniture" />
      </div>
      <div class="carousel-item carousel-item-main">
        <img src=${carouselImg2} alt="Photo of furniture" />
      </div>
      <div class="carousel-item carousel-item-main">
        <img src=${carouselImg3} alt="Photo of furniture" />
      </div>
      <div class="carousel-item carousel-item-main">
        <img src=${carouselImg4} alt="Photo of furniture" />
      </div>
      <div class="carousel-item carousel-item-main">
        <img src=${carouselImg5} alt="Photo of furniture" />
      </div>
      <div class="carousel-item carousel-item-main">
        <img src=${carouselImg6} alt="Photo of furniture" />
      </div>
      <div class="carousel-item carousel-item-main">
        <img src=${carouselImg7} alt="Photo of furniture" />
      </div>`;
}
