import { CATALOG_CARDS_NUM } from '@customTypes/enums';
import BaseComponent from '@utils/baseComponent';

export class CatalogPagination {
  public pagContainer: BaseComponent<'div'>;
  public prevBtn: BaseComponent<'button'>;
  public pageInfoBtn: BaseComponent<'button'>;
  public nextBtn: BaseComponent<'button'>;
  public currentPage = 1;
  public maxPage = 2;
  public total = CATALOG_CARDS_NUM;

  constructor(switchPageHandler: () => void) {
    this.pagContainer = new BaseComponent({ tagName: 'div', classNames: ['join'] });
    this.prevBtn = new BaseComponent({
      tagName: 'button',
      classNames: ['join-item', 'btn', 'pagination-prev'],
      attributes: { disabled: '' },
    });
    this.pageInfoBtn = new BaseComponent({
      tagName: 'button',
      classNames: ['join-item', 'btn', 'bg-primary', 'text-white', 'pointer-events-none', 'pagination-page'],
      textContent: 'Page 1',
    });
    this.nextBtn = new BaseComponent({
      tagName: 'button',
      classNames: ['join-item', 'btn', 'pagination-next'] /* , textContent: '»' */,
    });
    this.pagContainer.appendChildren([this.prevBtn, this.pageInfoBtn, this.nextBtn]);
    this.addSwitchPageListeners(switchPageHandler);
  }

  private addSwitchPageListeners(switchPageHandler: () => void): void {
    this.nextBtn.addListener('click', () => {
      this.currentPage += 1;
      this.prevBtn.getNode().disabled = false;
      switchPageHandler();
    });

    this.prevBtn.addListener('click', () => {
      this.nextBtn.getNode().disabled = false;
      this.currentPage -= 1;
      switchPageHandler();
    });
  }
}
