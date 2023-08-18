import {
  ClientResponse,
  Customer,
  CustomerSignInResult,
  CustomerSignin,
  MyCustomerDraft,
  OrderPagedQueryResponse,
} from '@commercetools/platform-sdk';
import { apiClient } from './ApiClient';

export const signIn = (email: string, password: string): Promise<ClientResponse<CustomerSignInResult>> => {
  const signInBody: CustomerSignin = {
    email,
    password,
  };
  return apiClient.apiRoot.me().login().post({ body: signInBody }).execute();
};

export const getOrders = (): Promise<ClientResponse<OrderPagedQueryResponse>> => {
  return apiClient.apiRoot.me().orders().get().execute();
};

export const getCustomer = (): Promise<ClientResponse<Customer>> => {
  return apiClient.apiRoot.me().get().execute();
};

export const signUp = (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  country: string,
  city: string,
  streetName: string,
  postalCode: string,
): Promise<ClientResponse<CustomerSignInResult>> => {
  const signUpBody: MyCustomerDraft = {
    email,
    password,
    firstName,
    lastName,
    dateOfBirth,
    addresses: [
      {
        country,
        city,
        streetName,
        postalCode,
      },
    ],
  };
  return apiClient.apiRoot.me().signup().post({ body: signUpBody }).execute();
};
