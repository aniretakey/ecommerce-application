import { FormFields, FormPages } from '@customTypes/enums';
import { emailValidationCb, passwordValidationCb } from '@utils/customValidationCb';
import { validator } from '@utils/validator';
import { Form } from '@components/form/FormTemplate';
import { signIn } from '@utils/apiRequests';
import { InvalidCredentialsError } from '@commercetools/platform-sdk';
import { safeQuerySelector } from '@utils/safeQuerySelector';
import { apiClient } from '@utils/ApiClient';

/**
 * ```html
 * <form class="login__form" id="loginForm">
 *  <div class="login__email-container form-field-container" data-valid="">
 *    <label class="login__email-label" for="loginEmail">Email*</label>
 *    <input class="login__email-input" type="text" id="loginEmail">
 *    <p class="error-message" id="loginEmailError"></p>
 *  </div>
 *  <div class="login__password-container form-field-container" data-valid="">
 *    <label class="login__password-label" for="loginPassword">Password*</label>
 *    <input class="login__password-input" type="password" id="loginPassword">
 *    <p class="error-message" id="loginPasswordError"></p>
 *  </div>
 *  <div class="login__show-pw-container form-field-container" data-valid="">
 *    <label class="login__show-pw-label" for="loginshow-pw">Show Password</label>
 *    <input class="login__show-pw-input" type="checkbox" id="loginshow-pw">
 *  </div>
 *  <button class="login__submit-btn" id="loginSubmitBtn">Sign In</button>
 *  <p class="redirect-message">Have not account yet?</p>
 *  <button class="login__redirect-btn" id="loginRedirectBtn">Sign Up</button>
 * </form>
 * ```
 *
 *
 */
export class LoginForm extends Form {
  constructor() {
    super(FormPages.login);
    this.buildLoginForm();
  }

  private buildLoginForm(): void {
    this.addNewValidatedField(FormFields.email, 'text', `${FormFields.email}*`, validator.email, emailValidationCb)
      .addNewValidatedField(
        FormFields.password,
        'password',
        `${FormFields.password}*`,
        validator.password,
        passwordValidationCb,
      )
      .addNewCtrlField(
        FormFields.showPw,
        'checkbox',
        'Show Password',
        'click',
        this.showPassword.bind(this, '#loginPassword'),
      )
      .buildForm();
    this.submitBtn.getNode().addEventListener('click', this.submitLogin.bind(this));
  }

  private submitLogin(e: Event): void {
    e.preventDefault();
    const fieldContainers = Array.from(document.querySelectorAll<HTMLDivElement>('.form-field-container'));
    if (fieldContainers.find((field) => field.getAttribute('data-valid') === 'false')) {
      this.errAuthMessage.getNode().textContent = 'You must fill in all the fields of the form correctly';
    } else {
      const email = safeQuerySelector<HTMLInputElement>('#loginEmail').value;
      const password = safeQuerySelector<HTMLInputElement>('#loginPassword').value;
      signIn(email, password)
        .then(async () => {
          await apiClient.getNewPassFlowToken(email, password).catch((err: Error) => console.log(err.message));
          window.location.hash = '#/';
        })
        .catch((e: InvalidCredentialsError) => {
          console.log(e.code, e.message);
          this.errAuthMessage.getNode().textContent = 'The account was not found. Check the correctness of the data';
          return null;
        });
    }
  }
}
