import ProductUI from '@pages/product/productUI';
import { getProduct } from '@utils/apiRequests';

// eslint-disable-next-line max-lines-per-function
jest.mock('../utils/apiRequests', () => ({
  getProduct: jest.fn().mockResolvedValue({
    body: {
      results: [
        {
          name: {
            ru: 'Cactus Dream Pillow',
          },
          description: {
            ru: 'Cactus Dream Pillow description',
          },
          masterVariant: {
            attributes: [
              {
                name: 'Color',
                value: 'white',
              },
            ],
            images: [
              {
                url: 'https://photo1.jpg',
              },
            ],
            prices: [
              {
                value: {
                  centAmount: 150000,
                },
                discounted: {
                  value: {
                    centAmount: 127500,
                  },
                },
              },
            ],
          },
        },
      ],
    },
  }),
}));

describe('ProductUI', () => {
  new ProductUI().render(document.body, '1');

  it('should add productInfo & slider', () => {
    expect(getProduct).toBeCalledWith('1');
    const productContainer = document.querySelector<HTMLDivElement>('.product-container');

    expect(productContainer).not.toBeNull();

    const productSlider = productContainer?.querySelector<HTMLDivElement>('.product-slider');
    const productInfo = productContainer?.querySelector<HTMLDivElement>('.product-info');
    expect(productInfo).not.toBeNull();
    expect(productSlider).not.toBeNull();
  });
});
