import BaseComponent from './baseComponent';

export class InputComponent extends BaseComponent<'input'> {
  public getValue(): string {
    return this.node.value;
  }

  public setValue(val?: string): this {
    if (val) {
      this.node.value = val;
    }
    return this;
  }
}
