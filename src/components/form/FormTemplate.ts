import { FormFields } from '@customTypes/enums';
import BaseComponent from '@utils/baseComponent';
import { safeQuerySelector } from '@utils/safeQuerySelector';
import { ValidationCb } from '@customTypes/types';
import { ZodString, z } from 'zod';
import { FormFieldCreator } from './FormFieldCreator';

export class Form {
  public form: BaseComponent<'form'>;
  public submitBtn: BaseComponent<'button'>;
  protected formFields: HTMLDivElement[] = [];
  private pageName: string;

  constructor(pageName: string) {
    this.pageName = pageName;
    this.form = new BaseComponent({
      tagName: 'form',
      classNames: [`${pageName}__form`],
      attributes: { id: `${pageName}Form` },
    });

    this.submitBtn = new BaseComponent({
      tagName: 'button',
      classNames: [`${pageName}__submit-btn`],
      textContent: 'Log In',
      attributes: { type: 'submit', id: `${pageName}SubmitBtn` },
    });
  }

  public addSubmitListener(submitHandler: (event: Event) => void): this {
    this.submitBtn.addListener('submit', submitHandler);
    return this;
  }

  //create field with validation like email or password
  protected addNewValidatedField(
    fieldName: FormFields,
    inputType = 'text',
    isErrMessRequired: boolean,
    labelText = `${fieldName}*`,
    validatorField: ZodString = z.string(),
    validationCb?: ValidationCb,
  ): this {
    const field = new FormFieldCreator(this.pageName, fieldName, inputType, isErrMessRequired, labelText);
    if (isErrMessRequired) {
      field.addInputValidation(validatorField, validationCb);
    }
    const fieldContainer = field.fieldContainer.getNode();
    this.formFields.push(fieldContainer);
    return this;
  }

  // create btn like show password btn
  protected addNewCtrlField(
    fieldName: FormFields,
    inputType = 'checkbox',
    labelText = ``,
    eventName: keyof HTMLElementEventMap,
    eventHandler: (e: Event) => void,
  ): this {
    const field = new FormFieldCreator(this.pageName, fieldName, inputType, false, labelText);
    field.fieldInput.addListener(eventName, eventHandler);
    const fieldContainer = field.fieldContainer.getNode();
    this.formFields.push(fieldContainer);
    return this;
  }

  public showPassword(passwordSelector: string): void {
    const passwordInput = safeQuerySelector<HTMLInputElement>(passwordSelector); //'#loginPassword'
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }

  protected buildForm(): this {
    this.form.getNode().append(...this.formFields, this.submitBtn.getNode());
    return this;
  }
}
