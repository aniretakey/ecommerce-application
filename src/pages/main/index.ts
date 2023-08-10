import BaseComponent from '@utils/baseComponent';

export default class Main {
  public main: BaseComponent<'main'>;

  constructor() {
    this.main = new BaseComponent({
      tagName: 'main',
      classNames: ['main'],
      attributes: {
        id: 'main',
      },
      parentNode: document.body,
    });
  }
}
