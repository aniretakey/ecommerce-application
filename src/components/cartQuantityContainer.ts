import { CartView } from '@pages/basket/CartView';
import { changeLineItemQuantity } from '@utils/apiRequests';
import BaseComponent from '@utils/baseComponent';
import { safeQuerySelector } from '@utils/safeQuerySelector';

export class CartQuantity {
  private lineItemId: string;
  public quantityContainer: BaseComponent<'div'>;
  private quantityReduceBtn: BaseComponent<'button'>;
  private quantityIncreaseBtn: BaseComponent<'button'>;
  private quantityInput: BaseComponent<'input'>;

  constructor(lineItemId: string, quantityVal = 1) {
    this.lineItemId = lineItemId;

    this.quantityContainer = new BaseComponent({
      tagName: 'div',
      classNames: ['quantity-container', 'col-start-2', 'row-start-2', 'flex', 'align-center', 'gap-1.5'],
    });
    this.quantityReduceBtn = new BaseComponent({
      tagName: 'button',
      classNames: ['reduce-btn', 'text-2xl', 'btn', 'btn-sm', 'btn-primary', 'px-4', 'w-9', 'h-9'],
      textContent: '-',
    });
    this.quantityInput = new BaseComponent({
      tagName: 'input',
      attributes: { type: 'number', value: `${quantityVal}`, min: '1', max: '1000000' },
      classNames: ['input', 'input-bordered', 'w-16', 'input-sm', 'h-9'],
    });
    this.quantityIncreaseBtn = new BaseComponent({
      tagName: 'button',
      classNames: ['increase-btn', 'text-3xl', 'btn', 'btn-sm', 'btn-primary', 'font-light', 'px-3', 'w-9', 'h-9'],
      textContent: '+',
    });

    this.quantityReduceBtn.getNode().disabled = quantityVal < 2;
    this.quantityContainer.appendChildren([this.quantityReduceBtn, this.quantityInput, this.quantityIncreaseBtn]);
    this.addQuantityListeners();
  }

  private addQuantityListeners(): BaseComponent<'div'> {
    this.quantityInput.addListener('change', () => {
      const newQuantity = Math.max(+this.quantityInput.getNode().value, 1);
      this.changeQuantity(newQuantity);
    });
    this.quantityReduceBtn.addListener('click', () => {
      const newQuantity = +this.quantityInput.getNode().value - 1;
      this.changeQuantity(newQuantity);
    });

    this.quantityIncreaseBtn.addListener('click', () => {
      const newQuantity = +this.quantityInput.getNode().value + 1;
      this.changeQuantity(newQuantity);
    });

    return this.quantityContainer;
  }

  private changeQuantity(newQuantity: number): void {
    this.quantityReduceBtn.getNode().disabled = newQuantity < 2;
    this.quantityInput.getNode().value = `${newQuantity}`;
    const cartId = localStorage.getItem('comforto-cart-id') ?? '';
    changeLineItemQuantity(cartId, this.lineItemId, newQuantity, CartView.cartVersion)
      .then((data) => {
        CartView.cartVersion = data.body.version;
        safeQuerySelector<HTMLParagraphElement>('.discounted-price').textContent = `₽${
          (data.body.totalPrice.centAmount ?? 0) / 100
        }`;
        localStorage.setItem('prevPrice', `${data.body.totalPrice.centAmount / 100 + 1000}`);
        safeQuerySelector<HTMLParagraphElement>('.total-price').textContent = `₽${
          (data.body.totalPrice.centAmount + 100000 ?? 0) / 100
        }`;
      })
      .catch(console.log);
  }
}
