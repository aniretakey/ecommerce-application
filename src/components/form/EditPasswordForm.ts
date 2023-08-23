import { FormFields, FormPages } from '@customTypes/enums';
import { passwordValidationCb } from '@utils/customValidationCb';
import { validator } from '@utils/validator';
import { Form } from '@components/form/FormTemplate';

export class EditPasswordForm extends Form {
  private userId;
  private userVersion;

  constructor(userId: string, userVersion: number) {
    super(FormPages.userProfile, false);
    this.userId = userId;
    this.userVersion = userVersion;
    this.buildEditPasswordForm();
  }

  private buildEditPasswordForm(): void {
    this.addNewValidatedField(
      FormFields.password,
      'password',
      `Current ${FormFields.password}*`,
      validator.inputString,
      passwordValidationCb,
      '',
      'current',
    )
      .addNewValidatedField(
        FormFields.password,
        'password',
        `New ${FormFields.password}*`,
        validator.inputString,
        passwordValidationCb,
        '',
        'new',
      )
      .addNewValidatedField(
        FormFields.password,
        'password',
        `Confirm New ${FormFields.password}*`,
        validator.inputString,
        passwordValidationCb,
        '',
        'confirm-new',
      )
      .addNewCtrlField(FormFields.showPw, 'checkbox', 'Show Password', 'click', this.showPasswords.bind(this))
      .buildForm();
    this.submitBtn.getNode().addEventListener('click', this.editPassword.bind(this));
  }

  private showPasswords(): void {
    const passwordInputs = document.querySelectorAll<HTMLInputElement>('.userprofile__password-input');
    passwordInputs.forEach((input) => {
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  }

  private editPassword(e: Event): void {
    e.preventDefault();
    if (!this.checkAllFieldsCorrectness()) {
      console.log(`edit password for user: id - ${this.userId} version - ${this.userVersion}`);
    }
  }
}
