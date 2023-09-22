import { z } from 'zod';
export type ValidationCb = (val: string, ctx: z.RefinementCtx) => void;
import {
  MyCustomerAddBillingAddressIdAction,
  MyCustomerAddShippingAddressIdAction,
  MyCustomerRemoveBillingAddressIdAction,
  MyCustomerRemoveShippingAddressIdAction,
  MyCustomerSetDefaultBillingAddressAction,
  MyCustomerSetDefaultShippingAddressAction,
} from '@commercetools/platform-sdk';

export const enum PageIds {
  MainPage = 'main-page',
  CatalogPage = 'catalog-page',
  AboutPage = 'about-page',
  RegistrationPage = 'registration-page',
  LoginPage = 'login-page',
  ProductPage = 'product-page',
  BasketPage = 'basket-page',
  UserProfilePage = 'profile-page',
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  refresh_token: string;
  token_type: string;
}

export interface DefaultAddresses {
  defaultShippingAddress?: number;
  defaultBillingAddress?: number;
}

export interface Addresses {
  billingAddresses: number[];
  shippingAddresses: number[];
}

export interface AddressTypes {
  isDefaultBillingAddress: boolean;
  isDefaultShippingAddress: boolean;
  isBillingAddress: boolean;
  isShippingAddress: boolean;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
}

export interface EditForm {
  editInfo: (e: Event) => Promise<void>;
}

export type ActionsForUpdateAddressTypes =
  | MyCustomerAddBillingAddressIdAction
  | MyCustomerAddShippingAddressIdAction
  | MyCustomerRemoveBillingAddressIdAction
  | MyCustomerRemoveShippingAddressIdAction
  | MyCustomerSetDefaultBillingAddressAction
  | MyCustomerSetDefaultShippingAddressAction;

export type ActiveFilters = Record<
  string,
  {
    element: HTMLInputElement;
    filter: string;
    optionName: string;
    value: string;
  }
>;
