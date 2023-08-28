import BaseComponent from '@utils/baseComponent';

export class FilterItem {
  public filterItem: BaseComponent<'li'>;
  private optionsList: BaseComponent<'ul'>;
  private filterName: string;
  private filterOptions: string[] = [];
  private rangeInputs: Record<string, BaseComponent<'input'>> = {};
  private label: BaseComponent<'label'>;
  private static sort = '';

  constructor(name: string, filterOptions: string[] = []) {
    this.filterName = name;
    this.filterOptions = filterOptions;
    // this.filterItem = new BaseComponent({ tagName: 'li' });

    this.filterItem = new BaseComponent({ tagName: 'li', classNames: ['dropdown'] });
    // const details = new BaseComponent({ tagName: 'details', parentNode: this.filterItem.getNode() });
    // const summary = new BaseComponent({ tagName: 'summary', textContent: this.filterName });
    this.label = new BaseComponent({
      tagName: 'label',
      textContent: this.filterName,
      attributes: { tabindex: '0' },
      classNames: ['btn', 'm-1'],
    });

    // this.optionsList = new BaseComponent({ tagName: 'ul', classNames: ['p-2', 'bg-base-100', 'w-max'] });
    this.optionsList = new BaseComponent({
      tagName: 'ul',
      attributes: { tabindex: '0' },
      classNames: ['dropdown-content', 'z-[1]', 'menu', 'p-2', 'shadow', 'bg-base-100', 'rounded-box', 'w-52'],
    });
    // details.appendChildren([summary, this.optionsList]);
    this.filterItem.appendChildren([this.label, this.optionsList]);
  }

  public addDropDownCheckBoxList(): this {
    this.filterOptions.forEach((option) => {
      const optionItem = new BaseComponent({ tagName: 'li' });
      const optionLable = new BaseComponent({
        tagName: 'label',
        attributes: { for: `${this.filterName}-${option.trim().split(' ').join('-')}`.toLowerCase() },
        textContent: option,
      });
      const optionInput = new BaseComponent({
        tagName: 'input',
        attributes: {
          id: `${this.filterName}-${option.trim().split(' ').join('-')}`.toLowerCase(),
          type: 'checkbox',
          name: this.filterName,
          value: option,
        },
      });
      optionLable.getNode().prepend(optionInput.getNode());
      optionItem.append(optionLable);
      this.optionsList.appendChildren([optionItem]);
    });

    return this;
  }

  public addDropDownRange(maxPrice = 74000): this {
    ['from', 'to'].forEach((option, i) => {
      const optionItem = new BaseComponent({ tagName: 'li' });
      const optionLable = new BaseComponent({
        tagName: 'label',
        attributes: { for: `${this.filterName}-${option}`.toLowerCase() },
        textContent: option,
      });
      const optionInput = new BaseComponent({
        tagName: 'input',
        attributes: {
          id: `${this.filterName}-${option}`.toLowerCase(),
          type: 'number',
          name: this.filterName,
          value: i === 1 ? `${maxPrice}` : '0',
          min: '0',
          max: `${maxPrice}`,
        },
      });
      const currency = new BaseComponent({
        tagName: 'span',
        textContent: '₽',
      });
      optionLable.appendChildren([optionInput, currency]);
      optionItem.append(optionLable);
      this.rangeInputs[option] = optionInput;
      this.optionsList.appendChildren([optionItem]);
    });

    return this;
  }

  public addDropDownRadioList(values = this.filterOptions): this {
    this.filterOptions.forEach((option, i) => {
      const optionItem = new BaseComponent({ tagName: 'li' });
      const optionLable = new BaseComponent({
        tagName: 'label',
        attributes: { for: `${this.filterName}-${option.trim().split(' ').join('-')}`.toLowerCase() },
        textContent: option,
      });
      const optionInput = new BaseComponent({
        tagName: 'input',
        attributes: {
          id: `${this.filterName}-${option.trim().split(' ').join('-')}`.toLowerCase(),
          type: 'radio',
          name: this.filterName,
          value: values[i] ?? option,
        },
      });
      optionInput.addListener('change', () => {
        FilterItem.sort = optionInput.getNode().value;
        this.label.setTextContent(`${this.filterName} by ${option}`);
      });
      optionLable.getNode().prepend(optionInput.getNode());
      optionItem.append(optionLable);
      this.optionsList.appendChildren([optionItem]);
    });

    return this;
  }

  public getRangeInputs(): Record<string, BaseComponent<'input'>> {
    return this.rangeInputs;
  }
  public static getSortVal(): string {
    return FilterItem.sort;
  }
}
