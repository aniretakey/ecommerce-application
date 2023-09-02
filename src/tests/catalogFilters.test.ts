import { CatalogFilters } from '@components/filters/CatalogFilters';
import { getProductsSearch } from '@utils/apiRequests';
// eslint-disable-next-line max-lines-per-function
jest.mock('../utils/apiRequests', () => ({
  getProductsSearch: jest.fn().mockResolvedValue({
    body: {
      results: [
        {
          masterVariant: {
            attributes: [
              {
                name: 'Color',
                value: 'black',
              },
              {
                name: 'Material',
                value: 'plastic',
              },
            ],

            prices: [
              {
                value: {
                  centAmount: 5000000,
                },
                discounted: {
                  value: {
                    centAmount: 2500000,
                  },
                },
              },
            ],
          },
        },
        {
          masterVariant: {
            attributes: [
              {
                name: 'Color',
                value: 'white',
              },
              {
                name: 'Material',
                value: 'glass',
              },
            ],

            prices: [
              {
                value: {
                  centAmount: 7500000,
                },
              },
            ],
          },
        },
        {
          masterVariant: {
            attributes: [
              {
                name: 'Color',
                value: 'pink',
              },
              {
                name: 'Material',
                value: 'cotton',
              },
            ],

            prices: [
              {
                value: {
                  centAmount: 20000000,
                },
              },
            ],
          },
        },
      ],
    },
  }),
}));

// eslint-disable-next-line max-lines-per-function
describe('CatalogFilters', () => {
  const catalogFilters = new CatalogFilters();
  document.body.append(catalogFilters.filters.getNode(), catalogFilters.activeFiltersContainer.getNode());

  // eslint-disable-next-line max-lines-per-function
  describe(`should call appendFilters and append filter items to filter container`, () => {
    expect(getProductsSearch).toBeCalledWith(0, 100, [], 'price asc');
    let blackColorCheckBox: HTMLInputElement | null;
    let pinkColorCheckBox: HTMLInputElement | null;
    let whiteColorCheckBox: HTMLInputElement | null;
    let plasticMaterialCheckBox: HTMLInputElement | null;
    let glassMaterialCheckBox: HTMLInputElement | null;
    let cottonMaterialCheckBox: HTMLInputElement | null;

    let priceFromInput: HTMLInputElement | null;
    let priceToInput: HTMLInputElement | null;
    beforeEach(() => {
      blackColorCheckBox = document.querySelector<HTMLInputElement>('#color-black');
      pinkColorCheckBox = document.querySelector<HTMLInputElement>('#color-pink');
      whiteColorCheckBox = document.querySelector<HTMLInputElement>('#color-white');
      plasticMaterialCheckBox = document.querySelector<HTMLInputElement>('#material-plastic');
      glassMaterialCheckBox = document.querySelector<HTMLInputElement>('#material-glass');
      cottonMaterialCheckBox = document.querySelector<HTMLInputElement>('#material-cotton');
      priceFromInput = document.querySelector<HTMLInputElement>('#price-from');
      priceToInput = document.querySelector<HTMLInputElement>('#price-to');
    });

    it('should append filter items to filter container', () => {
      expect(blackColorCheckBox).not.toBeNull();
      expect(pinkColorCheckBox).not.toBeNull();
      expect(whiteColorCheckBox).not.toBeNull();
      expect(glassMaterialCheckBox).not.toBeNull();
      expect(plasticMaterialCheckBox).not.toBeNull();
      expect(cottonMaterialCheckBox).not.toBeNull();
      expect(priceFromInput).not.toBeNull();
      expect(priceToInput).not.toBeNull();
    });

    // eslint-disable-next-line max-lines-per-function
    describe('should add/remove activeFilter badges', () => {
      // eslint-disable-next-line max-lines-per-function
      describe('checkbox filters', () => {
        const clickEvent = new Event('click', { bubbles: true });

        it('should add new active badge & resetBtn', () => {
          if (blackColorCheckBox) {
            blackColorCheckBox.checked = true;
            blackColorCheckBox.dispatchEvent(clickEvent);

            expect(document.querySelector(`div.badge[data-id="${blackColorCheckBox.id}"]`)).not.toBeNull();
            expect(document.querySelector('#resetAllFiltersBtn')).not.toBeNull();
            expect(catalogFilters.activeFilters[blackColorCheckBox.id]).not.toBeUndefined();

            blackColorCheckBox.checked = false;
            blackColorCheckBox.dispatchEvent(clickEvent);

            expect(document.querySelector(`div.badge[data-id="${blackColorCheckBox.id}"]`)).toBeNull();
            expect(document.querySelector('#resetAllFiltersBtn')).toBeNull();
            expect(Object.keys(catalogFilters.activeFilters).length).toBe(0);
          }
        });

        it('should remove all badges on resetBtn click', () => {
          if (blackColorCheckBox && whiteColorCheckBox && glassMaterialCheckBox) {
            blackColorCheckBox.checked = true;
            blackColorCheckBox.dispatchEvent(clickEvent);

            whiteColorCheckBox.checked = true;
            whiteColorCheckBox.dispatchEvent(clickEvent);

            glassMaterialCheckBox.checked = true;
            glassMaterialCheckBox.dispatchEvent(clickEvent);

            const resetAllFiltersBtn = document.querySelector<HTMLDivElement>('#resetAllFiltersBtn');

            expect(resetAllFiltersBtn).not.toBeNull();

            resetAllFiltersBtn?.dispatchEvent(clickEvent);
            expect(blackColorCheckBox.checked).toBe(false);
            expect(whiteColorCheckBox.checked).toBe(false);
            expect(glassMaterialCheckBox.checked).toBe(false);
            expect(catalogFilters.activeFiltersContainer.getNode().innerHTML).toBe('');
          }
        });
      });
      describe('range filters', () => {
        const changeEvent = new Event('change', { bubbles: true });
        it('should add new active badge & resetBtn', () => {
          if (priceToInput && priceFromInput) {
            priceToInput.value = '500000';
            priceFromInput.value = '1500000';
            priceFromInput.dispatchEvent(changeEvent);
            const priceBadge = document.querySelector(`div.badge[data-id="Price-badge"]`);
            expect(priceBadge).not.toBeNull();
            expect(document.querySelector('#resetAllFiltersBtn')).not.toBeNull();
            expect(catalogFilters.activeFilters['price-from']).not.toBeUndefined();
          }
        });
      });
    });
  });
});
afterAll(() => {
  jest.resetAllMocks();
});
