import BaseComponent from '@utils/baseComponent';

export class FilterItem {
  public filterItem: BaseComponent<'li'>;

  constructor(name: string, filterOptions: string[] = []) {
    this.filterItem = new BaseComponent({ tagName: 'li' });
    const details = new BaseComponent({ tagName: 'details', parentNode: this.filterItem.getNode() });
    const summary = new BaseComponent({ tagName: 'summary', textContent: name });

    const optionsList = new BaseComponent({ tagName: 'ul', classNames: ['p-2', 'bg-base-100', 'w-max'] });
    filterOptions.forEach((option) => {
      const optionItem = new BaseComponent({ tagName: 'li' });
      const optionLable = new BaseComponent({
        tagName: 'label',
        attributes: { for: `${name}-${option}`.toLowerCase() },
        textContent: option,
      });
      const optionInput = new BaseComponent({
        tagName: 'input',
        attributes: { id: `${name}-${option}`.toLowerCase(), type: 'checkbox', name, value: `${option}`.toLowerCase() },
      });
      optionLable.getNode().prepend(optionInput.getNode());
      optionItem.append(optionLable);
      optionInput.addListener('click', () => {
        console.log(option);
      });

      optionsList.appendChildren([optionItem]);
    });

    details.appendChildren([summary, optionsList]);
  }
}
