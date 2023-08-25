import BaseComponent from '@utils/baseComponent';

export class activeFilterBadge {
  public badge: BaseComponent<'div'>;
  constructor(name: string, id: string) {
    this.badge = new BaseComponent({
      tagName: 'div',
      classNames: ['badge'],
      textContent: name,
      attributes: { 'data-id': id },
    });
    const remove = new BaseComponent({
      tagName: 'div',
      classNames: ['leading-none', 'cursor-pointer'],
      parentNode: this.badge.getNode(),
    });
    remove.getNode().innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
    remove.addListener('click', () => {
      this.badge.destroy();
      const checkbox = document.querySelector<HTMLInputElement>(`#${id.trim().split(' ').join('-')}`);
      if (checkbox) {
        checkbox.checked = false;
      }
    });
  }
}
