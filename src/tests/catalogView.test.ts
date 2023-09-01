import { CatalogView } from '@pages/catalog/CatalogView';
import { getProductsSearch } from '@utils/apiRequests';
import { safeQuerySelector } from '@utils/safeQuerySelector';

// eslint-disable-next-line max-lines-per-function
jest.mock('../utils/apiRequests', () => ({
  getCategories: jest.fn().mockResolvedValue({
    body: {
      results: [
        {
          id: 'pillows-id',
          name: {
            ru: 'Pillows',
          },
        },
        {
          id: 'sofas-id',
          name: {
            ru: 'Sofas',
          },
        },
      ],
    },
  }),
  getProductsSearch: jest.fn().mockResolvedValue({
    body: {
      total: 49,
      results: [
        {
          name: {
            ru: 'Cactus Dream Pillow',
          },
          description: {
            ru: 'Cactus Dream Pillow description',
          },
          categories: [
            {
              id: 'pillows-id',
            },
          ],

          masterVariant: {
            attributes: [
              {
                name: 'Color',
                value: 'white',
              },
              {
                name: 'Material',
                value: 'cotton',
              },
              {
                name: 'Brand',
                value: 'Artful Creations',
              },
            ],
            images: [
              {
                url: 'https://pillow.jpg',
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
            key: 'CactusDream-1',
          },
        },
        {
          name: {
            ru: 'Cozy Cloud Sofa',
          },
          description: {
            ru: 'Cozy Cloud Sofa description',
          },
          categories: [
            {
              id: 'sofas-id',
            },
          ],

          masterVariant: {
            attributes: [
              {
                name: 'Color',
                value: 'black',
              },
              {
                name: 'Material',
                value: 'wood',
              },
              {
                name: 'Brand',
                value: 'Classic Comfort',
              },
            ],
            images: [
              {
                url: 'https://sofa.jpg',
              },
            ],
            prices: [
              {
                value: {
                  centAmount: 350000,
                },
                discounted: {
                  value: {
                    centAmount: 327500,
                  },
                },
              },
            ],
            key: 'CozyCloud-1',
          },
        },
      ],
    },
  }),
}));

// eslint-disable-next-line max-lines-per-function
describe('CatalogView', () => {
  const catalogView = new CatalogView();
  document.body.append(catalogView.catalogWrapper.getNode());

  // eslint-disable-next-line max-lines-per-function
  describe(``, () => {
    expect(getProductsSearch).toBeCalled();

    it('should create 2 cards', () => {
      const cardsWrap = document.querySelector<HTMLDivElement>('.catalog__cards-wrap');
      expect(cardsWrap).not.toBeNull();

      const cards = cardsWrap?.querySelectorAll('.card');
      expect(cards?.length).toBe(2);
    });

    // eslint-disable-next-line max-lines-per-function
    it('should apply Filters', () => {
      const clickEvent = new Event('click', { bubbles: true });
      const changeEvent = new Event('change', { bubbles: true });

      const whiteColorCheckBox = safeQuerySelector<HTMLInputElement>('#color-white');
      whiteColorCheckBox.checked = true;
      whiteColorCheckBox.dispatchEvent(clickEvent);

      const cottonMaterialCheckBox = safeQuerySelector<HTMLInputElement>('#material-cotton');
      cottonMaterialCheckBox.checked = true;
      cottonMaterialCheckBox.dispatchEvent(clickEvent);

      const brandArtfulCheckbox = safeQuerySelector<HTMLInputElement>('#brand-artful-creations');
      brandArtfulCheckbox.checked = true;
      brandArtfulCheckbox.dispatchEvent(clickEvent);

      const priceToInput = safeQuerySelector<HTMLInputElement>('#price-to');
      priceToInput.value = '2000';
      priceToInput.dispatchEvent(changeEvent);

      const searchInput = safeQuerySelector<HTMLInputElement>('#catalogSearchInput');
      searchInput.value = 'pillow';
      const searchBtn = safeQuerySelector<HTMLButtonElement>('#catalogSearchInput ~ button');
      searchBtn.dispatchEvent(clickEvent);

      const applyBtn = safeQuerySelector<HTMLButtonElement>('.filters button');
      applyBtn.dispatchEvent(clickEvent);

      expect(getProductsSearch).toBeCalledWith(
        0,
        6,
        [
          'variants.attributes.Color:"white"',
          'variants.attributes.Material:"cotton"',
          'variants.attributes.Brand:"Artful Creations"',
          'variants.price.centAmount:range (127500 to 200000)',
        ],
        'price asc',
        searchInput.value,
      );
    });
  });
});
afterAll(() => {
  jest.resetAllMocks();
});
