import { ModalWindow } from '@components/modal/modalWindow';
import { safeQuerySelector } from '@utils/safeQuerySelector';

describe('ModalWindow', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  it('should add modal window to page', () => {
    new ModalWindow().buildModal('content');
    const overlay = document.querySelector<HTMLDivElement>('.overlay');
    expect(overlay).not.toBeNull();
  });

  it('should close modal window on overlay click', () => {
    new ModalWindow().buildModal('content');
    const overlay = safeQuerySelector<HTMLDivElement>('.overlay');
    overlay.dispatchEvent(new Event('click'));

    expect(document.querySelector<HTMLDivElement>('.overlay')).toBeNull();
  });

  it('should close modal window on modalCloseBtn click', () => {
    new ModalWindow().buildModal('content');
    const closeBtn = safeQuerySelector<HTMLDivElement>('.modal__close-icon');
    closeBtn.dispatchEvent(new Event('click'));

    expect(document.querySelector<HTMLDivElement>('.overlay')).toBeNull();
  });
});
