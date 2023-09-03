import { FormFields, FormPages } from '@customTypes/enums';
import { passwordValidationCb } from '@utils/customValidationCb';
import { validator } from '@utils/validator';
import { Form } from '@components/form/FormTemplate';
import { EditForm } from '@customTypes/types';
import { updateCustomerPassword } from '@utils/apiRequests';
import { safeQuerySelector } from '@utils/safeQuerySelector';
import { apiClient } from '@utils/ApiClient';

export class EditPasswordForm extends Form implements EditForm {
  private userVersion;

  constructor(userVersion: number) {
    super(FormPages.userProfile, false);
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
  }

  private showPasswords(): void {
    const passwordInputs = document.querySelectorAll<HTMLInputElement>('.userprofile__password-input');
    passwordInputs.forEach((input) => {
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  }

  public async editInfo(e: Event): Promise<void> {
    e.preventDefault();
    if (!this.checkAllFieldsCorrectness()) {
      const passwordInfo = this.getPasswordInfo();
      this.checkPasswordsMatch(passwordInfo.newPassword, passwordInfo.confirmNewPassword);
      await updateCustomerPassword(this.userVersion, passwordInfo.currentPassword, passwordInfo.newPassword)
        .then(async (data) => {
          await apiClient
            .getNewPassFlowToken(data.body.email, passwordInfo.newPassword)
            .catch((e: Error) => console.log(e.message));
        })
        .catch((e: Error) => {
          throw new Error(e.message);
        });
    } else {
      throw new Error('Data is incorrect');
    }
  }

  private getPasswordInfo(): { currentPassword: string; newPassword: string; confirmNewPassword: string } {
    const currentPassword = safeQuerySelector<HTMLInputElement>('#userProfilePassword-current').value;
    const newPassword = safeQuerySelector<HTMLInputElement>('#userProfilePassword-new').value;
    const confirmNewPassword = safeQuerySelector<HTMLInputElement>('#userProfilePassword-confirm-new').value;
    return { currentPassword, newPassword, confirmNewPassword };
  }

  private checkPasswordsMatch(newPassword: string, confirmNewPassword: string): void {
    if (newPassword !== confirmNewPassword) {
      throw new Error('New password and confirm new password do not match!');
    }
  }
}
