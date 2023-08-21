import './registration-styles.css';
import Page from '@utils/pageTemplate';
import { RegistrationForm } from '@components/form/RegistrationForm';

export default class Registration extends Page {
  constructor() {
    super('registration');
  }

  public render(): HTMLElement {
    const title = this.createHeaderTitle('Registration');
    const registrationForm = new RegistrationForm();
    this.container.append(title, registrationForm.form.getNode());
    return this.container;
  }
}
