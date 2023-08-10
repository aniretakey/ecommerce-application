import { emailValidationCb, passwordValidationCb } from '@utils/customValidationCb';
import './login-styles.css';
import BaseComponent from '@utils/baseComponent';
import Page from '@utils/pageTemplate';
import { safeQuerySelector } from '@utils/safeQuerySelector';
import { validator } from '@utils/validator';
export default class Login extends Page {
  constructor() {
    super('login');
  }

  public render(): HTMLElement {
    const title = this.createHeaderTitle('Log In');
    const loginForm = this.addForm();
    this.container.append(title, loginForm);
    return this.container;
  }

  private addForm(): HTMLFormElement {
    const loginForm = document.createElement('form');
    loginForm.classList.add('login__form');
    loginForm.id = 'loginForm';

    loginForm.append(this.addEmailField(), this.addPasswordField(), this.addShowPwBtn());

    /* const submitBtn = */ new BaseComponent({
      tagName: 'button',
      classNames: ['login__submit-btn'],
      textContent: 'Log In',
      attributes: { type: 'submit', id: 'loginSubmitBtn' },
      parentNode: loginForm,
    }).getNode();
    return loginForm;
  }

  private addEmailField(): HTMLElement {
    const loginEmailContainer = new BaseComponent({
      tagName: 'div',
      classNames: ['login__email-container', 'form-field-container'],
    }).getNode();

    /* const emailLabel = */ new BaseComponent({
      tagName: 'label',
      classNames: ['login__email-label'],
      textContent: 'Email*',
      attributes: { for: 'loginEmail' },
      parentNode: loginEmailContainer,
    }).getNode();

    const emailInput = new BaseComponent({
      tagName: 'input',
      classNames: ['login__email-input'],
      attributes: { type: 'text', id: 'loginEmail' },
      parentNode: loginEmailContainer,
    }).getNode();

    const emailError = new BaseComponent({
      tagName: 'p',
      classNames: ['error-message'],
      textContent: '', //'Invalid email',
      attributes: { id: 'loginEmailError' },
      parentNode: loginEmailContainer,
    }).getNode();

    emailInput.addEventListener('input', () => {
      const errorMessage = validator.validate(validator.email, emailInput.value, emailValidationCb);
      if (errorMessage) {
        emailError.textContent = errorMessage;
      } else {
        emailError.textContent = '';
      }
    });

    return loginEmailContainer;
  }

  private addPasswordField(): HTMLElement {
    const loginPwContainer = new BaseComponent({
      tagName: 'div',
      classNames: ['login__pw-container', 'form-field-container'],
      attributes: { 'data-valid': 'false' },
    }).getNode();
    /* const pwLabel = */ new BaseComponent({
      tagName: 'label',
      classNames: ['login__pw-label'],
      textContent: 'Password*',
      attributes: { for: 'loginPassword' },
      parentNode: loginPwContainer,
    }).getNode();
    const pwInput = new BaseComponent({
      tagName: 'input',
      classNames: ['login__pw-input'],
      attributes: { type: 'password', id: 'loginPassword' },
      parentNode: loginPwContainer,
    }).getNode();
    const pwError = new BaseComponent({
      tagName: 'p',
      classNames: ['error-message'],
      textContent: '', //'Password must contain at least one uppercase letter (A-Z).',
      attributes: { id: 'loginPwError' },
      parentNode: loginPwContainer,
    }).getNode();
    pwInput.addEventListener('input', () => {
      const errorMessage = validator.validate(validator.password, pwInput.value, passwordValidationCb);
      if (errorMessage) {
        pwError.textContent = errorMessage;
      } else {
        pwError.textContent = '';
      }
    });
    return loginPwContainer;
  }

  private addShowPwBtn(): HTMLElement {
    const ShowPwContainer = new BaseComponent({
      tagName: 'div',
      classNames: ['login__pw-container', 'form-field-container'],
    }).getNode();

    /*  const showPwLabel = */ new BaseComponent({
      tagName: 'label',
      classNames: ['show-password'],
      textContent: 'Show password',
      attributes: { for: 'showPass' },
      parentNode: ShowPwContainer,
    }).addListener('click', () => {
      const passwordInput = safeQuerySelector<HTMLInputElement>('#loginPassword');
      passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    });

    /* const showPwInput = */ new BaseComponent({
      tagName: 'input',
      classNames: ['show-pw-input'],
      attributes: { type: 'checkbox', id: 'showPass' },
      parentNode: ShowPwContainer,
    }).getNode();

    return ShowPwContainer;
  }
}
