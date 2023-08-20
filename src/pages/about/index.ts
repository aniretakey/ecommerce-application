import { getCustomer } from '@utils/apiRequests';
import BaseComponent from '@utils/baseComponent';
import Page from '@utils/pageTemplate';

export default class About extends Page {
  constructor() {
    super('about');
  }

  public render(): HTMLElement {
    const title = this.createHeaderTitle('About');

    const greeting = new BaseComponent({
      tagName: 'h2',
      classNames: ['text-gray-700', 'font-bold', 'mb-2'],
      textContent: '',
    });

    const aboutMeBtn = new BaseComponent({
      tagName: 'button',
      classNames: ['btn', 'btn-primary'],
      textContent: 'Customer Info',
    });
    aboutMeBtn.getNode().addEventListener('click', () => {
      getCustomer()
        .then((data) => {
          console.log(data);
          greeting.getNode().textContent = `My name is  ${data.body.firstName}`;
        })
        .catch((err) => {
          console.log(err);
          greeting.getNode().textContent = `Please, sign In`;
        });
    });

    this.container.append(title, aboutMeBtn.getNode(), greeting.getNode());
    return this.container;
  }
}
