import {
  CategoryPagedQueryResponse,
  ClientResponse,
  Customer,
  CustomerSignInResult,
  CustomerSignin,
  MyCustomerDraft,
  OrderPagedQueryResponse,
  ProductPagedQueryResponse,
} from '@commercetools/platform-sdk';
import { apiClient } from './ApiClient';
import { Addresses } from '@customTypes/types';

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

export const signUp = (customer: MyCustomerDraft & Addresses): Promise<ClientResponse<CustomerSignInResult>> => {
  return apiClient.apiRoot.me().signup().post({ body: customer }).execute();
};

export const getProducts = (offset = 0, limit = 6): Promise<ClientResponse<ProductPagedQueryResponse>> => {
  return apiClient.apiRoot
    .products()
    .get({
      queryArgs: {
        limit,
        offset,
      },
    })
    .execute();
};

export const getCategories = (): Promise<ClientResponse<CategoryPagedQueryResponse>> => {
  return apiClient.apiRoot.categories().get().execute();
};
