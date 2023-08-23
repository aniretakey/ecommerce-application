import { FormFields, FormPages } from '@customTypes/enums';
import { Form } from './FormTemplate';
import { validator } from '@utils/validator';
import {
  emailValidationCb,
  firstNameValidationCb,
  lastNameValidationCb,
  ageValidationCb,
} from '@utils/customValidationCb';
import { PersonalInfo } from '@customTypes/types';

export class EditPersonalInfoFrom extends Form {
  private userId;
  private userVersion;

  constructor(userId: string, userVersion: number, personalInfo: PersonalInfo) {
    super(FormPages.userProfile, false);
    this.userId = userId;
    this.userVersion = userVersion;
    this.buildEditPersonalInfoFrom(personalInfo);
    this.formFields.forEach((field) => field.setAttribute('data-valid', 'true'));
  }

  private buildEditPersonalInfoFrom(personalInfo: PersonalInfo): void {
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
    this.submitBtn.getNode().addEventListener('click', this.editPersonalInfo.bind(this));
  }

  private editPersonalInfo(e: Event): void {
    e.preventDefault();
    if (!this.checkAllFieldsCorrectness()) {
      console.log(`edit personal info for user: id - ${this.userId} version - ${this.userVersion}`);
    }
  }
}
