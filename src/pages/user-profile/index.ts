import Page from '@utils/pageTemplate';
import { getCustomer } from '@utils/apiRequests';
import BaseComponent from '@utils/baseComponent';
import { Customer } from '@commercetools/platform-sdk';
import { getBadge, getDeleteIcon, getEditIcon } from './user-profile-ui';
import { UserProfileButtons } from '@customTypes/enums';
import { ModalWindow } from '@components/modal/modalWindow';
import { EditPersonalInfoFrom } from '@components/form/EditPersonalInfoForm';

const classNames = {
  infoContainer: ['flex', 'items-start', 'justify-center', 'gap-2', 'p-2', 'max-md:flex-col'],
  infoBlock: ['bg-white', 'shadow-md', 'rounded', 'py-2', 'px-5', 'max-md:w-full'],
  personalInfoBlock: ['min-w-max'],
  addressesInfoBlock: ['overflow-x-auto'],
  infoField: ['flex', 'items-center', 'justify-between'],
  infoFieldValue: ['pl-20', 'font-normal'],
  table: ['table', 'max-md:table-xs'],
  addressTypes: ['flex', 'flex-col'],
  button: ['btn', 'btn-sm', 'btn-primary', 'mr-4'],
  tableBtn: ['table__button', 'btn-xs'],
};

const tableHeadTitles = ['№', 'Country', 'City', 'Street', 'Postal code', 'Address type', 'Edit'];

export default class UserProfile extends Page {
  private userInfo: Customer | undefined;
  private tableBody = new BaseComponent({ tagName: 'tbody' });
  private personalInfo = {
    firstName: {
      textContent: 'First name',
      element: new BaseComponent({
        tagName: 'span',
        classNames: ['profile__first-name', ...classNames.infoFieldValue],
      }),
    },
    lastName: {
      textContent: 'Last name',
      element: new BaseComponent({ tagName: 'span', classNames: ['profile__last-name', ...classNames.infoFieldValue] }),
    },
    dateOfBirth: {
      textContent: 'Date of birth',
      element: new BaseComponent({
        tagName: 'span',
        classNames: ['profile__date-birth', ...classNames.infoFieldValue],
      }),
    },
    email: {
      textContent: 'Email',
      element: new BaseComponent({ tagName: 'span', classNames: ['profile__email', ...classNames.infoFieldValue] }),
    },
  };

  constructor() {
    super('user-profile');
  }

  public render(): HTMLElement {
    const title = this.createHeaderTitle('User Profile');
    const infoContainer = new BaseComponent({ tagName: 'div', classNames: [...classNames.infoContainer] });
    const personalInfoBlock = this.createPersonalInfoBlock();
    const addressesInfoBlock = this.createAddressesInfoBlock();
    infoContainer.appendChildren([personalInfoBlock, addressesInfoBlock]);
    this.container.append(title, infoContainer.getNode());
    this.setUserInfo();
    return this.container;
  }

  private createPersonalInfoBlock(): BaseComponent<'div'> {
    const container = new BaseComponent({
      tagName: 'div',
      classNames: [...classNames.infoBlock, ...classNames.personalInfoBlock],
    });
    const title = new BaseComponent({ tagName: 'h5', textContent: 'Personal info' });
    const editInfoBtn = new BaseComponent({
      tagName: 'button',
      classNames: [UserProfileButtons.editPersonalInfo, ...classNames.button],
      textContent: 'Edit info',
    });
    const editPasswordBtn = new BaseComponent({
      tagName: 'button',
      classNames: [UserProfileButtons.editPassword, ...classNames.button],
      textContent: 'Edit password',
    });
    container.append(title);
    editInfoBtn.addListener('click', this.openEditPersonalInfoFrom.bind(this));
    editPasswordBtn.addListener('click', () => console.log('open modal for edit password'));
    Object.values(this.personalInfo).forEach((field) => {
      const fieldElement = this.createFieldInfo(field.textContent, field.element);
      container.append(fieldElement);
    });
    container.appendChildren([editInfoBtn, editPasswordBtn]);
    return container;
  }

