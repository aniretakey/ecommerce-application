import { z } from 'zod';
export type ValidationCb = (val: string, ctx: z.RefinementCtx) => void;

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

export type ActiveFilters = Record<
  string,
  {
    element: HTMLInputElement;
    filter: string;
    optionName: string;
    value: string;
  }
>;
