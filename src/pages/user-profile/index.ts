import Page from '@utils/pageTemplate';
import { getCustomer } from '@utils/apiRequests';
import BaseComponent from '@utils/baseComponent';

export default class UserProfile extends Page {
  constructor() {
    super('user-profile');
  }

  public render(): HTMLElement {
    const title = this.createHeaderTitle('User Profile');
    this.container.append(title);
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
          greeting.getNode().textContent = `Hello, ${data.body.firstName}!`;
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
