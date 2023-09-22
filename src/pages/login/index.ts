import './login-styles.css';
import Page from '@utils/pageTemplate';
import { LoginForm } from '../../components/form/LoginForm';
export default class Login extends Page {
  constructor() {
    super('login');
  }

  public render(): HTMLElement {
    const title = this.createHeaderTitle('Log In');
    const loginForm = new LoginForm();
    this.container.append(title, loginForm.form.getNode());
    return this.container;
  }
}
