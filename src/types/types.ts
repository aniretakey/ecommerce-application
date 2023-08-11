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
