import { FormFields, FormPages, FormRedirectBtn, FormSubmitBtn, RedirectMessage } from '@customTypes/enums';
import BaseComponent from '@utils/baseComponent';
import { safeQuerySelector } from '@utils/safeQuerySelector';
import { PageIds, ValidationCb } from '@customTypes/types';
import { ZodString, z } from 'zod';
import { FormFieldCreator } from './FormFieldCreator';

const formClassNames = {
  withRedirect: [
    'flex',
    'flex-col',
    'items-center',
    'm-auto',
    'gap-2',
    'bg-white',
    'shadow-md',
    'rounded',
    'px-8',
    'pt-6',
    'pb-8',
    'mb-4',
    'w-full',
    'max-w-xs',
  ],
  withoutRedirect: ['flex', 'flex-col', 'items-center', 'gap-2', 'px-8', 'pt-6', 'w-full', 'max-w-xs'],
};

export class Form {
  public form: BaseComponent<'form'>;
  public submitBtn: BaseComponent<'button'>;
  protected formFields: HTMLDivElement[] = [];
  private pageName: FormPages;
  private isFormWithRedirect: boolean;
  protected redirectBtn: BaseComponent<'a'> | undefined;
  public errAuthMessage: BaseComponent<'p'>;
  constructor(pageName: FormPages, isFormWithRedirect = true) {
    this.pageName = pageName;
    this.isFormWithRedirect = isFormWithRedirect;
    const classNames = this.isFormWithRedirect ? formClassNames.withRedirect : formClassNames.withoutRedirect;
    this.form = new BaseComponent({
      tagName: 'form',
      classNames: [`${pageName}__form`, ...classNames],
      attributes: { id: `${pageName}Form` },
    });

    this.submitBtn = new BaseComponent({
      tagName: 'button',
      classNames: [`${pageName}__submit-btn`, 'btn', 'btn-primary'],
      textContent: FormSubmitBtn[pageName],
      attributes: { id: `${pageName}SubmitBtn` },
    });

    if (this.isFormWithRedirect) {
      const anotherPage = this.pageName === FormPages.login ? PageIds.RegistrationPage : PageIds.LoginPage;
      this.redirectBtn = new BaseComponent({
        tagName: 'a',
        classNames: [`${pageName}__redirect-btn`, 'btn'],
        textContent: FormRedirectBtn[pageName],
        attributes: { id: `${pageName}RedirectBtn`, 'data-navigo': '', href: `/${anotherPage}` },
      });
    }
    this.errAuthMessage = new BaseComponent({
      tagName: 'p',
      classNames: ['err-auth-message', 'text-red-700', 'px-4', 'py-3', 'rounded'],
      textContent: '',
    });
  }

  public addSubmitListener(submitHandler: (event: Event) => void): this {
    this.submitBtn.addListener('click', submitHandler);
    return this;
  }

  /**
   *create field with validation like email or password
   *
   * ```html
   * <div class="login__email-container form-field-container" data-valid="">
   *    <label class="login__email-label" for="loginEmail">Email*</label>
   *    <input class="login__email-input" type="text" id="loginEmail">
   *    <p class="error-message" id="loginEmailError"></p>
   * </div>
   * ```
   */
  protected addNewValidatedField(
    fieldName: FormFields,
    inputType = 'text',
    labelText = `${fieldName}*`,
    validatorField: ZodString = z.string(),
    validationCb?: ValidationCb,
    value?: string,
    additionalName?: string,
  ): this {
    const field = new FormFieldCreator(this.pageName, fieldName, inputType, true, labelText, value, additionalName);
    field.addInputValidation(validatorField, validationCb);
    field.fieldInput.addListener('input', () => {
      this.errAuthMessage.setTextContent('');
    });
    const fieldContainer = field.fieldContainer.getNode();
    this.formFields.push(fieldContainer);
    return this;
  }

  /**
   * create btn like show password btn
   * without a field for displaying an error, but you can add a handler to the input through eventHandler
   *
   * ```html
   * <div class="login__show-pw-container form-field-container" data-valid="">
   *  <label class="login__show-pw-label" for="loginshow-pw">Show Password</label>
   *  <input class="login__show-pw-input" type="checkbox" id="loginshow-pw">
   * </div>
   *
   * ```
   */
  protected addNewCtrlField(
    fieldName: FormFields,
    inputType = 'checkbox',
    labelText = ``,
    eventName?: keyof HTMLElementEventMap,
    eventHandler?: (e: Event) => void,
    isChecked = false,
  ): this {
    const field = new FormFieldCreator(this.pageName, fieldName, inputType, false, labelText);
    if (eventName && eventHandler) {
      field.fieldInput.addListener(eventName, eventHandler);
    }
    const fieldContainer = field.fieldContainer.getNode();
    fieldContainer.setAttribute('data-valid', 'true');
    field.fieldInput.getNode().checked = isChecked;
    this.formFields.push(fieldContainer);
    return this;
  }

  protected addNewLabel(className: string, text: string): this {
    const container = new BaseComponent({
      tagName: 'div',
      classNames: [`${this.pageName}__label-${className}`.toLowerCase()],
    });
    const label = new BaseComponent({
      tagName: 'label',
      classNames: ['block', 'text-gray-700', 'text-m', 'font-bold', 'my-4'],
      textContent: `${text}`,
    });
    container.append(label);
    this.formFields.push(container.getNode());
    return this;
  }

  public showPassword(passwordSelector: string): void {
    const passwordInput = safeQuerySelector<HTMLInputElement>(passwordSelector); //'#loginPassword'
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }

  protected buildForm(): this {
    this.form.getNode().append(...this.formFields, this.errAuthMessage.getNode(), this.submitBtn.getNode());

    if (this.isFormWithRedirect && this.redirectBtn) {
      this.form.getNode().append(this.createRedirectMessage().getNode(), this.redirectBtn.getNode());
    }
    return this;
  }
  private createRedirectMessage(): BaseComponent<'p'> {
    const p = new BaseComponent({
      tagName: 'p',
      classNames: ['redirect-message'],
      textContent: RedirectMessage[this.pageName],
    });
    return p;
  }

  protected checkAllFieldsCorrectness(): boolean {
    const fieldContainers = Array.from(document.querySelectorAll<HTMLDivElement>('.form-field-container'));
    const hasInvalidFields = !!fieldContainers.find((field) => field.getAttribute('data-valid') === 'false');
    if (hasInvalidFields) {
      this.errAuthMessage.setTextContent('You must fill in all the fields of the form correctly');
    }
    return hasInvalidFields;
  }
}
