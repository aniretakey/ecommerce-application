import { FormFieldCreator } from '../components/form/FormFieldCreator';
import { FormFields, FormPages } from '@customTypes/enums';
import { validator } from '@utils/validator';
import { ZodString, z } from 'zod';

const errorMessage = 'Invalid value';

describe('FormFieldCreator test', () => {
  validator.validate = jest.fn().mockImplementation((_field: ZodString, val = 'value') => {
    return val === 'valid' ? undefined : errorMessage;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fieldCreator = new FormFieldCreator(FormPages.login, FormFields.email, 'text', true);

  it('should add error message and set data-valid=false if validation fails', () => {
    fieldCreator.fieldInput.setValue('123');
    fieldCreator.addInputValidation(z.string());
    fieldCreator.fieldInput.getNode().dispatchEvent(new Event('input'));
    if (fieldCreator.fieldError) {
      expect(fieldCreator.fieldError.getNode().textContent).toBe('Invalid value');
    }
    expect(fieldCreator.fieldContainer.getNode().getAttribute('data-valid')).toBe('false');
  });

  it('should clear error message and set data-valid=true if value is valid ', () => {
    fieldCreator.fieldInput.setValue('valid');
    fieldCreator.addInputValidation(z.string());
    fieldCreator.fieldInput.getNode().dispatchEvent(new Event('input'));
    if (fieldCreator.fieldError) {
      expect(fieldCreator.fieldError.getNode().textContent).toBe('');
    }
    expect(fieldCreator.fieldContainer.getNode().getAttribute('data-valid')).toBe('true');
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
