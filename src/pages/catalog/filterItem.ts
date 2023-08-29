import BaseComponent from '@utils/baseComponent';
import { prices } from './data';

export class FilterItem {
  public filterItem: BaseComponent<'li'>;
  private optionsList: BaseComponent<'ul'>;
  private filterName: string;
  private filterOptions: string[] = [];
  private rangeInputs: Record<string, BaseComponent<'input'>> = {};
  private filterItemBtn: BaseComponent<'label'>;
  private static sort = '';

  constructor(name: string, filterOptions: string[] = []) {
    this.filterName = name;
    this.filterOptions = filterOptions;
    this.filterItem = new BaseComponent({
      tagName: 'li',
      classNames: ['dropdown', 'w-64'],
    });
    this.filterItemBtn = new BaseComponent({
      tagName: 'label',
      textContent: this.filterName,
      attributes: { tabindex: '0' },
      classNames: ['btn', 'm-1', 'btn-sm'],
    });

    this.optionsList = new BaseComponent({
      tagName: 'ul',
      attributes: { tabindex: '0' },
      classNames: ['dropdown-content', 'z-[1]', 'menu', 'p-2', 'shadow', 'bg-base-100', 'rounded-box', 'w-52'],
    });
    this.filterItem.appendChildren([this.filterItemBtn, this.optionsList]);
  }

  public addDropDownCheckBoxList(values = this.filterOptions): this {
    this.filterOptions.forEach((option, i) => {
      this.createFilterSubItem(option, 'checkbox', values, i);
    });

    return this;
  }

  public addDropDownRange(values = prices): this {
    this.filterOptions.forEach((option, i) => {
      const [minVal, maxVal] = values;
      const optionItem = new BaseComponent({ tagName: 'li' });
      const optionLable = new BaseComponent({
        tagName: 'label',
        attributes: { for: `${this.filterName}-${option}`.toLowerCase() },
        textContent: option,
      });
      const optionInput = new BaseComponent({
        tagName: 'input',
        classNames: ['w-24', 'justify-self-end'],
        attributes: {
          id: `${this.filterName}-${option}`.toLowerCase(),
          type: 'number',
          name: this.filterName,
          value: `${values[i] ?? option}`,
          min: `${minVal}`,
          max: `${maxVal}`,
          'data-optionName': option,
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
      const optionInput = this.createFilterSubItem(option, 'radio', values, i);
      optionInput.addListener('change', () => {
        this.changeRadioHandler(optionInput, option);
      });
      if (i === 0) {
        optionInput.getNode().checked = true;
        this.changeRadioHandler(optionInput, option);
      }
    });

    return this;
  }

  private createFilterSubItem(
    option: string,
    inputType: string,
    values = this.filterOptions,
    i: number,
  ): BaseComponent<'input'> {
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
        type: inputType,
        name: this.filterName,
        value: values[i] ?? option,
        'data-optionName': option,
      },
    });
    optionLable.getNode().prepend(optionInput.getNode());
    optionItem.append(optionLable);
    this.optionsList.appendChildren([optionItem]);
    return optionInput;
  }

  private changeRadioHandler(optionInput: BaseComponent<'input'>, option: string): void {
    FilterItem.sort = optionInput.getNode().value;
    this.filterItemBtn.setTextContent(`${this.filterName} by ${option}`);
  }

  public getRangeInputs(): Record<string, BaseComponent<'input'>> {
    return this.rangeInputs;
  }
  public static getSortVal(): string {
    return FilterItem.sort;
  }
}
