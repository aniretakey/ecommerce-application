import { FormFields, FormPages } from '@customTypes/enums';
import { ValidationCb } from '@customTypes/types';
import BaseComponent from '@utils/baseComponent';
import { validator } from '@utils/validator';
import { ZodString } from 'zod';

const labelClassnames = ['block', 'text-gray-700', 'text-sm', 'font-bold', 'mb-2'];
const inputclassNames = [
  'shadow',
  'appearance-none',
  'border',
  'rounded',
  'w-full',
  'py-2',
  'px-3',
  'text-gray-700',
  'leading-tight',
  'focus:outline-none',
  'focus:shadow-outline',
];

/**
 * ```html
 * <div class="login__email-container form-field-container" data-valid="">
 *    <label class="login__email-label" for="loginEmail">Email*</label>
 *    <input class="login__email-input" type="text" id="loginEmail">
 *    <p class="error-message" id="loginEmailError"></p>
 * </div>
 * ```
 */
export class FormFieldCreator {
  public fieldContainer: BaseComponent<'div'>;
  public fieldLabel: BaseComponent<'label'>;
  public fieldInput: BaseComponent<'input'>;
  public fieldError: BaseComponent<'p'> | null = null;

  constructor(
    page: FormPages,
    fieldName: FormFields,
    inputType: string,
    isErrMessRequired = true,
    labelText = `${fieldName}*`,
    value?: string,
  ) {
    this.fieldContainer = new BaseComponent({
      tagName: 'div',
      classNames: [`${page}__${fieldName}-container`.toLowerCase(), 'form-field-container'],
      attributes: { 'data-valid': 'false' },
    });
    this.fieldLabel = new BaseComponent({
      tagName: 'label',
      classNames: [`${page}__${fieldName}-label`.toLowerCase(), ...labelClassnames],
      textContent: `${labelText}`,
      attributes: { for: `${page}${fieldName}` },
      parentNode: this.fieldContainer.getNode(),
    });
    this.fieldInput = new BaseComponent({
      tagName: 'input',
      classNames: [`${page}__${fieldName}-input`.toLowerCase(), ...inputclassNames],
      attributes: { type: inputType, id: `${page}${fieldName}` },
      parentNode: this.fieldContainer.getNode(),
    });
    if (isErrMessRequired) {
      this.fieldError = new BaseComponent({
        tagName: 'p',
        classNames: ['error-message', 'text-red-500', 'text-xs', 'italic'],
        textContent: '', //'Invalid email',
        attributes: { id: `${page}${fieldName}Error` },
        parentNode: this.fieldContainer.getNode(),
      });
    }
    if (value) {
      this.fieldInput.getNode().value = value;
    }
  }

  public addInputValidation(
    validatorField: ZodString, // validator.email or validator.password
    validationCb?: ValidationCb,
  ): this {
    this.fieldInput.addListener('input', this.addErrMessage.bind(this, validatorField, validationCb));
    return this;
  }

  private addErrMessage(
    validatorField: ZodString, // validator.email or validator.password
    validationCb?: ValidationCb,
  ): this {
    if (this.fieldError) {
      const errorMessage = validator.validate(validatorField, this.fieldInput.getNode().value, validationCb);
      if (errorMessage) {
        this.fieldError.getNode().textContent = errorMessage;
        this.fieldContainer.setAttributes({ 'data-valid': 'false' });
      } else {
        this.fieldError.getNode().textContent = '';
        this.fieldContainer.setAttributes({ 'data-valid': 'true' });
      }
    }
    return this;
  }
}
