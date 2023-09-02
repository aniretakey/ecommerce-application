import { LoginForm } from '@components/form/LoginForm';
import { RegistrationForm } from '@components/form/RegistrationForm';
import { FormPages } from '@customTypes/enums';

jest.mock('../utils/ApiClient', () => ({
  apiClient: {
    getNewPassFlowToken: jest.fn().mockResolvedValue({ a: 1 }),
  },
}));

const login = new LoginForm();
const registration = new RegistrationForm();

[
  { page: FormPages.login, instance: login },
  { page: FormPages.registration, instance: registration },
].forEach(({ page, instance }) => {
  describe(`${page} form test`, () => {
    const form = instance.form.getNode();
    it('should create HTMLFormElement', () => {
      expect(form instanceof HTMLFormElement).toBe(true);
    });

    it('should add email input to the form', () => {
      const emailInput = form.querySelector<HTMLElement>(`#${page}Email`);
      expect(emailInput instanceof HTMLInputElement).toBe(true);
    });

    describe('should add password to form and show-password btn', () => {
      const passwordInput = form.querySelector<HTMLInputElement>(`#${page}Password`);
      const showPassBtn = form.querySelector<HTMLInputElement>(`#${page}show-pw`);
      it('should add password input to the form', () => {
        expect(passwordInput instanceof HTMLInputElement).toBe(true);
      });

      it('should add show-password btn to the form', () => {
        const isInput = showPassBtn instanceof HTMLInputElement;
        expect(isInput).toBe(true);
      });

      if (showPassBtn && passwordInput) {
        it('should add show password handler', () => {
          document.body.append(form);
          const oldType = passwordInput.type;
          const newType = oldType === 'password' ? 'text' : 'password';
          showPassBtn.dispatchEvent(new Event('click'));
          expect(passwordInput.type).toBe(newType);
        });
      }
    });
  });
});

afterAll(() => {
  jest.resetAllMocks();
});
