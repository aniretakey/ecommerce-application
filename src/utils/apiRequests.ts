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

export const signUp = (customer: MyCustomerDraft): Promise<ClientResponse<CustomerSignInResult>> => {
  return apiClient.apiRoot.me().signup().post({ body: customer }).execute();
};
