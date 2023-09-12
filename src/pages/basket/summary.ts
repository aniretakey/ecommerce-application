import { ConfirmationPrompt } from '@components/confirmationPrompt';
import { ModalWindow } from '@components/modal/modalWindow';
import { clearCart } from '@utils/apiRequests';
import BaseComponent from '@utils/baseComponent';
import { CartView } from './CartView';
import { safeQuerySelector } from '@utils/safeQuerySelector';
import { EmptyCart } from './EmptyCart';

export class CartSummary {
  public summary: BaseComponent<'div'>;

  constructor(totalPrice: number) {
    const summaryTitle = new BaseComponent({ tagName: 'h5', textContent: 'Summary', classNames: ['summary-title'] });

    this.summary = new BaseComponent({
      tagName: 'div',
      classNames: ['summary', 'flex', 'w-full', 'flex-col', 'gap-4'],
    });

    const clearCartBtn = new BaseComponent({
      tagName: 'button',
      textContent: 'Clear cart',
      classNames: ['btn', 'btn-accent', 'w-full'],
    });
    clearCartBtn.addListener('click', () => {
      this.clearCartHandler();
    });
    const checkoutBtn = new BaseComponent({
      tagName: 'button',
      textContent: 'Checkout',
      classNames: ['btn', 'btn-primary', 'w-full'],
    });

    this.summary.appendChildren([
      summaryTitle,
      this.createTotalPrice(totalPrice),
      this.createCouponContainer(),
      clearCartBtn,
      checkoutBtn,
    ]);
  }

  private clearCartHandler(): void {
    const modal = new ModalWindow();
    const confirmationPrompt = new ConfirmationPrompt('Are you sure you want to clear your cart?');
    confirmationPrompt.addCancelAction(modal.closeModal.bind(null));
    confirmationPrompt.addConfirmAction(() => {
      const cartId = localStorage.getItem('comforto-cart-id') ?? '';

      const lineItemIds = [...document.querySelectorAll('.cart-item')].map((item) => {
        return item.getAttribute('data-lineitemid') ?? '';
      });
      confirmationPrompt.prompt.getNode().innerHTML = `<span class="loading loading-dots loading-lg col-span-2 row-span-2"></span>`;

      clearCart(cartId, lineItemIds, CartView.cartVersion)
        .then((data) => {
          const cartItemsContainer = safeQuerySelector('.cart-items-container');
          cartItemsContainer.innerHTML = '';
          new EmptyCart(cartItemsContainer);
          CartView.cartVersion = data.body.version;
          safeQuerySelector('.summary').remove();
          modal.closeModal();
        })
        .catch(() => {
          modal.closeModal();
        });
    });
    modal.buildModal(confirmationPrompt.prompt);
  }

  private createTotalPrice(totalPrice: number): BaseComponent<'div'> {
    const totalPriceContainer = new BaseComponent({
      tagName: 'div',
      classNames: ['summary-container', 'total-price-container'],
    });
    const totalPriceLable = new BaseComponent({
      tagName: 'p',
      classNames: ['total-price-label'],
      textContent: 'Total',
    });
    const totalPriceIndicator = new BaseComponent({
      tagName: 'p',
      classNames: ['total-price', 'product-price', 'text-primary'],
      textContent: `₽${(totalPrice ?? 0) / 100}`,
    });

    totalPriceContainer.appendChildren([totalPriceLable, totalPriceIndicator]);
    return totalPriceContainer;
  }

  private createCouponContainer(): BaseComponent<'div'> {
    const couponContainer = new BaseComponent({
      tagName: 'div',
      classNames: ['summary-container', 'coupon-container', 'gap-4'],
    });
    const couponInput = new BaseComponent({
      tagName: 'input',
      classNames: ['input', 'input-bordered', 'input-secondary', 'w-full'],
      attributes: { type: 'text', placeholder: 'Coupon code' },
    });
    const applyCouponBtn = new BaseComponent({
      tagName: 'button',
      textContent: 'Apply',
      classNames: ['btn', 'btn-secondary'],
    });
    couponContainer.appendChildren([couponInput, applyCouponBtn]);
    return couponContainer;
  }
}
