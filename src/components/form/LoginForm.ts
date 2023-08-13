import { FormFields, FormPages } from '@customTypes/enums';
import { emailValidationCb, passwordValidationCb } from '@utils/customValidationCb';
import { validator } from '@utils/validator';
import { Form } from '@components/form/FormTemplate';

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
    this.addNewValidatedField(
      FormFields.email,
      'text',
      `${FormFields.email}*`,
      validator.inputString,
      emailValidationCb,
    )
      .addNewValidatedField(
        FormFields.password,
        'password',
        `${FormFields.password}*`,
        validator.inputString,
        passwordValidationCb,
      )
      .addNewCtrlField(
        FormFields.showPw,
        'checkbox',
        'Show Password',
        'click',
        this.showPassword.bind(this, '#loginPassword'),
      )
      .addSubmitListener(() => {
        // TODO add submit handler and disable the button if there are errors
        console.log('submited!');
      })
      .buildForm();
  }
}
