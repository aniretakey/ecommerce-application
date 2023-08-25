import { FormFields, FormPages } from '@customTypes/enums';
import { Form } from './FormTemplate';
import { validator } from '@utils/validator';
import {
  emailValidationCb,
  firstNameValidationCb,
  lastNameValidationCb,
  ageValidationCb,
} from '@utils/customValidationCb';
import { Customer } from '@commercetools/platform-sdk';
import { updateCustomerPersonalInfo } from '@utils/apiRequests';
import { safeQuerySelector } from '@utils/safeQuerySelector';
import { EditForm, PersonalInfo } from '@customTypes/types';

export class EditPersonalInfoFrom extends Form implements EditForm {
  private userVersion;

  constructor(userVersion: number, personalInfo: Customer) {
    super(FormPages.userProfile, false);
    this.userVersion = userVersion;
    this.buildPersonalInfoEditFrom(personalInfo);
    this.formFields.forEach((field) => field.setAttribute('data-valid', 'true'));
  }

  private buildPersonalInfoEditFrom(personalInfo: Customer): void {
    this.addNewValidatedField(
      FormFields.firstName,
      'text',
      `${FormFields.firstName}*`,
      validator.inputString,
      firstNameValidationCb,
      personalInfo.firstName,
    )
      .addNewValidatedField(
        FormFields.lastName,
        'text',
        `${FormFields.lastName}*`,
        validator.inputString,
        lastNameValidationCb,
        personalInfo.lastName,
      )
      .addNewValidatedField(
        FormFields.birthDate,
        'date',
        `${FormFields.birthDate}*`,
        validator.inputString,
        ageValidationCb,
        personalInfo.dateOfBirth,
      )
      .addNewValidatedField(
        FormFields.email,
        'text',
        `${FormFields.email}*`,
        validator.inputString,
        emailValidationCb,
        personalInfo.email,
      )
      .buildForm();
  }

  public async editInfo(e: Event): Promise<void> {
    e.preventDefault();
    if (!this.checkAllFieldsCorrectness()) {
      const newPersonalInfo = this.getUserInfo();
      await updateCustomerPersonalInfo(this.userVersion, newPersonalInfo).catch((e: Error) => {
        throw new Error(e.message);
      });
    }
  }

  private getUserInfo(): PersonalInfo {
    const email = safeQuerySelector<HTMLInputElement>('#userProfileEmail').value;
    const firstName = safeQuerySelector<HTMLInputElement>('#userProfileFirst-name').value;
    const lastName = safeQuerySelector<HTMLInputElement>('#userProfileLast-name').value;
    const birthDate = safeQuerySelector<HTMLInputElement>('#userProfileBirth-date').value;

    return { email, firstName, lastName, dateOfBirth: birthDate };
  }
}
