import {
  BaseAddress,
  Cart,
  CartRemoveDiscountCodeAction,
  CategoryPagedQueryResponse,
  ClientResponse,
  Customer,
  CustomerSignInResult,
  CustomerSignin,
  DiscountCodeReference,
  MyCartUpdateAction,
  MyCustomerDraft,
  MyLineItemDraft,
  OrderPagedQueryResponse,
  ProductProjectionPagedSearchResponse,
} from '@commercetools/platform-sdk';
import { apiClient } from './ApiClient';
import { Addresses, PersonalInfo, ActionsForUpdateAddressTypes } from '@customTypes/types';
import { CartView } from '@pages/basket/CartView';

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

export const getProduct = (key: string): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  return apiClient.apiRoot
    .productProjections()
    .search()
    .get({ queryArgs: { filter: `key:"${key}"` } })
    .execute();
};

export const getProductsSearch = (
  offset = 0,
  limit = 6,
  filter: string[] = [],
  sortBy: string,
  search = '',
): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  return apiClient.apiRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        limit,
        offset,
        filter,
        sort: sortBy ? sortBy : 'price asc',
        'text.ru': search,
        fuzzy: true,
      },
    })
    .execute();
};
export const getCategories = (): Promise<ClientResponse<CategoryPagedQueryResponse>> => {
  return apiClient.apiRoot.categories().get().execute();
};

export const updateCustomerPersonalInfo = (
  version: number,
  newPersonalInfo: PersonalInfo,
): Promise<ClientResponse<Customer>> => {
  return apiClient.apiRoot
    .me()
    .post({
      body: {
        version,
        actions: [
          {
            action: 'setFirstName',
            firstName: newPersonalInfo.firstName,
          },
          {
            action: 'setLastName',
            lastName: newPersonalInfo.lastName,
          },
          {
            action: 'setDateOfBirth',
            dateOfBirth: newPersonalInfo.dateOfBirth,
          },
          {
            action: 'changeEmail',
            email: newPersonalInfo.email,
          },
        ],
      },
    })
    .execute();
};

export const updateCustomerPassword = (
  version: number,
  currentPassword: string,
  newPassword: string,
): Promise<ClientResponse<Customer>> => {
  return apiClient.apiRoot
    .me()
    .password()
    .post({
      body: { version, currentPassword, newPassword },
    })
    .execute();
};

export const updateCustomerAddress = (
  version: number,
  addressId: string,
  addressInfo: BaseAddress,
): Promise<ClientResponse<Customer>> => {
  return apiClient.apiRoot
    .me()
    .post({
      body: {
        version: version,
        actions: [
          {
            action: 'changeAddress',
            addressId: addressId,
            address: addressInfo,
          },
        ],
      },
    })
    .execute();
};

export const addCustomerAddress = (version: number, addressInfo: BaseAddress): Promise<ClientResponse<Customer>> => {
  return apiClient.apiRoot
    .me()
    .post({
      body: {
        version: version,
        actions: [
          {
            action: 'addAddress',
            address: addressInfo,
          },
        ],
      },
    })
    .execute();
};

export const removeCustomerAddress = (version: number, addressId: string): Promise<ClientResponse<Customer>> => {
  return apiClient.apiRoot
    .me()
    .post({
      body: {
        version: version,
        actions: [
          {
            action: 'removeAddress',
            addressId: addressId,
          },
        ],
      },
    })
    .execute();
};

export const setAddressTypes = (
  version: number,
  addressId: string,
  actionsTypes: ActionsForUpdateAddressTypes['action'][],
): Promise<ClientResponse<Customer>> => {
  const actions: ActionsForUpdateAddressTypes[] = actionsTypes.map((actionType) => {
    return { action: actionType, addressId: addressId };
  });
  return apiClient.apiRoot
    .me()
    .post({
      body: { version, actions },
    })
    .execute();
};

export const createCart = (lineItems: MyLineItemDraft[]): Promise<ClientResponse<Cart>> => {
  return apiClient.apiRoot
    .me()
    .carts()
    .post({
      body: {
        currency: 'RUB',
        country: 'RU',
        lineItems,
      },
    })
    .execute();
};

export const getActiveCart = (): Promise<ClientResponse<Cart>> => {
  return apiClient.apiRoot.me().activeCart().get().execute();
};

export const getCart = (ID: string): Promise<ClientResponse<Cart>> => {
  return apiClient.apiRoot.me().carts().withId({ ID }).get().execute();
};

export const addProductInCart = (ID: string, version: number, productId: string): Promise<ClientResponse<Cart>> => {
  return apiClient.apiRoot
    .me()
    .carts()
    .withId({ ID })
    .post({
      body: {
        version,
        actions: [
          {
            action: 'addLineItem',
            productId,
          },
        ],
      },
    })
    .execute();
};

export const saveNewCartId = (data: ClientResponse<Cart>): void => {
  const cartId = data.body.id;
  localStorage.setItem('comforto-cart-id', cartId);
};

export const changeLineItemQuantity = (
  cartId: string,
  lineItemId: string,
  quantity: number,
  version: number = CartView.cartVersion,
): Promise<ClientResponse<Cart>> => {
  return apiClient.apiRoot
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version,
        actions: [{ action: 'changeLineItemQuantity', lineItemId, quantity }],
      },
    })
    .execute();
};

export const clearCart = (
  cartId: string,
  lineItemIds: string[],
  version: number = CartView.cartVersion,
): Promise<ClientResponse<Cart>> => {
  const actions: MyCartUpdateAction[] = lineItemIds.map((id) => {
    return { action: 'changeLineItemQuantity', lineItemId: id, quantity: 0 };
  });
  return apiClient.apiRoot
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version,
        actions,
      },
    })
    .execute();
};

export const usePromoCode = (
  cartId: string,
  version: number = CartView.cartVersion,
  promoCode: string,
): Promise<ClientResponse<Cart>> => {
  const actions: MyCartUpdateAction[] = [{ action: 'addDiscountCode', code: promoCode }];
  return apiClient.apiRoot
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version,
        actions,
      },
    })
    .execute();
};

export const removePromoCode = (
  cartId: string,
  version: number = CartView.cartVersion,
  promoCode: DiscountCodeReference,
): Promise<ClientResponse<Cart>> => {
  const actions: CartRemoveDiscountCodeAction[] = [{ action: 'removeDiscountCode', discountCode: promoCode }];
  return apiClient.apiRoot
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version,
        actions,
      },
    })
    .execute();
};