  private createAddressesInfoBlock(): BaseComponent<'div'> {
    const container = new BaseComponent({
      tagName: 'div',
      classNames: [...classNames.infoBlock, ...classNames.addressesInfoBlock],
    });
    const title = new BaseComponent({ tagName: 'h5', textContent: 'Addresses' });
    const addAddressBtn = new BaseComponent({
      tagName: 'button',
      classNames: [UserProfileButtons.addAddress, ...classNames.button],
      textContent: '+ new address',
    });
    const table = new BaseComponent({ tagName: 'table', classNames: classNames.table });
    const tableHead = new BaseComponent({ tagName: 'thead' });
    const tableHeadRow = new BaseComponent({ tagName: 'tr' });
    addAddressBtn.addListener('click', () => console.log('open modal for add address'));
    container.appendChildren([title, addAddressBtn]);
    tableHeadTitles.forEach((title) => {
      const th = new BaseComponent({ tagName: 'th', textContent: title });
      tableHeadRow.append(th);
    });
    tableHead.append(tableHeadRow);
    table.appendChildren([tableHead, this.tableBody]);
    container.append(table);
    this.addTableHandler();
    return container;
  }

  private addTableHandler(): void {
    this.tableBody.addListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof Element)) {
        throw new Error('Target is not element');
      }
      const button = target.closest('.table__button');

      if (button) {
        const addressId = target.closest('tr')?.getAttribute('data-id');
        if (button.classList.contains(UserProfileButtons.editAddress)) {
          console.log(`edit ${addressId}`);
        }
        if (button.classList.contains(UserProfileButtons.deleteAddress)) {
          console.log(`delete ${addressId}`);
        }
      }
    });
  }

  private createFieldInfo(textContent: string, fieldValue: BaseComponent<'span'>): BaseComponent<'h6'> {
    const field = new BaseComponent({
      tagName: 'h6',
      classNames: ['profile__info-field', ...classNames.infoField],
      textContent,
    });
    field.append(fieldValue);
    return field;
  }

  private setUserInfo(): void {
    getCustomer()
      .then((data) => {
        this.userInfo = data.body;
        this.setPersonalInfo(this.userInfo);
        this.setAddressesInfo(this.userInfo);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  private setPersonalInfo(data: Customer): void {
    this.personalInfo.firstName.element.setTextContent(data.firstName ?? 'No data');
    this.personalInfo.lastName.element.setTextContent(data.lastName ?? 'No data');
    this.personalInfo.dateOfBirth.element.setTextContent(data.dateOfBirth ?? 'No data');
    this.personalInfo.email.element.setTextContent(data.email ?? 'No data');
  }

  private setAddressesInfo(data: Customer): void {
    data.addresses.forEach((address, index) => {
      if (!address.id) {
        throw new Error('Id address does not exist');
      }
      const tableRow = new BaseComponent({ tagName: 'tr', attributes: { 'data-id': address.id } });
      tableRow.getNode().innerHTML = `
        <td>${index + 1}</td>
        <td>${address.country}</td>
        <td>${address.city}</td>
        <td>${address.streetName}</td>
        <td>${address.postalCode}</td>
        <td>${this.getAddressTypes(address.id, data)}</td>
        <td><button>${this.getEditButtons()}</button></td>`;
      this.tableBody.append(tableRow);
    });
  }

  private getAddressTypes(id: string, data: Customer): string {
    const { defaultBillingAddressId, defaultShippingAddressId, billingAddressIds, shippingAddressIds } = data;
    let result = `<div class="${classNames.addressTypes.join(' ')}">`;

    if (id === defaultBillingAddressId) {
      result += getBadge('Default Billing', true);
    }

    if (id === defaultShippingAddressId) {
      result += getBadge('Default Shipping', true);
    }

    if (billingAddressIds && billingAddressIds.includes(id)) {
      result += getBadge('Billing');
    }

    if (shippingAddressIds && shippingAddressIds.includes(id)) {
      result += getBadge('Shipping');
    }
    result += '</div>';
    return result;
  }

  private getEditButtons(): string {
    return `
    <button class="${classNames.tableBtn.join(' ')} ${UserProfileButtons.editAddress}">${getEditIcon()}</button>
    <button class="${classNames.tableBtn.join(' ')} ${UserProfileButtons.deleteAddress}">${getDeleteIcon()}</button>`;
  }

  private openEditPersonalInfoFrom(): void {
    if (!this.userInfo) {
      throw new Error('No user data');
    }
    const personalInfo = {
      firstName: this.userInfo.firstName ?? '',
      lastName: this.userInfo.lastName ?? '',
      dateOfBirth: this.userInfo.dateOfBirth ?? '',
      email: this.userInfo.email ?? '',
    };
    const form = new EditPersonalInfoFrom(this.userInfo.id, this.userInfo.version, personalInfo);
    const modal = new ModalWindow();
    modal.buildModal(form.form);
  }
}
